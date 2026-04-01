"use client";

import { motion } from "framer-motion";
import { ArrowRight, Phone, Sparkles, Globe, Smartphone, Monitor } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "@/hooks/use-mock-auth";

const platforms = [
  { icon: Globe, name: "Web App", desc: "Access from any browser" },
  { icon: Smartphone, name: "Mobile App", desc: "iOS & Android" },
  { icon: Monitor, name: "Desktop", desc: "Windows & Mac" },
];

export function CTASection() {
  const { data: session } = useSession();

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
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
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
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base md:text-lg text-white/60 max-w-xl mx-auto leading-relaxed font-light mb-10 sm:mb-12"
          >
            Join 50,000+ farmers already using Annadata to grow smarter, earn more, and build a sustainable future.
          </motion.p>

          {/* Platform badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
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
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-4"
          >
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Link
                href={session ? "/dashboard" : "/login"}
                className="group inline-flex items-center justify-center gap-2.5 w-full sm:w-auto bg-white text-emerald-900 px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-sm sm:text-base shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)] hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.6)] border border-white/20 transition-all duration-400"
              >
                Join Annadata Free
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <button
                className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-sm sm:text-base border border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-400 backdrop-blur-2xl shadow-xl shadow-black/20"
              >
                <Phone className="h-4 w-4" />
                Speak to an Expert
              </button>
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

        {/* Device Mockups Peeking from Bottom */}
        <motion.div
           initial={{ opacity: 0, y: 150 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
           className="relative max-w-6xl mx-auto mt-12 sm:mt-16 hidden md:flex items-end justify-center h-[320px] lg:h-[400px] overflow-hidden pb-0"
        >
          {/* Mockup 1: Android (Left) - Mandi Prices */}
          <div className="absolute left-[6%] lg:left-[12%] bottom-[-60px] lg:bottom-[-80px] w-44 lg:w-48 h-[380px] lg:h-[420px] bg-[#1a1a1a] rounded-[2.5rem] border-[5px] border-[#2c2c2c] shadow-2xl z-30 transform -rotate-[10deg] translate-y-12 transition-all duration-500 hover:-translate-y-8 hover:-rotate-[2deg] hover:scale-105 group hover:z-50 cursor-pointer">
            <div className="absolute top-0 w-full h-full bg-[#f8fafc] rounded-[2rem] overflow-hidden flex flex-col p-4 ring-1 ring-black/5 inset-0 m-1">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-[#2c2c2c] rounded-full z-10" />
              
              {/* Header */}
              <div className="mt-5 flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                <h3 className="text-emerald-950 font-bold text-xs lg:text-sm tracking-tight flex items-center gap-1.5">
                  <Image src="/symbollogo.png" alt="Logo" width={16} height={16} className="w-4 h-4" />
                  Live Mandi
                </h3>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              
              {/* Price Tickers */}
              <div className="flex flex-col gap-2.5">
                {[
                  { crop: "Wheat", price: "₹2,250", trend: "+2.4%", up: true },
                  { crop: "Rice", price: "₹3,420", trend: "+1.2%", up: true },
                  { crop: "Maize", price: "₹1,850", trend: "-0.5%", up: false },
                  { crop: "Cotton", price: "₹5,800", trend: "+0.8%", up: true },
                ].map((item, i) => (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0, x: -10 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ duration: 0.5, delay: i * 0.15, ease: "easeOut" }}
                     className="bg-white p-2.5 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 flex justify-between items-center group-hover:border-emerald-100 transition-colors"
                   >
                     <div>
                       <div className="text-[11px] lg:text-xs font-bold text-slate-800">{item.crop}</div>
                       <div className="text-[8px] lg:text-[9px] text-slate-500 mt-0.5">Avg. Market Price</div>
                     </div>
                     <div className="text-right">
                       <div className="text-[11px] lg:text-xs font-bold text-slate-900">{item.price}</div>
                       <div className={`text-[9px] font-bold mt-0.5 flex justify-end ${item.up ? 'text-emerald-500' : 'text-red-500'}`}>
                         {item.trend}
                       </div>
                     </div>
                   </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Mockup 2: Laptop (Center) - Overview */}
          <div className="relative z-20 bottom-[-40px] lg:bottom-[-50px] w-[500px] lg:w-[650px] h-[300px] lg:h-[380px] bg-[#2a2a2a] rounded-t-2xl border-t-[8px] border-x-[8px] border-[#1f1f1f] shadow-[0_-30px_100px_rgba(0,0,0,0.8)] flex flex-col pt-4 transition-all duration-500 hover:-translate-y-6 hover:scale-[1.02] group hover:z-50 cursor-pointer">
            <div className="absolute top-0 left-0 right-0 h-4 bg-[#1f1f1f] flex justify-center items-center rounded-t-xl">
               <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
            </div>
            <div className="flex-1 bg-[#f8fafc] rounded-t-md overflow-hidden flex relative ring-1 ring-black/5 w-full">
               {/* Sidebar */}
               <div className="w-20 lg:w-32 bg-white border-r border-slate-200 p-3 flex flex-col gap-2.5 z-10">
                  <div className="flex items-center gap-1.5 mb-2">
                     <Image src="/symbollogo.png" alt="Logo" width={24} height={24} className="w-5 h-5 lg:w-6 lg:h-6" />
                     <div className="h-2.5 lg:h-3 w-full bg-slate-200 rounded-sm" />
                  </div>
                  <div className="h-6 w-full bg-emerald-100 rounded-md border border-emerald-200" />
                  <div className="h-6 w-full bg-slate-100 rounded-md" />
                  <div className="h-6 w-full bg-slate-100 rounded-md" />
                  <div className="h-6 w-full bg-slate-100 rounded-md" />
               </div>
               
               {/* Content */}
               <div className="flex-1 p-4 lg:p-6 flex flex-col gap-4">
                  {/* Top nav */}
                  <div className="flex justify-between items-center">
                      <div>
                         <div className="h-3.5 w-24 bg-slate-300 rounded-sm mb-1.5" />
                         <div className="h-2 w-32 bg-slate-200 rounded-sm" />
                      </div>
                      <div className="flex gap-2">
                         <div className="h-6 w-6 lg:h-8 lg:w-8 bg-white shadow-sm border border-slate-200 rounded-full" />
                      </div>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3 lg:gap-4">
                     {[...Array(3)].map((_, i) => (
                       <motion.div 
                          key={i} 
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                          className="bg-white rounded-xl shadow-sm border border-slate-100 p-3 flex flex-col"
                       >
                          <div className="h-6 w-6 bg-emerald-50 rounded-md border border-emerald-100 mb-2.5" />
                          <div className="h-3 w-16 bg-slate-800 rounded-sm mb-1.5" />
                          <div className="h-2 w-20 bg-slate-300 rounded-sm" />
                       </motion.div>
                     ))}
                  </div>
                  
                  {/* Chart Area */}
                  <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 p-4 mt-1 flex items-end gap-2 overflow-hidden relative group-hover:border-emerald-100 transition-colors">
                      <div className="absolute top-4 left-4 h-3 w-32 bg-slate-200 rounded-sm" />
                      {[30, 65, 45, 80, 55, 95, 75, 40].map((h, i) => (
                         <motion.div 
                            key={i} 
                            initial={{ scaleY: 0 }}
                            whileInView={{ scaleY: h / 100 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, delay: i * 0.1, ease: "easeOut" }}
                            className="flex-1 bg-emerald-400 rounded-t-sm opacity-80 group-hover:opacity-100 group-hover:bg-emerald-500 transition-colors origin-bottom"
                         />
                      ))}
                  </div>
               </div>
            </div>
          </div>

          {/* Mockup 3: iPhone (Right) - AI Assistant */}
          <div className="absolute right-[6%] lg:right-[12%] bottom-[-60px] lg:bottom-[-80px] w-48 lg:w-52 h-[400px] lg:h-[440px] bg-[#1a1a1a] rounded-[3rem] border-[6px] border-[#2c2c2c] shadow-[30px_0_60px_rgba(0,0,0,0.6)] z-30 transform rotate-[10deg] translate-y-8 transition-all duration-500 hover:-translate-y-8 hover:rotate-[2deg] hover:scale-105 group hover:z-50 cursor-pointer">
            <div className="absolute top-0 w-full h-full bg-[#f8fafc] rounded-[2.5rem] overflow-hidden flex flex-col p-4 ring-1 ring-black/5 inset-0 m-1.5 pt-7 lg:pt-8">
              {/* iPhone Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 lg:w-28 h-6 bg-[#2c2c2c] rounded-b-[1rem] z-20" />
              
              {/* Header */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-3 mt-1">
                 <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Image src="/symbollogo.png" alt="AI" width={16} height={16} className="w-3.5 h-3.5" />
                 </div>
                 <h3 className="text-emerald-950 font-bold text-xs lg:text-sm tracking-tight">Kisan AI</h3>
              </div>

              {/* Chat Area */}
              <div className="flex flex-col gap-3 flex-1 overflow-hidden">
                 {/* User Msg */}
                 <motion.div 
                    initial={{ opacity: 0, scale: 0.9, x: 10 }}
                    whileInView={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="self-end bg-emerald-600 text-white rounded-2xl rounded-tr-sm p-2.5 max-w-[85%] text-[9px] lg:text-[10px] shadow-sm leading-relaxed"
                 >
                    What's the best time to sow wheat this season?
                 </motion.div>
                 
                 {/* Bot Msg */}
                 <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="self-start bg-white text-slate-700 border border-slate-100 rounded-2xl rounded-tl-sm p-3 max-w-[90%] text-[9px] lg:text-[10px] shadow-sm leading-relaxed relative group-hover:border-emerald-200 transition-colors"
                 >
                    Based on current soil moisture (<strong className="text-emerald-600">68%</strong>) and weather forecasts, sowing between <strong className="text-slate-900">Nov 10-15</strong> yields optimal results. 🌾
                 </motion.div>

                 {/* Typing indicator */}
                 <motion.div 
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, delay: 2.2, repeat: Infinity }}
                    className="self-start bg-white border border-slate-100 rounded-full px-3 py-1.5 text-[10px] text-slate-400 shadow-sm mt-auto mb-2 flex items-center gap-1"
                 >
                    <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" />
                    <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce delay-75" />
                    <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce delay-150" />
                 </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
