"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  User, CreditCard, Smartphone, Bell, Shield, Palette,
  MapPin, Mail, Phone, Camera, Check, ChevronRight,
  Crown, Zap, Star, Wifi, WifiOff, Monitor, Tablet,
  Watch, Cpu, ToggleLeft, ToggleRight, Lock, Key,
  Eye, EyeOff, Globe, Languages, Sun, Moon, Volume2,
  VolumeX, Download, Trash2, LogOut, HelpCircle,
  ExternalLink, CheckCircle2, AlertTriangle, Clock,
  IndianRupee, Sparkles, Signal, Battery, BatteryLow,
  Radar, Video, Plane, Leaf, Thermometer, Droplets,
  Wind, CloudRain, SunDim, Radio, ShieldCheck, RefreshCw,
} from "lucide-react";

/* ─── Types ─── */
type Tab = "profile" | "subscription" | "devices" | "notifications" | "security" | "appearance";

/* ─── Animation helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };

/* ─── Data ─── */
const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "subscription", label: "Subscription", icon: CreditCard },
  { id: "devices", label: "Devices", icon: Smartphone },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
];

const plans = [
  {
    id: "free", name: "Kisan Basic", price: "Free", period: "", color: "border-border", badge: "",
    features: ["5 IoT Nodes", "Basic Crop Analysis", "Mandi Prices", "Community Support"],
    current: false,
  },
  {
    id: "pro", name: "Kisan Pro", price: "₹499", period: "/mo", color: "border-primary/50", badge: "Popular",
    features: ["25 IoT Nodes", "AI Crop Engine", "Smart Irrigation", "Warehouse Tracking", "Priority Support", "Weekly Reports"],
    current: true,
  },
  {
    id: "enterprise", name: "Kisan Enterprise", price: "₹1,999", period: "/mo", color: "border-amber-500/50", badge: "Best Value",
    features: ["Unlimited IoT Nodes", "Advanced AI Suite", "Custom Integrations", "Dedicated Manager", "24/7 Support", "API Access", "White-label"],
    current: false,
  },
];

const annadataDevices = [
  {
    name: "Annadata Mini", model: "AD-MINI-V3", type: "sensor" as const,
    desc: "Compact soil moisture & temperature sensor",
    firmware: "v3.2.1", protocol: "LoRa 868MHz", lastActive: "Now",
    online: true, battery: 92, signal: 98, location: "Plot A — North Field",
    warranty: "Active (until Dec 2027)", serialNo: "ADM-2024-00847",
  },
  {
    name: "Annadata Field", model: "AD-FIELD-PRO", type: "weather" as const,
    desc: "All-in-one weather station with 7 sensors",
    firmware: "v2.8.4", protocol: "WiFi + LoRa", lastActive: "Now",
    online: true, battery: 100, signal: 95, location: "Central Farm Hub",
    warranty: "Active (until Aug 2027)", serialNo: "ADF-2024-01293",
  },
  {
    name: "Annadata Pro", model: "AD-PRO-X1", type: "hub" as const,
    desc: "Advanced AI crop analytics & edge computing hub",
    firmware: "v5.1.0", protocol: "4G LTE + WiFi", lastActive: "Now",
    online: true, battery: 87, signal: 100, location: "Farm Control Room",
    warranty: "Active (until Mar 2028)", serialNo: "ADP-2025-00156",
  },
  {
    name: "Annadata Drone", model: "AD-DRONE-S2", type: "drone" as const,
    desc: "Autonomous aerial surveillance & crop spraying drone",
    firmware: "v4.0.3", protocol: "5.8GHz Radio", lastActive: "3 hrs ago",
    online: false, battery: 34, signal: 0, location: "Drone Hangar",
    warranty: "Active (until Jun 2027)", serialNo: "ADD-2024-00072",
  },
  {
    name: "Annadata CCTV", model: "AD-CAM-360", type: "cctv" as const,
    desc: "360° PTZ farm security camera with night vision",
    firmware: "v1.9.7", protocol: "WiFi 6", lastActive: "Now",
    online: true, battery: 100, signal: 91, location: "Farm Gate Entry",
    warranty: "Active (until Oct 2027)", serialNo: "ADC-2024-00341",
  },
  {
    name: "Annadata CCTV", model: "AD-CAM-360", type: "cctv" as const,
    desc: "360° PTZ farm security camera with night vision",
    firmware: "v1.9.7", protocol: "WiFi 6", lastActive: "12 hrs ago",
    online: false, battery: 100, signal: 0, location: "Warehouse B",
    warranty: "Expired", serialNo: "ADC-2023-00198",
  },
];

