"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { Search, Bell, Menu, ChevronDown, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface DashboardHeaderProps {
  onMobileMenuToggle?: () => void;
}

export function DashboardHeader({ onMobileMenuToggle }: DashboardHeaderProps) {
  const { data: session } = useSession();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <header className="h-16 lg:h-[72px] bg-card/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm transition-colors duration-300">
      
      {/* Left: Mobile Toggle & System Status */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors bg-muted/50 rounded-xl border border-border/50 hover:bg-muted"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2.5">
           <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
           <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest hidden md:inline-block">System Online</span>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-xl mx-4 lg:mx-8">
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
          <input 
            type="text" 
            placeholder="Search telemetry, active fields, or alerts..." 
            className="w-full h-10 lg:h-11 bg-muted/40 border border-border/50 rounded-xl pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all duration-300 shadow-inner"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex gap-1">
            <kbd className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-[10px] font-mono font-bold border border-border/50">⌘</kbd>
            <kbd className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-[10px] font-mono font-bold border border-border/50">K</kbd>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 lg:gap-4 flex-1 justify-end">
        
        {/* Theme Toggle */}
        {mounted && (
          <motion.button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="relative p-2.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-300 border border-transparent hover:border-border/50 overflow-hidden"
            whileTap={{ scale: 0.9 }}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isDark ? (
                <motion.div
                  key="sun"
                  initial={{ y: -20, opacity: 0, rotate: -90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 20, opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="w-[18px] h-[18px] text-amber-400" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ y: -20, opacity: 0, rotate: 90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 20, opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="w-[18px] h-[18px] text-indigo-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        )}

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-300 border border-transparent hover:border-border/50 group">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-orange-500 border-2 border-card" />
        </button>

        <div className="h-8 w-px bg-border hidden sm:block mx-1" />

        {/* User Card */}
        <div className="flex items-center gap-3 pl-2 cursor-pointer group rounded-xl p-1.5 hover:bg-muted/80 border border-transparent hover:border-border/50 transition-all duration-300">
          <div className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/25 overflow-hidden relative shrink-0">
             {session?.user?.image ? (
               <Image src={session.user.image} alt="User" fill className="object-cover" />
             ) : (
               <div className="w-full h-full flex flex-col items-center justify-center font-bold text-primary text-sm">
                 {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "A"}
               </div>
             )}
          </div>
          <div className="hidden md:flex flex-col pr-1">
            <span className="text-[13px] font-semibold text-foreground leading-tight">
              {session?.user?.name || "Annadata Admin"}
            </span>
            <span className="text-[10px] font-medium text-muted-foreground leading-tight mt-0.5">
              Premium Account
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground hidden md:block transition-colors" />
        </div>
      </div>
    </header>
  );
}
