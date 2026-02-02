import { Signal } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, ArrowRight, Target, ShieldAlert, Clock, Trophy } from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

interface SignalCardProps {
  signal: Signal;
}

export function SignalCard({ signal }: SignalCardProps) {
  const isBuy = signal.direction === "BUY";
  const isActive = signal.status === "ACTIVE";

  const statusColors = {
    ACTIVE: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    HIT_TP: "bg-green-500/10 text-green-400 border-green-500/20",
    HIT_SL: "bg-red-500/10 text-red-400 border-red-500/20",
    CLOSED: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Link href={`/signals/${signal.id}`}>
        <Card className="cursor-pointer border-border/50 bg-card hover:border-primary/50 transition-colors shadow-lg overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/50 bg-secondary/20">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isBuy ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                {isBuy ? (
                  <TrendingUp className="w-5 h-5 text-green-500" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-500" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold font-display tracking-tight text-white">{signal.pair}</h3>
                <p className="text-xs text-muted-foreground font-mono">
                  {formatDistanceToNow(new Date(signal.createdAt!), { addSuffix: true })}
                </p>
              </div>
            </div>
            <Badge variant="outline" className={`${statusColors[signal.status as keyof typeof statusColors]} uppercase tracking-wider text-[10px]`}>
              {signal.status?.replace('_', ' ')}
            </Badge>
          </CardHeader>
          
          <CardContent className="pt-6 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <ArrowRight className="w-3 h-3" /> Entry
              </span>
              <p className="font-mono text-lg font-bold text-foreground">
                {signal.entryPrice}
              </p>
            </div>
            
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Target className="w-3 h-3 text-green-500" /> Take Profit
              </span>
              <p className="font-mono text-lg font-bold text-green-400">
                {signal.takeProfit}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-red-500" /> Stop Loss
              </span>
              <p className="font-mono text-lg font-bold text-red-400">
                {signal.stopLoss}
              </p>
            </div>

            {signal.resultPips && (
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-yellow-500" /> Result
                </span>
                <p className={`font-mono text-lg font-bold ${Number(signal.resultPips) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {Number(signal.resultPips) > 0 ? '+' : ''}{signal.resultPips} pips
                </p>
              </div>
            )}
          </CardContent>

          <CardFooter className="pt-0 pb-4">
            <div className="w-full pt-4 border-t border-border/50 flex justify-between items-center">
               <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                 {signal.isPremium ? (
                   <><span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Premium Signal</>
                 ) : (
                   "Free Signal"
                 )}
               </span>
               <span className="text-xs text-primary font-medium group-hover:underline flex items-center gap-1">
                 View Analysis <ArrowRight className="w-3 h-3" />
               </span>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
