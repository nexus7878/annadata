"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/section-heading";
import { LineChart, Activity, Droplets, ThermometerSun, TrendingUp, CheckCircle2, Sprout, CloudSun, Leaf, ArrowUpRight, ArrowDownRight, BarChart3, Sparkles } from "lucide-react";
import Image from "next/image";

const stats = [
  { icon: Droplets, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", label: "Soil Moisture", v: "68%", trend: "+3%", up: true },
  { icon: ThermometerSun, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20", label: "Temperature", v: "28°C", trend: "-1°C", up: false },
  { icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "Crop Health", v: "92%", trend: "+5%", up: true },
  { icon: LineChart, color: "text-violet-500", bg: "bg-violet-500/10", border: "border-violet-500/20", label: "Est. Yield", v: "4.2T", trend: "+0.4T", up: true },
];

const barHeights = [45, 62, 38, 75, 55, 82, 70, 48, 88, 65, 72, 58];
const linePoints = "10,85 30,70 50,75 70,55 90,60 110,42 130,48 150,30 170,35 190,20 210,25 230,15";

export function DashboardPreview() {
  return (
    <section id="overview" className="py-20 sm:py-28 md:py-36 overflow-hidden relative">
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-background mix-blend-multiply z-0 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/[0.04] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      {/* Subtle Noise Texture */}
      <div
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container px-4 sm:px-6 relative z-10 w-full max-w-[1400px]">
        <SectionHeading
          badge="Platform Overview"
          title="A mission-control center for your farm."
          subtitle="Monitor crop health, control irrigation, and track market prices from one intuitive, high-performance dashboard."
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-[1100px] mx-auto mt-16"
        >
          {/* Main dashboard mockup container - Forced Dark Mode for contrast against white page */}
          <div className="relative rounded-2xl sm:rounded-3xl border border-gray-800 bg-[#121212] shadow-[0_30px_80px_-15px_rgba(0,0,0,0.8)] overflow-hidden ring-1 ring-white/10 shadow-emerald-900/20">
            
            {/* Window chrome / Header */}
            <div className="h-12 border-b border-white/10 flex items-center px-4 sm:px-6 gap-4 bg-[#1A1A1A]">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-sm" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="h-7 px-8 bg-black/60 rounded-lg border border-white/5 flex items-center gap-2 shadow-inner">
                  <span className="text-[10px] text-gray-400 font-semibold tracking-wider">ANNADATA TERMINAL</span>
                </div>
              </div>
              <div className="w-12 flex justify-end">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Image src="/symbollogo.png" alt="Logo" width={14} height={14} className="dark:brightness-200" />
                </div>
              </div>
            </div>

            {/* Application Layout */}
            <div className="flex min-h-[500px]">
              {/* Sidebar */}
              <div className="w-56 border-r border-white/5 hidden md:flex flex-col bg-[#161616] p-4">
                {/* Nav items */}
                <div className="space-y-1 mt-2">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-4 px-3">Main Menu</p>
                  {[
                    { label: "Overview", active: true, icon: BarChart3 },
                    { label: "Crop Engine", active: false, icon: Leaf },
                    { label: "Smart Irrigation", active: false, icon: Droplets },
                    { label: "Mandi Prices", active: false, icon: TrendingUp },
                    { label: "Climate Data", active: false, icon: CloudSun },
                  ].map((item, i) => {
                    const NavIcon = item.icon;
                    return (
                      <div
                        key={i}
                        className={`h-10 rounded-xl flex items-center px-3 gap-3 transition-all duration-300 cursor-pointer ${
                          item.active 
                            ? 'bg-emerald-500/10 shadow-sm border border-emerald-500/20' 
                            : 'hover:bg-white/5'
                        }`}
                      >
                        <NavIcon className={`w-4 h-4 ${item.active ? 'text-emerald-400' : 'text-gray-400'}`} />
                        <span className={`text-xs font-semibold ${item.active ? 'text-emerald-50 text-shadow-sm' : 'text-gray-400'}`}>
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-auto px-3 bg-gradient-to-tr from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden">
                   <Sparkles className="absolute top-2 right-2 text-emerald-400/20 w-8 h-8" />
                   <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">AI Insights</p>
                   <p className="text-[11px] text-muted-foreground leading-relaxed font-medium z-10">Your crops are growing 12% faster this week due to optimal moisture levels.</p>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 p-5 lg:p-8 space-y-6">
                
                {/* Header Strip */}
                <div className="flex justify-between items-end mb-2">
                   <div>
                     <h3 className="text-xl font-bold text-white font-heading">Farm Operations</h3>
                     <p className="text-xs text-gray-400">Real-time telemetry and diagnostics</p>
                   </div>
                   <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
                     <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                     <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">System Normal</span>
                   </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className={`bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3 relative overflow-hidden group hover:bg-white/10 transition-colors duration-300`}
                      >
                        {/* Soft background glow */}
                        <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity ${stat.bg}`} />
                        
                        <div className="flex items-start justify-between relative z-10">
                          <div className={`p-2 rounded-xl ${stat.bg} border ${stat.border}`}>
                            <Icon className={`w-4 h-4 ${stat.color}`} />
                          </div>
                          <span className={`text-[10px] font-bold flex items-center gap-0.5 px-1.5 py-0.5 rounded-md ${stat.up ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'}`}>
                            {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {stat.trend}
                          </span>
                        </div>
                        <div className="relative z-10">
                          <p className="text-2xl font-bold font-heading text-white">{stat.v}</p>
                          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Performance Bar Chart */}
                  <div className="col-span-1 lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-sm font-bold text-white font-heading">Harvest Trajectory</p>
                        <p className="text-[11px] text-gray-400">Historical yield vs. projected (tons)</p>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-md bg-emerald-500/30" />
                          <span className="text-[10px] font-bold text-gray-400">Last Year</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-md bg-emerald-500" />
                          <span className="text-[10px] font-bold text-white">Current</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="h-40 w-full flex items-end justify-between gap-1.5 sm:gap-2 px-2">
                      {barHeights.map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          whileInView={{ height: `${h}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.4 + i * 0.04, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          className={`flex-1 rounded-t-lg transition-colors duration-300 relative group overflow-hidden ${
                            i % 2 === 0 
                              ? 'bg-primary/20 hover:bg-primary/30' 
                              : 'bg-primary/50 hover:bg-primary/60 shadow-[0_0_15px_rgba(52,211,153,0.15)]'
                          }`}
                        >
                           <div className="absolute inset-x-0 top-0 h-1 bg-white/20" />
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between px-2 mt-3 space-x-1.5">
                      {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m) => (
                        <span key={m} className="text-[9px] font-semibold text-gray-500 flex-1 text-center uppercase tracking-wider">{m}</span>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Donut & Line */}
                  <div className="flex flex-col gap-6">
                     
                     {/* Efficiency Score Donut */}
                     <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-1 items-center justify-between sm:justify-center gap-6 backdrop-blur-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] pointer-events-none" />
                        
                        <div>
                          <p className="text-xs font-bold text-white font-heading">Efficiency</p>
                          <p className="text-[10px] text-gray-400 mb-1">Overall farm rating</p>
                        </div>
                        
                        <div className="relative w-20 h-20 shrink-0">
                          <svg className="w-full h-full -rotate-90 drop-shadow-md" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                            <motion.circle
                              cx="50" cy="50" r="38" fill="none"
                              stroke="hsl(var(--primary))"
                              strokeWidth="10"
                              strokeLinecap="round"
                              strokeDasharray={2 * Math.PI * 38}
                              initial={{ strokeDashoffset: 2 * Math.PI * 38 }}
                              whileInView={{ strokeDashoffset: 2 * Math.PI * 38 * 0.15 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.6, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                              className="drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-xl font-bold font-heading text-white">85%</span>
                          </div>
                        </div>
                     </div>
                     
                     {/* Growth Trend Line */}
                     <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex-1 flex flex-col justify-center backdrop-blur-sm relative overflow-hidden">
                       <p className="text-xs font-bold text-white font-heading mb-4">Growth Rate</p>
                       <svg viewBox="0 0 240 80" className="w-full h-12 overflow-visible">
                         <defs>
                           <linearGradient id="lineColor" x1="0" y1="0" x2="1" y2="0">
                             <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
                             <stop offset="100%" stopColor="hsl(var(--primary))" />
                           </linearGradient>
                           <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
                             <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                           </linearGradient>
                         </defs>
                         <motion.polyline
                           points={linePoints}
                           fill="none"
                           stroke="url(#lineColor)"
                           strokeWidth="3"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           initial={{ pathLength: 0, opacity: 0 }}
                           whileInView={{ pathLength: 1, opacity: 1 }}
                           viewport={{ once: true }}
                           transition={{ delay: 0.7, duration: 1.8, ease: "easeOut" }}
                           style={{ filter: "drop-shadow(0px 4px 6px rgba(52,211,153,0.3))" }}
                         />
                         <motion.polyline
                           points={linePoints}
                           fill="url(#glow)"
                           stroke="none"
                           initial={{ opacity: 0 }}
                           whileInView={{ opacity: 1 }}
                           viewport={{ once: true }}
                           transition={{ delay: 1, duration: 1 }}
                         />
                       </svg>
                     </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Floating UI Notification elements positioned outside the main window */}
          
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -right-6 lg:-right-12 top-24 lg:top-32 hidden md:block z-20"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="bg-black/60 border border-white/10 shadow-2xl shadow-black/40 rounded-2xl p-3 flex items-center gap-3 backdrop-blur-xl"
            >
              <div className="bg-emerald-500/20 p-2 rounded-xl border border-emerald-500/30">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]" />
              </div>
              <div className="pr-4">
                <p className="text-xs font-bold text-white mb-0.5">Irrigation Complete</p>
                <p className="text-[10px] text-emerald-200/70 font-medium">Zone A hydrated optimally</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -left-6 lg:-left-12 bottom-32 hidden lg:block z-20"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="bg-black/60 border border-white/10 shadow-2xl shadow-black/40 rounded-2xl p-3 flex items-center gap-3 backdrop-blur-xl"
            >
              <div className="bg-blue-500/20 p-2 rounded-xl border border-blue-500/30">
                <TrendingUp className="w-5 h-5 text-blue-400 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
              </div>
              <div className="pr-4">
                <p className="text-xs font-bold text-white mb-0.5">Price Alert: Wheat</p>
                <p className="text-[10px] text-blue-200/70 font-medium">+5% jump in local Mandi</p>
              </div>
            </motion.div>
          </motion.div>

          {/* New Pest Warning Float */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -left-4 top-16 hidden md:block z-20"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="bg-black/60 border border-orange-500/20 shadow-2xl shadow-orange-900/10 rounded-2xl p-3 flex items-center gap-3 backdrop-blur-xl"
            >
              <div className="bg-orange-500/20 p-2 rounded-xl border border-orange-500/30 relative">
                <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full animate-ping" />
                <Sprout className="w-5 h-5 text-orange-400 drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]" />
              </div>
              <div className="pr-2">
                <p className="text-xs font-bold text-white mb-0.5">Pest Warning</p>
                <p className="text-[10px] text-orange-200/70 font-medium">Field B requires attention</p>
              </div>
            </motion.div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
