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
    if (!data || !data["05. price"]) return null;

    const marketData = {
      symbol: symbol,
      price: data["05. price"],
      change: data["09. change"],
      changePercent: data["10. change percent"],
    };

    return await storage.updateMarketData(marketData);
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    return null;
  }
}

export async function generateSignals() {
  const symbols = ["AAPL", "MSFT", "GOOGL", "BTCUSD", "EURUSD"];
  
  for (const symbol of symbols) {
    const data = await fetchMarketPrice(symbol);
    if (!data) continue;

    const price = parseFloat(data.price);
    const changePercent = parseFloat(data.changePercent?.replace("%", "") || "0");

    // Simple logic for real-time signals based on 24h change
    if (changePercent > 1.5) {
      // Potentially overbought or momentum buy
      await storage.createSignal({
        pair: symbol,
        direction: "BUY",
        entryPrice: data.price,
        stopLoss: (price * 0.98).toFixed(2),
        takeProfit: (price * 1.05).toFixed(2),
        status: "ACTIVE",
        analysis: `Real-time momentum detected for ${symbol}. Positive change of ${data.changePercent}. Strong bullish trend confirmed.`,
        isPremium: true
      });
    } else if (changePercent < -1.5) {
      await storage.createSignal({
        pair: symbol,
        direction: "SELL",
        entryPrice: data.price,
        stopLoss: (price * 1.02).toFixed(2),
        takeProfit: (price * 0.95).toFixed(2),
        status: "ACTIVE",
        analysis: `Market pressure on ${symbol}. Price dropped by ${data.changePercent}. Short-term bearish outlook.`,
        isPremium: false
      });
    }
  }
}
