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

// Système de prompting professionnel avancé
const PROFESSIONAL_SYSTEM_PROMPT = `Tu es QUANTUM TRADE AI, un système d'analyse de trading institutionnel de niveau professionnel.

🎯 TON RÔLE:
Tu es un algorithme de trading quantitatif sophistiqué utilisé par les hedge funds et les traders institutionnels. Tu combines l'analyse technique avancée, l'analyse fondamentale et la psychologie des marchés.

📊 TES COMPÉTENCES:
1. ANALYSE TECHNIQUE AVANCÉE
   - Reconnaissance de patterns (Double top/bottom, Head & Shoulders, Triangles, Wedges)
   - Analyse multi-timeframe (M1, M5, M15, H1)
   - Confluence de niveaux (Fibonacci, Points Pivots, Zones de liquidité)
   - Momentum et divergences (RSI, MACD, Stochastique)

2. ANALYSE QUANTITATIVE
   - Calcul de probabilités de succès basé sur les patterns historiques
   - Ratios risk/reward optimisés
   - Volatilité et ATR pour le sizing des positions
   - Corrélations inter-marchés

3. PSYCHOLOGIE DES MARCHÉS
   - Identification des zones de peur et d'avidité
   - Analyse du sentiment (positionnement retail vs institutionnel)
   - Niveaux psychologiques (chiffres ronds, records historiques)

4. GESTION DU RISQUE
   - Stop loss dynamiques basés sur la structure du marché
   - Take profit multi-niveaux (TP1, TP2, TP3)
   - Trailing stop suggestions
   - Maximum drawdown acceptable

⚡ TES RÈGLES D'OR:
- Toujours donner un signal clair (BUY ou SELL)
- Justifier chaque décision avec des données concrètes
- Calculer précisément les niveaux SL/TP
- Évaluer la confiance de manière réaliste
- Adapter le style au type d'actif (Forex, Crypto, Actions)

🔒 FORMAT DE RÉPONSE: Toujours en JSON structuré et professionnel.`;

