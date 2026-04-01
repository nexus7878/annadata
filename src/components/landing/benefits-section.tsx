"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/section-heading";
import { CheckCircle2, TrendingUp, Droplets, Search, Activity } from "lucide-react";

const benefits = [
  "Up to 40% Increase in Crop Yield",
  "30% Reduction in Water Usage",
  "Early Disease Detection & Prevention",
  "Optimized Fertilizer Application",
  "Direct Access to Best Market Prices",
  "Seamless Access to Government Subsidies",
];

const highlights = [
  { label: "AI Crop Doctor", desc: "Instant disease detection & precise treatment routing.", icon: Search, color: "text-emerald-400", bg: "from-emerald-500/20 to-emerald-500/5", glow: "group-hover:shadow-[0_0_30px_-5px_rgba(52,211,153,0.3)]" },
  { label: "Smart Irrigation", desc: "Weather-synced, automated watering schedules.", icon: Droplets, color: "text-blue-400", bg: "from-blue-500/20 to-blue-500/5", glow: "group-hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]" },
  { label: "Mandi Connect", desc: "Direct market access and live commodity pricing.", icon: TrendingUp, color: "text-violet-400", bg: "from-violet-500/20 to-violet-500/5", glow: "group-hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.3)]" },
  { label: "Predictive Yield", desc: "Satellite & drone data analytics for harvest modeling.", icon: Activity, color: "text-orange-400", bg: "from-orange-500/20 to-orange-500/5", glow: "group-hover:shadow-[0_0_30px_-5px_rgba(249,115,22,0.3)]" },
];

export function BenefitsSection() {
  return (
    <section id="benefits" className="py-20 sm:py-28 md:py-36 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/[0.04] rounded-full blur-[140px] pointer-events-none -translate-y-1/4 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/[0.03] rounded-full blur-[140px] pointer-events-none translate-y-1/4 -translate-x-1/4" />

      <div className="container px-4 sm:px-6 relative z-10 w-full max-w-[1300px]">
        <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 items-center">
          {/* Left column - Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <SectionHeading
              badge="Farmer Benefits"
              title="Transforming agriculture from guesswork to science."
              subtitle="Empowering farmers across India with data-driven insights, environmental telemetry, and advanced AI-powered tools."
              alignment="left"
              className="mb-8 sm:mb-12"
            />

            <ul className="space-y-4 sm:space-y-5">
              {benefits.map((benefit, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * i, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-4 group"
                >
                  <div className="h-7 w-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all duration-400 shadow-sm shadow-emerald-900/10">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 drop-shadow-sm" />
                  </div>
                  <span className="text-[15px] sm:text-base font-medium text-foreground/80 group-hover:text-foreground transition-colors duration-300">
                    {benefit}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right column - Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mt-8 lg:mt-0">
            {highlights.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: 0.2 + 0.1 * i, ease: [0.16, 1, 0.3, 1] }}
                  className={`group relative bg-[#121212]/30 backdrop-blur-xl border border-white/5 rounded-[2rem] p-7 overflow-hidden transition-all duration-500 hover:bg-[#1A1A1A]/40 hover:border-white/10 ${item.glow}`}
                >
                  {/* Subtle Background Radiance */}
                  <div className={`absolute -inset-x-0 -inset-y-0 w-full h-full bg-gradient-to-br ${item.bg} opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none`} />
                  <div className={`absolute -top-12 -right-12 w-36 h-36 bg-gradient-to-br ${item.bg} rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className={`inline-flex w-14 h-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.bg} mb-6 group-hover:scale-110 group-hover:rotate-[3deg] transition-all duration-500 shadow-inner border border-white/5`}>
                      <Icon className={`w-7 h-7 ${item.color} drop-shadow-md`} />
                    </div>
                    
                    <h4 className="text-xl font-bold text-white mb-2 font-heading tracking-tight">{item.label}</h4>
                    <p className="text-sm text-gray-400 leading-relaxed font-medium group-hover:text-gray-300 transition-colors duration-300">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
