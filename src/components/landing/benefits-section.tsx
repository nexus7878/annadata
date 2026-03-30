"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/section-heading";
import { AnimatedCounter } from "@/components/animated-counter";
import { CheckCircle2, TrendingUp, Droplets, Sprout, Award } from "lucide-react";

const benefits = [
  "Up to 40% Increase in Crop Yield",
  "30% Reduction in Water Usage",
  "Early Disease Detection & Prevention",
  "Optimized Fertilizer Application",
  "Direct Access to Best Market Prices",
  "Seamless Access to Government Subsidies",
];

const stats = [
  { label: "Active Farmers", value: 50000, suffix: "+", icon: Sprout, color: "text-emerald-500", bg: "bg-emerald-500/8" },
  { label: "Acres Monitored", value: 100000, suffix: "+", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/8" },
  { label: "Crop Types", value: 150, suffix: "+", icon: Award, color: "text-violet-500", bg: "bg-violet-500/8" },
  { label: "Avg. Yield Boost", value: 40, suffix: "%", icon: Droplets, color: "text-cyan-500", bg: "bg-cyan-500/8" },
];

export function BenefitsSection() {
  return (
    <section className="py-20 sm:py-28 md:py-36 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-[120px] pointer-events-none -translate-y-1/4 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-400/[0.03] rounded-full blur-[120px] pointer-events-none translate-y-1/4 -translate-x-1/4" />

      <div className="container px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 items-center">
          {/* Left column - Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionHeading
              badge="Farmer Benefits"
              title="Transforming agriculture from guesswork to science."
              subtitle="Empowering over 50,000 farmers across India with data-driven insights and AI-powered tools."
              alignment="left"
              className="mb-8 sm:mb-10"
            />

            <ul className="space-y-3 sm:space-y-4">
              {benefits.map((benefit, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-3 group"
                >
                  <div className="h-6 w-6 rounded-full bg-primary/8 flex items-center justify-center shrink-0 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-foreground/70 group-hover:text-foreground transition-colors duration-300">
                    {benefit}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right column - Stats Grid */}
          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 25, filter: "blur(6px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: 0.15 + 0.1 * i, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-card border border-border/60 rounded-2xl p-6 sm:p-8 text-center hover:shadow-xl hover:shadow-primary/[0.04] hover:-translate-y-1 transition-all duration-500 group"
                >
                  <div className={`inline-flex p-2.5 rounded-xl ${stat.bg} mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-gradient mb-1.5 sm:mb-2">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-[11px] sm:text-xs md:text-sm font-medium text-muted-foreground">
                    {stat.label}
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
