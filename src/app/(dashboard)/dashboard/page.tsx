"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Droplets,
  ThermometerSun,
  Activity,
  Wind,
  ArrowUpRight,
  ArrowDownRight,
  CloudSun,
  Leaf,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  BarChart3,
  Zap,
  X,
  Loader2,
  Wifi,
  WifiOff,
  Battery,
  Sun,
  CloudRain,
  Cloud,
  Download,
  RefreshCw,
  Radio,
  Clock,
  TrendingUp,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  BarChart,
  Bar,
  Line,
  ComposedChart,
} from "recharts";

/* ──────────────────────── animation presets ──────────────────────── */
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ──────────────────────── mini sparkline ──────────────────────── */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 28;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={w} height={h} className="opacity-60 group-hover:opacity-100 transition-opacity">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

/* ──────────────────────── weather icons ──────────────────────── */
function WeatherIcon({ icon, className }: { icon: string; className?: string }) {
  switch (icon) {
    case "sunny":
      return <Sun className={className} />;
    case "rainy":
      return <CloudRain className={className} />;
    case "partly_cloudy":
      return <Cloud className={className} />;
    default:
      return <CloudSun className={className} />;
  }
}

/* ──────────────────────── types ──────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TelemetryData = any;

/* ═══════════════════════ MAIN COMPONENT ═══════════════════════ */
export default function DashboardOverview() {
  const [telemetry, setTelemetry] = useState<TelemetryData>(null);
  const [prevTelemetry, setPrevTelemetry] = useState<TelemetryData>(null);
  const [notices, setNotices] = useState<TelemetryData[]>([]);
  const [activities, setActivities] = useState<TelemetryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLive, setIsLive] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const noticesInitialized = useRef(false);

  const fetchTelemetry = useCallback(async () => {
    try {
      const res = await fetch("/api/telemetry");
      const data = await res.json();

      setPrevTelemetry(telemetry);
      setTelemetry(data);
      setLastUpdated(new Date());

      if (!noticesInitialized.current) {
        setNotices(data.systemNotices || []);
        noticesInitialized.current = true;
      }

      const iconMap: Record<string, typeof Droplets> = {
        water: Droplets,
        nutrient: Zap,
        calendar: Calendar,
        market: BarChart3,
      };
      const colorMap: Record<string, string> = {
        water: "text-blue-500",
        nutrient: "text-amber-500",
        calendar: "text-violet-500",
        market: "text-emerald-500",
      };
      const bgMap: Record<string, string> = {
        water: "bg-blue-500/10",
        nutrient: "bg-amber-500/10",
        calendar: "bg-violet-500/10",
        market: "bg-emerald-500/10",
      };
      const mapped = (data.recentActivities || []).map((a: TelemetryData) => ({
        ...a,
        icon: iconMap[a.type] || Activity,
        color: colorMap[a.type] || "text-muted-foreground",
        bg: bgMap[a.type] || "bg-muted",
      }));
      setActivities(mapped);
    } catch {
      console.error("Telemetry fetch failed");
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchTelemetry();
    const id = setInterval(() => {
      if (isLive) fetchTelemetry();
    }, 8000);
    return () => clearInterval(id);
  }, [fetchTelemetry, isLive]);

  /* helpers */
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };
  const dismissNotice = (id: string) => {
    setNotices((p) => p.filter((n) => n.id !== id));
    showToast("Notice dismissed.");
  };

  const handleDownloadCSV = () => {
    if (!telemetry) return;
    showToast("Generating telemetry report…");
    const rows = [
      "Timestamp,Temperature_C,Soil_Moisture_pct,Humidity_pct,Wind_Speed_kmh,EC_mScm,N_mgkg,P_mgkg,K_mgkg",
      `${telemetry.timestamp},${telemetry.kpis.temperature},${telemetry.kpis.soilMoisture},${telemetry.kpis.humidity},${telemetry.kpis.windSpeed},${telemetry.soilChemistry.EC},${telemetry.soilChemistry.Nitrogen},${telemetry.soilChemistry.Phosphorus},${telemetry.soilChemistry.Potassium}`,
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `annadata_telemetry_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ──────────────── loading state ──────────────── */
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-primary">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wide animate-pulse">
          Establishing IoT Connection…
        </p>
      </div>
    );
  }

  /* ──────────────── derive kpi cards ──────────────── */
  const kpis = [
    {
      icon: Droplets,
      label: "Soil Moisture",
      value: `${telemetry?.kpis.soilMoisture ?? 42}%`,
      delta: telemetry?.trends.moistureDelta ?? 0,
      color: "blue",
      sparkline: telemetry?.sparklines?.moisture,
    },
    {
      icon: ThermometerSun,
      label: "Temperature",
      value: `${telemetry?.kpis.temperature ?? 28}°C`,
      delta: telemetry?.trends.tempDelta ?? 0,
      color: "orange",
      sparkline: telemetry?.sparklines?.temperature,
    },
    {
      icon: CloudSun,
      label: "Humidity",
      value: `${telemetry?.kpis.humidity ?? 65}%`,
      delta: telemetry?.trends.humidityDelta ?? 0,
      color: "emerald",
      sparkline: telemetry?.sparklines?.humidity,
    },
    {
      icon: Wind,
      label: "Wind Speed",
      value: `${telemetry?.kpis.windSpeed ?? 12} km/h`,
      delta: telemetry?.trends.windDelta ?? 0,
      color: "violet",
      sparkline: null,
    },
  ];

  const colorClasses: Record<string, { text: string; bg: string; border: string; stroke: string }> = {
    blue: { text: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", stroke: "#3b82f6" },
    orange: { text: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20", stroke: "#f97316" },
    emerald: { text: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", stroke: "#10b981" },
    violet: { text: "text-violet-500", bg: "bg-violet-500/10", border: "border-violet-500/20", stroke: "#8b5cf6" },
  };

  const npkData = [
    { label: "Nitrogen (N)", value: parseInt(telemetry?.soilChemistry.Nitrogen || "45"), target: 50, unit: "mg/kg", color: "bg-emerald-500", shadow: "shadow-emerald-500/40" },
    { label: "Phosphorus (P)", value: parseInt(telemetry?.soilChemistry.Phosphorus || "22"), target: 30, unit: "mg/kg", color: "bg-orange-500", shadow: "shadow-orange-500/40" },
    { label: "Potassium (K)", value: parseInt(telemetry?.soilChemistry.Potassium || "180"), target: 200, unit: "mg/kg", color: "bg-blue-500", shadow: "shadow-blue-500/40" },
  ];

  const onlineCount = telemetry?.nodeStats?.online ?? 0;
  const totalNodes = telemetry?.nodeStats?.total ?? 12;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 max-w-[1440px] mx-auto pb-20 relative">
      {/* ─── Toast ─── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 right-8 z-50 bg-card/95 backdrop-blur-2xl border border-border rounded-2xl shadow-2xl p-4 flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-bold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Header ─── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight">
            Farm Command Center
          </h1>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <p className="text-sm text-muted-foreground">
              {totalNodes} IoT nodes deployed across {Math.ceil(totalNodes / 3)} zones
            </p>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isLive ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"}`} />
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                {isLive ? "Live" : "Paused"}
              </span>
            </div>
            {lastUpdated && (
              <span className="text-[11px] text-muted-foreground/60 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => {
              setIsLive((v) => !v);
              showToast(isLive ? "Live feed paused" : "Live feed resumed");
            }}
            className={`px-3.5 py-2 rounded-xl text-[12px] font-bold border transition-all duration-300 flex items-center gap-1.5 ${
              isLive
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                : "bg-muted/50 text-muted-foreground border-border/60 hover:bg-muted"
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            {isLive ? "Live" : "Paused"}
          </button>
          <button
            onClick={() => {
              fetchTelemetry();
              showToast("Data refreshed");
            }}
            className="px-3.5 py-2 bg-muted/50 hover:bg-muted border border-border/60 rounded-xl text-[12px] font-bold text-foreground transition-all flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <button
            onClick={handleDownloadCSV}
            className="px-3.5 py-2 bg-primary/10 hover:bg-primary/15 border border-primary/25 rounded-xl text-[12px] font-bold text-primary transition-all flex items-center gap-1.5 shadow-sm shadow-primary/5 hover:shadow-md hover:shadow-primary/10 active:scale-95"
          >
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </motion.div>

      {/* ─── KPI Cards ─── */}
      <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          const c = colorClasses[kpi.color];
          const up = kpi.delta >= 0;
          return (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -3 }}
              className="bg-card/70 backdrop-blur-xl border border-border/40 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-border/80 transition-all duration-300 shadow-sm hover:shadow-lg cursor-default"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl ${c.bg} border ${c.border}`}>
                  <Icon className={`w-4 h-4 ${c.text}`} />
                </div>
                {kpi.sparkline && <Sparkline data={kpi.sparkline} color={c.stroke} />}
              </div>
              <p className="text-2xl sm:text-[28px] font-bold font-heading tracking-tight leading-none">
                {kpi.value}
              </p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                  {kpi.label}
                </p>
                <span
                  className={`text-[10px] font-bold flex items-center gap-0.5 px-1.5 py-0.5 rounded-md ${
                    up
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                  }`}
                >
                  {up ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                  {up ? "+" : ""}
                  {kpi.delta}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ─── Row 2: Sensor Network ── Weather ── Node Status ─── */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Sensor Network Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="md:col-span-3 bg-card/70 backdrop-blur-xl border border-border/40 rounded-2xl p-5 sm:p-6"
        >
          <div className="flex justify-between items-start mb-5">
            <div>
              <h2 className="font-bold text-sm font-heading flex items-center gap-2">
                <Wifi className="w-4 h-4 text-primary" />
                Sensor Network
              </h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {onlineCount}/{totalNodes} nodes online · Avg battery {telemetry?.nodeStats?.avgBattery ?? 0}%
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                {onlineCount} Active
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {(telemetry?.sensorNodes || []).map((node: TelemetryData) => (
              <div
                key={node.id}
                className={`p-3 rounded-xl border transition-all duration-200 ${
                  node.status === "online"
                    ? "bg-card/50 border-border/30 hover:border-border/60"
                    : "bg-destructive/5 border-destructive/15 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground truncate pr-1">
                    {node.name}
                  </span>
                  {node.status === "online" ? (
                    <Wifi className="w-3 h-3 text-emerald-500 shrink-0" />
                  ) : (
                    <WifiOff className="w-3 h-3 text-destructive shrink-0" />
                  )}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold font-mono">{node.temp}°</span>
                  <span className="text-[10px] text-muted-foreground">{node.moisture}%</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Battery className="w-3 h-3 text-muted-foreground" />
                  <span className={`text-[10px] font-semibold ${node.battery > 30 ? "text-muted-foreground" : "text-orange-500"}`}>
                    {node.battery}%
                  </span>
                  <div className="flex-1" />
                  <span className="text-[9px] text-muted-foreground/50">{node.signal}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weather + Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="md:col-span-2 space-y-4"
        >
          {/* Weather Forecast */}
          <div className="bg-card/70 backdrop-blur-xl border border-border/40 rounded-2xl p-5">
            <h2 className="font-bold text-sm font-heading flex items-center gap-2 mb-4">
              <CloudSun className="w-4 h-4 text-primary" />
              5-Day Forecast
            </h2>
            <div className="space-y-2.5">
              {(telemetry?.weatherForecast || []).map((day: TelemetryData, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-1.5 border-b border-border/20 last:border-0"
                >
                  <span className="text-xs font-semibold w-16">{day.day}</span>
                  <WeatherIcon icon={day.icon} className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-mono font-bold">
                    {day.high}°
                    <span className="text-muted-foreground font-normal">/{day.low}°</span>
                  </span>
                  <div className="flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-blue-400" />
                    <span className="text-[10px] text-muted-foreground">{day.precip}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-card/70 backdrop-blur-xl border border-border/40 rounded-2xl p-5">
            <h2 className="font-bold text-sm font-heading flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-primary" />
              Quick Stats
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-primary/5 rounded-xl border border-primary/10">
                <p className="text-xl font-bold font-heading text-primary">{onlineCount}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Active Nodes</p>
              </div>
              <div className="text-center p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                <p className="text-xl font-bold font-heading text-emerald-600 dark:text-emerald-400">
                  {telemetry?.nodeStats?.avgBattery ?? 0}%
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Avg Battery</p>
              </div>
              <div className="text-center p-3 bg-blue-500/5 rounded-xl border border-blue-500/10">
                <p className="text-xl font-bold font-heading text-blue-600 dark:text-blue-400">
                  {telemetry?.kpis.soilMoisture ?? 0}%
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Avg Moisture</p>
              </div>
              <div className="text-center p-3 bg-orange-500/5 rounded-xl border border-orange-500/10">
                <p className="text-xl font-bold font-heading text-orange-600 dark:text-orange-400">
                  {telemetry?.soilChemistry?.EC ?? 0}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">EC (mS/cm)</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ─── Row 3: Soil Chemistry ── Crop Health Chart ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Soil Chemistry */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-2 bg-card/70 backdrop-blur-xl border border-border/40 rounded-2xl p-5 sm:p-6"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="font-bold text-sm font-heading flex items-center gap-2">
                <Leaf className="w-4 h-4 text-primary" />
                Soil Chemistry
              </h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">NPK macronutrients & EC</p>
            </div>
          </div>

          {/* NPK Bars */}
          <div className="space-y-5 mb-6">
            {npkData.map((nutrient, i) => {
              const pct = (nutrient.value / nutrient.target) * 100;
              return (
                <div key={i}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs font-semibold text-foreground/80">{nutrient.label}</span>
                    <span className="text-[11px] font-mono">
                      <span className="font-bold">{nutrient.value}</span>
                      <span className="text-muted-foreground"> / {nutrient.target} {nutrient.unit}</span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden border border-border/20">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, pct)}%` }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 1, ease: "easeOut" }}
                      className={`h-full ${nutrient.color} relative rounded-full`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/25 rounded-full" />
                    </motion.div>
                  </div>
                  {pct < 80 && (
                    <p className="text-[10px] text-orange-600 dark:text-orange-400 mt-1 font-medium flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Below optimal
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* EC Gauge */}
          <div className="flex items-center justify-center p-4 bg-muted/15 border border-border/20 rounded-xl">
            <div className="relative w-28 h-28 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="10" className="text-muted/20" />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="url(#ecGrad)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 42}
                  initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                  animate={{
                    strokeDashoffset:
                      2 * Math.PI * 42 * (1 - parseFloat(telemetry?.soilChemistry.EC || "1.2") / 3.0),
                  }}
                  transition={{ delay: 0.5, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                />
                <defs>
                  <linearGradient id="ecGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold font-mono">{telemetry?.soilChemistry.EC ?? "1.20"}</span>
                <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mt-0.5">mS/cm</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-bold">EC Level</p>
              <p className="text-[10px] text-muted-foreground">Salt concentration</p>
              <div className="mt-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1 w-fit">
                <CheckCircle2 className="w-3 h-3" /> Healthy
              </div>
            </div>
          </div>
        </motion.div>

        {/* Crop Health Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-3 bg-card/70 backdrop-blur-xl border border-border/40 rounded-2xl p-5 sm:p-6"
        >
          <div className="flex justify-between items-start mb-5">
            <div>
              <h2 className="font-bold text-sm font-heading flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Crop Health Index
              </h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">NDVI & Stress levels — 7 day trend</p>
            </div>
            <div className="flex items-center gap-4 text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/80" />
                <span className="text-muted-foreground font-semibold">NDVI</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-400/80" />
                <span className="text-muted-foreground font-semibold">Stress</span>
              </div>
            </div>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={telemetry?.cropHealth || []} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.4} />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  domain={[0, 1]}
                  tickFormatter={(v) => v.toFixed(1)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "12px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    fontSize: "12px",
                  }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any, name: any) => [
                    parseFloat(value).toFixed(2),
                    name === "ndvi" ? "NDVI" : "Stress",
                  ]}
                />
                <Bar dataKey="ndvi" fill="#10b981" opacity={0.6} radius={[4, 4, 0, 0]} barSize={20} />
                <Line
                  type="monotone"
                  dataKey="stress"
                  stroke="#fb7185"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#fb7185", stroke: "hsl(var(--background))", strokeWidth: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* ─── Row 4: Activity Feed ── System Notices ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="lg:col-span-2 bg-card/70 backdrop-blur-xl border border-border/40 rounded-2xl p-5 sm:p-6"
        >
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-5 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Live Activity Feed
          </h2>
          <div className="space-y-3">
            {activities.map((act, i) => {
              const Icon = act.icon;
              return (
                <motion.div
                  key={act.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.06 }}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors group cursor-default"
                >
                  <div className={`p-2 rounded-lg ${act.bg} shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-3.5 h-3.5 ${act.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium leading-snug truncate">{act.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{act.time}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* System Notices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card/70 backdrop-blur-xl border border-border/40 rounded-2xl p-5 sm:p-6 flex flex-col"
        >
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-5 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            System Notices
          </h2>
          <div className="space-y-3 flex-1">
            <AnimatePresence>
              {notices.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full text-muted-foreground py-8"
                >
                  <CheckCircle2 className="w-8 h-8 mb-2 opacity-20" />
                  <p className="text-sm font-medium opacity-50">All systems normal</p>
                </motion.div>
              ) : (
                notices.map((notice) => (
                  <motion.div
                    key={notice.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, scale: 0.95 }}
                    className={`p-3.5 rounded-xl flex gap-3 relative group transition-all ${
                      notice.type === "warning"
                        ? "bg-orange-500/5 border border-orange-500/15 hover:bg-orange-500/10"
                        : "bg-muted/20 border border-border/30 hover:bg-muted/40"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {notice.type === "warning" ? (
                        <ThermometerSun className="w-4 h-4 text-orange-500" />
                      ) : (
                        <Activity className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <div className="pr-5 min-w-0">
                      <p className="text-[13px] font-bold leading-tight">{notice.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                        {notice.message}
                      </p>
                    </div>
                    <button
                      onClick={() => dismissNotice(notice.id)}
                      className="absolute top-2 right-2 p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-muted/60 text-muted-foreground transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
