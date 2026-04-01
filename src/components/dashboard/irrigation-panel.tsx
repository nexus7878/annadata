"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Droplets, Power, Play, Calendar, RefreshCw, Activity,
  Clock, Zap, AlertTriangle, CheckCircle2, X,
  ChevronDown, Pause, Timer,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ============================================================
// Types
// ============================================================
export interface ZoneData {
  id: string;
  name: string;
  crop: string;
  moisture: number;        // 0-100
  targetMoisture: number;  // 0-100
  lastWatered: string;
  status: "idle" | "watering" | "scheduled";
  waterUsedToday: number;  // liters
  pumpFlowRate: number;    // liters/min
  color: string;
  schedule?: { start: string; duration: number }; // duration in minutes
}

interface IrrigationPanelProps {
  zones: ZoneData[];
  onZoneUpdate?: (zones: ZoneData[]) => void;
  onStartZone?: (zoneId: string) => void;
  onStopZone?: (zoneId: string) => void;
  systemMode: "off" | "running" | "auto";
  onModeChange: (mode: "off" | "running" | "auto") => void;
}

// ============================================================
// Component
// ============================================================
export function IrrigationPanel({
  zones,
  onStartZone,
  onStopZone,
  systemMode,
  onModeChange,
}: IrrigationPanelProps) {
  const [showScheduler, setShowScheduler] = useState(false);
  const [selectedScheduleZone, setSelectedScheduleZone] = useState<string | null>(null);
  const [scheduleTime, setScheduleTime] = useState("06:00");
  const [scheduleDuration, setScheduleDuration] = useState("30");
  const [scheduleSaved, setScheduleSaved] = useState(false);

  const activeZones = zones.filter((z) => z.status === "watering").length;
  const totalUsageToday = zones.reduce((a, z) => a + z.waterUsedToday, 0);
  const avgMoisture = Math.round(zones.reduce((a, z) => a + z.moisture, 0) / (zones.length || 1));

  const handleSaveSchedule = useCallback(() => {
    setScheduleSaved(true);
    setTimeout(() => {
      setScheduleSaved(false);
      setShowScheduler(false);
      setSelectedScheduleZone(null);
    }, 1500);
  }, []);

  return (
    <div className="bg-card/60 backdrop-blur-2xl rounded-2xl p-5 sm:p-6 flex flex-col h-full border border-border/50 relative overflow-hidden shadow-sm">
      {/* Background Glow */}
      <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[80px] opacity-10 dark:opacity-20 transition-colors duration-700 pointer-events-none ${
        systemMode === "running" ? "bg-blue-500" :
        systemMode === "auto" ? "bg-emerald-500" : "bg-red-500"
      }`} />

      <div className="mb-5 relative z-10">
        <h2 className="text-base font-bold flex items-center gap-2 mb-1 text-foreground">
          <div className="p-1.5 bg-blue-500/10 rounded-lg">
            <Droplets className="h-4 w-4 text-blue-500 dark:text-blue-400" />
          </div>
          Irrigation Control
        </h2>
        <p className="text-[11px] text-muted-foreground">Manage water pumps across all farm zones</p>
      </div>

      <div className="flex-1 flex flex-col gap-4 relative z-10">
        {/* Status Indicator */}
        <div className="bg-muted/40 rounded-2xl p-4 border border-border/50 shadow-inner">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1.5">System Status</p>
              <div className="flex items-center gap-2.5">
                <div className="relative flex h-2.5 w-2.5">
                  {(systemMode === "running" || systemMode === "auto") && (
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      systemMode === "running" ? "bg-blue-400" : "bg-emerald-400"
                    }`} />
                  )}
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    systemMode === "running" ? "bg-blue-500" :
                    systemMode === "auto" ? "bg-emerald-500" : "bg-red-500"
                  }`} />
                </div>
                <span className={`font-bold text-base capitalize ${
                  systemMode === "running" ? "text-blue-600 dark:text-blue-400" :
                  systemMode === "auto" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                }`}>
                  {systemMode === "off" ? "Off" : systemMode === "running" ? "Manual" : "Auto"} Mode
                </span>
              </div>
            </div>

            {systemMode === "running" ? (
              <div className="h-11 w-11 rounded-full border border-blue-500/30 flex items-center justify-center bg-blue-500/10 relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 opacity-60"
                />
                <Droplets className="h-4 w-4 text-blue-600 dark:text-blue-400 absolute" />
              </div>
            ) : systemMode === "auto" ? (
              <div className="h-11 w-11 rounded-full border border-emerald-500/30 flex items-center justify-center bg-emerald-500/10">
                <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            ) : (
              <div className="h-11 w-11 rounded-full border border-red-500/30 flex items-center justify-center bg-red-500/10">
                <Power className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-muted/30 rounded-xl p-3 text-center border border-border/30">
            <p className="text-lg font-bold text-foreground">{activeZones}</p>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium">Active</p>
          </div>
          <div className="bg-muted/30 rounded-xl p-3 text-center border border-border/30">
            <p className="text-lg font-bold text-foreground">{avgMoisture}%</p>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium">Avg Moist</p>
          </div>
          <div className="bg-muted/30 rounded-xl p-3 text-center border border-border/30">
            <p className="text-lg font-bold text-foreground">{(totalUsageToday / 1000).toFixed(1)}k</p>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium">L Today</p>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <Button
            className={`w-full flex items-center justify-center gap-1.5 h-10 px-0 rounded-xl text-xs font-bold transition-all ${
              systemMode === "running"
                ? "bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-500 border border-red-500/30"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
            }`}
            onClick={() => onModeChange(systemMode === "running" ? "off" : "running")}
          >
            {systemMode === "running" ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 shrink-0" />}
            <span className="truncate">{systemMode === "running" ? "Stop All" : "Manual"}</span>
          </Button>

          <Button
            variant="outline"
            className={`w-full flex items-center justify-center gap-1.5 h-10 px-0 rounded-xl text-xs font-bold transition-all ${
              systemMode === "auto"
                ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-500 border-emerald-500/40"
                : "bg-muted/50 border-border/60 hover:bg-muted text-muted-foreground shadow-sm"
            }`}
            onClick={() => onModeChange(systemMode === "auto" ? "off" : "auto")}
          >
            <motion.div
              animate={systemMode === "auto" ? { rotate: 360 } : {}}
              transition={systemMode === "auto" ? { repeat: Infinity, duration: 4, ease: "linear" } : {}}
              className="shrink-0"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </motion.div>
            <span className="truncate">Auto</span>
          </Button>

          <Button
            variant="outline"
            className="w-full col-span-2 flex items-center justify-center gap-2 rounded-xl text-xs h-10 bg-muted/50 border-border/60 hover:bg-muted font-semibold mt-1 text-foreground shadow-sm"
            onClick={() => setShowScheduler(true)}
          >
            <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>Schedule Timers</span>
          </Button>
        </div>
      </div>

      {/* Schedule Modal */}
      <AnimatePresence>
        {showScheduler && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowScheduler(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="bg-card border border-border/60 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {scheduleSaved ? (
                <div className="flex flex-col items-center justify-center py-14 px-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="h-16 w-16 rounded-full bg-emerald-500/15 flex items-center justify-center mb-5"
                  >
                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                  </motion.div>
                  <h3 className="text-lg font-bold">Schedule Saved!</h3>
                  <p className="text-sm text-muted-foreground mt-1">Irrigation will run automatically.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between p-5 border-b border-border/40">
                    <div>
                      <h3 className="text-lg font-bold">Schedule Irrigation</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Set automatic watering times</p>
                    </div>
                    <button onClick={() => setShowScheduler(false)}
                      className="h-8 w-8 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center">
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>

                  <div className="p-5 space-y-5">
                    {/* Zone Select */}
                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-2 block">Select Zone</label>
                      <div className="grid grid-cols-2 gap-2">
                        {zones.map((z) => (
                          <button
                            key={z.id}
                            onClick={() => setSelectedScheduleZone(z.id)}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              selectedScheduleZone === z.id
                                ? "border-blue-500 bg-blue-500/5 shadow-sm"
                                : "border-border/40 hover:border-border/80 hover:bg-muted/20"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`h-3 w-3 rounded-full ${z.color}`} />
                              <p className="text-xs font-bold">{z.name}</p>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{z.crop}</p>
                          </button>
                        ))}
                        <button
                          onClick={() => setSelectedScheduleZone("all")}
                          className={`p-3 rounded-xl border text-left transition-all col-span-2 ${
                            selectedScheduleZone === "all"
                              ? "border-blue-500 bg-blue-500/5 shadow-sm"
                              : "border-border/40 hover:border-border/80 hover:bg-muted/20"
                          }`}
                        >
                          <p className="text-xs font-bold">🌾 All Zones</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">Water entire farm</p>
                        </button>
                      </div>
                    </div>

                    {/* Time */}
                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-2 block">Start Time</label>
                      <input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="w-full h-11 rounded-xl bg-muted/30 border border-border/50 px-4 text-sm font-semibold text-foreground"
                      />
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-2 block">Duration (minutes)</label>
                      <div className="grid grid-cols-4 gap-2">
                        {["15", "30", "45", "60"].map((d) => (
                          <button
                            key={d}
                            onClick={() => setScheduleDuration(d)}
                            className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${
                              scheduleDuration === d
                                ? "border-blue-500 bg-blue-500/10 text-blue-500"
                                : "border-border/40 text-muted-foreground hover:border-border/80"
                            }`}
                          >
                            {d}m
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 font-semibold"
                      disabled={!selectedScheduleZone}
                      onClick={handleSaveSchedule}
                    >
                      <Timer className="h-4 w-4 mr-1.5" /> Save Schedule
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