const SCALPING_SYSTEM_PROMPT = `Tu es QUANTUM SCALPER AI, un système de scalping haute fréquence de niveau institutionnel.

⚡ SPÉCIALISATION: Scalping ultra-rapide (1-15 minutes)

📈 TON APPROCHE:
1. Détection instantanée des micro-mouvements
2. Exploitation des déséquilibres order flow
3. Trading sur les breakouts de consolidation
4. Capture des mouvements de liquidité

🎯 OBJECTIFS:
- Gains rapides: 0.3% à 1% par trade
- Stop loss serré: Max 0.5% du prix
- Win rate cible: 65-75%
- Risk/Reward minimum: 1:1.5

⏱️ TIMING:
- Entrées précises au pip près
- Sorties rapides avant les retournements
- Éviter les périodes de faible volatilité

📊 INDICATEURS PRIORITAIRES:
- RSI courte période (2-7)
- MACD rapide (5,13,1)
- Bandes de Bollinger serrées
- Volume tick

🔒 TOUJOURS fournir un signal immédiat avec des niveaux précis.`;

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
  sma: number | null
): Promise<AIAnalysisResult | null> {
  try {
    const prompt = `🔍 ANALYSE SCALPING PROFESSIONNELLE - ${symbol}

📊 DONNÉES DE MARCHÉ EN TEMPS RÉEL:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Actif: ${symbol}
• Prix actuel: ${price}
• RSI (1min): ${rsi !== null ? rsi.toFixed(2) : 'Non disponible'}
• MACD (1min): ${macd !== null ? macd.toFixed(6) : 'Non disponible'}
• SMA (1min): ${sma !== null ? sma.toFixed(4) : 'Non disponible'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 MISSION: Génère une analyse de scalping institutionnelle complète.

📋 ANALYSE REQUISE:
1. Évalue la micro-tendance actuelle
2. Identifie les niveaux de support/résistance immédiats
3. Calcule la zone d'entrée optimale
4. Définis des SL/TP ultra-précis pour scalping
5. Estime la probabilité de succès

⚠️ CONTRAINTES SCALPING:
- Stop loss max: 0.5% du prix
- Take profit: 0.3% à 1% du prix
- Durée estimée: 2-15 minutes

Réponds UNIQUEMENT au format JSON:
{
  "shouldSignal": true,
  "direction": "BUY" ou "SELL",
  "confidence": "HIGH" | "MEDIUM" | "LOW",
  "analysis": "Synthèse professionnelle de l'opportunité (2-3 phrases)",
  "technicalReasoning": "Justification technique détaillée",
  "stopLoss": "Niveau exact avec 4 décimales",
  "takeProfit": "Niveau principal",
  "takeProfitLevels": {
    "tp1": "Premier objectif (50% position)",
    "tp2": "Deuxième objectif (30% position)",
    "tp3": "Extension (20% position)"
  },
  "riskReward": "Ratio R:R calculé",
  "winProbability": "Probabilité estimée en %",
  "marketContext": "Contexte actuel du marché",
  "entryZone": "Zone d'entrée recommandée",
  "keyLevels": {
    "support": "Support immédiat",
    "resistance": "Résistance immédiate"
  },
  "timeframe": "Durée estimée du trade"
}`;

    const client = getOpenAIClient();
    if (!client) {
      console.log("[QUANTUM AI] OpenAI non configuré - analyse indisponible");
      return null;
    }
    
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SCALPING_SYSTEM_PROMPT }, 
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3, // Plus conservateur pour la précision
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;
    if (!content) return null;
    
    const result = JSON.parse(content);
    console.log(`[QUANTUM AI] Signal ${symbol}: ${result.direction} (${result.confidence})`);
    return result;
  } catch (error) {
    console.error("[QUANTUM AI] Erreur d'analyse:", error);
    return null;
  }
}