const deviceTypeIcons: Record<string, React.ElementType> = {
  sensor: Leaf, weather: CloudRain, hub: Cpu, drone: Plane, cctv: Video,
};
const deviceTypeColors: Record<string, { text: string; bg: string; border: string }> = {
  sensor: { text: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  weather: { text: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  hub: { text: "text-violet-500", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  drone: { text: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  cctv: { text: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
};

/* ────────────────────────────── MAIN COMPONENT ────────────────────────────── */
export function SettingsPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const { data: session } = useSession();
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto pb-20 space-y-6">
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account, subscription, connected devices, and preferences</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ───────── Sidebar Tabs ───────── */}
        <motion.nav
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          className="lg:w-60 shrink-0 bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-3 shadow-lg lg:sticky lg:top-24 lg:self-start"
        >
          <div className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative overflow-hidden ${
                    active
                      ? "bg-primary/10 text-foreground border border-primary/20 shadow-sm"
                      : "text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-transparent"
                  }`}
                >
                  {active && (
                    <motion.div layoutId="settings-tab-pill" className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-full" transition={{ type: "spring", stiffness: 350, damping: 30 }} />
                  )}
                  <Icon className={`w-[18px] h-[18px] ${active ? "text-primary" : ""}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </motion.nav>

        {/* ───────── Content Area ───────── */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === "profile" && <ProfileSection key="profile" session={session} />}
            {activeTab === "subscription" && <SubscriptionSection key="subscription" />}
            {activeTab === "devices" && <DevicesSection key="devices" />}
            {activeTab === "notifications" && <NotificationsSection key="notifications" />}
            {activeTab === "security" && <SecuritySection key="security" />}
            {activeTab === "appearance" && <AppearanceSection key="appearance" theme={resolvedTheme} setTheme={setTheme} />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════ SECTION WRAPPER ═══════════════════════ */
function SectionCard({ children, title, subtitle, icon: Icon }: { children: React.ReactNode; title: string; subtitle?: string; icon?: React.ElementType }) {
  return (
    <motion.div initial="hidden" animate="visible" exit={{ opacity: 0, y: -10 }} variants={stagger}
      className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden"
    >
      <div className="absolute -right-16 -top-16 w-48 h-48 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
      {Icon && (
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20"><Icon className="w-5 h-5 text-primary" /></div>
          <div>
            <h2 className="text-lg font-bold font-heading text-foreground">{title}</h2>
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
        </motion.div>
      )}
      {children}
    </motion.div>
  );
}

/* ═══════════════════════ TOGGLE COMPONENT ═══════════════════════ */
function Toggle({ enabled, onToggle, label, desc }: { enabled: boolean; onToggle: () => void; label: string; desc?: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
      <div><p className="text-sm font-semibold text-foreground">{label}</p>{desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}</div>
      <button onClick={onToggle} className="relative">
        {enabled ? <ToggleRight className="w-10 h-10 text-primary transition-colors" /> : <ToggleLeft className="w-10 h-10 text-muted-foreground/40 transition-colors" />}
      </button>
    </div>
  );
}

/* ═══════════════════════ 1. PROFILE ═══════════════════════ */
function ProfileSection({ session }: { session: ReturnType<typeof useSession>["data"] }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" exit={{ opacity: 0 }} className="space-y-6">
      <SectionCard title="Personal Information" subtitle="Update your profile details" icon={User}>
        {/* Avatar */}
        <motion.div variants={fadeUp} className="flex items-center gap-5 mb-8 pb-6 border-b border-border/30">
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl bg-primary/15 border-2 border-primary/25 overflow-hidden flex items-center justify-center">
              {session?.user?.image ? (
                <Image src={session.user.image} alt="Avatar" fill className="object-cover" />
              ) : (
                <span className="text-2xl font-bold text-primary">{session?.user?.name?.charAt(0) || "A"}</span>
              )}
            </div>
            <button className="absolute -bottom-1 -right-1 p-1.5 bg-primary rounded-lg text-primary-foreground shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{session?.user?.name || "Annadata Admin"}</p>
            <p className="text-xs text-muted-foreground">{session?.user?.email || "admin@annadata.in"}</p>
            <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-primary/10 border border-primary/20 rounded text-[10px] font-bold text-primary uppercase tracking-wider">
              <Crown className="w-3 h-3" /> Pro Member
            </span>
          </div>
        </motion.div>

        {/* Form Fields */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { label: "Full Name", value: "Rajesh Patel", icon: User },
            { label: "Email", value: "rajesh@annadata.in", icon: Mail },
            { label: "Phone", value: "+91 98765 43210", icon: Phone },
            { label: "Location", value: "Nagpur, Maharashtra", icon: MapPin },
            { label: "Farm Size", value: "12.5 Hectares", icon: Globe },
            { label: "Language", value: "English / हिन्दी", icon: Languages },
          ].map((f) => {
            const FIcon = f.icon;
            return (
              <div key={f.label}>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">{f.label}</label>
                <div className="relative">
                  <FIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input defaultValue={f.value} className="w-full h-11 bg-muted/40 border border-border/50 rounded-xl pl-10 pr-4 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all duration-300" />
                </div>
              </div>
            );
          })}
        </motion.div>

        <motion.div variants={fadeUp} className="flex justify-end gap-3 mt-8 pt-6 border-t border-border/30">
          <button className="px-5 py-2.5 bg-muted/60 hover:bg-muted border border-border/60 rounded-xl text-sm font-semibold transition-all">Cancel</button>
          <button className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all">Save Changes</button>
        </motion.div>
      </SectionCard>

      {/* Danger Zone */}
      <motion.div variants={fadeUp} className="bg-card/80 backdrop-blur-xl border border-destructive/20 rounded-3xl p-6 sm:p-8 shadow-lg">
        <h3 className="text-sm font-bold text-destructive uppercase tracking-wider mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Danger Zone</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-muted/40 hover:bg-muted border border-border/50 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground transition-all"><Download className="w-4 h-4" /> Export Data</button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 rounded-xl text-sm font-bold text-destructive transition-all"><Trash2 className="w-4 h-4" /> Delete Account</button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 rounded-xl text-sm font-bold text-orange-600 dark:text-orange-400 transition-all"><LogOut className="w-4 h-4" /> Sign Out</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════ 2. SUBSCRIPTION ═══════════════════════ */
function SubscriptionSection() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" exit={{ opacity: 0 }} className="space-y-6">
      {/* Current Plan Status */}
      <SectionCard title="Your Subscription" subtitle="Manage your billing and plan" icon={CreditCard}>
        <motion.div variants={fadeUp} className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/15 border border-primary/25 shadow-lg shadow-primary/10">
              <Crown className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-bold text-foreground text-lg">Kisan Pro</p>
              <p className="text-xs text-muted-foreground mt-0.5">Billed monthly • Next renewal: April 15, 2026</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground font-heading">₹499<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20"><CheckCircle2 className="w-3 h-3" /> Active</span>
          </div>
        </motion.div>

        {/* Usage Stats */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "IoT Nodes", used: 18, total: 25, color: "bg-blue-500" },
            { label: "API Calls", used: 8420, total: 15000, color: "bg-emerald-500" },
            { label: "Storage", used: 2.4, total: 5, color: "bg-violet-500", unit: "GB" },
            { label: "Reports", used: 12, total: 30, color: "bg-orange-500" },
          ].map((u) => (
            <div key={u.label} className="bg-muted/30 border border-border/40 rounded-xl p-4">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{u.label}</p>
              <p className="text-lg font-bold text-foreground mt-1">{u.used}{u.unit && u.unit}<span className="text-sm text-muted-foreground font-normal">/{u.total}{u.unit && u.unit}</span></p>
              <div className="h-1.5 w-full bg-muted/60 rounded-full mt-2 overflow-hidden">
                <div className={`h-full ${u.color} rounded-full transition-all duration-700`} style={{ width: `${(u.used / u.total) * 100}%` }} />
              </div>
            </div>
          ))}
        </motion.div>
      </SectionCard>

      {/* Plans Grid */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((plan) => (
          <motion.div key={plan.id} variants={fadeUp}
            className={`relative bg-card/80 backdrop-blur-xl border-2 ${plan.color} rounded-3xl p-6 shadow-lg flex flex-col transition-all duration-300 hover:shadow-xl ${
              plan.current ? "ring-2 ring-primary/30" : "hover:border-border"
            }`}
          >
            {plan.badge && (
              <span className={`absolute -top-3 left-6 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
                plan.id === "enterprise" ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30" : "bg-primary/15 text-primary border-primary/30"
              }`}>{plan.badge}</span>
            )}
            <div className="mb-4 mt-1">
              <h3 className="text-lg font-bold font-heading text-foreground">{plan.name}</h3>
              <p className="text-3xl font-bold text-foreground mt-2 font-heading">{plan.price}<span className="text-sm text-muted-foreground font-normal">{plan.period}</span></p>
            </div>
            <ul className="space-y-2.5 flex-1 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground"><Check className="w-4 h-4 text-primary shrink-0" />{f}</li>
              ))}
            </ul>
            <button className={`w-full py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
              plan.current
                ? "bg-primary/10 text-primary border border-primary/20 cursor-default"
                : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
            }`}>{plan.current ? "Current Plan" : "Upgrade"}</button>
          </motion.div>
        ))}
      </motion.div>

      {/* Payment History */}
      <SectionCard title="Payment History" subtitle="Recent transactions" icon={IndianRupee}>
        <motion.div variants={fadeUp} className="space-y-3">
          {[
            { date: "Mar 15, 2026", amount: "₹499", status: "Paid", method: "UPI" },
            { date: "Feb 15, 2026", amount: "₹499", status: "Paid", method: "UPI" },
            { date: "Jan 15, 2026", amount: "₹499", status: "Paid", method: "Card" },
          ].map((tx, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
                <div><p className="text-sm font-semibold text-foreground">Kisan Pro Monthly</p><p className="text-xs text-muted-foreground">{tx.date} • {tx.method}</p></div>
              </div>
              <span className="text-sm font-bold text-foreground">{tx.amount}</span>
            </div>
          ))}
        </motion.div>
      </SectionCard>
    </motion.div>
  );
}

