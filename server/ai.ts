import OpenAI from "openai";

// Configured for Replit AI Integrations - lazy initialization to avoid startup crash
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
  if (!openai && process.env.AI_INTEGRATIONS_OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
      baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
    });
  }
  return openai;
}

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

    const client = getOpenAIClient();
    if (!client) {
      console.log("OpenAI not configured - skipping AI analysis");
      return null;
    }
    
    const response = await client.chat.completions.create({
      model: "gpt-4o",
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

export async function generateInstantAISignal(symbol: string, price: number, historicalData: any = null) {
  try {
    const prompt = `Tu es un trader professionnel et tu dois ABSOLUMENT donner une position de trading pour ${symbol}.

DONNÉES ACTUELLES:
- Actif: ${symbol}
- Prix actuel: ${price}
${historicalData ? `- Données historiques: ${JSON.stringify(historicalData)}` : ''}

MISSION OBLIGATOIRE: Tu dois TOUJOURS fournir une recommandation de trading. Analyse le marché et décide si c'est un achat ou une vente basé sur:
- La tendance actuelle du prix
- Le momentum du marché
- Les niveaux psychologiques importants
- La volatilité probable

IMPORTANT: Tu dois TOUJOURS répondre avec une direction (BUY ou SELL). Ne refuse jamais de donner un signal.

Réponds UNIQUEMENT au format JSON:
{
  "direction": "BUY" ou "SELL",
  "confidence": "HIGH" ou "MEDIUM" ou "LOW",
  "analysis": "Explication détaillée de ta stratégie en français (3-4 phrases maximum)",
  "stopLoss": "${price}" (ajuste selon le risque, environ 0.5-1% du prix),
  "takeProfit": "${price}" (ajuste selon l'objectif, environ 1-2% du prix),
  "reasoning": "Les raisons techniques de cette décision"
}`;

    const client = getOpenAIClient();
    if (!client) {
      console.log("OpenAI not configured - returning default signal");
      return {
        direction: "BUY",
        confidence: "LOW",
        analysis: "OpenAI non configuré - signal par défaut.",
        stopLoss: (price * 0.995).toFixed(4),
        takeProfit: (price * 1.01).toFixed(4),
        reasoning: "Signal de secours - API non configurée"
      };
    }
    
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Tu es un analyste de trading expert. Tu dois TOUJOURS donner une recommandation de position (BUY ou SELL). Tu ne peux jamais refuser ou dire que tu n'as pas assez de données. Base toi sur ton expertise du marché pour prendre une décision." 
        }, 
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      return {
        direction: "BUY",
        confidence: "MEDIUM",
        analysis: "Analyse technique automatique basée sur le prix actuel.",
        stopLoss: (price * 0.995).toFixed(4),
        takeProfit: (price * 1.01).toFixed(4),
        reasoning: "Signal généré automatiquement"
      };
    }
    return JSON.parse(content);
  } catch (error) {
    console.error("Erreur AI Instant Signal:", error);
    return {
      direction: "BUY",
      confidence: "LOW",
      analysis: "Analyse par défaut - l'IA n'a pas pu analyser complètement.",
      stopLoss: (price * 0.995).toFixed(4),
      takeProfit: (price * 1.01).toFixed(4),
      reasoning: "Signal de secours"
    };
  }
}