export async function generateInstantAISignal(
  symbol: string, 
  price: number, 
  historicalData: any = null
): Promise<AIAnalysisResult> {
  try {
    const assetType = getAssetType(symbol);
    const volatilityProfile = getVolatilityProfile(symbol, price);
    
    const prompt = `🚀 SIGNAL TRADING INSTITUTIONNEL - ${symbol}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 PROFIL DE L'ACTIF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Symbole: ${symbol}
• Type: ${assetType}
• Prix actuel: ${formatPrice(price, symbol)}
• Volatilité estimée: ${volatilityProfile.volatility}
• Spread typique: ${volatilityProfile.spread}

${historicalData ? `📈 DONNÉES HISTORIQUES:
${JSON.stringify(historicalData, null, 2)}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 ANALYSE INSTITUTIONNELLE REQUISE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tu dois analyser cet actif comme un trader institutionnel senior:

1. 📉 ANALYSE TECHNIQUE
   - Tendance dominante (haussière/baissière/range)
   - Momentum actuel
   - Niveaux clés de support/résistance
   - Patterns chartistes visibles

2. 🧠 PSYCHOLOGIE DU MARCHÉ
   - Sentiment actuel
   - Zones de liquidité probables
   - Positionnement probable des institutionnels

3. ⚖️ GESTION DU RISQUE
   - Stop loss optimal (basé sur structure, pas arbitraire)
   - Take profit multi-niveaux
   - Ratio risk/reward

4. 📊 PROBABILITÉS
   - Win rate estimé pour ce setup
   - Qualité du signal (1-10)

⚠️ RÈGLE ABSOLUE: Tu DOIS fournir une recommandation (BUY ou SELL).
Même en cas d'incertitude, choisis la direction la plus probable.

📋 RÉPONDS EN JSON:
{
  "shouldSignal": true,
  "direction": "BUY" ou "SELL",
  "confidence": "HIGH" | "MEDIUM" | "LOW",
  "analysis": "Synthèse professionnelle complète en français (3-4 phrases)",
  "technicalReasoning": "Justification technique détaillée avec les indicateurs utilisés",
  "stopLoss": "Niveau précis calculé sur la structure du marché",
  "takeProfit": "Objectif principal",
  "takeProfitLevels": {
    "tp1": "Premier take profit (sécuriser 40%)",
    "tp2": "Deuxième take profit (sécuriser 35%)",
    "tp3": "Extension pour le reste (25%)"
  },
  "riskReward": "Ratio calculé (ex: 1:2.5)",
  "winProbability": "Probabilité de succès estimée (ex: 68%)",
  "marketContext": "Description du contexte de marché actuel",
  "entryZone": "Zone d'entrée optimale",
  "trailingStopSuggestion": "Suggestion de trailing stop",
  "keyLevels": {
    "support": "Niveau de support clé",
    "resistance": "Niveau de résistance clé"
  },
  "timeframe": "Horizon temporel recommandé"
}`;

    const client = getOpenAIClient();
    if (!client) {
      console.log("[QUANTUM AI] OpenAI non configuré - signal par défaut généré");
      return generateFallbackSignal(symbol, price, volatilityProfile);
    }
    
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: PROFESSIONAL_SYSTEM_PROMPT }, 
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
      max_tokens: 1500,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      return generateFallbackSignal(symbol, price, volatilityProfile);
    }
    
    const result = JSON.parse(content);
    console.log(`[QUANTUM AI] Signal instantané ${symbol}: ${result.direction} | Confiance: ${result.confidence} | Prob: ${result.winProbability}`);
    return result;
  } catch (error) {
    console.error("[QUANTUM AI] Erreur signal instantané:", error);
    return generateFallbackSignal(symbol, price, getVolatilityProfile(symbol, price));
  }
}

// Helpers pour une analyse plus précise
function getAssetType(symbol: string): string {
  if (symbol.includes("/USD") && !symbol.includes("BTC") && !symbol.includes("ETH") && !symbol.includes("BNB")) {
    return "FOREX - Paire de devises";
  }
  if (symbol.includes("BTC") || symbol.includes("ETH") || symbol.includes("BNB") || symbol.includes("SOL") || symbol.includes("XRP")) {
    return "CRYPTO - Cryptomonnaie";
  }
  return "ACTIONS - Action cotée en bourse";
}

interface VolatilityProfile {
  volatility: string;
  spread: string;
  slMultiplier: number;
  tpMultiplier: number;
}

function getVolatilityProfile(symbol: string, price: number): VolatilityProfile {
  // Crypto - haute volatilité
  if (symbol.includes("BTC") || symbol.includes("ETH")) {
    return { 
      volatility: "Élevée (crypto majeure)", 
      spread: "0.05-0.1%",
      slMultiplier: 0.02, // 2%
      tpMultiplier: 0.04  // 4%
    };
  }
  if (symbol.includes("SOL") || symbol.includes("BNB") || symbol.includes("XRP")) {
    return { 
      volatility: "Très élevée (altcoin)", 
      spread: "0.1-0.3%",
      slMultiplier: 0.03,
      tpMultiplier: 0.06
    };
  }
  // Forex
  if (symbol.includes("EUR/USD") || symbol.includes("GBP/USD")) {
    return { 
      volatility: "Modérée (major pair)", 
      spread: "0.5-1 pip",
      slMultiplier: 0.005,
      tpMultiplier: 0.01
    };
  }
  if (symbol.includes("/")) {
    return { 
      volatility: "Modérée-élevée (forex)", 
      spread: "1-3 pips",
      slMultiplier: 0.008,
      tpMultiplier: 0.015
    };
  }
  // Actions
  return { 
    volatility: "Variable (action)", 
    spread: "0.02-0.05%",
    slMultiplier: 0.015,
    tpMultiplier: 0.03
  };
}

function formatPrice(price: number, symbol: string): string {
  if (symbol.includes("JPY")) {
    return price.toFixed(3);
  }
  if (symbol.includes("BTC")) {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }
  if (symbol.includes("/")) {
    return price.toFixed(5);
  }
  return `$${price.toFixed(2)}`;
}

function generateFallbackSignal(symbol: string, price: number, profile: VolatilityProfile): AIAnalysisResult {
  const direction = Math.random() > 0.5 ? "BUY" : "SELL";
  const sl = direction === "BUY" 
    ? (price * (1 - profile.slMultiplier)).toFixed(4)
    : (price * (1 + profile.slMultiplier)).toFixed(4);
  const tp = direction === "BUY"
    ? (price * (1 + profile.tpMultiplier)).toFixed(4)
    : (price * (1 - profile.tpMultiplier)).toFixed(4);
  
  return {
    shouldSignal: true,
    direction: direction as "BUY" | "SELL",
    confidence: "LOW",
    analysis: `Signal automatique pour ${symbol}. L'API OpenAI n'est pas configurée - analyse basée sur les paramètres par défaut.`,
    technicalReasoning: "Signal généré automatiquement sans analyse AI. Configurez OpenAI pour des analyses professionnelles.",
    stopLoss: sl,
    takeProfit: tp,
    takeProfitLevels: {
      tp1: (parseFloat(tp) * 0.5).toFixed(4),
      tp2: (parseFloat(tp) * 0.75).toFixed(4),
      tp3: tp
    },
    riskReward: "1:2",
    winProbability: "50%",
    marketContext: "Contexte non disponible - API non configurée",
    entryZone: price.toFixed(4),
    keyLevels: {
      support: (price * 0.98).toFixed(4),
      resistance: (price * 1.02).toFixed(4)
    },
    timeframe: "15-60 minutes"
  };
}

// Fonction d'analyse avancée avec multi-timeframe
export async function generateAdvancedAnalysis(
  symbol: string,
  price: number,
  indicators: {
    rsi?: number;
    macd?: number;
    sma20?: number;
    sma50?: number;
    sma200?: number;
    atr?: number;
    volume?: number;
  }
): Promise<AIAnalysisResult | null> {
  try {
    const prompt = `📊 ANALYSE MULTI-TIMEFRAME AVANCÉE - ${symbol}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 DONNÉES TECHNIQUES COMPLÈTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Prix: ${formatPrice(price, symbol)}
• RSI (14): ${indicators.rsi?.toFixed(2) ?? 'N/A'}
• MACD: ${indicators.macd?.toFixed(6) ?? 'N/A'}
• SMA 20: ${indicators.sma20?.toFixed(4) ?? 'N/A'}
• SMA 50: ${indicators.sma50?.toFixed(4) ?? 'N/A'}
• SMA 200: ${indicators.sma200?.toFixed(4) ?? 'N/A'}
• ATR: ${indicators.atr?.toFixed(4) ?? 'N/A'}
• Volume: ${indicators.volume ?? 'N/A'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 ANALYSE PROFESSIONNELLE REQUISE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. CONFLUENCE DES INDICATEURS
   - Que disent les indicateurs ensemble?
   - Y a-t-il des divergences?
   
2. STRUCTURE DU MARCHÉ
   - Tendance générale (SMA 50 vs 200)
   - Position relative du prix
   
3. SIGNAL DE TRADING
   - Direction optimale
   - Niveaux précis d'entrée/sortie

Réponds en JSON avec la même structure que précédemment.`;

    const client = getOpenAIClient();
    if (!client) {
      console.log("[QUANTUM AI] OpenAI non configuré");
      return null;
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: PROFESSIONAL_SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 1500,
    });

    const content = response.choices[0].message.content;
    if (!content) return null;
    
    return JSON.parse(content);
  } catch (error) {
    console.error("[QUANTUM AI] Erreur analyse avancée:", error);
    return null;
  }
}
