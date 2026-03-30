"use client";

import { motion } from "framer-motion";
import { ArrowRight, Phone, Sparkles, Globe, Smartphone, Monitor } from "lucide-react";
import Link from "next/link";

const platforms = [
  { icon: Globe, name: "Web App", desc: "Access from any browser" },
  { icon: Smartphone, name: "Mobile App", desc: "iOS & Android" },
  { icon: Monitor, name: "Desktop", desc: "Windows & Mac" },
];

export function CTASection() {
  return (
    <section className="py-20 sm:py-28 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-900 z-0" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1592982537447-6f23f5c9ec64?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-[0.07] mix-blend-overlay z-0" />

      {/* Noise texture */}
      <div
        className="absolute inset-0 z-[1] opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Ambient glow orbs */}
      <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-white/[0.04] rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-emerald-300/[0.05] rounded-full blur-[90px]" />
      </div>

      <div className="container px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 25, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.1] text-white/80 text-xs sm:text-sm font-medium mb-6 backdrop-blur-xl">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              Available Everywhere
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-5 leading-[1.1] tracking-tight">
              Start your smart farming
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-green-200 to-lime-200">
                journey today
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-sm sm:text-base md:text-lg text-white/60 max-w-xl mx-auto leading-relaxed font-light mb-10 sm:mb-12"
          >
            Join 50,000+ farmers already using Annadata to grow smarter, earn more, and build a sustainable future.
          </motion.p>

          {/* Platform badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-12"
          >
            {platforms.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-2.5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] rounded-xl px-4 py-2.5 sm:px-5 sm:py-3 backdrop-blur-md transition-all duration-400"
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300" />
                  <div className="text-left">
                    <p className="text-white text-xs sm:text-sm font-semibold leading-tight">{p.name}</p>
                    <p className="text-white/50 text-[10px] sm:text-xs leading-tight">{p.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4"
          >
            <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
              <Link
                href="/dashboard"
                className="group inline-flex items-center justify-center gap-2.5 w-full sm:w-auto bg-white text-emerald-800 px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-sm sm:text-base shadow-xl shadow-black/15 hover:shadow-2xl transition-all duration-400"
              >
                Join Annadata Free
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-300" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
              <a
                href="tel:1800123FARM"
                className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-sm sm:text-base border border-white/[0.15] text-white hover:bg-white/[0.08] transition-all duration-400 backdrop-blur-sm"
              >
                <Phone className="h-4 w-4" />
                Speak to an Expert
              </a>
            </motion.div>
          </motion.div>

          {/* Trust line */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-white/30 text-[10px] sm:text-xs mt-8 sm:mt-10 mb-16"
          >
            No credit card required • Free forever for small farms • Cancel anytime
          </motion.p>
        </div>

        {/* Dashboard Mockup Peeking from Bottom */}
        <motion.div
           initial={{ opacity: 0, y: 150 }}
           whileInView={{ opacity: 1, y: 30 }}
           viewport={{ once: true }}
           transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
           className="relative max-w-5xl mx-auto hidden md:block"
        >
           <div className="relative rounded-t-3xl border-t border-l border-r border-white/20 bg-black/60 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl overflow-hidden ring-1 ring-white/10 pt-4 px-2">
              <div className="absolute top-0 left-0 right-0 h-10 border-b border-white/10 flex items-center px-4 bg-white/[0.02]">
                 <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                 </div>
              </div>
              <div className="h-[400px] w-full rounded-t-2xl border-t border-white/10 overflow-hidden bg-[#121212] flex mt-6">
                 {/* Mini Sidebar */}
                 <div className="w-48 border-r border-white/5 p-4 flex flex-col gap-2">
                    <div className="h-6 w-24 bg-white/10 rounded-md mb-4" />
                    <div className="h-8 w-full bg-emerald-500/20 rounded-lg border border-emerald-500/20" />
                    <div className="h-8 w-full bg-white/5 rounded-lg" />
                    <div className="h-8 w-full bg-white/5 rounded-lg" />
                 </div>
                 {/* Mini Content Grid */}
                 <div className="flex-1 p-6 flex flex-col gap-4">
                    <div className="flex justify-between items-end">
                       <div>
                          <div className="h-6 w-32 bg-white/20 rounded-md mb-2" />
                          <div className="h-4 w-48 bg-white/10 rounded-md" />
                       </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mt-2">
                       {[...Array(4)].map((_, i) => (
                          <div key={i} className="h-28 bg-white/5 rounded-xl border border-white/5 p-4 flex flex-col justify-end">
                             <div className="h-8 w-16 bg-white/20 rounded-lg mb-2" />
                             <div className="h-3 w-24 bg-white/10 rounded-md" />
                          </div>
                       ))}
                    </div>
                    <div className="flex-1 bg-white/5 rounded-xl border border-white/5 mt-2" />
                 </div>
              </div>
           </div>
        </motion.div>
      </div>
    </section>
  );
}
