import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Activity, ArrowRight, TrendingUp, ShieldCheck, Zap, BarChart3, Brain, Target, ChevronRight, LineChart, Lock, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  const { user, isLoading } = useAuth();

  if (!isLoading && user) {
    return <Redirect to="/dashboard" />;
  }

  const features = [
    {
      icon: <Brain className="w-6 h-6 text-primary" />,
      title: "Intelligence Artificielle Avancee",
      description: "Algorithmes de trading institutionnel alimentes par GPT-4o pour des analyses precises et professionnelles."
    },
    {
      icon: <Target className="w-6 h-6 text-green-500" />,
      title: "Signaux Haute Precision",
      description: "Niveaux d'entree, Stop Loss et Take Profit calcules sur la structure du marche, pas arbitrairement."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-blue-500" />,
      title: "Gestion du Risque Pro",
      description: "Ratio Risk/Reward optimise avec trailing stop et TP multi-niveaux pour maximiser vos gains."
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: "Execution en Temps Reel",
      description: "Signaux instantanes generes en quelques secondes pour ne jamais manquer une opportunite."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-purple-500" />,
      title: "Analyse Multi-Marches",
      description: "Forex, Crypto, Actions et Indices - une couverture complete des marches financiers mondiaux."
    },
    {
      icon: <LineChart className="w-6 h-6 text-cyan-500" />,
      title: "Smart Money Concepts",
      description: "Analyse basee sur les concepts institutionnels: Order Blocks, Liquidity Zones, Fair Value Gaps."
    }
  ];

  const stats = [
    { value: "95%", label: "Precision IA" },
    { value: "24/7", label: "Disponibilite" },
    { value: "50+", label: "Actifs Couverts" },
    { value: "<3s", label: "Temps d'Analyse" }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-border/30 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/40 blur-xl rounded-full"></div>
              <div className="relative bg-gradient-to-br from-primary to-blue-600 p-2.5 rounded-xl shadow-lg shadow-primary/25">
                <Activity className="h-6 w-6 text-white" />
              </div>
            </div>
            <span className="font-display font-bold text-2xl tracking-tight">
              <span className="text-white">Alpha</span><span className="text-primary">Signals</span>
            </span>
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              PRO
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost"
              className="hidden sm:flex text-muted-foreground hover:text-white"
              onClick={() => window.location.href = "/api/login"}
              data-testid="button-login-nav"
            >
              Se connecter
            </Button>
            <Button 
              className="font-semibold shadow-lg shadow-primary/25"
              onClick={() => window.location.href = "/api/login"}
              data-testid="button-start-free"
            >
              Commencer <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-16 sm:pt-24 pb-32">
          {/* Background Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-r from-primary/30 via-blue-600/20 to-purple-600/20 blur-[150px] rounded-full opacity-60 pointer-events-none" />
          <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-green-500/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 border border-border/50 backdrop-blur-sm mb-8"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-sm text-muted-foreground">Powered by <span className="text-primary font-semibold">GPT-4o</span></span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight text-white mb-6 leading-tight"
              >
                Trading <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-cyan-400">Institutionnel</span>
                <br />
                <span className="text-muted-foreground">a Portee de Main</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
              >
                Accedez a des signaux de trading de niveau hedge fund generes par intelligence artificielle. 
                Analyses precises, gestion du risque professionnelle et execution en temps reel.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-blue-600 text-white hover:from-primary/90 hover:to-blue-600/90 text-lg px-8 py-6 h-auto rounded-xl shadow-2xl shadow-primary/30 transition-all hover:shadow-primary/40 hover:scale-[1.02] w-full sm:w-auto"
                  onClick={() => window.location.href = "/api/login"}
                  data-testid="button-start-trading"
                >
                  Commencer Maintenant <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 h-auto rounded-xl w-full sm:w-auto border-border/50 hover:bg-card/50"
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  data-testid="button-learn-more"
                >
                  En savoir plus
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-8 mt-16 pt-16 border-t border-border/30"
              >
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-3xl sm:text-4xl font-display font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-gradient-to-b from-card/50 to-background border-y border-border/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-4"
              >
                Fonctionnalites
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-display font-bold text-white mb-4"
              >
                Technologie de Trading Avancee
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground max-w-2xl mx-auto"
              >
                Des outils professionnels developpes pour les traders serieux qui veulent un avantage sur les marches.
              </motion.p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="group bg-card/80 backdrop-blur-sm p-6 rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-blue-600/10 rounded-xl flex items-center justify-center mb-4 border border-primary/10 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-display font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative bg-gradient-to-br from-card via-card/95 to-card/90 rounded-2xl border border-border/50 p-8 sm:p-12 overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="relative z-10 text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 text-green-500 text-sm font-medium mb-6">
                  <Lock className="w-4 h-4" />
                  Securise et Fiable
                </div>
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
                  Arretez de Deviner. Commencez a Trader.
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Rejoignez des milliers de traders qui font confiance a notre analyse de marche quotidienne 
                  alimentee par l'intelligence artificielle la plus avancee.
                </p>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-primary to-blue-600 text-white hover:from-primary/90 hover:to-blue-600/90 px-8 py-6 h-auto rounded-xl shadow-xl shadow-primary/20"
                  onClick={() => window.location.href = "/api/login"}
                  data-testid="button-join-now"
                >
                  Rejoindre Maintenant <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/30 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <span className="font-display font-semibold text-white">AlphaSignals</span>
              </div>
              <p className="text-xs text-muted-foreground/60 text-center max-w-xl">
                Le trading comporte des risques substantiels et ne convient pas a tous les investisseurs. 
                Les performances passees ne garantissent pas les resultats futurs. Contenu a but educatif uniquement.
              </p>
              <div className="flex items-center gap-2 text-muted-foreground/60">
                <Globe className="w-4 h-4" />
                <span className="text-xs">FR</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
