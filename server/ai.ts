import OpenAI from "openai";

// Configured for Replit AI Integrations
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function generateAIAnalysis(symbol: string, price: number, rsi: number | null, macd: number | null, sma: number | null) {
  try {
    const prompt = `En tant qu'expert en trading haute fréquence (scalping), analyse instantanément ces données pour ${symbol} :
    - Prix actuel : ${price}
    - RSI (1min) : ${rsi ?? 'N/A'}
    - MACD (1min) : ${macd ?? 'N/A'}
    - SMA (1min) : ${sma ?? 'N/A'}

    RÈGLE CRITIQUE : Tu dois générer une position de trading IMMÉDIATE pour un scalping rapide (quelques minutes). 
    Sois précis sur les niveaux de prix. Analyse les micro-tendances.
    
    Réponds UNIQUEMENT au format JSON :
    {
      "shouldSignal": true,
      "direction": "BUY" | "SELL",
      "analysis": "ton analyse ultra-rapide et technique en français (max 2 phrases)",
      "stopLoss": "prix suggéré (très serré pour scalping)",
      "takeProfit": "prix suggéré (objectif rapide)"
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-5.2",
      messages: [{ role: "system", content: "Tu es un algorithme de scalping HFT ultra-performant." }, { role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) return null;
    return JSON.parse(content);
  } catch (error) {
    console.error("Erreur AI Decision:", error);
    return null;
  }
}
