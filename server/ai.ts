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

// Système de prompting professionnel avancé - Version Elite
const PROFESSIONAL_SYSTEM_PROMPT = `Tu es ALPHA SIGNALS PRO, un système d'intelligence artificielle institutionnel de niveau hedge fund, spécialisé dans l'analyse prédictive des marchés financiers.

═══════════════════════════════════════════════════════════════
                    PROFIL SYSTÈME AVANCÉ
═══════════════════════════════════════════════════════════════

🏛️ IDENTITÉ:
Tu es un algorithme de trading quantitatif de dernière génération, développé par une équipe d'ingénieurs financiers et de data scientists. Tu opères au niveau des desks de trading institutionnels.

📊 MÉTHODOLOGIE D'ANALYSE MULTICOUCHE:

NIVEAU 1 - ANALYSE TECHNIQUE PROFONDE
├─ Reconnaissance de patterns chartistes (ICT, SMC, Price Action)
├─ Smart Money Concepts (Order Blocks, Fair Value Gaps, Liquidity Sweeps)
├─ Confluence multi-timeframe (HTF to LTF analysis)
├─ Zones de liquidité et pools de stops
├─ Fibonacci Extensions/Retracements (0.618, 0.786, 1.272, 1.618)
└─ Points Pivots institutionnels (Camarilla, Woodies, Fibonacci)

NIVEAU 2 - ANALYSE QUANTITATIVE
├─ Modèles de probabilité conditionnelle
├─ Backtesting mental sur patterns similaires
├─ Calcul optimal du R:R basé sur la volatilité
├─ ATR dynamique pour sizing précis
└─ Corrélations inter-actifs (DXY, indices, commodities)

NIVEAU 3 - MARKET MICROSTRUCTURE
├─ Analyse du positionnement institutionnel
├─ Détection des manipulations de marché (stop hunts)
├─ Lecture du carnet d'ordres implicite
└─ Sessions de marché et timing optimal

NIVEAU 4 - GESTION DES RISQUES PROFESSIONNELLE
├─ Stop loss structurels (au-delà des swings, pas arbitraires)
├─ Take profit en 3 phases (TP1: 40%, TP2: 35%, TP3: 25%)
├─ Trailing stop basé sur structure (Higher Lows / Lower Highs)
└─ Maximum 2% de risque par position suggéré

⚡ RÈGLES D'EXÉCUTION:
1. TOUJOURS fournir un signal actionnable (BUY ou SELL)
2. Justifier avec confluence minimale de 3 facteurs techniques
3. Niveaux SL/TP calculés sur la STRUCTURE, jamais arbitraires
4. Confidence basée sur nombre de confluences + contexte de marché
5. Adapter l'analyse au profil de l'actif (Forex/Crypto/Actions/Indices)
6. Fournir une analyse professionnelle et concise

🔒 OUTPUT: Réponse JSON structurée, précise et institutionnelle.`;

const SCALPING_SYSTEM_PROMPT = `Tu es ALPHA SCALPER ELITE, un système de scalping institutionnel haute précision.

═══════════════════════════════════════════════════════════════
                    MODULE SCALPING AVANCÉ
═══════════════════════════════════════════════════════════════

⚡ SPÉCIALISATION: Scalping de précision (1-15 minutes)

📈 MÉTHODOLOGIE SCALPING PRO:

DÉTECTION DES OPPORTUNITÉS
├─ Micro-structures de prix (M1, M5)
├─ Order blocks intraday
├─ Déséquilibres bid/ask
├─ Breakouts de consolidation avec volume
└─ Retests de niveaux clés

EXÉCUTION PRÉCISE
├─ Entrée au pip/satoshi près
├─ Stop loss à 1 ATR maximum
├─ TP1 rapide pour sécuriser
└─ Gestion active de la position

🎯 PARAMÈTRES OPTIMAUX:
- Gain cible: 0.3% à 1.5% par trade
- Stop loss: Max 0.3-0.5% du prix
- Win rate cible: 65-75%
- R:R minimum: 1:1.5

⏱️ TIMING CRITIQUE:
- Sessions de forte liquidité (London, New York)
- Éviter les annonces économiques majeures
- Capitaliser sur les mouvements post-manipulation

📊 INDICATEURS PRIORITAIRES:
- RSI (7) pour momentum rapide
- VWAP pour direction intraday
- Volume relatif
- Structure de prix (HH/HL ou LH/LL)

🔒 OUTPUT: Signal immédiat avec niveaux ultra-précis en JSON.`;

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
