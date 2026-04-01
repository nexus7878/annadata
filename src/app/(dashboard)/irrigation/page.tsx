"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/section-heading";
import { IrrigationPanel } from "@/components/dashboard/irrigation-panel";
import type { ZoneData } from "@/components/dashboard/irrigation-panel";
import {
  Droplets, CloudRain, Map as MapIcon, Wifi, Activity, Sprout,
  ArrowRight, Thermometer, Wind, Eye, Sun, Moon,
  TrendingDown, TrendingUp, AlertTriangle, CheckCircle2,
  BarChart3, Zap, Clock, Calendar, Power,
  ChevronRight, Play, Pause, ToggleLeft, ToggleRight,
  Gauge, Waves, CloudSun, History,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ============================================================
// Simulated Zone Data
// ============================================================
const INITIAL_ZONES: ZoneData[] = [
  {
    id: "zone-a",
    name: "Zone A",
    crop: "Wheat",
    moisture: 42,
    targetMoisture: 65,
    lastWatered: "2 hours ago",
    status: "idle",
    waterUsedToday: 1200,
    pumpFlowRate: 40,
    color: "bg-blue-500",
    schedule: { start: "06:00", duration: 30 },
  },
  {
    id: "zone-b",
    name: "Zone B",
    crop: "Corn",
    moisture: 71,
    targetMoisture: 70,
    lastWatered: "45 min ago",
    status: "idle",
    waterUsedToday: 850,
    pumpFlowRate: 35,
    color: "bg-cyan-400",
  },
  {
    id: "zone-c",
    name: "Zone C",
    crop: "Rice Paddy",
    moisture: 88,
    targetMoisture: 85,
    lastWatered: "20 min ago",
    status: "watering",
    waterUsedToday: 2400,
    pumpFlowRate: 50,
    color: "bg-emerald-400",
    schedule: { start: "05:30", duration: 45 },
  },
  {
    id: "zone-d",
    name: "Zone D",
    crop: "Vegetables",
    moisture: 35,
    targetMoisture: 60,
    lastWatered: "5 hours ago",
    status: "scheduled",
    waterUsedToday: 600,
    pumpFlowRate: 25,
    color: "bg-purple-400",
    schedule: { start: "17:00", duration: 20 },
  },
];

// ============================================================
// Weather Simulation
// ============================================================
interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  icon: typeof Sun;
  nextRain: string;
  forecast: { day: string; temp: number; rain: boolean }[];
}

const WEATHER: WeatherData = {
  temp: 32,
  humidity: 58,
  windSpeed: 12,
  condition: "Partly Cloudy",
  icon: CloudSun,
  nextRain: "In 3 Days",
  forecast: [
    { day: "Today", temp: 32, rain: false },
    { day: "Tue", temp: 34, rain: false },
    { day: "Wed", temp: 30, rain: false },
    { day: "Thu", temp: 28, rain: true },
    { day: "Fri", temp: 25, rain: true },
    { day: "Sat", temp: 27, rain: false },
    { day: "Sun", temp: 31, rain: false },
  ],
};

// ============================================================
// Water Usage History
// ============================================================
const USAGE_HISTORY = [
  { day: "Mon", liters: 3200 },
  { day: "Tue", liters: 4100 },
  { day: "Wed", liters: 2800 },
  { day: "Thu", liters: 3600 },
  { day: "Fri", liters: 2200 },
  { day: "Sat", liters: 4500 },
  { day: "Today", liters: 5050 },
];

// ============================================================
// Smart Recommendations
// ============================================================
interface Recommendation {
  id: string;
  type: "warning" | "success" | "info";
  title: string;
  message: string;
  action?: string;
  zoneId?: string;
}