/* ═══════════════════════ 3. DEVICES ═══════════════════════ */
function DevicesSection() {
  const onlineCount = annadataDevices.filter(d => d.online).length;
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" exit={{ opacity: 0 }} className="space-y-6">
      {/* Summary Bar */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Devices", value: annadataDevices.length, icon: Cpu, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Online", value: onlineCount, icon: Wifi, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Offline", value: annadataDevices.length - onlineCount, icon: WifiOff, color: "text-orange-500", bg: "bg-orange-500/10" },
          { label: "Warranty Active", value: annadataDevices.filter(d => d.warranty.startsWith("Active")).length, icon: ShieldCheck, color: "text-violet-500", bg: "bg-violet-500/10" },
        ].map((s) => {
          const SIcon = s.icon;
          return (
            <div key={s.label} className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-4 shadow-sm">
              <div className={`p-2 rounded-lg ${s.bg} w-fit mb-2`}><SIcon className={`w-4 h-4 ${s.color}`} /></div>
              <p className="text-2xl font-bold text-foreground font-heading">{s.value}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          );
        })}
      </motion.div>

      {/* Device Cards */}
      <SectionCard title="Annadata IoT Devices" subtitle={`${onlineCount} of ${annadataDevices.length} devices connected`} icon={Radar}>
        <motion.div variants={fadeUp} className="space-y-4">
          {annadataDevices.map((dev, i) => {
            const DevIcon = deviceTypeIcons[dev.type] || Cpu;
            const colors = deviceTypeColors[dev.type] || deviceTypeColors.sensor;
            return (
              <motion.div key={i} variants={fadeUp}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  dev.online ? "bg-muted/15 border-border/40 hover:border-primary/30 hover:shadow-md" : "bg-muted/5 border-border/20 opacity-75"
                }`}
              >
                {/* Main Row */}
                <div className="flex items-center gap-4 p-4">
                  <div className={`p-3 rounded-xl shrink-0 ${colors.bg} border ${colors.border} shadow-sm`}>
                    <DevIcon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-foreground">{dev.name}</p>
                      <span className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded border border-border/30">{dev.model}</span>
                      {dev.online ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Online
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded border border-border/30">Offline</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{dev.desc}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-3 shrink-0">
                    {dev.battery < 100 && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        {dev.battery > 30 ? <Battery className="w-4 h-4 text-emerald-500" /> : <BatteryLow className="w-4 h-4 text-orange-500" />}
                        {dev.battery}%
                      </div>
                    )}
                    {dev.signal > 0 && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Signal className={`w-3.5 h-3.5 ${dev.signal > 80 ? "text-emerald-500" : "text-orange-500"}`} />{dev.signal}%
                      </div>
                    )}
                    <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all" title="Device settings">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details Row */}
                <div className="px-4 pb-4 pt-0 flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-muted-foreground border-t border-border/20 pt-3 ml-16">
                  <span className="flex items-center gap-1"><Radio className="w-3 h-3" />{dev.protocol}</span>
                  <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3" />FW {dev.firmware}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{dev.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{dev.lastActive}</span>
                  <span className={`flex items-center gap-1 ${
                    dev.warranty.startsWith("Active") ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"
                  }`}><ShieldCheck className="w-3 h-3" />{dev.warranty}</span>
                  <span className="font-mono text-muted-foreground/60">S/N: {dev.serialNo}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div variants={fadeUp} className="mt-6 pt-5 border-t border-border/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">All Annadata devices receive automatic OTA firmware updates</p>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-muted/60 hover:bg-muted border border-border/60 rounded-xl text-sm font-semibold text-foreground transition-all">
              <RefreshCw className="w-4 h-4" /> Check Updates
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-primary/10 hover:bg-primary/15 border border-primary/20 rounded-xl text-sm font-bold text-primary transition-all">
              <Signal className="w-4 h-4" /> Pair New Device
            </button>
          </div>
        </motion.div>
      </SectionCard>

      {/* Live Sensor Readings from Annadata Devices */}
      <SectionCard title="Live Sensor Readings" subtitle="Real-time data from your Annadata devices" icon={Cpu}>
        <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "Soil Moisture", source: "Annadata Mini", status: "Active", icon: Droplets, reading: "42% RH", color: "text-blue-500", bg: "bg-blue-500/10" },
            { name: "Soil Temperature", source: "Annadata Mini", status: "Active", icon: Thermometer, reading: "28.4°C", color: "text-orange-500", bg: "bg-orange-500/10" },
            { name: "Wind Speed", source: "Annadata Field", status: "Active", icon: Wind, reading: "12 km/h", color: "text-teal-500", bg: "bg-teal-500/10" },
            { name: "Rainfall", source: "Annadata Field", status: "Active", icon: CloudRain, reading: "0 mm", color: "text-indigo-500", bg: "bg-indigo-500/10" },
            { name: "UV Index", source: "Annadata Field", status: "Active", icon: SunDim, reading: "6.2", color: "text-amber-500", bg: "bg-amber-500/10" },
            { name: "Crop Health AI", source: "Annadata Pro", status: "Processing", icon: Leaf, reading: "94%", color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { name: "Aerial Survey", source: "Annadata Drone", status: "Idle", icon: Plane, reading: "—", color: "text-amber-500", bg: "bg-amber-500/10" },
            { name: "Gate Camera", source: "Annadata CCTV", status: "Recording", icon: Video, reading: "1080p", color: "text-rose-500", bg: "bg-rose-500/10" },
            { name: "Warehouse Cam", source: "Annadata CCTV", status: "Offline", icon: Video, reading: "—", color: "text-muted-foreground", bg: "bg-muted/30" },
          ].map((s, i) => {
            const SIcon = s.icon;
            return (
              <div key={i} className={`p-4 rounded-xl border transition-all ${s.status === "Offline" ? "bg-muted/10 border-border/20 opacity-60" : "bg-muted/20 border-border/40 hover:border-border"}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${s.bg}`}><SIcon className={`w-3.5 h-3.5 ${s.color}`} /></div>
                    <p className="text-sm font-bold text-foreground">{s.name}</p>
                  </div>
                </div>
                <p className="text-xl font-bold font-heading text-foreground">{s.reading}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    s.status === "Active" || s.status === "Recording" ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
                    s.status === "Processing" ? "text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20" :
                    s.status === "Idle" ? "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20" :
                    "text-destructive bg-destructive/10 border-destructive/20"
                  }`}>{s.status}</span>
                  <span className="text-[10px] text-muted-foreground">{s.source}</span>
                </div>
              </div>
            );
          })}
        </motion.div>
      </SectionCard>
    </motion.div>
  );
}

