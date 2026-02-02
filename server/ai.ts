import OpenAI from "openai";

// Configured for Replit AI Integrations
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function generateAIAnalysis(symbol: string, price: number, rsi: number | null, macd: number | null, sma: number | null) {
  try {
    const prompt = `En tant qu'expert en trading haute fréquence (scalping), analyse les données suivantes pour ${symbol} :
    - Prix actuel : ${price}
    - RSI (15m) : ${rsi ?? 'N/A'}
    - MACD (15m) : ${macd ?? 'N/A'}
    - SMA (15m) : ${sma ?? 'N/A'}

    Donne une analyse très courte (max 2 phrases) et percutante en français pour justifier un signal de trading. Sois direct et technique. Pas de blabla inutile.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_completion_tokens: 100,
    });

    return response.choices[0].message.content || "Analyse technique confirmée par IA.";
  } catch (error) {
    console.error("Erreur AI Analysis:", error);
    return null;
  }
}
