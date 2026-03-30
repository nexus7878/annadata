"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Leaf,
  Droplets,
  TrendingUp,
  Building2,
  Bot,
  Landmark,
  Sparkles,
  Settings,
  X,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: BarChart3 },
  { label: "Crop Engine", href: "/crop-analysis", icon: Leaf },
  { label: "Smart Irrigation", href: "/irrigation", icon: Droplets },
  { label: "Mandi Prices", href: "/mandi-prices", icon: TrendingUp },
  { label: "Warehouse", href: "/warehouse", icon: Building2 },
  { label: "AI Assistant", href: "/ai-assistant", icon: Bot },
  { label: "Schemes", href: "/schemes", icon: Landmark },
];

interface DashboardSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function DashboardSidebar({ mobileOpen, onMobileClose }: DashboardSidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <aside className="flex flex-col w-64 h-screen max-h-screen bg-card/95 backdrop-blur-xl border-r border-border/60 py-6 px-4 shrink-0 overflow-y-auto custom-scrollbar shadow-2xl z-20">
      
      {/* Brand Logo */}
      <div className="flex items-center justify-between mb-10 px-3">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center border border-primary/25 group-hover:bg-primary/25 transition-all duration-300 group-hover:shadow-md group-hover:shadow-primary/10">
            <Image src="/images/symbollogo.png" alt="Logo" width={20} height={20} className="opacity-90 dark:brightness-0 dark:invert" />
          </div>
          <span className="font-bold text-foreground tracking-wide font-heading text-[15px]">ANNADATA</span>
        </Link>
        {/* Mobile close button */}
        {onMobileClose && (
          <button onClick={onMobileClose} className="lg:hidden p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="space-y-1 mt-2 flex-1">
        <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 mb-4 px-3">Main Menu</p>
        
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
          const NavIcon = item.icon;

          return (
            <Link key={item.href} href={item.href} onClick={onMobileClose}>
              <motion.div
                className={cn(
                  "h-11 rounded-xl flex items-center px-4 gap-3 transition-all duration-300 relative overflow-hidden",
                  isActive
                    ? "bg-primary/10 shadow-sm border border-primary/20"
                    : "hover:bg-muted/80 border border-transparent hover:border-border/50"
                )}
                whileHover={{ x: isActive ? 0 : 2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <NavIcon className={cn(
                  "w-[18px] h-[18px] transition-colors duration-200",
                  isActive ? "text-primary" : "text-muted-foreground"
                )} />
                <span className={cn(
                  "text-sm font-semibold transition-colors duration-200",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Settings Link */}
      <div className="mt-8 mb-4 px-1">
        <Link href="/settings">
          <div className="h-10 rounded-xl flex items-center px-3 gap-3 transition-all duration-300 hover:bg-muted/80 text-muted-foreground hover:text-foreground cursor-pointer">
             <Settings className="w-[18px] h-[18px]" />
             <span className="text-sm font-semibold">Settings</span>
          </div>
        </Link>
      </div>

      {/* AI Insights Promo */}
      <div className="mt-auto bg-gradient-to-tr from-primary/8 to-transparent border border-primary/15 rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden shrink-0 group hover:border-primary/30 transition-all duration-300 cursor-pointer">
        <Sparkles className="absolute -top-4 -right-2 text-primary/10 w-16 h-16 group-hover:scale-110 group-hover:text-primary/20 transition-all duration-500" />
        <p className="text-[10px] font-bold uppercase tracking-wider text-primary">AI Insights Active</p>
        <p className="text-[12px] text-muted-foreground leading-relaxed font-medium z-10">
          Soil moisture optimization increased predicted yield by 4% this month.
        </p>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex sticky top-0 h-screen">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={onMobileClose}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
