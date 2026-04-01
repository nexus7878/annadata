"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { SectionHeading } from "@/components/section-heading";
import { Landmark, Sun, Tractor, ShieldCheck, ArrowRight, CheckCircle2, FileText, Globe, Search, Filter, ExternalLink, IndianRupee, HandCoins, Sprout } from "lucide-react";
import Image from "next/image";

/* ─── Schemes Data ─── */
const schemes = [
  {
    id: "pm-kisan",
    title: "PM-KISAN Samman Nidhi",
    desc: "Income support of ₹6,000/year in three equal installments to all landholding farmer families.",
    icon: Landmark, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20",
    eligibility: ["Must own cultivable land", "Valid Aadhaar Card", "Bank Account linked to Aadhaar"],
    url: "https://pmkisan.gov.in/",
    category: "Financial Support",
    tags: ["Direct Benefit Transfer", "All Farmers"],
  },
  {
    id: "pm-kusum",
    title: "PM KUSUM (Solar Pumps)",
    desc: "Subsidy of up to 60% for standalone solar agriculture pumps to reduce diesel & grid reliance.",
    icon: Sun, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20",
    eligibility: ["Individual farmer or group", "Water source available", "Micro irrigation system preferred"],
    url: "https://pmkusum.mnre.gov.in/",
    category: "Infrastructure",
    tags: ["Solar Energy", "Subsidy"],
  },
  {
    id: "pmfby",
    title: "PM Fasal Bima Yojana",
    desc: "Comprehensive crop insurance from pre-sowing to post-harvest losses against natural risks.",
    icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20",
    eligibility: ["All farmers growing notified crops", "Sharecroppers and tenant farmers included"],
    url: "https://pmfby.gov.in/",
    category: "Insurance",
    tags: ["Crop Protection", "Risk Cover"],
  },
  {
    id: "smam",
    title: "Agricultural Mechanization",
    desc: "Financial assistance (SMAM) for purchasing tractors, power tillers, and specialized machinery.",
    icon: Tractor, color: "text-violet-500", bg: "bg-violet-500/10", border: "border-violet-500/20",
    eligibility: ["Small and marginal farmers", "Women, SC/ST farmers get higher subsidy"],
    url: "https://agrimachinery.nic.in/",
    category: "Infrastructure",
    tags: ["Machinery", "Grant"],
  },
  {
    id: "kcc",
    title: "Kisan Credit Card (KCC)",
    desc: "Provides farmers with timely access to adequate credit for agricultural and allied activities.",
    icon: HandCoins, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20",
    eligibility: ["Individual/Joint borrowers who are owner-cultivators", "Tenant farmers, oral lessees", "SHGs or Joint Liability Groups"],
    url: "https://www.myscheme.gov.in/schemes/kcc",
    category: "Credit",
    tags: ["Low Interest Loan", "Working Capital"],
  },
  {
    id: "pkvy",
    title: "Paramparagat Krishi Vikas Yojana",
    desc: "Promotes organic farming through a cluster approach with financial assistance of ₹50,000 per hectare.",
    icon: Sprout, color: "text-green-600", bg: "bg-green-600/10", border: "border-green-600/20",
    eligibility: ["Farmers forming a cluster of 20 hectares", "Willingness to adopt organic practices"],
    url: "https://pgsindia-ncof.gov.in/pkvy/index.aspx",
    category: "Sustainable Farming",
    tags: ["Organic", "Cluster Approach"],
  }
];

const categories = ["All", "Financial Support", "Infrastructure", "Insurance", "Credit", "Sustainable Farming"];

