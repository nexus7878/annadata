"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Droplets, Power, Play, Calendar, RefreshCw, Activity } from "lucide-react";
import { motion } from "framer-motion";

export function IrrigationPanel() {
  const [status, setStatus] = useState<"off" | "running" | "auto">("auto");

  return (
    <div className="bg-card/60 backdrop-blur-2xl rounded-2xl p-6 sm:p-8 flex flex-col h-full border border-border/50 relative overflow-hidden shadow-sm">
      {/* Background Glow */}
      <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[80px] opacity-10 dark:opacity-20 transition-colors duration-700 pointer-events-none ${
        status === "running" ? "bg-blue-500" :
        status === "auto" ? "bg-emerald-500" : "bg-red-500"
      }`} />

      <div className="mb-6 relative z-10">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-1 text-foreground">
          <div className="p-1.5 bg-blue-500/10 rounded-lg">
            <Droplets className="h-5 w-5 text-blue-500 dark:text-blue-400" />
          </div>
          Smart Irrigation Control
        </h2>
        <p className="text-xs text-muted-foreground">Manage water pumps & moisture levels across all farm zones</p>
      </div>

      <div className="flex-1 flex flex-col gap-6 relative z-10">
        {/* Status Indicator */}
        <div className="bg-muted/40 rounded-2xl p-5 border border-border/50 shadow-inner">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">System Status</p>
              <div className="flex items-center gap-3">
                <div className="relative flex h-3 w-3">
                  {(status === "running" || status === "auto") && (
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      status === "running" ? "bg-blue-400" : "bg-emerald-400"
                    }`} />
                  )}
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${
                    status === "running" ? "bg-blue-500" :
                    status === "auto" ? "bg-emerald-500" : "bg-red-500"
                  }`} />
                </div>
                <span className={`font-bold text-lg capitalize ${
                  status === "running" ? "text-blue-600 dark:text-blue-400" :
                  status === "auto" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                }`}>
                  {status} Mode
                </span>
              </div>
            </div>

            {/* Visual feedback for running state */}
            {status === "running" ? (
              <div className="h-12 w-12 rounded-full border border-blue-500/30 flex items-center justify-center bg-blue-500/10 relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 opacity-60"
                />
                <Droplets className="h-5 w-5 text-blue-600 dark:text-blue-400 absolute" />
              </div>
            ) : status === "auto" ? (
              <div className="h-12 w-12 rounded-full border border-emerald-500/30 flex items-center justify-center bg-emerald-500/10">
                <Activity className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            ) : (
              <div className="h-12 w-12 rounded-full border border-red-500/30 flex items-center justify-center bg-red-500/10">
                <Power className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <Button
            variant={status === "running" ? "destructive" : "default"}
            className={`w-full flex items-center justify-center gap-1.5 h-11 px-0 rounded-xl text-xs font-bold transition-all ${
              status === "running" 
                ? "bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-500 border border-red-500/30" 
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
            }`}
            onClick={() => setStatus(status === "running" ? "off" : "running")}
          >
            {status === "running" ? <Power className="h-4 w-4" /> : <Play className="h-4 w-4 shrink-0" />}
            <span className="truncate">{status === "running" ? "Stop" : "Manual Start"}</span>
          </Button>

          <Button
            variant="outline"
            className={`w-full flex items-center justify-center gap-1.5 h-11 px-0 rounded-xl text-xs font-bold transition-all ${
              status === "auto" 
                ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-500 border-emerald-500/40" 
                : "bg-muted/50 border-border/60 hover:bg-muted text-muted-foreground shadow-sm"
            }`}
            onClick={() => setStatus("auto")}
          >
            <motion.div
              animate={status === "auto" ? { rotate: 180 } : {}}
              transition={status === "auto" ? { repeat: Infinity, duration: 4, ease: "linear" } : {}}
              className="shrink-0"
            >
              <RefreshCw className="h-4 w-4" />
            </motion.div>
            <span className="truncate">Auto Mode</span>
          </Button>

          <Button
            variant="outline"
            className="w-full col-span-2 flex items-center justify-center gap-2 rounded-xl text-xs h-11 bg-muted/50 border-border/60 hover:bg-muted font-semibold mt-1 text-foreground shadow-sm"
          >
            <Calendar className="h-4 w-4 text-primary shrink-0" />
            <span>Schedule Timers</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