/* ═══════════════════════ 4. NOTIFICATIONS ═══════════════════════ */
function NotificationsSection() {
  const [prefs, setPrefs] = useState({
    push: true, email: true, sms: false, cropAlerts: true, weather: true, mandi: true,
    irrigation: true, deviceAlerts: true, marketing: false, weeklyReport: true, sound: true,
  });
  const toggle = (key: keyof typeof prefs) => setPrefs(p => ({ ...p, [key]: !p[key] }));

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" exit={{ opacity: 0 }} className="space-y-6">
      <SectionCard title="Notification Channels" subtitle="Choose how you receive notifications" icon={Bell}>
        <motion.div variants={fadeUp}>
          <Toggle enabled={prefs.push} onToggle={() => toggle("push")} label="Push Notifications" desc="Receive push notifications on your devices" />
          <Toggle enabled={prefs.email} onToggle={() => toggle("email")} label="Email Notifications" desc="Get updates delivered to your inbox" />
          <Toggle enabled={prefs.sms} onToggle={() => toggle("sms")} label="SMS Notifications" desc="Receive text messages for critical alerts" />
          <Toggle enabled={prefs.sound} onToggle={() => toggle("sound")} label="Notification Sound" desc="Play sound for incoming notifications" />
        </motion.div>
      </SectionCard>

      <SectionCard title="Alert Preferences" subtitle="Fine-tune which alerts you receive" icon={Zap}>
        <motion.div variants={fadeUp}>
          <Toggle enabled={prefs.cropAlerts} onToggle={() => toggle("cropAlerts")} label="Crop Health Alerts" desc="Disease detection, pest warnings, growth anomalies" />
          <Toggle enabled={prefs.weather} onToggle={() => toggle("weather")} label="Weather Alerts" desc="Extreme weather, frost warnings, rain predictions" />
          <Toggle enabled={prefs.mandi} onToggle={() => toggle("mandi")} label="Mandi Price Alerts" desc="Price changes above your threshold" />
          <Toggle enabled={prefs.irrigation} onToggle={() => toggle("irrigation")} label="Irrigation Alerts" desc="Moisture levels, pump status, schedule reminders" />
          <Toggle enabled={prefs.deviceAlerts} onToggle={() => toggle("deviceAlerts")} label="Device Alerts" desc="Sensor offline, low battery, calibration needed" />
          <Toggle enabled={prefs.weeklyReport} onToggle={() => toggle("weeklyReport")} label="Weekly Summary Report" desc="Get a comprehensive weekly farm report every Monday" />
          <Toggle enabled={prefs.marketing} onToggle={() => toggle("marketing")} label="Product Updates" desc="New features, tips, and promotional offers" />
        </motion.div>
      </SectionCard>
    </motion.div>
  );
}

