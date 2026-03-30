"use client";

import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, LineChart } from "lucide-react";

const data = [
  { name: 'Mon', price: 2100 },
  { name: 'Tue', price: 2150 },
  { name: 'Wed', price: 2200 },
  { name: 'Thu', price: 2180 },
  { name: 'Fri', price: 2250 },
  { name: 'Sat', price: 2300 },
  { name: 'Sun', price: 2350 },
];

export function MandiChart() {
  return (
    <div className="bg-card/60 backdrop-blur-2xl border border-border/50 rounded-3xl p-5 shadow-xl relative overflow-hidden group">
      {/* Background glow for chart */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-primary/20 transition-colors duration-500" />
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <h3 className="font-bold text-sm flex items-center gap-2">
            <LineChart className="h-4 w-4 text-primary" />
            Wheat Price Trend (Last 7 Days)
          </h3>
          <p className="text-xs text-muted-foreground mt-1">Azadpur Mandi, Delhi</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-foreground">₹2,350 <span className="text-xs text-muted-foreground font-normal">/ Qtl</span></p>
          <div className="flex items-center justify-end gap-1 mt-1 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 w-fit ml-auto">
            <TrendingUp className="h-3 w-3 text-emerald-500" />
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">+8.2%</span>
          </div>
        </div>
      </div>
      
      <div className="h-[220px] w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: "12px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                fontSize: "12px",
              }}
              itemStyle={{ color: "hsl(var(--primary))", fontWeight: "bold" }}
              labelStyle={{ color: "hsl(var(--muted-foreground))", marginBottom: "4px" }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [`₹${value}`, "Price"]}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorPrice2)"
              activeDot={{ r: 6, fill: "hsl(var(--primary))", stroke: "hsl(var(--background))", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
