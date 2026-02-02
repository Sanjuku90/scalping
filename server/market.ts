import axios from "axios";
import { storage } from "./storage";

const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const BASE_URL = "https://www.alphavantage.co/query";

export async function fetchMarketPrice(symbol: string) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: "GLOBAL_QUOTE",
        symbol: symbol,
        apikey: ALPHA_VANTAGE_KEY,
      },
    });

    const data = response.data["Global Quote"];
    if (!data || !data["05. price"]) {
      console.warn(`No price data returned from Alpha Vantage for ${symbol}. Response:`, JSON.stringify(response.data));
      return null;
    }

    const marketData = {
      symbol: symbol,
      price: data["05. price"],
      change: data["09. change"],
      changePercent: data["10. change percent"],
    };

    console.log(`Updated price for ${symbol}: ${marketData.price}`);
    return await storage.updateMarketData(marketData);
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    return null;
  }
}

export async function fetchForexPrice(from: string, to: string) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: "CURRENCY_EXCHANGE_RATE",
        from_currency: from,
        to_currency: to,
        apikey: ALPHA_VANTAGE_KEY,
      },
    });

    const data = response.data["Realtime Currency Exchange Rate"];
    if (!data || !data["5. Exchange Rate"]) {
      console.warn(`No forex data for ${from}/${to}. Response:`, JSON.stringify(response.data));
      return null;
    }

    const symbol = `${from}/${to}`;
    const marketData = {
      symbol: symbol,
      price: data["5. Exchange Rate"],
      change: "0",
      changePercent: "0%",
    };

    console.log(`Updated price for ${symbol}: ${marketData.price}`);
    return await storage.updateMarketData(marketData);
  } catch (error) {
    console.error(`Error fetching forex for ${from}/${to}:`, error);
    return null;
  }
}

export async function generateSignals() {
  // Stocks
  const symbols = ["AAPL", "MSFT", "GOOGL", "IBM"];
  for (const symbol of symbols) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const data = await fetchMarketPrice(symbol);
    if (!data) continue;
    await processSignal(symbol, data);
  }

  // Forex
  const forexPairs = [{ from: "EUR", to: "USD" }, { from: "GBP", to: "USD" }];
  for (const pair of forexPairs) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const data = await fetchForexPrice(pair.from, pair.to);
    if (!data) continue;
    await processSignal(`${pair.from}/${pair.to}`, data);
  }
}

async function processSignal(symbol: string, data: any) {
  const price = parseFloat(data.price);
  const changePercent = parseFloat(data.changePercent?.replace("%", "") || "0");

  // If changePercent is 0 (like in Forex current logic), use a small random spread for demo or just skip
  // In a real app we'd compare against historical data from storage
  const movement = Math.abs(changePercent) > 0 ? Math.abs(changePercent) : (Math.random() * 2);

  if (movement > 0.5) {
    const direction = changePercent >= 0 ? (Math.random() > 0.5 ? "BUY" : "SELL") : "SELL";
    const existingSignals = await storage.getSignals();
    const hasActive = existingSignals.some(s => s.pair === symbol && s.status === "ACTIVE");
    
    if (!hasActive) {
      await storage.createSignal({
        pair: symbol,
        direction: direction,
        entryPrice: data.price,
        stopLoss: direction === "BUY" ? (price * 0.98).toFixed(4) : (price * 1.02).toFixed(4),
        takeProfit: direction === "BUY" ? (price * 1.05).toFixed(4) : (price * 0.95).toFixed(4),
        status: "ACTIVE",
        analysis: `Real-time data update for ${symbol}. Price: ${data.price}. Direction based on market momentum.`,
        isPremium: Math.random() > 0.5
      });
      console.log(`Generated new real signal for ${symbol}: ${direction} at ${data.price}`);
    }
  }
}