function generateRecommendations(zones: ZoneData[]): Recommendation[] {
  const recs: Recommendation[] = [];

  zones.forEach((z) => {
    if (z.moisture < z.targetMoisture - 15) {
      recs.push({
        id: `low-${z.id}`,
        type: "warning",
        title: `${z.name} needs water`,
        message: `Moisture is ${z.moisture}%, below target of ${z.targetMoisture}%. ${z.crop} may stress without irrigation.`,
        action: "Start Watering",
        zoneId: z.id,
      });
    }
    if (z.moisture >= z.targetMoisture && z.status === "watering") {
      recs.push({
        id: `over-${z.id}`,
        type: "info",
        title: `${z.name} target reached`,
        message: `Moisture is at ${z.moisture}% (target: ${z.targetMoisture}%). Consider stopping to save water.`,
        action: "Stop Pump",
        zoneId: z.id,
      });
    }
  });

  const highMoistureZones = zones.filter((z) => z.moisture >= z.targetMoisture);
  if (highMoistureZones.length === zones.length) {
    recs.push({
      id: "all-good",
      type: "success",
      title: "All zones optimal",
      message: "Every zone has met its moisture target. No irrigation needed right now.",
    });
  }

  return recs;
}

// ============================================================
// Helper: Circular Gauge
// ============================================================
function CircularGauge({ value, max = 100, size = 80, strokeWidth = 6, color = "text-blue-500", label }: {
  value: number; max?: number; size?: number; strokeWidth?: number; color?: string; label?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.min(100, (value / max) * 100);
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke="hsl(var(--muted))" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke="currentColor" strokeWidth={strokeWidth}
          strokeLinecap="round" strokeDasharray={circumference}
          className={color}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-lg font-bold text-foreground">{value}%</span>
        {label && <span className="text-[8px] text-muted-foreground uppercase tracking-wider font-medium">{label}</span>}
      </div>
    </div>
  );
}

