import { useRoute, Link } from "wouter";
import { useSignal, useUpdateSignal, useDeleteSignal } from "@/hooks/use-signals";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock, Target, ShieldAlert, Trash2, Save, TrendingUp, TrendingDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { TradingViewWidget } from "@/components/TradingViewWidget";

export default function SignalDetails() {
  const [match, params] = useRoute("/signals/:id");
  const id = parseInt(params?.id || "0");
  const { data: signal, isLoading } = useSignal(id);
  const updateSignal = useUpdateSignal();
  const deleteSignal = useDeleteSignal();
  const [resultPips, setResultPips] = useState("");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto p-8">
           <Skeleton className="h-10 w-1/3 mb-8 bg-card" />
           <Skeleton className="h-[400px] w-full rounded-2xl bg-card" />
        </div>
      </div>
    );
  }

  if (!signal) return <div className="text-center p-20 text-white">Signal not found</div>;

  const handleStatusChange = (status: string) => {
    updateSignal.mutate({ id, status: status as any });
  };

  const handleResultSave = () => {
    if (!resultPips) return;
    updateSignal.mutate({ id, resultPips });
  };

  const handleDelete = () => {
    deleteSignal.mutate(id, {
      onSuccess: () => window.location.href = "/"
    });
  };

  const isBuy = signal.direction === "BUY";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Link href="/">
          <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-display font-bold text-white">{signal.pair}</h1>
              <Badge 
                className={`text-sm px-3 py-1 ${isBuy ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
              >
                {signal.direction}
              </Badge>
            </div>
            <p className="text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" /> 
              Posted {formatDistanceToNow(new Date(signal.createdAt!), { addSuffix: true })}
            </p>
          </div>

          <div className="flex items-center gap-2">
             {/* Admin Controls */}
             <div className="bg-card border border-border rounded-lg p-2 flex items-center gap-2">
               <Select defaultValue={signal.status} onValueChange={handleStatusChange}>
                 <SelectTrigger className="w-[140px] h-8 bg-background border-border">
                   <SelectValue placeholder="Status" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                   <SelectItem value="HIT_TP">HIT TP</SelectItem>
                   <SelectItem value="HIT_SL">HIT SL</SelectItem>
                   <SelectItem value="CLOSED">CLOSED</SelectItem>
                 </SelectContent>
               </Select>

               <Dialog>
                 <DialogTrigger asChild>
                   <Button variant="destructive" size="icon" className="h-8 w-8">
                     <Trash2 className="w-4 h-4" />
                   </Button>
                 </DialogTrigger>
                 <DialogContent>
                   <DialogHeader>
                     <DialogTitle>Delete Signal</DialogTitle>
                     <DialogDescription>
                       Are you sure you want to delete this signal? This action cannot be undone.
                     </DialogDescription>
                   </DialogHeader>
                   <DialogFooter>
                     <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                   </DialogFooter>
                 </DialogContent>
               </Dialog>
             </div>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <Card className="bg-card/50 border-border/50">
             <CardContent className="pt-6 text-center">
               <span className="text-xs text-muted-foreground uppercase tracking-widest block mb-1">Entry Price</span>
               <span className="text-2xl font-mono font-bold text-foreground">{signal.entryPrice}</span>
             </CardContent>
           </Card>
           
           <Card className="bg-green-950/20 border-green-500/20">
             <CardContent className="pt-6 text-center">
               <span className="text-xs text-green-500/80 uppercase tracking-widest block mb-1 flex justify-center items-center gap-1">
                 <Target className="w-3 h-3" /> Take Profit
               </span>
               <span className="text-2xl font-mono font-bold text-green-400">{signal.takeProfit}</span>
             </CardContent>
           </Card>

           <Card className="bg-red-950/20 border-red-500/20">
             <CardContent className="pt-6 text-center">
               <span className="text-xs text-red-500/80 uppercase tracking-widest block mb-1 flex justify-center items-center gap-1">
                 <ShieldAlert className="w-3 h-3" /> Stop Loss
               </span>
               <span className="text-2xl font-mono font-bold text-red-400">{signal.stopLoss}</span>
             </CardContent>
           </Card>
        </div>

        {/* TradingView Chart */}
        <Card className="border-border bg-card overflow-hidden">
          <CardHeader>
            <CardTitle>TradingView Live Analysis</CardTitle>
          </CardHeader>
          <div className="h-[500px] w-full bg-black/50">
            <TradingViewWidget symbol={signal.pair} />
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-6">
             {/* Analysis Content */}
             <Card className="border-border bg-card">
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   Technical Analysis
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                   {signal.analysis || "No analysis provided for this signal."}
                 </p>
               </CardContent>
             </Card>
           </div>

           <div className="space-y-6">
              {/* Sidebar info could go here: Market session, volatility, etc */}
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-primary text-lg">Pro Tip</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Always calculate your position size based on your risk tolerance. 
                    Never risk more than 1-2% of your account balance on a single trade.
                  </p>
                </CardContent>
              </Card>
           </div>
        </div>
      </main>
    </div>
  );
}
