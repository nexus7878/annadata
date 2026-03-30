"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/section-heading";
import { IrrigationPanel } from "@/components/dashboard/irrigation-panel";
import { Droplets, CloudRain, Map as MapIcon, Wifi, Activity, Sprout, ArrowRight } from "lucide-react";

const waterUsage = [
  { zone: "Zone A (Wheat)", usage: "1,200 L", percent: 85, color: "bg-blue-500" },
  { zone: "Zone B (Corn)", usage: "850 L", percent: 60, color: "bg-cyan-400" },
  { zone: "Zone C (Rice)", usage: "2,400 L", percent: 95, color: "bg-emerald-400" },
];

const howToSteps = [
  { num: "01", title: "Setup IoT Sensors", desc: "Install soil moisture and weather sensors across your farm zones.", icon: Wifi },
  { num: "02", title: "Automate Rules", desc: "Our AI calculates exactly how much water each crop needs.", icon: Activity },
  { num: "03", title: "Save Water", desc: "Pumps automatically activate only when absolutely necessary.", icon: Droplets },
  { num: "04", title: "Boost Yield", desc: "Crops receive perfect hydration, maximizing your harvest.", icon: Sprout },
];

export default function IrrigationPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background styling elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="container px-4 md:px-6 py-16 md:py-24 mx-auto">
        <SectionHeading
          badge="IoT Water Management"
          title="Smart Irrigation"
          subtitle="Save up to 30% water while maximizing crop yield through precise, automated irrigation based on real-time soil data."
          alignment="center"
        />

        <div className="max-w-7xl mx-auto mt-12 grid lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Dashboard Column */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-8 flex flex-col gap-6 lg:gap-8"
          >
            {/* Top Row: Panel + Map */}
            <div className="grid md:grid-cols-5 gap-6">
              {/* Irrigation Panel */}
              <div className="md:col-span-2">
                <IrrigationPanel />
              </div>

              {/* Interactive Farm Map */}
              <div className="md:col-span-3 bg-card/40 backdrop-blur-2xl border border-border/50 rounded-2xl relative overflow-hidden flex flex-col min-h-[300px]">
                <div className="absolute inset-0 bg-blue-500/5" />
                
                {/* Simulated Map Grid */}
                <div 
                  className="absolute inset-0 opacity-20 pointer-events-none" 
                  style={{ backgroundImage: 'radial-gradient(hsl(var(--primary)) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
                />

                {/* Simulated Map Zones */}
                <div className="absolute inset-0 p-8 flex items-center justify-center">
                   <div className="relative w-full max-w-[280px] aspect-square">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="absolute top-4 left-4 right-1/2 bottom-1/2 border border-blue-500/30 bg-blue-500/10 rounded-tl-3xl rounded-br-lg"
                      />
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="absolute top-4 right-4 left-1/2 bottom-[30%] border border-cyan-500/30 bg-cyan-500/10 rounded-tr-3xl rounded-bl-lg rounded-br-[40px]"
                      />
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7, duration: 0.8 }}
                        className="absolute bottom-4 left-4 right-1/2 top-1/2 border border-emerald-500/30 bg-emerald-500/10 rounded-bl-3xl rounded-tr-lg"
                      />
                      
                      {/* Floating Data Nodes */}
                      <motion.div 
                        animate={{ y: [-5, 5, -5] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="absolute top-1/4 left-1/4 bg-background border border-border shadow-lg rounded-full px-2.5 py-1 text-[10px] font-bold text-blue-400 flex items-center gap-1 -translate-x-1/2 -translate-y-1/2 backdrop-blur-md"
                      >
                        <Droplets className="h-3 w-3" /> 85%
                      </motion.div>
                      <motion.div 
                        animate={{ y: [5, -5, 5] }}
                        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                        className="absolute top-[35%] right-[20%] bg-background border border-border shadow-lg rounded-full px-2.5 py-1 text-[10px] font-bold text-cyan-400 flex items-center gap-1 -translate-x-1/2 -translate-y-1/2 backdrop-blur-md"
                      >
                        <Droplets className="h-3 w-3" /> 60%
                      </motion.div>
                      <motion.div 
                        animate={{ y: [-3, 3, -3] }}
                        transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                        className="absolute bottom-[30%] left-[30%] bg-background border border-border shadow-lg rounded-full px-2.5 py-1 text-[10px] font-bold text-emerald-400 flex items-center gap-1 -translate-x-1/2 -translate-y-1/2 backdrop-blur-md"
                      >
                        <Droplets className="h-3 w-3" /> 95%
                      </motion.div>
                   </div>
                </div>

                {/* Overlay UI */}
                <div className="relative z-10 p-6 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold flex items-center gap-2">
                       <MapIcon className="h-4 w-4 text-blue-400" />
                       Live Farm Map
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">Real-time zone moisture levels</p>
                  </div>
                  <div className="flex items-center gap-2 bg-background/50 backdrop-blur-xl border border-border/50 rounded-full px-3 py-1.5 shadow-sm text-[10px] font-bold text-blue-400">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    Sensors Active
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Usage Stats & Highlights */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Water Usage */}
              <div className="md:col-span-2 bg-card/40 backdrop-blur-2xl border border-border/50 rounded-2xl p-6 sm:p-8 shadow-sm">
                <h3 className="font-semibold text-sm mb-6 flex items-center gap-2 text-muted-foreground uppercase tracking-widest">
                  <Activity className="h-4 w-4" />
                  Water Usage Tracker
                </h3>
                <div className="space-y-5">
                  {waterUsage.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="flex justify-between text-xs mb-2">
                        <span className="font-medium text-foreground">{item.zone}</span>
                        <span className="font-bold text-muted-foreground">{item.usage}</span>
                      </div>
                      <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden border border-border/50 shadow-inner">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percent}%` }}
                          transition={{ delay: 0.3 + i * 0.1, duration: 1, ease: "easeOut" }}
                          className={`h-full ${item.color} rounded-full relative`}
                        >
                          <div className="absolute inset-0 bg-white/20 w-full" style={{ maskImage: 'linear-gradient(to right, transparent, black)' }}/>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-col gap-4">
                <div className="flex-1 bg-blue-500/5 border border-blue-500/10 rounded-2xl p-5 flex flex-col justify-center relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-colors" />
                  <Droplets className="h-6 w-6 text-blue-500 mb-3" />
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Avg Moisture</p>
                  <h4 className="text-3xl font-bold font-heading text-foreground">65%</h4>
                </div>
                <div className="flex-1 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl p-5 flex flex-col justify-center relative overflow-hidden group">
                  <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl group-hover:bg-cyan-500/20 transition-colors" />
                  <CloudRain className="h-6 w-6 text-cyan-500 mb-3" />
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Next Rain</p>
                  <h4 className="text-2xl font-bold font-heading text-foreground whitespace-nowrap">In 4 Days</h4>
                </div>
              </div>
            </div>

          </motion.div>

          {/* Right Column: How To Guide */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4"
          >
            <div className="sticky top-24 bg-card/60 backdrop-blur-2xl border border-border/80 rounded-2xl p-6 md:p-8 shadow-xl">
              <div className="mb-6">
                <h3 className="text-xl font-bold font-heading mb-2">How it works</h3>
                <p className="text-sm text-muted-foreground">Follow these steps to fully automate your farm&apos;s water management.</p>
              </div>

              <div className="space-y-6 relative">
                {/* Connecting Line */}
                <div className="absolute left-6 top-10 bottom-10 w-px bg-border/80" />

                {howToSteps.map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + idx * 0.15 }}
                      className="relative flex gap-5 items-start"
                    >
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-background border-2 border-blue-500/20 flex items-center justify-center shadow-md shadow-blue-500/5 text-blue-500">
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="pt-1.5 pb-2">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-sm">PHASE {step.num}</span>
                        </div>
                        <h4 className="font-bold text-sm text-foreground mb-1">{step.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-6 border-t border-border/50">
                 <button className="w-full flex items-center justify-center gap-2 bg-foreground text-background font-bold text-sm py-4 rounded-xl hover:bg-foreground/90 transition-colors">
                   Order IoT Kit <ArrowRight className="h-4 w-4" />
                 </button>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
