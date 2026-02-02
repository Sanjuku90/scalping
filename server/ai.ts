import OpenAI from "openai";

// Configured for Replit AI Integrations
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function generateAIAnalysis(symbol: string, price: number, rsi: number | null, macd: number | null, sma: number | null) {
  try {
    const prompt = `En tant qu'expert en trading haute fréquence (scalping), analyse ces données pour ${symbol} :
    - Prix : ${price}
    - RSI : ${rsi ?? 'N/A'}
    - MACD : ${macd ?? 'N/A'}
    - SMA : ${sma ?? 'N/A'}

    RÈGLE : Tu dois décider si un signal de trading doit être généré.
    Réponds UNIQUEMENT au format JSON :
    {
      "shouldSignal": boolean,
      "direction": "BUY" | "SELL" | null,
      "analysis": "ton analyse courte en français",
      "stopLoss": "prix suggéré",
      "takeProfit": "prix suggéré"
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
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
