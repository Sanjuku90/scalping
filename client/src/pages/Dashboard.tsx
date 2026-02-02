import { useSignals } from "@/hooks/use-signals";
import { SignalCard } from "@/components/SignalCard";
import { InstantSignalDialog } from "@/components/InstantSignalDialog";
import { Navbar } from "@/components/Navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { TradingViewMiniChart } from "@/components/TradingViewWidget";
import { Activity, TrendingUp, Zap, Clock, BarChart3 } from "lucide-react";

export default function Dashboard() {
  const { data: signals, isLoading } = useSignals();

  // Separate active signals
  const activeSignals = signals?.filter(s => s.status === "ACTIVE") || [];
  const closedSignals = signals?.filter(s => s.status !== "ACTIVE") || [];

  // Calculate quick stats
  const totalSignals = signals?.length || 0;
  const winningSignals = signals?.filter(s => s.status === "HIT_TP")?.length || 0;
  const winRate = totalSignals > 0 ? Math.round((winningSignals / totalSignals) * 100) : 0;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* TradingView Ticker Tape */}
        <div className="w-full overflow-hidden rounded-xl bg-card border border-border/50 shadow-sm">
          <TradingViewMiniChart symbol="EURUSD" />
        </div>

        {/* Header Section with Quick Stats */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-primary/20 to-blue-600/10 p-2 rounded-lg border border-primary/10">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">Centre de Commande</h1>
            </div>
            <p className="text-muted-foreground">Signaux de trading institutionnels generes par IA en temps reel.</p>
          </div>
          
          {/* Quick Stats Row */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border/50">
              <Activity className="w-4 h-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Actifs:</span>
              <span className="font-semibold text-white">{activeSignals.length}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border/50">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Win Rate:</span>
              <span className="font-semibold text-white">{winRate}%</span>
            </div>
            <InstantSignalDialog />
          </div>
        </div>

        {/* Active Signals Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <h2 className="text-xl font-bold font-display text-white">Signaux Actifs</h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                {activeSignals.length} en cours
              </span>
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[280px] rounded-xl bg-card" />
              ))}
            </div>
          ) : activeSignals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeSignals.map((signal) => (
                <SignalCard key={signal.id} signal={signal} />
              ))}
            </div>
          ) : (
            <div className="relative overflow-hidden text-center py-16 border border-dashed border-border/50 rounded-xl bg-gradient-to-br from-card/80 to-card/40">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-7 h-7 text-primary" />
                </div>
                <p className="text-muted-foreground mb-2">Aucun signal actif pour le moment.</p>
                <p className="text-sm text-muted-foreground/60">Generez un nouveau signal avec le bouton ci-dessus.</p>
              </div>
            </div>
          )}
        </section>

        {/* Past Signals Grid (Closed) */}
        {closedSignals.length > 0 && (
           <section className="space-y-4 pt-6 border-t border-border/30">
             <div className="flex items-center gap-3">
               <Clock className="w-5 h-5 text-muted-foreground" />
               <h2 className="text-lg font-semibold font-display text-muted-foreground">Historique des Signaux</h2>
               <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                 {closedSignals.length} fermes
               </span>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 opacity-70 hover:opacity-100 transition-opacity duration-300">
               {closedSignals.slice(0, 6).map((signal) => (
                 <SignalCard key={signal.id} signal={signal} />
               ))}
             </div>
           </section>
        )}

      </main>
    </div>
  );
}
