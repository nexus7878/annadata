"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useTheme } from "next-themes";
import { useSession } from "@/hooks/use-mock-auth";
import Image from "next/image";
import {
  User, CreditCard, Smartphone, Bell, Shield, Palette,
  MapPin, Mail, Phone, Camera, Check, ChevronRight,
  Crown, Zap, Wifi, WifiOff, Monitor,
  Cpu, ToggleLeft, ToggleRight, Lock, Key,
  Eye, EyeOff, Globe, Languages, Sun, Moon,
  Download, Trash2, LogOut,
  CheckCircle2, AlertTriangle, Clock,
  IndianRupee, Signal, Battery, BatteryLow,
  Radar, Video, Plane, Leaf, Thermometer, Droplets,
  Wind, CloudRain, SunDim, Radio, ShieldCheck, RefreshCw,
  Loader2, X
} from "lucide-react";

/* ─── Types ─── */
type Tab = "profile" | "subscription" | "devices" | "notifications" | "security" | "appearance";

/* ─── Animation helpers ─── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)", scale: 0.98 },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } };

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

const initialDevices = [
  { id: "d1", name: "Annadata Mini", model: "AD-MINI-V3", type: "sensor", desc: "Compact soil moisture & temp sensor", firmware: "v3.2.1", protocol: "LoRa 868MHz", lastActive: "Now", online: true, battery: 92, signal: 98, location: "Plot A — North Field", warranty: "Active (until Dec 2027)", serialNo: "ADM-2024-00847" },
  { id: "d2", name: "Annadata Field", model: "AD-FIELD-PRO", type: "weather", desc: "All-in-one weather station with 7 sensors", firmware: "v2.8.4", protocol: "WiFi + LoRa", lastActive: "Now", online: true, battery: 100, signal: 95, location: "Central Farm Hub", warranty: "Active (until Aug 2027)", serialNo: "ADF-2024-01293" },
  { id: "d3", name: "Annadata Pro", model: "AD-PRO-X1", type: "hub", desc: "Advanced AI crop analytics & edge computing hub", firmware: "v5.1.0", protocol: "4G LTE + WiFi", lastActive: "Now", online: true, battery: 87, signal: 100, location: "Farm Control Room", warranty: "Active (until Mar 2028)", serialNo: "ADP-2025-00156" },
  { id: "d4", name: "Annadata Drone", model: "AD-DRONE-S2", type: "drone", desc: "Autonomous aerial surveillance drone", firmware: "v4.0.3", protocol: "5.8GHz Radio", lastActive: "3 hrs ago", online: false, battery: 34, signal: 0, location: "Drone Hangar", warranty: "Active (until Jun 2027)", serialNo: "ADD-2024-00072" },
];

const deviceTypeIcons: Record<string, React.ElementType> = {
  sensor: Leaf, weather: CloudRain, hub: Cpu, drone: Plane, cctv: Video,
};
const deviceTypeColors: Record<string, string> = {
  sensor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  weather: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  hub: "text-violet-500 bg-violet-500/10 border-violet-500/20",
  drone: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  cctv: "text-rose-500 bg-rose-500/10 border-rose-500/20",
};

/* ────────────────────────────── MAIN COMPONENT ────────────────────────────── */
export function SettingsPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const { data: session } = useSession();
  const { resolvedTheme, setTheme } = useTheme();
  
  // Toast System
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto pb-20 space-y-6 relative min-h-screen">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%", scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
            exit={{ opacity: 0, y: 50, x: "-50%", scale: 0.9 }}
            className={`fixed bottom-8 left-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-xl font-semibold text-sm backdrop-blur-md border ${
              toast.type === "success" ? "bg-emerald-500 text-white border-emerald-500/50 shadow-emerald-500/20" : "bg-destructive text-destructive-foreground border-destructive/50"
            }`}
          >
            {toast.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account, subscription, connected devices, and preferences</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ───────── Sidebar Tabs ───────── */}
        <motion.nav
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          className="lg:w-60 shrink-0 bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-3 shadow-sm lg:sticky lg:top-24 lg:self-start"
        >
          <div className="space-y-1 relative">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors duration-300 relative z-10 ${
                    active ? "text-primary dark:text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="activeTabBg"
                      className="absolute inset-0 bg-primary/10 dark:bg-primary border border-primary/20 rounded-xl -z-10 shadow-sm"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                  <Icon className={`w-4 h-4 ${active ? "animate-pulse-slow" : ""}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </motion.nav>

        {/* ───────── Content Area ───────── */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "profile" && <ProfileSection session={session} onSave={() => showToast("Profile updated successfully!")} />}
              {activeTab === "subscription" && <SubscriptionSection onUpgrade={() => showToast("Upgraded successfully! Redirecting to payment...")} />}
              {activeTab === "devices" && <DevicesSection onToast={showToast} />}
              {activeTab === "notifications" && <NotificationsSection onSave={() => showToast("Notification preferences saved!")} />}
              {activeTab === "security" && <SecuritySection onSave={() => showToast("Security settings updated!", "success")} />}
              {activeTab === "appearance" && <AppearanceSection theme={resolvedTheme} setTheme={setTheme} onSave={() => showToast("Appearance settings saved!")} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════ SECTION WRAPPER ═══════════════════════ */
function SectionCard({ children, title, subtitle, icon: Icon }: { children: React.ReactNode; title: string; subtitle?: string; icon?: React.ElementType }) {
  return (
    <motion.div initial="hidden" animate="visible" variants={stagger}
      className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden transition-all duration-500 hover:shadow-md hover:border-border/80"
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
    <div className="flex items-center justify-between py-4 border-b border-border/30 last:border-0 group cursor-pointer" onClick={onToggle}>
      <div className="pr-4">
        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{label}</p>
        {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      <button className="relative outline-none flex-shrink-0 shrink-0">
        <motion.div
          layout
          className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${enabled ? "bg-primary" : "bg-muted"}`}
        >
          <motion.div
            layout
            className={`w-4 h-4 rounded-full bg-white shadow-sm`}
            animate={{ x: enabled ? 24 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </motion.div>
      </button>
    </div>
  );
}

/* ═══════════════════════ 1. PROFILE ═══════════════════════ */
function ProfileSection({ session, onSave }: { session: ReturnType<typeof useSession>["data"], onSave: () => void }) {
  const [isSaving, setIsSaving] = useState(false);
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => { setIsSaving(false); onSave(); }, 800);
  };

  return (
    <div className="space-y-6">
      <SectionCard title="Personal Information" subtitle="Update your profile details" icon={User}>
        {/* Avatar */}
        <motion.div variants={fadeUp} className="flex items-center gap-5 mb-8 pb-6 border-b border-border/30">
          <div className="relative group cursor-pointer">
            <motion.div whileHover={{ scale: 1.05 }} className="w-20 h-20 rounded-2xl bg-primary/15 border-2 border-primary/25 overflow-hidden flex items-center justify-center transition-transform">
              {session?.user?.image ? (
                <Image src={session.user.image} alt="Avatar" fill className="object-cover" />
              ) : (
                <span className="text-2xl font-bold text-primary">{session?.user?.name?.charAt(0) || "A"}</span>
              )}
            </motion.div>
            <button className="absolute -bottom-1 -right-1 p-2 bg-primary rounded-lg text-primary-foreground shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
              <Camera className="w-3 h-3" />
            </button>
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{session?.user?.name || "Annadata Admin"}</p>
            <p className="text-xs text-muted-foreground">{session?.user?.email || "admin@annadata.in"}</p>
            <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-md text-[10px] font-bold text-primary uppercase tracking-wider">
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
              <div key={f.label} className="group">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block group-focus-within:text-primary transition-colors">{f.label}</label>
                <div className="relative">
                  <FIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input defaultValue={f.value} className="w-full h-11 bg-muted/30 border border-border/50 rounded-xl pl-10 pr-4 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
            );
          })}
        </motion.div>

        <motion.div variants={fadeUp} className="flex justify-end gap-3 mt-8 pt-6 border-t border-border/30">
          <button className="px-5 py-2.5 bg-muted/60 hover:bg-muted border border-border/60 rounded-xl text-sm font-semibold transition-all">Cancel</button>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleSave} disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Save Changes
          </motion.button>
        </motion.div>
      </SectionCard>

      {/* Danger Zone */}
      <motion.div variants={fadeUp} className="bg-card/80 backdrop-blur-xl border border-destructive/20 rounded-3xl p-6 sm:p-8 shadow-sm transition-all hover:border-destructive/40 hover:shadow-destructive/5">
        <h3 className="text-sm font-bold text-destructive uppercase tracking-wider mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Danger Zone</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-muted/40 hover:bg-muted border border-border/50 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground transition-all"><Download className="w-4 h-4" /> Export Data</button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 rounded-xl text-sm font-bold text-destructive transition-all"><Trash2 className="w-4 h-4" /> Delete Account</button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 rounded-xl text-sm font-bold text-orange-600 dark:text-orange-400 transition-all ml-auto"><LogOut className="w-4 h-4" /> Sign Out</button>
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════ 2. SUBSCRIPTION ═══════════════════════ */
function SubscriptionSection({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <div className="space-y-6">
      <SectionCard title="Your Subscription" subtitle="Manage your billing and plan" icon={CreditCard}>
        <motion.div variants={fadeUp} className="bg-gradient-to-r relative overflow-hidden from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-primary/20 blur-[50px] -z-10 text-primary animate-pulse-slow" />
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/15 border border-primary/25 shadow-lg shadow-primary/10 relative">
              <Crown className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-bold text-foreground text-lg">Kisan Pro</p>
              <p className="text-xs text-muted-foreground mt-0.5">Billed monthly • Next renewal: April 15, 2026</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground font-heading">₹499<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 shadow-sm mt-1"><CheckCircle2 className="w-3 h-3" /> Active</span>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "IoT Nodes", used: 18, total: 25, color: "bg-blue-500" },
            { label: "API Calls", used: 8420, total: 15000, color: "bg-emerald-500" },
            { label: "Storage", used: 2.4, total: 5, color: "bg-violet-500", unit: "GB" },
            { label: "Reports", used: 12, total: 30, color: "bg-orange-500" },
          ].map((u) => (
            <div key={u.label} className="bg-muted/30 border border-border/40 rounded-xl p-4 transition-all hover:bg-muted/50 hover:border-border/60">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{u.label}</p>
              <p className="text-lg font-bold text-foreground mt-1">{u.used}{u.unit && u.unit}<span className="text-sm text-muted-foreground font-normal">/{u.total}{u.unit && u.unit}</span></p>
              <div className="h-1.5 w-full bg-muted/60 rounded-full mt-2 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(u.used / u.total) * 100}%` }} transition={{ duration: 1, ease: "easeOut" }} className={`h-full ${u.color} rounded-full`} />
              </div>
            </div>
          ))}
        </motion.div>
      </SectionCard>

      <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((plan) => (
          <motion.div key={plan.id} variants={fadeUp}
            whileHover={!plan.current ? { y: -5, scale: 1.02 } : {}}
            className={`relative bg-card/80 backdrop-blur-xl border-2 ${plan.color} rounded-3xl p-6 shadow-sm flex flex-col transition-all duration-300 ${
              plan.current ? "ring-2 ring-primary/30 shadow-primary/10" : "hover:border-border hover:shadow-xl"
            }`}
          >
            {plan.badge && (
              <span className={`absolute -top-3 left-6 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border shadow-sm ${
                plan.id === "enterprise" ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30" : "bg-primary text-primary-foreground border-primary"
              }`}>{plan.badge}</span>
            )}
            <div className="mb-4 mt-1">
              <h3 className="text-lg font-bold font-heading text-foreground">{plan.name}</h3>
              <p className="text-3xl font-bold text-foreground mt-2 font-heading">{plan.price}<span className="text-sm text-muted-foreground font-normal">{plan.period}</span></p>
            </div>
            <ul className="space-y-2.5 flex-1 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground"><div className="p-0.5 rounded-full bg-primary/15"><Check className="w-3 h-3 text-primary shrink-0" /></div>{f}</li>
              ))}
            </ul>
            <motion.button 
              whileTap={{ scale: 0.98 }}
              onClick={!plan.current ? onUpgrade : undefined}
              className={`w-full py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                plan.current
                  ? "bg-primary/10 text-primary border border-primary/20 cursor-default"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30"
              }`}
            >
              {plan.current ? "Current Plan" : "Upgrade Plan"}
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════ 3. DEVICES ═══════════════════════ */
function DevicesSection({ onToast }: { onToast: (msg: string, type: "success"|"error") => void }) {
  const [devices, setDevices] = useState(initialDevices);
  const onlineCount = devices.filter(d => d.online).length;

  const checkUpdates = () => {
    onToast("Checking for updates...", "success");
    setTimeout(() => onToast("All devices are fully up-to-date.", "success"), 2000);
  };

  return (
    <div className="space-y-6">
      <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Devices", value: devices.length, icon: Cpu, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Online", value: onlineCount, icon: Wifi, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Offline", value: devices.length - onlineCount, icon: WifiOff, color: "text-orange-500", bg: "bg-orange-500/10" },
          { label: "Warranty Active", value: devices.filter(d => d.warranty.startsWith("Active")).length, icon: ShieldCheck, color: "text-violet-500", bg: "bg-violet-500/10" },
        ].map((s) => {
          const SIcon = s.icon;
          return (
            <motion.div whileHover={{ y: -2 }} key={s.label} className="bg-card/80 backdrop-blur-xl border border-border/50 hover:border-border rounded-2xl p-4 shadow-sm transition-colors">
              <div className={`p-2 rounded-xl ${s.bg} w-fit mb-2`}><SIcon className={`w-4 h-4 ${s.color}`} /></div>
              <p className="text-2xl font-bold text-foreground font-heading">{s.value}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">{s.label}</p>
            </motion.div>
          );
        })}
      </motion.div>

      <SectionCard title="Annadata IoT Devices" subtitle={`${onlineCount} connected`} icon={Radar}>
        <motion.div variants={fadeUp} className="space-y-4">
          <AnimatePresence>
            {devices.map((dev) => {
              const DevIcon = deviceTypeIcons[dev.type] || Cpu;
              const colors = deviceTypeColors[dev.type];
              return (
                <motion.div key={dev.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, height: 0 }}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    dev.online ? "bg-muted/15 border-border/40 hover:border-primary/30 hover:shadow-md" : "bg-muted/5 border-border/20 opacity-75"
                  }`}
                >
                  <div className="flex items-center gap-4 p-4">
                    <div className={`p-3 rounded-xl shrink-0 ${colors.split(' ')[1]} border ${colors.split(' ')[2]} shadow-sm`}>
                      <DevIcon className={`w-5 h-5 ${colors.split(' ')[0]}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-foreground">{dev.name}</p>
                        <span className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-md border border-border/30">{dev.model}</span>
                        {dev.online ? (
                          <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Online
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md border border-border/30 shadow-sm">Offline</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{dev.desc}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <button onClick={() => setDevices(devices.filter(d => d.id !== dev.id))} className="p-2 bg-muted hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors" title="Remove device">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="px-4 pb-4 pt-0 flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-muted-foreground border-t border-border/20 pt-3 ml-16">
                    <span className="flex items-center gap-1"><Radio className="w-3 h-3" />{dev.protocol}</span>
                    <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3" />FW {dev.firmware}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{dev.location}</span>
                    {dev.online && <span className="flex items-center gap-1"><Battery className="w-3 h-3 text-emerald-500" />{dev.battery}%</span>}
                    <span className={`flex items-center gap-1 ${dev.warranty.startsWith("Active") ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`}><ShieldCheck className="w-3 h-3" />{dev.warranty}</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
        
        <motion.div variants={fadeUp} className="mt-6 pt-5 border-t border-border/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">All Annadata devices receive automatic OTA firmware updates</p>
          <div className="flex gap-2">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={checkUpdates} className="flex items-center gap-2 px-4 py-2.5 bg-muted/60 hover:bg-muted border border-border/60 rounded-xl text-sm font-semibold text-foreground transition-all">
              <RefreshCw className="w-4 h-4" /> Check Updates
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-2 px-4 py-2.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-xl text-sm font-bold text-primary transition-all shadow-sm">
              <Signal className="w-4 h-4" /> Pair New Device
            </motion.button>
          </div>
        </motion.div>
      </SectionCard>
    </div>
  );
}

/* ═══════════════════════ 4. NOTIFICATIONS ═══════════════════════ */
function NotificationsSection({ onSave }: { onSave: () => void }) {
  const [prefs, setPrefs] = useState({
    push: true, email: true, sms: false, cropAlerts: true, weather: true, mandi: true,
    irrigation: true, deviceAlerts: true, marketing: false, weeklyReport: true, sound: true,
  });
  const toggle = (key: keyof typeof prefs) => setPrefs(p => ({ ...p, [key]: !p[key] }));

  return (
    <div className="space-y-6">
      <SectionCard title="Notification Channels" subtitle="Choose how you receive notifications" icon={Bell}>
        <motion.div variants={fadeUp}>
          <Toggle enabled={prefs.push} onToggle={() => toggle("push")} label="Push Notifications" desc="Receive push notifications on your devices" />
          <Toggle enabled={prefs.email} onToggle={() => toggle("email")} label="Email Notifications" desc="Get updates delivered to your inbox" />
          <Toggle enabled={prefs.sms} onToggle={() => toggle("sms")} label="SMS Notifications" desc="Receive text messages for critical alerts" />
          <Toggle enabled={prefs.sound} onToggle={() => toggle("sound")} label="Notification Sound" desc="Play sound for incoming alerts" />
        </motion.div>
      </SectionCard>

      <SectionCard title="Alert Preferences" subtitle="Fine-tune which alerts you receive" icon={Zap}>
        <motion.div variants={fadeUp}>
          <Toggle enabled={prefs.cropAlerts} onToggle={() => toggle("cropAlerts")} label="Crop Health Alerts" desc="Disease detection, pest warnings, growth anomalies" />
          <Toggle enabled={prefs.weather} onToggle={() => toggle("weather")} label="Weather Alerts" desc="Extreme weather, frost warnings, rain predictions" />
          <Toggle enabled={prefs.irrigation} onToggle={() => toggle("irrigation")} label="Irrigation Events" desc="Moisture drops, pump toggles, schedule triggers" />
          <Toggle enabled={prefs.deviceAlerts} onToggle={() => toggle("deviceAlerts")} label="Device Health" desc="Sensors going offline, low battery warnings" />
        </motion.div>
        <div className="flex justify-end mt-6 pt-5 border-t border-border/30">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onSave} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20">
            <Check className="w-4 h-4" /> Save Preferences
          </motion.button>
        </div>
      </SectionCard>
    </div>
  );
}

/* ═══════════════════════ 5. SECURITY ═══════════════════════ */
function SecuritySection({ onSave }: { onSave: () => void }) {
  const [showPwd, setShowPwd] = useState(false);
  const [twoFA, setTwoFA] = useState(true);
  const [biometric, setBiometric] = useState(true);
  const [sessions, setSessions] = useState([
    { id: 1, device: "Chrome on MacBook Pro", ip: "192.168.1.12", loc: "Nagpur, MH", current: true },
    { id: 2, device: "Annadata App on iPhone", ip: "103.45.67.89", loc: "Nagpur, MH", current: false },
  ]);

  return (
    <div className="space-y-6">
      <SectionCard title="Password & Authentication" subtitle="Keep your account secure" icon={Shield}>
        <motion.div variants={fadeUp} className="space-y-5 mb-6">
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Current Password</label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input type={showPwd ? "text" : "password"} defaultValue="supersecure" className="w-full h-11 bg-muted/30 border border-border/50 rounded-xl pl-10 pr-12 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
              <button onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1">
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="group">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">New Password</label>
              <div className="relative"><Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" /><input type="password" placeholder="••••••••" className="w-full h-11 bg-muted/30 border border-border/50 rounded-xl pl-10 pr-4 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" /></div>
            </div>
            <div className="group">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Confirm Password</label>
              <div className="relative"><Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" /><input type="password" placeholder="••••••••" className="w-full h-11 bg-muted/30 border border-border/50 rounded-xl pl-10 pr-4 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" /></div>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onSave} className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all">Update Password</motion.button>
        </motion.div>

        <motion.div variants={fadeUp} className="pt-5 border-t border-border/30">
          <Toggle enabled={twoFA} onToggle={() => setTwoFA(!twoFA)} label="Two-Factor Authentication" desc="Add an extra layer of security with mobile OTP" />
          <Toggle enabled={biometric} onToggle={() => setBiometric(!biometric)} label="Biometric Login" desc="Use FaceID or Fingerprint on mobile app" />
        </motion.div>
      </SectionCard>

      <SectionCard title="Active Sessions" subtitle="Manage your connected devices" icon={Monitor}>
        <motion.div variants={fadeUp} className="space-y-3">
          <AnimatePresence>
            {sessions.map((s) => (
              <motion.div key={s.id} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0, scale: 0.95 }} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0 overflow-hidden">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border shadow-sm ${s.current ? "bg-primary/10 border-primary/20" : "bg-muted/50 border-border/40"}`}><Monitor className={`w-4 h-4 ${s.current ? "text-primary" : "text-muted-foreground"}`} /></div>
                  <div>
                    <p className="text-sm font-semibold text-foreground flex items-center gap-2">{s.device} {s.current && <span className="px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider bg-primary/20 text-primary border border-primary/30 font-bold">Current</span>}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.ip} • {s.loc}</p>
                  </div>
                </div>
                {!s.current && <button onClick={() => setSessions(prev => prev.filter(x => x.id !== s.id))} className="text-xs font-bold text-destructive bg-destructive/10 hover:bg-destructive text-destructive hover:text-white px-3 py-1.5 rounded-lg transition-all border border-destructive/20 shadow-sm">Revoke</button>}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </SectionCard>
    </div>
  );
}

/* ═══════════════════════ 6. APPEARANCE ═══════════════════════ */
function AppearanceSection({ theme, setTheme, onSave }: { theme: string | undefined; setTheme: (t: string) => void, onSave: () => void }) {
  const [fontSize, setFontSize] = useState("medium");
  const [density, setDensity] = useState("Comfortable");
  const [motionPref, setMotionPref] = useState(false);

  const themes = [
    { id: "light", label: "Light", icon: Sun, colors: "from-slate-100 to-slate-200 border-slate-300" },
    { id: "dark", label: "Dark", icon: Moon, colors: "from-slate-800 to-slate-900 border-slate-700" },
    { id: "system", label: "System", icon: Monitor, colors: "from-blue-200 to-slate-800 border-blue-400" },
  ];

  return (
    <div className="space-y-6">
      <SectionCard title="Theme" subtitle="Choose your preferred appearance style" icon={Palette}>
        <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {themes.map((t) => {
            const TIcon = t.icon;
            const active = theme === t.id;
            return (
              <motion.button key={t.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setTheme(t.id)}
                className={`relative p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-4 ${
                  active ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" : "border-border/40 hover:border-border bg-muted/10 hover:bg-muted/30"
                }`}
              >
                {active && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3 p-1 bg-primary rounded-full shadow-md"><Check className="w-3 h-3 text-primary-foreground" /></motion.span>}
                <div className={`w-full aspect-video rounded-xl bg-gradient-to-br ${t.colors} border shadow-inner opacity-80`} />
                <div className="flex items-center gap-2"><TIcon className={`w-4 h-4 ${active ? "text-primary" : "text-muted-foreground"}`} /><span className="text-sm font-bold text-foreground">{t.label} Mode</span></div>
              </motion.button>
            );
          })}
        </motion.div>
      </SectionCard>

      <SectionCard title="Display Preferences" subtitle="Customize density and accessibility" icon={Globe}>
        <motion.div variants={fadeUp} className="space-y-4">
          <div className="py-4 border-b border-border/30">
            <p className="text-sm font-semibold text-foreground mb-3">Font Size</p>
            <div className="flex bg-muted/30 p-1.5 rounded-xl border border-border/50 w-fit">
              {["small", "medium", "large"].map((s) => (
                <button key={s} onClick={() => setFontSize(s)}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                    fontSize === s ? "bg-card text-foreground shadow-md border border-border/60" : "text-muted-foreground hover:text-foreground"
                  }`}
                >{s}</button>
              ))}
            </div>
          </div>
          
          <div className="py-4 border-b border-border/30">
            <p className="text-sm font-semibold text-foreground mb-1">Layout Density</p>
            <p className="text-xs text-muted-foreground mb-3">Adjust how compact the dashboard components are</p>
            <div className="flex gap-3 mt-2">
              {["Comfortable", "Compact"].map((l) => (
                <button key={l} onClick={() => setDensity(l)} className={`px-5 py-2.5 flex-1 sm:flex-none rounded-xl text-sm font-semibold border transition-all ${
                  density === l ? "bg-primary/10 border-primary/30 text-primary shadow-sm" : "bg-muted/20 border-border/40 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                }`}>{l}</button>
              ))}
            </div>
          </div>

          <Toggle enabled={motionPref} onToggle={() => setMotionPref(!motionPref)} label="Reduce Motion" desc="Disable UI animations for a simpler, faster experience" />
          
          <div className="flex justify-end pt-5">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onSave} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20">
              <Check className="w-4 h-4" /> Save Appearance
            </motion.button>
          </div>
        </motion.div>
      </SectionCard>
    </div>
  );
}
