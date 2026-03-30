"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { SectionHeading } from "@/components/section-heading";
import { MandiChart } from "@/components/dashboard/mandi-chart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Search, TrendingUp, TrendingDown, MapPin, Bell, Sparkles, Navigation2, LineChart, Truck, ShieldCheck, BookOpen, Loader2 } from "lucide-react";

const guideSteps = [
  {
    icon: Search,
    title: "1. Search & Compare",
    desc: "Search your crop to see real-time prices across various connected mandis.",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: LineChart,
    title: "2. Analyze Trends",
    desc: "Use the AI charts to predict if prices will go up or down next week.",
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    icon: Bell,
    title: "3. Set Price Alerts",
    desc: "Set your target price. We'll notify you when the market hits your goal.",
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    icon: Truck,
    title: "4. Sell & Transport",
    desc: "Lock the price and instantly book logistics directly to the buyer.",
    color: "bg-emerald-500/10 text-emerald-500",
  },
];

const getMockImage = (commodity: string) => {
  const images = [
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=100&h=100",
    "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=100&h=100",
    "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=100&h=100",
    "https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&q=80&w=100&h=100",
    "https://images.unsplash.com/photo-1463124564560-ef021c3226a2?auto=format&fit=crop&q=80&w=100&h=100",
  ];
  return images[commodity.length % images.length];
};

interface MandiItem {
  crop: string;
  market: string;
  price: string;
  trend: string;
  up: boolean;
  distance: string;
  live: boolean;
  image: string;
}

