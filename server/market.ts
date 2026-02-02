import axios from "axios";
import { storage } from "./storage";
import { generateAIAnalysis } from "./ai";

const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const BASE_URL = "https://www.alphavantage.co/query";

// Caching to respect rate limits
const cache: Record<string, { data: any, timestamp: number }> = {};
const CACHE_TTL = 30 * 60 * 1000;

async function axiosGetWithRetry(params: any, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await axios.get(BASE_URL, { params });
      const info = response.data["Information"] || response.data["Note"] || response.data["ErrorMessage"];
      if (info) {
        if (info.includes("rate limit")) {
          await new Promise(resolve => setTimeout(resolve, 5000 * (i + 1)));
          continue;
        }
        return response;
      }
      return response;
    } catch (error) {
      if (i === retries) throw error;
      await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
    }
  }
  return null;
}

export async function fetchMarketPrice(symbol: string) {
  const cacheKey = `price_${symbol}`;
  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_TTL) return cache[cacheKey].data;

  try {
    const response = await axiosGetWithRetry({
      function: "GLOBAL_QUOTE",
      symbol: symbol,
      apikey: ALPHA_VANTAGE_KEY,
    });
    if (!response) return null;
    const data = response.data["Global Quote"];
    if (!data || !data["05. price"]) return null;

    const marketData = {
      symbol: symbol,
      price: data["05. price"],
      change: data["09. change"],
      changePercent: data["10. change percent"],
    };
    const updated = await storage.updateMarketData(marketData);
    cache[cacheKey] = { data: updated, timestamp: Date.now() };
    return updated;
  } catch (error) {
    return null;
  }
}

export async function fetchForexPrice(from: string, to: string) {
  const symbol = `${from}/${to}`;
  const cacheKey = `forex_${symbol}`;
  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_TTL) return cache[cacheKey].data;

  try {
    const response = await axiosGetWithRetry({
      function: "CURRENCY_EXCHANGE_RATE",
      from_currency: from,
      to_currency: to,
      apikey: ALPHA_VANTAGE_KEY,
    });
    if (!response) return null;
    const data = response.data["Realtime Currency Exchange Rate"];
    if (!data || !data["5. Exchange Rate"]) return null;

    const marketData = {
      symbol: symbol,
      price: data["5. Exchange Rate"],
      change: "0",
      changePercent: "0%",
    };
    const updated = await storage.updateMarketData(marketData);
    cache[cacheKey] = { data: updated, timestamp: Date.now() };
    return updated;
  } catch (error) {
    return null;
  }
}

export async function fetchTechnicalIndicator(symbol: string, func: "RSI" | "MACD" | "SMA", interval: string = "1min") {
  const cacheKey = `${func}_${symbol}_${interval}`;
  const SCALPING_CACHE_TTL = 60 * 1000; // 1 minute
  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < SCALPING_CACHE_TTL) return cache[cacheKey].data;

  try {
    const params: any = {
      function: func,
      symbol: symbol,
      interval: interval,
      time_period: "14",
      series_type: "close",
      apikey: ALPHA_VANTAGE_KEY,
    };
    if (func === "MACD") {
      delete params.time_period;
    }

    const response = await axiosGetWithRetry(params);
    if (!response) return null;

    const key = `Technical Analysis: ${func}`;
    const technicalData = response.data[key];
    if (!technicalData) return null;

    const lastRef = Object.keys(technicalData)[0];
    const data = technicalData[lastRef];
    cache[cacheKey] = { data: data, timestamp: Date.now() };
    return data;
  } catch (error) {
    return null;
  }
}

export async function generateInstantSignal(symbol: string) {
  console.log(`[INSTANT AI ANALYSIS] Generating signal for ${symbol}...`);
  
  let priceData;
  let symbolForTech = symbol.replace("/", "");

  if (symbol.includes("/")) {
    const [from, to] = symbol.split("/");
    priceData = await fetchForexPrice(from, to);
  } else {
    priceData = await fetchMarketPrice(symbol);
  }

  if (!priceData) throw new Error("Impossible de récupérer les données de prix");

  const [rsiData, macdData, smaData] = await Promise.all([
    fetchTechnicalIndicator(symbolForTech, "RSI", "1min"),
    fetchTechnicalIndicator(symbolForTech, "MACD", "1min"),
    fetchTechnicalIndicator(symbolForTech, "SMA", "1min")
  ]);

  const price = parseFloat(priceData.price);
  const rsi = rsiData ? parseFloat(rsiData.RSI) : null;
  const macd = macdData ? parseFloat(macdData.MACD) : null;
  const sma = smaData ? parseFloat(smaData.SMA) : null;
  
  const aiDecision = await generateAIAnalysis(symbol, price, rsi, macd, sma);

  if (aiDecision && aiDecision.direction) {
    return await storage.createSignal({
      pair: symbol,
      direction: aiDecision.direction,
      entryPrice: priceData.price,
      stopLoss: aiDecision.stopLoss || (aiDecision.direction === "BUY" ? (price * 0.998).toFixed(4) : (price * 1.002).toFixed(4)),
      takeProfit: aiDecision.takeProfit || (aiDecision.direction === "BUY" ? (price * 1.005).toFixed(4) : (price * 0.995).toFixed(4)),
      status: "ACTIVE",
      analysis: `[INSTANT IA] ${aiDecision.analysis}`,
      isPremium: true
    });
  }
  
  throw new Error("L'IA n'a pas pu générer de signal concluant pour le moment.");
}