// ============================================================
// Zone Card Component
// ============================================================
function ZoneCard({ zone, onToggle }: { zone: ZoneData; onToggle: () => void }) {
  const isLow = zone.moisture < zone.targetMoisture - 10;
  const isWatering = zone.status === "watering";
  const isOptimal = zone.moisture >= zone.targetMoisture;
  const moistureColor = isLow ? "text-amber-500" : isOptimal ? "text-emerald-500" : "text-blue-500";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card/60 backdrop-blur-2xl border rounded-2xl p-5 relative overflow-hidden transition-all duration-300 ${
        isWatering ? "border-blue-500/40 shadow-md shadow-blue-500/5" : "border-border/50 shadow-sm"
      }`}
    >
      {/* Watering animation overlay */}
      {isWatering && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-blue-500/10 to-transparent"
          />
        </div>
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${
              isWatering
                ? "bg-blue-500/10 border-blue-500/30"
                : isLow
                  ? "bg-amber-500/10 border-amber-500/30"
                  : "bg-emerald-500/10 border-emerald-500/30"
            }`}>
              <Droplets className={`h-5 w-5 ${
                isWatering ? "text-blue-500" : isLow ? "text-amber-500" : "text-emerald-500"
              }`} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                {zone.name}
                <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                  isWatering
                    ? "bg-blue-500/10 text-blue-500"
                    : zone.status === "scheduled"
                      ? "bg-purple-500/10 text-purple-500"
                      : isLow
                        ? "bg-amber-500/10 text-amber-500"
                        : "bg-emerald-500/10 text-emerald-500"
                }`}>
                  {isWatering ? "Watering" : zone.status === "scheduled" ? "Scheduled" : isLow ? "Low" : "Optimal"}
                </span>
              </h3>
              <p className="text-[11px] text-muted-foreground">{zone.crop} • Last watered {zone.lastWatered}</p>
            </div>
          </div>

          {/* Toggle Button */}
          <button
            onClick={onToggle}
            className={`shrink-0 p-1 rounded-lg transition-all ${
              isWatering ? "text-blue-500 hover:bg-blue-500/10" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {isWatering
              ? <ToggleRight className="h-7 w-7" />
              : <ToggleLeft className="h-7 w-7" />
            }
          </button>
        </div>

        {/* Moisture & Stats */}
        <div className="flex items-center gap-5">
          <CircularGauge
            value={zone.moisture}
            color={moistureColor}
            label="Moisture"
            size={76}
            strokeWidth={5}
          />

          <div className="flex-1 space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Target</span>
              <span className="text-xs font-bold text-foreground">{zone.targetMoisture}%</span>
            </div>
            <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(zone.moisture / zone.targetMoisture) * 100}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className={`h-full rounded-full ${
                  isLow ? "bg-amber-500" : isOptimal ? "bg-emerald-500" : "bg-blue-500"
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <p className="text-[9px] text-muted-foreground uppercase font-medium">Used Today</p>
                <p className="text-xs font-bold">{zone.waterUsedToday.toLocaleString()} L</p>
              </div>
              <div>
                <p className="text-[9px] text-muted-foreground uppercase font-medium">Flow Rate</p>
                <p className="text-xs font-bold">{zone.pumpFlowRate} L/min</p>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Badge */}
        {zone.schedule && (
          <div className="mt-3 flex items-center gap-2 bg-purple-500/8 border border-purple-500/15 rounded-xl px-3 py-2">
            <Clock className="h-3.5 w-3.5 text-purple-500" />
            <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
              Scheduled: {zone.schedule.start} for {zone.schedule.duration}min
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================
// Main Page
// ============================================================
export default function IrrigationPage() {
  const [zones, setZones] = useState<ZoneData[]>(INITIAL_ZONES);
  const [systemMode, setSystemMode] = useState<"off" | "running" | "auto">("auto");
  const [selectedTab, setSelectedTab] = useState<"zones" | "analytics" | "weather">("zones");
  const [dismissedRecs, setDismissedRecs] = useState<Set<string>>(new Set());

  // Simulate live moisture updates
  useEffect(() => {
    const interval = setInterval(() => {
      setZones((prev) =>
        prev.map((z) => {
          let moisture = z.moisture;
          if (z.status === "watering") {
            moisture = Math.min(100, moisture + (Math.random() * 2));
          } else {
            // Slow evaporation
            moisture = Math.max(0, moisture - (Math.random() * 0.3));
          }
          // Auto-stop if target reached in auto mode
          let status = z.status;
          if (systemMode === "auto" && z.status === "watering" && moisture >= z.targetMoisture + 5) {
            status = "idle";
          }
          // Auto-start if too low in auto mode
          if (systemMode === "auto" && z.status === "idle" && moisture < z.targetMoisture - 15) {
            status = "watering";
          }

          return {
            ...z,
            moisture: Math.round(moisture * 10) / 10,
            status,
            waterUsedToday: z.status === "watering" ? z.waterUsedToday + z.pumpFlowRate : z.waterUsedToday,
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [systemMode]);

  const toggleZone = useCallback((zoneId: string) => {
    setZones((prev) =>
      prev.map((z) =>
        z.id === zoneId
          ? { ...z, status: z.status === "watering" ? "idle" : "watering", lastWatered: z.status === "watering" ? "Just now" : z.lastWatered }
          : z
      )
    );
  }, []);

  const handleModeChange = useCallback((mode: "off" | "running" | "auto") => {
    setSystemMode(mode);
    if (mode === "off") {
      setZones((prev) => prev.map((z) => ({ ...z, status: "idle" as const })));
    }
    if (mode === "running") {
      // Start all zones that need water
      setZones((prev) =>
        prev.map((z) => ({
          ...z,
          status: z.moisture < z.targetMoisture ? "watering" as const : z.status,
        }))
      );
    }
  }, []);

  const recommendations = generateRecommendations(zones).filter((r) => !dismissedRecs.has(r.id));
  const totalUsageToday = zones.reduce((a, z) => a + z.waterUsedToday, 0);
  const maxHistory = Math.max(...USAGE_HISTORY.map((h) => h.liters));
  const avgMoisture = Math.round(zones.reduce((a, z) => a + z.moisture, 0) / zones.length);

  const handleRecAction = useCallback((rec: Recommendation) => {
    if (rec.zoneId) {
      toggleZone(rec.zoneId);
    }
    setDismissedRecs((prev) => new Set(prev).add(rec.id));
  }, [toggleZone]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background blurs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="container px-4 md:px-6 py-8 md:py-12 mx-auto">
        <SectionHeading
          title="Smart Irrigation"
          subtitle="Automated water management powered by real-time soil sensors and AI-driven recommendations."
          alignment="left"
        />

        {/* Top Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Avg Moisture", value: `${avgMoisture}%`, icon: Droplets, color: "text-blue-500 bg-blue-500/10", trend: avgMoisture >= 60 ? "up" : "down" },
            { label: "Water Used Today", value: `${(totalUsageToday / 1000).toFixed(1)}k L`, icon: Waves, color: "text-cyan-500 bg-cyan-500/10" },
            { label: "Active Zones", value: `${zones.filter((z) => z.status === "watering").length}/${zones.length}`, icon: Zap, color: "text-emerald-500 bg-emerald-500/10" },
            { label: "Next Rain", value: WEATHER.nextRain, icon: CloudRain, color: "text-violet-500 bg-violet-500/10" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-4 flex items-center gap-3"
            >
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Recommendations */}
        <AnimatePresence>
          {recommendations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 space-y-2"
            >
              {recommendations.map((rec) => (
                <motion.div
                  key={rec.id}
                  layout
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12, height: 0 }}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border backdrop-blur-xl ${
                    rec.type === "warning"
                      ? "bg-amber-500/5 border-amber-500/20"
                      : rec.type === "success"
                        ? "bg-emerald-500/5 border-emerald-500/20"
                        : "bg-blue-500/5 border-blue-500/20"
                  }`}
                >
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                    rec.type === "warning" ? "bg-amber-500/15" : rec.type === "success" ? "bg-emerald-500/15" : "bg-blue-500/15"
                  }`}>
                    {rec.type === "warning" ? <AlertTriangle className="h-4 w-4 text-amber-500" /> :
                      rec.type === "success" ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> :
                        <Activity className="h-4 w-4 text-blue-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground">{rec.title}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{rec.message}</p>
                  </div>
                  {rec.action && (
                    <Button
                      size="sm"
                      className="shrink-0 h-8 text-[11px] font-bold rounded-lg bg-foreground text-background hover:bg-foreground/90"
                      onClick={() => handleRecAction(rec)}
                    >
                      {rec.action}
                    </Button>
                  )}
                  <button
                    onClick={() => setDismissedRecs((prev) => new Set(prev).add(rec.id))}
                    className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span className="sr-only">Dismiss</span>
                    ×
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-12 gap-5 items-start">

          {/* Left Column: Control Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-4 xl:col-span-3"
          >
            <div className="sticky top-20 space-y-5">
              <IrrigationPanel
                zones={zones}
                systemMode={systemMode}
                onModeChange={handleModeChange}
                onStartZone={(id) => toggleZone(id)}
                onStopZone={(id) => toggleZone(id)}
              />

              {/* Weather Card */}
              <div className="bg-card/60 backdrop-blur-2xl border border-border/50 rounded-2xl p-5 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                  <CloudSun className="h-4 w-4" /> Weather Impact
                </h3>

                <div className="flex items-center gap-4 mb-4">
                  <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/15 flex items-center justify-center">
                    <Sun className="h-7 w-7 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{WEATHER.temp}°C</p>
                    <p className="text-xs text-muted-foreground">{WEATHER.condition}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/30 rounded-xl p-2.5 text-center">
                    <Droplets className="h-3.5 w-3.5 text-blue-400 mx-auto mb-1" />
                    <p className="text-xs font-bold">{WEATHER.humidity}%</p>
                    <p className="text-[8px] text-muted-foreground uppercase">Humidity</p>
                  </div>
                  <div className="bg-muted/30 rounded-xl p-2.5 text-center">
                    <Wind className="h-3.5 w-3.5 text-slate-400 mx-auto mb-1" />
                    <p className="text-xs font-bold">{WEATHER.windSpeed} km/h</p>
                    <p className="text-[8px] text-muted-foreground uppercase">Wind</p>
                  </div>
                </div>

                {/* 7-day mini forecast */}
                <div className="mt-4 pt-3 border-t border-border/40">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2.5">7-Day Forecast</p>
                  <div className="flex gap-1.5">
                    {WEATHER.forecast.map((f, i) => (
                      <div key={i} className={`flex-1 text-center py-2 rounded-lg ${f.rain ? "bg-blue-500/10" : "bg-muted/20"}`}>
                        <p className="text-[8px] font-medium text-muted-foreground">{f.day}</p>
                        {f.rain
                          ? <CloudRain className="h-3.5 w-3.5 text-blue-400 mx-auto my-1" />
                          : <Sun className="h-3.5 w-3.5 text-amber-400 mx-auto my-1" />
                        }
                        <p className="text-[10px] font-bold">{f.temp}°</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Tabs Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-8 xl:col-span-9"
          >
            {/* Tab Navigation */}
            <div className="flex gap-1 bg-muted/30 rounded-2xl p-1.5 border border-border/40 mb-5">
              {([
                { key: "zones", label: "Farm Zones", icon: MapIcon },
                { key: "analytics", label: "Analytics", icon: BarChart3 },
                { key: "weather", label: "Weather & Tips", icon: CloudRain },
              ] as { key: typeof selectedTab; label: string; icon: typeof MapIcon }[]).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 ${
                    selectedTab === tab.key
                      ? "bg-card shadow-sm text-foreground border border-border/50"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Zones Tab */}
            <AnimatePresence mode="wait">
              {selectedTab === "zones" && (
                <motion.div
                  key="zones"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Farm Map Visualization */}
                  <div className="bg-card/40 backdrop-blur-2xl border border-border/50 rounded-2xl relative overflow-hidden min-h-[220px]">
                    <div className="absolute inset-0 bg-blue-500/[0.02]" />
                    <div
                      className="absolute inset-0 opacity-10 pointer-events-none"
                      style={{ backgroundImage: "radial-gradient(hsl(var(--primary)) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
                    />

                    {/* Zone Visualization */}
                    <div className="absolute inset-0 p-6 flex items-center justify-center">
                      <div className="relative w-full max-w-[400px] aspect-[2/1]">
                        {zones.map((zone, i) => {
                          const positions = [
                            "top-0 left-0 w-[48%] h-[48%] rounded-tl-3xl rounded-br-2xl",
                            "top-0 right-0 w-[48%] h-[48%] rounded-tr-3xl rounded-bl-2xl",
                            "bottom-0 left-0 w-[48%] h-[48%] rounded-bl-3xl rounded-tr-2xl",
                            "bottom-0 right-0 w-[48%] h-[48%] rounded-br-3xl rounded-tl-2xl",
                          ];
                          const colors = [
                            { bg: "bg-blue-500/10", border: "border-blue-500/30" },
                            { bg: "bg-cyan-500/10", border: "border-cyan-500/30" },
                            { bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
                            { bg: "bg-purple-500/10", border: "border-purple-500/30" },
                          ];
                          const nodePos = [
                            "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                            "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                            "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                            "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                          ];
                          const textColors = ["text-blue-400", "text-cyan-400", "text-emerald-400", "text-purple-400"];

                          return (
                            <motion.div
                              key={zone.id}
                              initial={{ opacity: 0, scale: 0.85 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
                              className={`absolute ${positions[i]} border ${colors[i].bg} ${colors[i].border} ${
                                zone.status === "watering" ? "animate-pulse" : ""
                              }`}
                            >
                              <motion.div
                                animate={{ y: [-3, 3, -3] }}
                                transition={{ repeat: Infinity, duration: 3 + i, ease: "easeInOut" }}
                                className={`absolute ${nodePos[i]} bg-background border border-border shadow-lg rounded-full px-2.5 py-1 text-[10px] font-bold ${textColors[i]} flex items-center gap-1 backdrop-blur-md whitespace-nowrap z-10`}
                              >
                                <Droplets className="h-3 w-3" />
                                {Math.round(zone.moisture)}%
                                {zone.status === "watering" && (
                                  <span className="relative flex h-1.5 w-1.5 ml-0.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500" />
                                  </span>
                                )}
                              </motion.div>
                              <span className="absolute bottom-2 left-3 text-[9px] font-bold text-muted-foreground/60">{zone.name}</span>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Map Header */}
                    <div className="relative z-10 p-5 flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-sm flex items-center gap-2">
                          <MapIcon className="h-4 w-4 text-blue-400" /> Live Farm Map
                        </h3>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Real-time zone moisture levels</p>
                      </div>
                      <div className="flex items-center gap-2 bg-background/50 backdrop-blur-xl border border-border/50 rounded-full px-3 py-1.5 shadow-sm text-[10px] font-bold text-emerald-400">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        {zones.length} Sensors Active
                      </div>
                    </div>
                  </div>

                  {/* Zone Cards Grid */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    {zones.map((zone, i) => (
                      <motion.div
                        key={zone.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.08 }}
                      >
                        <ZoneCard zone={zone} onToggle={() => toggleZone(zone.id)} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Analytics Tab */}
              {selectedTab === "analytics" && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  {/* Water Usage Chart */}
                  <div className="bg-card/40 backdrop-blur-2xl border border-border/50 rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-sm flex items-center gap-2">
                        <History className="h-4 w-4 text-blue-400" /> Weekly Water Usage
                      </h3>
                      <span className="text-xs text-muted-foreground font-medium">
                        Total: {(USAGE_HISTORY.reduce((a, h) => a + h.liters, 0) / 1000).toFixed(1)}k L
                      </span>
                    </div>

                    {/* Bar Chart */}
                    <div className="flex items-end gap-2 h-44">
                      {USAGE_HISTORY.map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${(h.liters / maxHistory) * 100}%` }}
                            transition={{ duration: 0.8, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                            className={`w-full rounded-xl relative overflow-hidden ${
                              h.day === "Today" ? "bg-blue-500" : "bg-blue-500/30"
                            }`}
                          >
                            {h.day === "Today" && (
                              <div className="absolute inset-0 bg-gradient-to-t from-blue-600 to-blue-400" />
                            )}
                          </motion.div>
                          <p className={`text-[10px] font-medium ${h.day === "Today" ? "text-blue-500 font-bold" : "text-muted-foreground"}`}>
                            {h.day}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Zone-wise Water Usage */}
                  <div className="bg-card/40 backdrop-blur-2xl border border-border/50 rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold text-sm mb-5 flex items-center gap-2">
                      <Activity className="h-4 w-4 text-cyan-400" /> Zone Water Consumption
                    </h3>
                    <div className="space-y-4">
                      {zones.map((zone, i) => {
                        const maxUsage = Math.max(...zones.map((z) => z.waterUsedToday));
                        const percent = (zone.waterUsedToday / maxUsage) * 100;
                        return (
                          <motion.div
                            key={zone.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + i * 0.08 }}
                          >
                            <div className="flex justify-between text-xs mb-2">
                              <span className="font-semibold text-foreground flex items-center gap-2">
                                <div className={`h-2.5 w-2.5 rounded-full ${zone.color}`} />
                                {zone.name} ({zone.crop})
                              </span>
                              <span className="font-bold text-muted-foreground">{zone.waterUsedToday.toLocaleString()} L</span>
                            </div>
                            <div className="h-2.5 w-full bg-muted/50 rounded-full overflow-hidden border border-border/30">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percent}%` }}
                                transition={{ delay: 0.3 + i * 0.1, duration: 1, ease: "easeOut" }}
                                className={`h-full ${zone.color} rounded-full relative`}
                              >
                                <div className="absolute inset-0 bg-white/20 w-full" style={{ maskImage: "linear-gradient(to right, transparent, black)" }} />
                              </motion.div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Savings Summary */}
                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      { label: "Water Saved This Week", value: "12,400 L", change: "+18%", icon: TrendingDown, color: "text-blue-500 bg-blue-500/10" },
                      { label: "Pump Efficiency", value: "94%", change: "+3%", icon: Gauge, color: "text-emerald-500 bg-emerald-500/10" },
                      { label: "Cost Savings", value: "₹1,850", change: "+22%", icon: TrendingUp, color: "text-amber-500 bg-amber-500/10" },
                    ].map((s, i) => (
                      <motion.div
                        key={s.label}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.1 }}
                        className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-5 shadow-sm"
                      >
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                          <s.icon className="h-5 w-5" />
                        </div>
                        <p className="text-xl font-bold text-foreground">{s.value}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</span>
                        </div>
                        <span className="text-[11px] text-emerald-500 font-bold mt-1 block">{s.change} vs last week</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Weather & Tips Tab */}
              {selectedTab === "weather" && (
                <motion.div
                  key="weather"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  {/* Detailed Weather */}
                  <div className="bg-card/40 backdrop-blur-2xl border border-border/50 rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold text-sm mb-5 flex items-center gap-2">
                      <CloudSun className="h-4 w-4 text-amber-400" /> Current Weather Conditions
                    </h3>

                    <div className="flex items-center gap-8 mb-6">
                      <div className="flex items-center gap-4">
                        <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/15 flex items-center justify-center">
                          <Sun className="h-10 w-10 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-4xl font-bold text-foreground">{WEATHER.temp}°C</p>
                          <p className="text-sm text-muted-foreground">{WEATHER.condition}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { label: "Humidity", value: `${WEATHER.humidity}%`, icon: Droplets, color: "text-blue-400" },
                        { label: "Wind Speed", value: `${WEATHER.windSpeed} km/h`, icon: Wind, color: "text-slate-400" },
                        { label: "UV Index", value: "7 (High)", icon: Sun, color: "text-amber-400" },
                        { label: "Visibility", value: "10 km", icon: Eye, color: "text-purple-400" },
                      ].map((item) => (
                        <div key={item.label} className="bg-muted/30 rounded-xl p-4 text-center border border-border/30">
                          <item.icon className={`h-5 w-5 ${item.color} mx-auto mb-2`} />
                          <p className="text-sm font-bold text-foreground">{item.value}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mt-0.5">{item.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 7-Day Forecast Full */}
                  <div className="bg-card/40 backdrop-blur-2xl border border-border/50 rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold text-sm mb-5 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-400" /> 7-Day Forecast
                    </h3>
                    <div className="space-y-2">
                      {WEATHER.forecast.map((f, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 + i * 0.06 }}
                          className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                            f.day === "Today" ? "bg-blue-500/5 border border-blue-500/20" : "hover:bg-muted/20"
                          }`}
                        >
                          <span className={`text-xs font-bold w-12 ${f.day === "Today" ? "text-blue-500" : "text-foreground"}`}>{f.day}</span>
                          {f.rain
                            ? <CloudRain className="h-5 w-5 text-blue-400" />
                            : <Sun className="h-5 w-5 text-amber-400" />
                          }
                          <span className="text-sm font-bold text-foreground flex-1">{f.temp}°C</span>
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                            f.rain ? "bg-blue-500/10 text-blue-500" : "bg-amber-500/10 text-amber-500"
                          }`}>
                            {f.rain ? "Rain Expected" : "Clear"}
                          </span>
                          {f.rain && (
                            <span className="text-[10px] text-blue-400 font-semibold">Skip irrigation</span>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Smart Tips */}
                  <div className="bg-card/40 backdrop-blur-2xl border border-border/50 rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold text-sm mb-5 flex items-center gap-2">
                      <Sprout className="h-4 w-4 text-emerald-400" /> AI Irrigation Tips
                    </h3>
                    <div className="space-y-3">
                      {[
                        { tip: "Water early morning (5–7 AM) to reduce evaporation by up to 30%.", icon: "🌅" },
                        { tip: "Rice paddy (Zone C) needs consistently high moisture. Consider increasing target to 90%.", icon: "🌾" },
                        { tip: "Rain predicted Thursday — skip Zone A and B watering on Wednesday evening.", icon: "🌧️" },
                        { tip: "Vegetables (Zone D) benefit from drip irrigation. Reduce flow rate to 15 L/min for better root absorption.", icon: "🥕" },
                        { tip: "Weekly deep watering is more effective than daily shallow watering for wheat.", icon: "🌿" },
                      ].map((t, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + i * 0.08 }}
                          className="flex items-start gap-3 p-3 rounded-xl bg-muted/20 border border-border/30 hover:bg-muted/30 transition-colors"
                        >
                          <span className="text-lg shrink-0">{t.icon}</span>
                          <p className="text-xs text-foreground/80 leading-relaxed font-medium">{t.tip}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