/* ─── Animation Variants ─── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function SchemesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const filteredSchemes = schemes.filter(s => {
    const matchesCategory = activeCategory === "All" || s.category === activeCategory;
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const checkEligibility = () => {
    setToast("Scanning your farm profile against scheme criteria...");
    setTimeout(() => setToast("Great news! You are highly eligible for PM-KISAN and PMFBY based on your 12.5 Hectare land record."), 2500);
    setTimeout(() => setToast(null), 8500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto pb-24 relative min-h-screen">

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%", scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
            exit={{ opacity: 0, y: 50, x: "-50%", scale: 0.9 }}
            className="fixed bottom-8 left-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl font-semibold text-sm backdrop-blur-md border bg-primary text-primary-foreground border-primary/50"
          >
            <CheckCircle2 className="w-5 h-5 animate-pulse" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold font-heading tracking-tight text-foreground flex items-center justify-center gap-3">
          <Landmark className="w-8 h-8 text-primary" /> Government Schemes
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-3 leading-relaxed">
          Discover, check eligibility, and apply directly to agricultural subsidies and financial assistance programs established by the Government of India.
        </p>
      </motion.div>

      {/* ────────────────────────────── HERO / AI ELIGIBILITY CTA ────────────────────────────── */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-12">
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-card border border-primary/20 rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="absolute right-0 top-0 w-64 h-64 bg-primary/20 blur-[100px] pointer-events-none" />
          
          <div className="max-w-xl relative pl-2">
            <div className="absolute left-0 top-1 bottom-1 w-1 bg-primary rounded-full" />
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 font-heading">AI Eligibility Matcher</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Stop guessing if you qualify. Let our Annadata AI scan your land records, historical crop data, and farmer profile to instantly highlight the grants and subsidies you are eligible for today.
            </p>
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(var(--primary), 0.3)" }}
              whileTap={{ scale: 0.98 }}
              onClick={checkEligibility}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 transition-all"
            >
              <Search className="w-4 h-4" /> Run Eligibility Scan
            </motion.button>
          </div>
          
          <div className="shrink-0 relative hidden sm:block">
            <div className="w-40 h-40 bg-gradient-to-tr from-primary/20 to-emerald-500/20 rounded-2xl border flex items-center justify-center rotate-3 shadow-lg backdrop-blur-sm border-white/10">
              <FileText className="w-20 h-20 text-primary drop-shadow-md" />
            </div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-emerald-500/20 backdrop-blur-md rounded-xl border border-emerald-500/30 flex items-center justify-center -rotate-6 shadow-sm">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
          </div>
        </div>
      </motion.div>


      {/* ────────────────────────────── FILTERS & SEARCH ────────────────────────────── */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar mask-edges">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 border ${
                activeCategory === cat 
                  ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20" 
                  : "bg-card/50 text-muted-foreground border-border/50 hover:bg-muted hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search schemes, e.g. 'Solar'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 bg-card/50 border border-border/60 rounded-xl pl-10 pr-4 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all backdrop-blur-md"
          />
        </div>
      </motion.div>


      {/* ────────────────────────────── SCHEMES GRID ────────────────────────────── */}
      <motion.div 
        variants={stagger} 
        initial="hidden" 
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredSchemes.length > 0 ? filteredSchemes.map((scheme) => {
            const Icon = scheme.icon;
            return (
              <motion.div
                key={scheme.id}
                layout
                initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
                className="group bg-card/80 backdrop-blur-xl border border-border/50 hover:border-border rounded-3xl overflow-hidden flex flex-col shadow-sm hover:shadow-xl transition-all duration-500"
              >
                {/* Card Header & Content */}
                <div className="p-6 sm:p-7 flex-1">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className={`p-3.5 rounded-2xl ${scheme.bg} border ${scheme.border} group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 shadow-sm`}>
                      <Icon className={`w-6 h-6 ${scheme.color}`} />
                    </div>
                    {/* Tags */}
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-muted rounded-md text-foreground border border-border/50">
                        {scheme.category}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold font-heading text-foreground mb-2 group-hover:text-primary transition-colors">{scheme.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 h-[4.5rem]">
                    {scheme.desc}
                  </p>

                  {/* Eligibility List */}
                  <div className="pt-5 border-t border-border/40">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <Filter className="w-3.5 h-3.5" /> Eligibility Criteria
                    </p>
                    <ul className="space-y-2.5">
                      {scheme.eligibility.map((req, j) => (
                        <li key={j} className="flex items-start gap-2.5 text-sm text-foreground/80">
                          <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${scheme.color}`} />
                          <span className="leading-snug">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Footer with REAL External Link */}
                <div className="p-4 sm:p-5 mt-auto border-t border-border/30 bg-muted/10 group-hover:bg-primary/[0.02] transition-colors">
                  <a 
                    href={scheme.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold bg-muted/50 hover:bg-primary hover:text-primary-foreground border border-border/60 hover:border-primary hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 group/btn"
                  >
                    Apply on Gov Portal 
                    <ExternalLink className="w-4 h-4 group-hover/btn:rotate-12 group-hover/btn:scale-110 transition-transform" />
                  </a>
                </div>
              </motion.div>
            );
          }) : (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="col-span-full py-20 text-center flex flex-col items-center justify-center opacity-60"
            >
              <Search className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-bold">No schemes found</h3>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your search query or category filter.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

    </div>
  );
}
