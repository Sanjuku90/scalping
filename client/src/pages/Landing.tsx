import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Activity, ArrowRight, TrendingUp, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  const { user, isLoading } = useAuth();

  if (!isLoading && user) {
    return <Redirect to="/dashboard" />;
  }

  const features = [
    {
      icon: <TrendingUp className="w-6 h-6 text-green-500" />,
      title: "High Probability Setups",
      description: "Curated trading signals based on multi-timeframe analysis and institutional order flow."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-blue-500" />,
      title: "Risk Management First",
      description: "Every signal includes precise Entry, Stop Loss, and Take Profit levels to protect your capital."
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: "Real-time Execution",
      description: "Get instant notifications for new setups so you never miss a market movement."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 p-2 rounded-lg">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white">
              Alpha<span className="text-primary">Signals</span>
            </span>
          </div>
          <Button 
            className="font-semibold"
            onClick={() => window.location.href = "/api/login"}
          >
            Login
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-20 pb-32">
          {/* Background Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 blur-[120px] rounded-full opacity-50 pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl md:text-7xl font-display font-bold tracking-tight text-white mb-6"
            >
              Trade Like a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Professional</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Get access to institutional-grade forex and crypto signals. 
              Clear entry points, defined risk, and comprehensive market analysis.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 h-auto rounded-full shadow-xl shadow-primary/20 transition-transform hover:scale-105"
                onClick={() => window.location.href = "/api/login"}
              >
                Start Trading Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-card/30 border-y border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-12">
              {features.map((feature, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-colors shadow-lg"
                >
                  <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center mb-6 border border-border shadow-inner">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-24 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-display font-bold text-white mb-6">Stop Guessing. Start Executing.</h2>
            <p className="text-muted-foreground mb-8">Join thousands of traders who rely on our daily market analysis.</p>
            {/* Disclaimer */}
            <p className="text-xs text-muted-foreground/50 max-w-2xl mx-auto">
              Trading involves substantial risk and is not suitable for every investor. 
              Past performance is not indicative of future results. Content is for educational purposes only.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
