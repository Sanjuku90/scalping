import { useSignals } from "@/hooks/use-signals";
import { SignalCard } from "@/components/SignalCard";
import { CreateSignalDialog } from "@/components/CreateSignalDialog";
import { StatsChart } from "@/components/StatsChart";
import { Navbar } from "@/components/Navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: signals, isLoading } = useSignals();

  // Separate active signals
  const activeSignals = signals?.filter(s => s.status === "ACTIVE") || [];
  const closedSignals = signals?.filter(s => s.status !== "ACTIVE") || [];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white">Market Overview</h1>
            <p className="text-muted-foreground mt-1">Real-time trading signals and performance analytics.</p>
          </div>
          <CreateSignalDialog />
        </div>

        {/* Stats Section */}
        <section>
          {isLoading ? (
            <Skeleton className="w-full h-[300px] rounded-2xl bg-card" />
          ) : (
            <StatsChart signals={signals || []} />
          )}
        </section>

        {/* Active Signals Grid */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <h2 className="text-xl font-bold font-display text-white">Active Signals</h2>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[250px] rounded-2xl bg-card" />
              ))}
            </div>
          ) : activeSignals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeSignals.map((signal) => (
                <SignalCard key={signal.id} signal={signal} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-xl bg-card/30">
              <p className="text-muted-foreground">No active signals at the moment.</p>
            </div>
          )}
        </section>

        {/* Past Signals Grid (Closed) */}
        {closedSignals.length > 0 && (
           <section className="space-y-4 pt-8 border-t border-border/50">
             <h2 className="text-xl font-bold font-display text-muted-foreground">Signal History</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80 hover:opacity-100 transition-opacity">
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