export default function MandiPricesPage() {
  const [mandiData, setMandiData] = useState<MandiItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMandiData = async () => {
      try {
        const res = await fetch('https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001fc422d1b642e49bb7ad4fbbd6a2d7dde&format=json&limit=15');
        const data = await res.json();
        
        if (data && data.records) {
          const mappedData = data.records.map((record: Record<string, string>, index: number) => {
            const isUp = index % 2 === 0;
            const trendVal = (Math.random() * 5 + 1).toFixed(1);
            
            return {
              crop: record.commodity,
              market: `${record.market}, ${record.state}`,
              price: `₹${record.modal_price}`,
              trend: `${isUp ? '+' : '-'}${trendVal}%`,
              up: isUp,
              distance: `${Math.floor(Math.random() * 800) + 10} km`,
              live: index < 3,
              image: getMockImage(record.commodity),
            };
          });
          setMandiData(mappedData);
        }
      } catch (error) {
        console.error("Failed to fetch mandi data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMandiData();
  }, []);

  return (
    <div className="container px-4 md:px-6 py-12 md:py-16 mx-auto min-h-screen relative">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />

      <SectionHeading
        title="Live Mandi Prices"
        subtitle="Real-time market rates & AI-driven price predictions across all major mandis."
        alignment="left"
      />

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 mt-10 relative z-10">
        {/* Left Column: Data & Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="lg:col-span-2 space-y-6"
        >
          {/* AI Banner */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-5 shadow-inner relative overflow-hidden flex items-center gap-4">
            <div className="absolute -left-10 w-32 h-32 bg-primary/20 blur-[40px] rounded-full" />
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30 relative z-10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div className="relative z-10">
              <h3 className="text-sm font-bold text-foreground">AI Market Insight: Sell Wheat Now</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Data predicts Wheat prices will drop by 3% in Delhi NCR regions next week due to unexpected rain.
              </p>
            </div>
            <Button size="sm" className="ml-auto shrink-0 relative z-10 rounded-xl shadow-lg shadow-primary/20">
              View Report
            </Button>
          </div>

          {/* Search Controls */}
          <div className="flex gap-3">
            <div className="relative flex-1 group">
              <div className="absolute inset-0 bg-primary/5 blur-md rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
              <Input 
                placeholder="Search crop, state, or mandi name..." 
                className="pl-12 h-14 rounded-2xl bg-card/60 backdrop-blur-xl border-border/50 text-base shadow-sm relative z-10 focus-visible:ring-primary/50" 
              />
            </div>
            <Button className="h-14 rounded-2xl px-8 shadow-lg shadow-primary/20 font-bold bg-primary hover:bg-primary/90 text-primary-foreground">
              Find Best Price
            </Button>
          </div>

          {/* Glassmorphic Table */}
          <div className="bg-card/60 backdrop-blur-2xl rounded-3xl border border-border/50 shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            
            <div className="overflow-x-auto relative z-10">
              <table className="w-full text-left">
                <thead className="text-[11px] text-muted-foreground/80 uppercase tracking-widest bg-muted/30 border-b border-border/50">
                  <tr>
                    <th className="px-6 py-5 font-bold">Crop & Mandi</th>
                    <th className="px-6 py-5 font-bold">Live Price / Qtl</th>
                    <th className="px-6 py-5 font-bold">Market Trend</th>
                    <th className="px-6 py-5 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          <p className="text-sm font-medium">Connecting to Data.gov.in APMC Database...</p>
                        </div>
                      </td>
                    </tr>
                  ) : mandiData.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                        No market data available right now.
                      </td>
                    </tr>
                  ) : (
                    mandiData.map((item, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
                        className="hover:bg-muted/40 transition-colors duration-300 group"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="relative h-12 w-12 rounded-full overflow-hidden border border-border/50 shadow-sm shrink-0">
                              <Image src={item.image} alt={item.crop} fill className="object-cover" sizes="48px" unoptimized />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <div className="font-bold text-sm text-foreground capitalize">{item.crop.toLowerCase()}</div>
                                <div className={`h-1.5 w-1.5 rounded-full shadow-sm ${item.live ? 'bg-emerald-500 shadow-emerald-500/50 animate-pulse' : 'bg-muted-foreground/50'}`} />
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground capitalize">
                                <MapPin className="h-3 w-3" /> {item.market.toLowerCase()} <span className="opacity-50">({item.distance})</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                            {item.price}
                          </div>
                          {item.live && <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Live Deal</span>}
                        </td>
                        <td className="px-6 py-5">
                          <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg border ${
                            item.up 
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                              : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                          }`}>
                            {item.up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                            {item.trend}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <Button size="sm" className="rounded-xl font-bold shadow-md opacity-90 group-hover:opacity-100 transition-opacity">
                            Sell Now
                          </Button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Table Footer */}
            <div className="px-6 py-4 bg-muted/20 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Government Verified Mandis</span>
              <Button variant="link" size="sm" className="text-primary p-0 h-auto font-bold">View All 150+ Markets &rarr;</Button>
            </div>
          </div>

          {/* Market Intelligence Section */}
          <div className="grid sm:grid-cols-2 gap-6 pt-2">
            {/* High Demand Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-card/60 backdrop-blur-2xl border border-border/50 rounded-3xl p-6 shadow-xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-blue-500/20 transition-colors duration-500" />
              <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="font-bold text-base flex items-center gap-2 text-foreground">
                  <Navigation2 className="h-5 w-5 text-blue-500" />
                  High Demand Zones
                </h3>
                <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded-md uppercase tracking-wider">Live</span>
              </div>
              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                      <span className="font-bold text-blue-500 text-xs">MH</span>
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Maharashtra</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">+12% Cotton Demand</p>
                    </div>
                  </div>
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
                      <span className="font-bold text-orange-500 text-xs">UP</span>
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Uttar Pradesh</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">+8% Sugarcane Demand</p>
                    </div>
                  </div>
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                      <span className="font-bold text-purple-500 text-xs">MP</span>
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Madhya Pradesh</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">+15% Soyabean Demand</p>
                    </div>
                  </div>
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                </div>
              </div>
              <Button variant="ghost" className="w-full mt-6 text-xs font-bold text-blue-500 hover:text-blue-600 hover:bg-blue-500/10 relative z-10">
                View Full Heatmap &rarr;
              </Button>
            </motion.div>

            {/* Smart Logistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-card/60 backdrop-blur-2xl border border-border/50 rounded-3xl p-6 shadow-xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-emerald-500/20 transition-colors duration-500" />
              <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="font-bold text-base flex items-center gap-2 text-foreground">
                  <Truck className="h-5 w-5 text-emerald-500" />
                  Available Transport
                </h3>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md uppercase tracking-wider">Nearby</span>
              </div>
              <div className="space-y-4 relative z-10">
                <div className="p-3 rounded-2xl bg-muted/40 border border-border/50 hover:border-emerald-500/30 transition-colors cursor-pointer group/item">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-sm text-foreground flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      Ashok Leyland 14-W
                    </p>
                    <span className="text-xs font-bold text-emerald-500 group-hover/item:bg-emerald-500 group-hover/item:text-white px-2 py-0.5 rounded-full transition-colors">₹40/km</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                    <MapPin className="h-3 w-3" />
                    <span>2.4 km away</span> &bull; <span>Available Now</span>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-muted/40 border border-border/50 hover:border-emerald-500/30 transition-colors cursor-pointer group/item">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-sm text-foreground flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500/50" />
                      Tata Ace Mini
                    </p>
                    <span className="text-xs font-bold text-emerald-500 group-hover/item:bg-emerald-500 group-hover/item:text-white px-2 py-0.5 rounded-full transition-colors">₹18/km</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                    <MapPin className="h-3 w-3" />
                    <span>5.1 km away</span> &bull; <span>In 2 hours</span>
                  </div>
                </div>
              </div>
              <Button className="w-full mt-4 rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground relative z-10 shadow-lg shadow-primary/20">
                Book Transport Now
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Column: Chart, Alerts & Guide */}
        <div className="lg:col-span-1 space-y-6">
          <div className="sticky top-24 space-y-6">
            
            {/* Chart Wrap */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <MandiChart />
            </motion.div>

            {/* Price Alert Glass Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-amber-500/5 backdrop-blur-md border border-amber-500/20 rounded-3xl p-6 shadow-lg shadow-amber-500/5 relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/10 rounded-full blur-[20px]" />
              <div className="flex items-center gap-3 mb-3 relative z-10">
                <div className="h-10 w-10 bg-amber-500/20 rounded-xl flex items-center justify-center border border-amber-500/30">
                  <Bell className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Active Price Alert</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Target Locked</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-5 relative z-10">
                We will notify you instantly when <strong className="text-foreground">Wheat (Lokwan)</strong> crosses <strong className="text-emerald-500">₹2,400</strong> per quintal in Delhi NCR.
              </p>
              <Button className="w-full rounded-xl font-bold bg-background/50 hover:bg-background border-amber-500/30 text-amber-600 dark:text-amber-500 relative z-10" variant="outline">
                Edit Alert
              </Button>
            </motion.div>

            {/* How-to Guide */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8"
            >
              <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                How to Sell Smart
              </h3>
              
              <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                {guideSteps.map((step, index) => (
                  <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mb-6">
                    {/* Timeline Dot */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border/50 bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative">
                      <div className="h-2 w-2 rounded-full bg-primary ring-4 ring-primary/20" />
                    </div>
                    {/* Content Card */}
                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md shadow-sm transition-all hover:bg-card/80 hover:border-primary/30 hover:shadow-primary/5">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${step.color}`}>
                          <step.icon className="h-4 w-4" />
                        </div>
                        <h4 className="font-bold text-sm text-foreground">{step.title}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
