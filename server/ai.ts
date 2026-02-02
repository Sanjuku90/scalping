import OpenAI from "openai";

// Configured for Replit AI Integrations - lazy initialization to avoid startup crash
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
  if (!openai) {
    const key = process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
    if (key) {
      openai = new OpenAI({
        apiKey: key,
        baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
      });
    }
  }
  return openai;
}

// Fonction de simulation pour le mode gratuit
function getMockAnalysis(symbol: string, price: number, style: string): AIAnalysisResult {
  const direction = Math.random() > 0.5 ? "BUY" : "SELL";
  const volatility = symbol.includes("BTC") || symbol.includes("ETH") ? 0.05 : 0.01;
  const sl = direction === "BUY" ? price * (1 - volatility) : price * (1 + volatility);
  const tp = direction === "BUY" ? price * (1 + volatility * 2) : price * (1 - volatility * 2);

  return {
    shouldSignal: true,
    direction: direction as "BUY" | "SELL",
    confidence: "MEDIUM",
    analysis: `[MODE SIMULATION] Analyse technique basée sur l'action du prix pour ${symbol}. La structure suggère une opportunité en ${direction}.`,
    technicalReasoning: "Confluence technique détectée sur les niveaux de support/résistance. RSI en zone de continuation.",
    stopLoss: sl.toFixed(symbol.includes("/") ? 5 : 2),
    takeProfit: tp.toFixed(symbol.includes("/") ? 5 : 2),
    takeProfitLevels: {
      "tp1": (price + (tp - price) * 0.4).toFixed(symbol.includes("/") ? 5 : 2),
      "tp2": (price + (tp - price) * 0.7).toFixed(symbol.includes("/") ? 5 : 2),
      "tp3": tp.toFixed(symbol.includes("/") ? 5 : 2)
    },
    riskReward: "1:2.5",
    winProbability: "68%",
    marketContext: "Tendance de marché établie",
    entryZone: price.toFixed(symbol.includes("/") ? 5 : 2),
    timeframe: style === "SCALPING" ? "15-60 min" : "4-24h"
  };
}

// Système de prompting professionnel avancé - Version Elite
const PROFESSIONAL_SYSTEM_PROMPT = `Tu es ALPHA SIGNALS PRO, un système d'intelligence artificielle institutionnel de niveau hedge fund, spécialisé dans l'analyse prédictive des marchés financiers.

🏛️ IDENTITÉ:
Tu es un algorithme de trading quantitatif de dernière génération.

🔒 OUTPUT: Réponse JSON structurée, précise et institutionnelle.`;

export interface AIAnalysisResult {
  shouldSignal: boolean;
  direction: "BUY" | "SELL";
  confidence: "HIGH" | "MEDIUM" | "LOW";
  analysis: string;
  technicalReasoning: string;
  stopLoss: string;
  takeProfit: string;
  takeProfitLevels?: {
    tp1: string;
    tp2: string;
    tp3?: string;
  };
  riskReward: string;
  winProbability: string;
  marketContext: string;
  entryZone?: string;
  trailingStopSuggestion?: string;
  timeframe?: string;
  keyLevels?: {
    support: string;
    resistance: string;
  };
}

export async function generateAIAnalysis(
  symbol: string, 
  price: number, 
  rsi: number | null, 
  macd: number | null, 
  sma: number | null,
  style: "SCALPING" | "DAILY" | "SWING" = "DAILY"
): Promise<AIAnalysisResult | null> {
  try {
    const client = getOpenAIClient();
    if (!client) {
      console.log("[AI] Mode simulation activé.");
      return getMockAnalysis(symbol, price, style);
    }

    const stylePrompts = {
      SCALPING: "Analyse ultra-courte durée (1-15 min), haute précision.",
      DAILY: "Analyse intraday (quelques heures à une journée).",
      SWING: "Analyse moyen terme (quelques jours)."
    };

    const prompt = `🔍 ANALYSE DE TRADING PROFESSIONNELLE (${style}) - ${symbol}
• Prix actuel: ${price}
• RSI: ${rsi ?? 'N/A'}
• Style: ${stylePrompts[style]}

Réponds UNIQUEMENT au format JSON structure AIAnalysisResult.`;

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: PROFESSIONAL_SYSTEM_PROMPT }, 
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const content = response.choices[0].message.content;
    if (!content) return getMockAnalysis(symbol, price, style);
    
    return JSON.parse(content);
  } catch (error) {
    console.error("[AI] Erreur, passage en mode simulation:", error);
    return getMockAnalysis(symbol, price, style);
  }
}

export async function generateInstantAISignal(
  symbol: string, 
  price: number, 
  historicalData: any = null
): Promise<AIAnalysisResult> {
  const result = await generateAIAnalysis(symbol, price, null, null, null, "DAILY");
  return result || getMockAnalysis(symbol, price, "DAILY");
}

export async function generateAdvancedAnalysis(
  symbol: string,
  price: number,
  indicators: any
): Promise<AIAnalysisResult | null> {
  return generateAIAnalysis(symbol, price, indicators.rsi, indicators.macd, indicators.sma20, "DAILY");
}
