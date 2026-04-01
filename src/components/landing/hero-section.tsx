"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sprout, BarChart3, Zap, Users, Shield } from "lucide-react";
import { useSession } from "@/hooks/use-mock-auth";

export function HeroSection() {
  const { data: session } = useSession();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] -mt-20 lg:-mt-24 flex items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* === BACKGROUND LAYERS === */}
      <motion.div style={{ y: bgY, scale }} className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat"
          role="img"
          aria-label="Lush green agricultural farmland"
        />
      </motion.div>

      {/* Gradient overlays for depth & mood */}
      <div className="absolute inset-0 z-[1]">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/40 via-transparent to-teal-950/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
      </div>

      {/* Film grain texture */}
      <div
        className="absolute inset-0 z-[2] opacity-[0.035] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Animated ambient orbs */}
      <div className="absolute inset-0 z-[3] overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[35rem] h-[35rem] bg-emerald-500/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 60, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-1/3 right-1/4 w-[30rem] h-[30rem] bg-teal-400/15 rounded-full blur-[130px]"
        />
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 6 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-emerald-400/[0.07] rounded-full blur-[150px]"
        />
      </div>

      {/* === CONTENT === */}
      <motion.div
        style={{ opacity }}
        className="container relative z-20 px-4 sm:px-6 flex flex-col items-center text-center pt-28 sm:pt-24"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 25, filter: "blur(10px)", scale: 0.9 }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.02 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/20 text-white mb-8 bg-white/10 backdrop-blur-3xl shadow-2xl shadow-emerald-900/40 cursor-pointer"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-sm shadow-emerald-400/50" />
          </span>
          <span className="text-xs sm:text-sm font-medium tracking-wide">
            Annadata v2.0 — AI-Powered Smart Farming
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 35, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="text-[2.5rem] sm:text-5xl md:text-7xl lg:text-[5.5rem] font-heading font-bold text-white tracking-[-0.03em] mb-5 sm:mb-7 max-w-5xl leading-[0.92]"
        >
          Smart{" "}
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-200 to-lime-200">
              Farming
            </span>
            <span
              className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-200 to-lime-200 blur-2xl opacity-50 pointer-events-none select-none"
              aria-hidden="true"
            >
              Farming
            </span>
          </span>
          <br />
          <span className="text-[2rem] sm:text-4xl md:text-6xl lg:text-7xl font-medium tracking-[-0.02em]">
            for the Future
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-sm sm:text-lg md:text-xl text-white/70 max-w-2xl mb-9 sm:mb-11 leading-relaxed font-light px-2"
        >
          India&apos;s most advanced AI-powered agriculture platform — connecting farmers
          with crop analytics, smart irrigation, live market prices &amp; government schemes.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0 mb-14 sm:mb-16"
        >
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
            <Link
              href={session ? "/dashboard" : "/login"}
              className="group inline-flex items-center justify-center gap-2.5 w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-7 sm:px-9 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base transition-all duration-500 shadow-[0_0_40px_-8px_rgba(16,185,129,0.5)] hover:shadow-[0_0_80px_-10px_rgba(20,184,166,0.8)] border border-emerald-400/20"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
            <Link
              href="#features"
              className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-7 sm:px-9 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base border border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-500 backdrop-blur-2xl shadow-xl shadow-black/10"
            >
              Explore Features
            </Link>
          </motion.div>
        </motion.div>

        {/* Trust Stats */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:gap-x-12"
        >
          {[
            { icon: Users, label: "Farmers", value: "50K+" },
            { icon: Zap, label: "AI Models", value: "12+ Active" },
            { icon: Shield, label: "Data", value: "100% Secure" },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75 + i * 0.1 }}
                className="flex items-center gap-2.5 text-white/65"
              >
                <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/10">
                  <Icon className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-bold text-white">{stat.value}</span>
                  <span className="text-[10px] sm:text-xs text-white/45">{stat.label}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* === FLOATING UI ELEMENTS === */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-24 sm:bottom-32 left-4 sm:left-10 lg:left-16 z-20 hidden md:block"
      >
        <motion.div animate={{ y: [0, -12, 0], rotate: [0, -1.5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
          <div className="bg-black/50 backdrop-blur-2xl p-3.5 sm:p-4 rounded-2xl border border-white/[0.12] flex items-center gap-3.5 shadow-2xl shadow-emerald-900/20">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-500/15 flex items-center justify-center border border-emerald-500/20">
              <Sprout className="text-emerald-400 h-5 w-5" />
            </div>
            <div>
              <p className="text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider">Crop Health</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-emerald-300 text-[9px] sm:text-[10px] font-medium">94% Optimal</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-36 sm:top-44 right-4 sm:right-10 lg:right-16 z-20 hidden lg:block"
      >
        <motion.div animate={{ y: [0, 12, 0], rotate: [0, 1.5, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
          <div className="bg-black/50 backdrop-blur-2xl p-3.5 sm:p-4 rounded-2xl border border-white/[0.12] flex items-center gap-3.5 shadow-2xl shadow-blue-900/20">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-500/15 flex items-center justify-center border border-blue-500/20">
              <BarChart3 className="text-blue-400 h-5 w-5" />
            </div>
            <div>
              <p className="text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider">Live Mandi</p>
              <p className="text-blue-300 text-[9px] sm:text-[10px] font-medium mt-0.5">Wheat ₹2,450 <span className="text-emerald-400">↑5%</span></p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-36 sm:bottom-44 right-4 sm:right-10 lg:right-28 z-20 hidden xl:block"
      >
        <motion.div animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}>
          <div className="bg-black/50 backdrop-blur-2xl p-3 sm:p-3.5 flex items-center gap-3 rounded-2xl border border-white/[0.12] shadow-2xl shadow-orange-900/20">
            <div className="w-9 h-9 rounded-xl bg-orange-500/15 flex items-center justify-center border border-orange-500/20">
              <span className="text-lg">☀️</span>
            </div>
            <div>
              <p className="text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">Weather</p>
              <p className="text-orange-300 text-[8px] sm:text-[9px] font-medium mt-0.5">Clear Skies • 28°C</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-9 rounded-full border-2 border-white/25 flex items-start justify-center p-1.5"
        >
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6], height: ["4px", "8px", "4px"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 rounded-full bg-white/60"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
