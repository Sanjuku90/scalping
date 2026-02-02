import axios from "axios";
import { storage } from "./storage";

const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const BASE_URL = "https://www.alphavantage.co/query";

// Caching to respect rate limits
const cache: Record<string, { data: any, timestamp: number }> = {};
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes for free tier

async function axiosGetWithRetry(params: any, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await axios.get(BASE_URL, { params });
      
      // Alpha Vantage returns 200 even for rate limits or errors
      const info = response.data["Information"] || response.data["Note"] || response.data["ErrorMessage"];
      if (info) {
        console.warn(`Alpha Vantage API Notice for ${params.function}: ${info}`);
        if (info.includes("rate limit")) {
          await new Promise(resolve => setTimeout(resolve, 5000 * (i + 1)));
          continue;
        }
        return response; // Return anyway to let caller handle empty data
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
  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_TTL) {
    return cache[cacheKey].data;
  }

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
    console.error(`Error fetching price for ${symbol}:`, error);
    return null;
  }
}

export async function fetchForexPrice(from: string, to: string) {
  const symbol = `${from}/${to}`;
  const cacheKey = `forex_${symbol}`;
  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_TTL) {
    return cache[cacheKey].data;
  }

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
    console.error(`Error fetching forex for ${from}/${to}:`, error);
    return null;
  }
}

export async function fetchRealRSI(symbol: string) {
  const cacheKey = `rsi_${symbol}`;
  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_TTL) {
    return cache[cacheKey].data;
  }

  try {
    const response = await axiosGetWithRetry({
      function: "RSI",
      symbol: symbol,
      interval: "daily",
      time_period: "14",
      series_type: "close",
      apikey: ALPHA_VANTAGE_KEY,
    });

    if (!response) return null;

    const technicalData = response.data["Technical Analysis: RSI"];
    if (!technicalData) {
       console.warn(`Technical data (RSI) missing for ${symbol}. API limit likely.`);
       return null;
    }

    const lastRef = Object.keys(technicalData)[0];
    const rsi = parseFloat(technicalData[lastRef]["RSI"]);
    cache[cacheKey] = { data: rsi, timestamp: Date.now() };
    return rsi;
  } catch (error) {
    console.error(`Error fetching RSI for ${symbol}:`, error);
    return null;
  }
}

export async function generateSignals() {
  // Reduction des symboles pour rester dans les limites de la clé gratuite (25 requêtes/jour)
  const symbols = ["AAPL", "EUR/USD"];
  
  for (const symbol of symbols) {
    await new Promise(resolve => setTimeout(resolve, 15000)); // Delai important pour la version gratuite
    
    let priceData;
    let rsi;

    if (symbol.includes("/")) {
      const [from, to] = symbol.split("/");
      priceData = await fetchForexPrice(from, to);
      rsi = await fetchRealRSI(from + to);
    } else {
      priceData = await fetchMarketPrice(symbol);
      rsi = await fetchRealRSI(symbol);
    }

    if (priceData) {
      await processRealSignal(symbol, priceData, rsi);
    }
  }
}

async function processRealSignal(symbol: string, data: any, rsi: number | null) {
  const price = parseFloat(data.price);
  
  let direction: "BUY" | "SELL" | null = null;
  let analysis = "";

  // Analyse technique STRICTE basée sur le RSI réel
  if (rsi !== null) {
    if (rsi < 30) {
      direction = "BUY";
      analysis = `ANALYSE RÉELLE : RSI à ${rsi.toFixed(2)} indique une zone de survente critique. Signal d'achat technique généré sur données Alpha Vantage.`;
    } else if (rsi > 70) {
      direction = "SELL";
      analysis = `ANALYSE RÉELLE : RSI à ${rsi.toFixed(2)} indique une zone de surachat critique. Signal de vente technique généré sur données Alpha Vantage.`;
    }
  }

  if (direction) {
    const existingSignals = await storage.getSignals();
    const hasActive = existingSignals.some(s => s.pair === symbol && s.status === "ACTIVE");
    
    if (!hasActive) {
      await storage.createSignal({
        pair: symbol,
        direction: direction,
        entryPrice: data.price,
        stopLoss: direction === "BUY" ? (price * 0.99).toFixed(4) : (price * 1.01).toFixed(4),
        takeProfit: direction === "BUY" ? (price * 1.03).toFixed(4) : (price * 0.97).toFixed(4),
        status: "ACTIVE",
        analysis: analysis,
        isPremium: true
      });
      console.log(`[VERIFIED SIGNAL] ${symbol}: ${direction} at ${data.price} (RSI: ${rsi})`);
    }
  }
}