export async function generateSignals() {
  console.log(`[AI SCAN] Scanning markets at ${new Date().toLocaleTimeString()}...`);
  const symbols = ["AAPL", "EUR/USD", "GBP/USD", "TSLA", "MSFT", "GOOGL", "BTC/USD", "ETH/USD"];
  
  for (const symbol of symbols) {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Faster scanning
    
    let priceData;
    let symbolForTech = symbol.replace("/", "");

    if (symbol.includes("/")) {
      const [from, to] = symbol.split("/");
      priceData = await fetchForexPrice(from, to);
    } else {
      priceData = await fetchMarketPrice(symbol);
    }

    if (!priceData) continue;

    const rsiData = await fetchTechnicalIndicator(symbolForTech, "RSI", "1min");
    const macdData = await fetchTechnicalIndicator(symbolForTech, "MACD", "1min");
    const smaData = await fetchTechnicalIndicator(symbolForTech, "SMA", "1min");

    await processScalpingSignal(symbol, priceData, rsiData, macdData, smaData);
  }

  await cleanupObsoleteSignals();
}

async function cleanupObsoleteSignals() {
  const activeSignals = await storage.getSignals();
  for (const signal of activeSignals) {
    if (signal.status !== "ACTIVE") continue;

    const symbolForTech = signal.pair.replace("/", "");
    const rsiData = await fetchTechnicalIndicator(symbolForTech, "RSI", "1min");
    const rsi = rsiData ? parseFloat(rsiData.RSI) : null;

    if (rsi !== null) {
      if ((signal.direction === "BUY" && rsi > 55) || (signal.direction === "SELL" && rsi < 45)) {
        await storage.updateSignal(signal.id, { status: "CLOSED", analysis: signal.analysis + " [IA: Signal clos car les conditions ne sont plus remplies]" });
        console.log(`[AUTO-CLEANUP] Signal ${signal.pair} closed (RSI: ${rsi})`);
      }
    }
  }
}

async function processScalpingSignal(symbol: string, data: any, rsiData: any, macdData: any, smaData: any) {
  const price = parseFloat(data.price);
  const rsi = rsiData ? parseFloat(rsiData.RSI) : null;
  const macd = macdData ? parseFloat(macdData.MACD) : null;
  const macdSignal = macdData ? parseFloat(macdData.MACD_Signal) : null;
  const sma = smaData ? parseFloat(smaData.SMA) : null;
  
  // TOUTE LA LOGIQUE EST DÉLÉGUÉE À L'IA
  const aiDecision = await generateAIAnalysis(symbol, price, rsi, macd, sma);

  if (aiDecision && aiDecision.shouldSignal && aiDecision.direction) {
    const existingSignals = await storage.getSignals();
    const hasActive = existingSignals.some(s => s.pair === symbol && s.status === "ACTIVE");
    
    if (!hasActive) {
      await storage.createSignal({
        pair: symbol,
        direction: aiDecision.direction,
        entryPrice: data.price,
        stopLoss: aiDecision.stopLoss || (aiDecision.direction === "BUY" ? (price * 0.998).toFixed(4) : (price * 1.002).toFixed(4)),
        takeProfit: aiDecision.takeProfit || (aiDecision.direction === "BUY" ? (price * 1.005).toFixed(4) : (price * 0.995).toFixed(4)),
        status: "ACTIVE",
        analysis: `[DÉCISION IA] ${aiDecision.analysis}`,
        isPremium: true
      });
      console.log(`[AI FULL DECISION] ${symbol}: ${aiDecision.direction} generated by LLM`);
    }
  }
}
