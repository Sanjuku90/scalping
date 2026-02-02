import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";
import { Signal } from "@shared/schema";

interface StatsChartProps {
  signals: Signal[];
}

export function StatsChart({ signals }: StatsChartProps) {
  const data = useMemo(() => {
    // Filter for closed signals with results
    const closedSignals = signals
      .filter(s => s.status !== 'ACTIVE' && s.resultPips != null)
      .sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());

    let cumulative = 0;
    return closedSignals.map(signal => {
      cumulative += Number(signal.resultPips);
      return {
        date: new Date(signal.createdAt!).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        pips: cumulative,
        raw: Number(signal.resultPips)
      };
    });
  }, [signals]);

  if (data.length === 0) {
    return (
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>Performance Growth</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          Not enough data to display chart
        </CardContent>
      </Card>
    );
  }

  const isPositive = data[data.length - 1].pips >= 0;

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Cumulative Performance (Pips)</CardTitle>
        <div className={`text-3xl font-bold font-mono ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? '+' : ''}{data[data.length - 1].pips}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorPips" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Area 
                type="monotone" 
                dataKey="pips" 
                stroke={isPositive ? "#22c55e" : "#ef4444"} 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorPips)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
