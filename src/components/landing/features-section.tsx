"use client";

import { motion, Variants } from "framer-motion";
import {
  Search, Droplets, FlaskConical, TrendingUp, MapPin, Landmark,
  ArrowUpRight, Bot, ShoppingBag, CloudSun, TestTubes, Tractor, Shield,
} from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import Link from "next/link";

const features = [
  {
    title: "AI Crop Analysis",
    description: "Upload crop photos to instantly identify diseases and get precise treatment recommendations powered by deep learning.",
    icon: Search,
    color: "text-blue-500",
    bg: "from-blue-500/10 to-blue-500/5",
    glow: "group-hover:shadow-blue-500/10",
    href: "/crop-analysis",
  },
  {
    title: "Smart Irrigation",
    description: "Automate watering based on live soil moisture, weather forecasts, and crop water requirements in real-time.",
    icon: Droplets,
    color: "text-cyan-500",
    bg: "from-cyan-500/10 to-cyan-500/5",
    glow: "group-hover:shadow-cyan-500/10",
    href: "/irrigation",
  },
  {
    title: "Fertilizer Recommendation",
    description: "Get AI-powered NPK & micro-nutrient recommendations tailored to your soil type, crop stage, and deficiency patterns.",
    icon: FlaskConical,
    color: "text-violet-500",
    bg: "from-violet-500/10 to-violet-500/5",
    glow: "group-hover:shadow-violet-500/10",
    href: "/dashboard",
  },
  {
    title: "Live Mandi Prices",
    description: "Track real-time market prices across mandis nationwide. Get alerts & sell produce at the highest profit margin.",
    icon: TrendingUp,
    color: "text-emerald-500",
    bg: "from-emerald-500/10 to-emerald-500/5",
    glow: "group-hover:shadow-emerald-500/10",
    href: "/mandi-prices",
  },
  {
    title: "Warehouse Finder",
    description: "Locate nearby cold storage with available capacity, real-time pricing, and booking information instantly.",
    icon: MapPin,
    color: "text-orange-500",
    bg: "from-orange-500/10 to-orange-500/5",
    glow: "group-hover:shadow-orange-500/10",
    href: "/warehouse",
  },
  {
    title: "Government Schemes",
    description: "Discover and apply for PM Kisan, subsidies, insurance programs, and more — AI matches you to eligible schemes.",
    icon: Landmark,
    color: "text-amber-500",
    bg: "from-amber-500/10 to-amber-500/5",
    glow: "group-hover:shadow-amber-500/10",
    href: "/schemes",
  },
  {
    title: "AI Assistant",
    description: "Chat with our multilingual AI assistant for instant farming advice, pest solutions, and crop recommendations.",
    icon: Bot,
    color: "text-pink-500",
    bg: "from-pink-500/10 to-pink-500/5",
    glow: "group-hover:shadow-pink-500/10",
    href: "/ai-assistant",
  },
  {
    title: "Annadata Market",
    description: "Buy & sell agricultural produce, seeds, fertilizers, and equipment directly — no middlemen, best prices guaranteed.",
    icon: ShoppingBag,
    color: "text-teal-500",
    bg: "from-teal-500/10 to-teal-500/5",
    glow: "group-hover:shadow-teal-500/10",
    href: "/market",
  },
  {
    title: "Weather Forecast",
    description: "Hyper-local 7-day weather predictions with rainfall alerts, frost warnings, and sowing/harvesting advisories.",
    icon: CloudSun,
    color: "text-sky-500",
    bg: "from-sky-500/10 to-sky-500/5",
    glow: "group-hover:shadow-sky-500/10",
    href: "/dashboard",
  },
  {
    title: "Soil Testing",
    description: "Get detailed soil health reports — pH, organic carbon, NPK levels — with actionable improvement recommendations.",
    icon: TestTubes,
    color: "text-lime-600",
    bg: "from-lime-600/10 to-lime-600/5",
    glow: "group-hover:shadow-lime-600/10",
    href: "/dashboard",
  },
  {
    title: "Farm Equipment",
    description: "Rent or buy tractors, drones, harvesters, and other modern farming equipment at the best rates near you.",
    icon: Tractor,
    color: "text-yellow-600",
    bg: "from-yellow-600/10 to-yellow-600/5",
    glow: "group-hover:shadow-yellow-600/10",
    href: "/market",
  },
  {
    title: "Crop Insurance",
    description: "Compare and enroll in PMFBY & private crop insurance plans. Get claim assistance and instant payout tracking.",
    icon: Shield,
    color: "text-rose-500",
    bg: "from-rose-500/10 to-rose-500/5",
    glow: "group-hover:shadow-rose-500/10",
    href: "/schemes",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 25, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-28 md:py-36 relative">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-primary/[0.025] rounded-full blur-[150px] pointer-events-none" />

      <div className="container px-4 sm:px-6 mx-auto relative">
        <SectionHeading
          badge="Core Features"
          title="Everything you need to grow smarter."
          subtitle="A comprehensive ecosystem of tools designed to modernize Indian agriculture from seed to market."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={index} variants={itemVariants}>
                <Link href={feature.href} className="block h-full">
                  <div
                    className={`group relative h-full rounded-2xl p-5 sm:p-6 transition-all duration-500 cursor-pointer overflow-hidden border border-border/50 bg-card/40 hover:bg-card hover:border-border/80 hover:shadow-xl ${feature.glow}`}
                  >
                    {/* Subtle gradient spot on hover */}
                    <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${feature.bg} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-5">
                        <div
                          className={`h-11 w-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${feature.bg} transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg`}
                        >
                          <Icon className={`h-5 w-5 ${feature.color} transition-transform duration-500 group-hover:scale-110`} />
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground/0 group-hover:text-muted-foreground transition-all duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold mb-2 group-hover:text-foreground transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed group-hover:text-muted-foreground/80 transition-colors duration-300">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