/* ═══════════════════════ 5. SECURITY ═══════════════════════ */
function SecuritySection() {
  const [showPwd, setShowPwd] = useState(false);
  const [twoFA, setTwoFA] = useState(true);
  const [biometric, setBiometric] = useState(true);

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" exit={{ opacity: 0 }} className="space-y-6">
      <SectionCard title="Password & Authentication" subtitle="Keep your account secure" icon={Shield}>
        <motion.div variants={fadeUp} className="space-y-5 mb-6">
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type={showPwd ? "text" : "password"} defaultValue="supersecure" className="w-full h-11 bg-muted/40 border border-border/50 rounded-xl pl-10 pr-12 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all" />
              <button onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">New Password</label>
              <div className="relative"><Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input type="password" placeholder="••••••••" className="w-full h-11 bg-muted/40 border border-border/50 rounded-xl pl-10 pr-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all" /></div>
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Confirm Password</label>
              <div className="relative"><Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input type="password" placeholder="••••••••" className="w-full h-11 bg-muted/40 border border-border/50 rounded-xl pl-10 pr-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all" /></div>
            </div>
          </div>
          <button className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all">Update Password</button>
        </motion.div>

        <motion.div variants={fadeUp} className="pt-5 border-t border-border/30">
          <Toggle enabled={twoFA} onToggle={() => setTwoFA(!twoFA)} label="Two-Factor Authentication" desc="Add an extra layer of security with OTP" />
          <Toggle enabled={biometric} onToggle={() => setBiometric(!biometric)} label="Biometric Login" desc="Use fingerprint or face recognition on supported devices" />
        </motion.div>
      </SectionCard>

      <SectionCard title="Active Sessions" subtitle="Manage where you're logged in" icon={Monitor}>
        <motion.div variants={fadeUp} className="space-y-3">
          {[
            { device: "Chrome on MacBook Pro", ip: "192.168.1.12", loc: "Nagpur, MH", current: true },
            { device: "Annadata App on iPhone", ip: "103.45.67.89", loc: "Nagpur, MH", current: false },
            { device: "Firefox on Windows PC", ip: "103.45.67.90", loc: "Mumbai, MH", current: false },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${s.current ? "bg-primary/10" : "bg-muted/50"}`}><Monitor className={`w-4 h-4 ${s.current ? "text-primary" : "text-muted-foreground"}`} /></div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{s.device} {s.current && <span className="text-[10px] text-primary font-bold ml-1">(This device)</span>}</p>
                  <p className="text-xs text-muted-foreground">{s.ip} • {s.loc}</p>
                </div>
              </div>
              {!s.current && <button className="text-xs font-bold text-destructive hover:text-destructive/80 transition-colors">Revoke</button>}
            </div>
          ))}
        </motion.div>
      </SectionCard>
    </motion.div>
  );
}

/* ═══════════════════════ 6. APPEARANCE ═══════════════════════ */
function AppearanceSection({ theme, setTheme }: { theme: string | undefined; setTheme: (t: string) => void }) {
  const [fontSize, setFontSize] = useState("medium");
  const themes = [
    { id: "light", label: "Light", icon: Sun, colors: "from-amber-100 to-orange-50" },
    { id: "dark", label: "Dark", icon: Moon, colors: "from-slate-800 to-slate-900" },
    { id: "system", label: "System", icon: Monitor, colors: "from-slate-300 to-slate-500" },
  ];

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" exit={{ opacity: 0 }} className="space-y-6">
      <SectionCard title="Theme" subtitle="Choose your preferred appearance" icon={Palette}>
        <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4">
          {themes.map((t) => {
            const TIcon = t.icon;
            const active = theme === t.id || (t.id === "system" && !["light","dark"].includes(theme || ""));
            return (
              <button key={t.id} onClick={() => setTheme(t.id)}
                className={`relative p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-3 ${
                  active ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" : "border-border/40 hover:border-border bg-muted/20"
                }`}
              >
                {active && <span className="absolute top-2 right-2 p-0.5 bg-primary rounded-full"><Check className="w-3 h-3 text-primary-foreground" /></span>}
                <div className={`w-full h-16 rounded-xl bg-gradient-to-br ${t.colors} border border-border/30`} />
                <div className="flex items-center gap-2"><TIcon className={`w-4 h-4 ${active ? "text-primary" : "text-muted-foreground"}`} /><span className="text-sm font-bold text-foreground">{t.label}</span></div>
              </button>
            );
          })}
        </motion.div>
      </SectionCard>

      <SectionCard title="Display Preferences" subtitle="Customize your experience" icon={Globe}>
        <motion.div variants={fadeUp}>
          <div className="py-4 border-b border-border/30">
            <p className="text-sm font-semibold text-foreground mb-3">Font Size</p>
            <div className="flex gap-3">
              {["small", "medium", "large"].map((s) => (
                <button key={s} onClick={() => setFontSize(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all capitalize ${
                    fontSize === s ? "bg-primary/10 border-primary/25 text-primary" : "bg-muted/40 border-border/40 text-muted-foreground hover:text-foreground"
                  }`}
                >{s}</button>
              ))}
            </div>
          </div>
          <div className="py-4 border-b border-border/30">
            <p className="text-sm font-semibold text-foreground mb-1">Dashboard Layout</p>
            <p className="text-xs text-muted-foreground mb-3">Choose dashboard density</p>
            <div className="flex gap-3">
              {["Comfortable", "Compact"].map((l) => (
                <button key={l} className="px-4 py-2 rounded-xl text-sm font-semibold bg-muted/40 border border-border/40 text-muted-foreground hover:text-foreground hover:border-border transition-all">{l}</button>
              ))}
            </div>
          </div>
          <div className="py-4 flex items-center justify-between">
            <div><p className="text-sm font-semibold text-foreground">Reduce Animations</p><p className="text-xs text-muted-foreground mt-0.5">Minimize motion for accessibility</p></div>
            <ToggleLeft className="w-10 h-10 text-muted-foreground/40 cursor-pointer hover:text-muted-foreground transition-colors" />
          </div>
        </motion.div>
      </SectionCard>
    </motion.div>
  );
}
