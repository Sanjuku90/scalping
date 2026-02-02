import { useSignals } from "@/hooks/use-signals";
import { SignalCard } from "@/components/SignalCard";
import { InstantSignalDialog } from "@/components/InstantSignalDialog";
import { Navbar } from "@/components/Navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { TradingViewMiniChart } from "@/components/TradingViewWidget";
import { Activity, TrendingUp, Zap, Clock, BarChart3 } from "lucide-react";

export default function Dashboard() {
  const { data: signals, isLoading } = useSignals();

  // Separate signals by category and status
  const activeSignals = signals?.filter(s => s.status === "ACTIVE") || [];
  const closedSignals = signals?.filter(s => s.status !== "ACTIVE") || [];
  
  const cryptoSignals = activeSignals.filter(s => s.category === "CRYPTO");
  const forexSignals = activeSignals.filter(s => s.category === "FOREX");
  const otherSignals = activeSignals.filter(s => s.category !== "CRYPTO" && s.category !== "FOREX");

  // Calculate quick stats
  const totalSignals = signals?.length || 0;
  const winningSignals = signals?.filter(s => s.status === "HIT_TP")?.length || 0;
  const winRate = totalSignals > 0 ? Math.round((winningSignals / totalSignals) * 100) : 0;

  const SignalSection = ({ title, signals, icon: Icon, colorClass }: any) => (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg ${colorClass}/10 border border-${colorClass}/20`}>
            <Icon className={`w-4 h-4 ${colorClass}`} />
          </div>
          <h2 className="text-xl font-bold font-display text-white">{title}</h2>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}/10 ${colorClass} border border-${colorClass}/20`}>
            {signals.length}
          </span>
        </div>
      </div>
      
      {signals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {signals.map((signal: any) => (
            <SignalCard key={signal.id} signal={signal} />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center border border-dashed border-border/30 rounded-xl bg-card/20">
          <p className="text-sm text-muted-foreground">Aucun signal {title.toLowerCase()} actif.</p>
        </div>
      )}
    </section>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* TradingView Ticker Tape */}
        <div className="w-full overflow-hidden rounded-xl bg-card border border-border/50 shadow-sm">
          <TradingViewMiniChart symbol="BTCUSD" />
        </div>

        {/* Header Section with Quick Stats */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-primary/20 to-blue-600/10 p-2 rounded-lg border border-primary/10">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">Analyse Elite IA</h1>
            </div>
            <p className="text-muted-foreground">Signaux institutionnels basés sur la précision chirurgicale et les flux de liquidité.</p>
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
              <span className="text-sm text-muted-foreground">Performance:</span>
              <span className="font-semibold text-white">{winRate}%</span>
            </div>
            <InstantSignalDialog />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[280px] rounded-xl bg-card" />
            ))}
          </div>
        ) : activeSignals.length > 0 ? (
          <>
            {cryptoSignals.length > 0 && (
              <SignalSection title="Cryptomonnaies" signals={cryptoSignals} icon={TrendingUp} colorClass="text-orange-500" />
            )}
            {forexSignals.length > 0 && (
              <SignalSection title="Forex" signals={forexSignals} icon={BarChart3} colorClass="text-blue-500" />
            )}
            {otherSignals.length > 0 && (
              <SignalSection title="Autres Actifs" signals={otherSignals} icon={Activity} colorClass="text-primary" />
            )}
          </>
        ) : (
          <div className="relative overflow-hidden text-center py-16 border border-dashed border-border/50 rounded-xl bg-gradient-to-br from-card/80 to-card/40">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <p className="text-muted-foreground mb-2">Aucune position détectée par l'IA.</p>
              <p className="text-sm text-muted-foreground/60">Utilisez l'Analyse Instantanée pour forcer une détection.</p>
            </div>
          </div>
        )}

        {/* Past Signals Grid (Closed) */}
        {closedSignals.length > 0 && (
           <section className="space-y-4 pt-6 border-t border-border/30">
             <div className="flex items-center gap-3">
               <Clock className="w-5 h-5 text-muted-foreground" />
               <h2 className="text-lg font-semibold font-display text-muted-foreground">Historique des Flux</h2>
               <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                 {closedSignals.length} terminés
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
