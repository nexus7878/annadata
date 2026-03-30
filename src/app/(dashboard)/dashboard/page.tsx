"use client";

import { motion } from "framer-motion";
import {
  Droplets,
  ThermometerSun,
  Activity,
  Wind,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  CloudSun,
  Leaf,
  Settings,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  BarChart3,
  Zap,
} from "lucide-react";
import { MandiChart } from "@/components/dashboard/mandi-chart";

// Mock IoT Telemetry Data
const stats = [
  { icon: Droplets, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", glowColor: "blue", label: "Soil Moisture", v: "42%", trend: "-2%", up: false },
  { icon: ThermometerSun, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20", glowColor: "orange", label: "Temperature", v: "28.4°C", trend: "+1.2°C", up: true },
  { icon: CloudSun, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", glowColor: "emerald", label: "Humidity", v: "65%", trend: "+5%", up: true },
  { icon: Wind, color: "text-violet-500", bg: "bg-violet-500/10", border: "border-violet-500/20", glowColor: "violet", label: "Wind Speed", v: "12 km/h", trend: "-3 km/h", up: false },
];

const npkData = [
  { label: "Nitrogen (N)", value: "45", target: "50", unit: "mg/kg", color: "bg-emerald-500", shadow: "shadow-emerald-500/40" },
  { label: "Phosphorus (P)", value: "22", target: "30", unit: "mg/kg", color: "bg-orange-500", shadow: "shadow-orange-500/40" },
  { label: "Potassium (K)", value: "180", target: "200", unit: "mg/kg", color: "bg-blue-500", shadow: "shadow-blue-500/40" },
];

const recentActivities = [
  { icon: Droplets, label: "Irrigation Zone A activated", time: "12 min ago", color: "text-blue-500", bg: "bg-blue-500/10" },
  { icon: Zap, label: "Fertilizer schedule updated", time: "1 hr ago", color: "text-amber-500", bg: "bg-amber-500/10" },
  { icon: BarChart3, label: "Weekly crop report generated", time: "3 hrs ago", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { icon: Calendar, label: "Harvest window opens in 4 days", time: "Today", color: "text-violet-500", bg: "bg-violet-500/10" },
];

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function DashboardOverview() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1440px] mx-auto pb-20">
      
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-heading tracking-tight">Farm Telemetry Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time diagnostics from 12 active IoT node locations</p>
        </div>
        
        <div className="flex shrink-0 gap-2">
          <button className="px-4 py-2.5 bg-muted/60 hover:bg-muted border border-border/60 rounded-xl text-[13px] font-semibold text-foreground transition-all duration-300 shadow-sm flex items-center gap-2 hover:shadow-md">
            <Settings className="w-4 h-4 text-muted-foreground" /> Options
          </button>
          <button className="px-4 py-2.5 bg-primary/10 hover:bg-primary/15 border border-primary/25 rounded-xl text-[13px] font-bold text-primary transition-all duration-300 shadow-sm shadow-primary/5 flex items-center gap-2 hover:shadow-md hover:shadow-primary/10">
            <LineChart className="w-4 h-4" /> Download Report
          </button>
        </div>
      </motion.div>

      {/* Primary KPI Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              variants={fadeUp}
              className="bg-card/80 backdrop-blur-md border border-border/50 rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:border-border transition-all duration-300 shadow-sm hover:shadow-lg cursor-default"
            >
              {/* Background Glow */}
              <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-[50px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${stat.bg.replace('/10', '')}`} />
              
              <div className="flex items-start justify-between relative z-10">
                <div className={`p-2.5 rounded-xl ${stat.bg} border ${stat.border} shadow-inner transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className={`text-[10px] sm:text-xs font-bold flex items-center gap-0.5 px-2 py-1 rounded-md shadow-sm border ${
                  stat.up 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                    : 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20'
                  }`}
                >
                  {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.trend}
                </span>
              </div>
              <div className="relative z-10 pt-2">
                <p className="text-2xl sm:text-3xl font-bold font-heading text-foreground tracking-tight">{stat.v}</p>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Advanced Telemetry Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        
        {/* Soil Chemistry (NPK + EC) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-2 bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-lg font-bold text-foreground font-heading flex items-center gap-2">
                <Leaf className="w-5 h-5 text-primary" />
                Soil Chemistry Analysis
              </h2>
              <p className="text-xs text-muted-foreground mt-1.5">NPK macronutrients and Electrical Conductivity (EC)</p>
            </div>
            
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Sensors Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* NPK Bars */}
            <div className="space-y-6">
              {npkData.map((nutrient, i) => {
                const percentage = (parseInt(nutrient.value) / parseInt(nutrient.target)) * 100;
                return (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-semibold text-foreground/80">{nutrient.label}</span>
                      <div className="text-xs font-mono">
                        <span className="text-foreground font-bold">{nutrient.value}</span>
                        <span className="text-muted-foreground"> / {nutrient.target} {nutrient.unit}</span>
                      </div>
                    </div>
                    <div className="h-2.5 w-full bg-muted/60 rounded-full overflow-hidden border border-border/30 shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, percentage)}%` }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 1, ease: 'easeOut' }}
                        className={`h-full ${nutrient.color} shadow-lg ${nutrient.shadow} relative rounded-full`}
                      >
                         <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/30 rounded-full" />
                      </motion.div>
                    </div>
                    {percentage < 80 && (
                      <p className="text-[10px] text-orange-600 dark:text-orange-400 mt-1.5 font-medium flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Sub-optimal level detected
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Electrical Conductivity (EC) Gauge */}
            <div className="flex items-center justify-center relative p-4 bg-muted/20 border border-border/30 rounded-2xl">
               <div className="absolute top-4 left-4">
                 <p className="text-sm font-bold text-foreground font-heading">Electrical Conductivity</p>
                 <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">Salt concentration</p>
               </div>
               
               <div className="relative w-40 h-40 mt-8 shrink-0">
                  <svg className="w-full h-full -rotate-90 drop-shadow-xl" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="12" className="text-muted/30" />
                    {/* Foreground progress */}
                    <motion.circle
                      cx="50" cy="50" r="42" fill="none"
                      stroke="url(#ecGradient)"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 42}
                      initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - 1.2/3.0) }} 
                      transition={{ delay: 0.6, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                      className="drop-shadow-[0_0_12px_rgba(59,130,246,0.4)]"
                    />
                    <defs>
                      <linearGradient id="ecGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold font-mono text-foreground tracking-tight drop-shadow-sm">1.2</span>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-1 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">mS/cm</span>
                  </div>
               </div>
               
               <div className="absolute bottom-4 right-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-1 rounded border border-emerald-500/20 flex items-center gap-1">
                 <CheckCircle2 className="w-3 h-3" /> Healthy Range
               </div>
            </div>
          </div>
        </motion.div>

        {/* System Notices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-lg flex flex-col relative overflow-hidden"
        >
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-[60px]" />
          
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-6">System Notices</h2>
          
          <div className="space-y-4 flex-1">
            <div className="p-4 bg-orange-500/5 border border-orange-500/15 rounded-2xl flex gap-3 hover:border-orange-500/30 transition-colors duration-300">
               <div className="mt-0.5">
                 <ThermometerSun className="w-5 h-5 text-orange-500" />
               </div>
               <div>
                 <p className="text-sm font-bold text-foreground leading-tight">High Temp Warning</p>
                 <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">Temperatures expected to exceed 35°C tomorrow. Adjust irrigation schedules accordingly.</p>
               </div>
            </div>
            
            <div className="p-4 bg-muted/30 border border-border/50 hover:bg-muted/50 hover:border-border transition-all duration-300 cursor-pointer rounded-2xl flex gap-3">
               <div className="mt-0.5">
                 <Activity className="w-5 h-5 text-blue-500" />
               </div>
               <div>
                 <p className="text-sm font-bold text-foreground leading-tight">Device Calibration</p>
                 <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">Node 4 (East Field) requires moisture probe calibration in 2 days.</p>
               </div>
            </div>
          </div>

          <button className="w-full mt-4 py-3 bg-muted/40 hover:bg-muted border border-border/50 hover:border-border transition-all duration-300 rounded-xl text-sm font-bold text-foreground shadow-inner">
            View All Diagnostics
          </button>
        </motion.div>
      </div>

      {/* Bottom Row: Chart + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-2"
        >
          <div className="mb-4">
            <h2 className="text-lg font-bold text-foreground font-heading">Financial & Market Intelligence</h2>
            <p className="text-xs text-muted-foreground mt-1">Live updates on aggregated mandi commodities</p>
          </div>
          <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-1 shadow-lg">
            <MandiChart />
          </div>
        </motion.div>

        {/* Recent Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-lg"
        >
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((act, i) => {
              const Icon = act.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-start gap-3 group cursor-default"
                >
                  <div className={`p-2 rounded-lg ${act.bg} shrink-0 transition-transform duration-200 group-hover:scale-110`}>
                    <Icon className={`w-4 h-4 ${act.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground leading-tight truncate">{act.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{act.time}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <button className="w-full mt-6 py-3 bg-primary/8 hover:bg-primary/12 border border-primary/20 hover:border-primary/30 transition-all duration-300 rounded-xl text-sm font-bold text-primary">
            View All Activity
          </button>
        </motion.div>
      </div>
    </div>
  );
}
