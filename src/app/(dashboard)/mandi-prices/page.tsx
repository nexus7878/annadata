"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { SectionHeading } from "@/components/section-heading";
import { MandiChart } from "@/components/dashboard/mandi-chart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Search, TrendingUp, TrendingDown, MapPin, Bell, Sparkles, Navigation2, LineChart, Truck, ShieldCheck, BookOpen, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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

const TARGET_CROPS = [
  { name: 'Paddy', baseMarket: 'Karnal Mandi, Haryana', basePrice: 2200, distance: 45 },
  { name: 'Wheat', baseMarket: 'Khanna Mandi, Punjab', basePrice: 2400, distance: 120 },
  { name: 'Onion', baseMarket: 'Lasalgaon, Maharashtra', basePrice: 1800, distance: 340 },
  { name: 'Potato', baseMarket: 'Agra Mandi, UP', basePrice: 1200, distance: 85 },
  { name: 'Green Chilli', baseMarket: 'Guntur, Andhra Pradesh', basePrice: 4500, distance: 450 },
  { name: 'Bottle Gourd', baseMarket: 'Azadpur, Delhi', basePrice: 1500, distance: 25 },
];

const GOV_API_KEY = '579b464db66ec23bdd000001fc422d1b642e49bb7ad4fbbd6a2d7dde';
const UNSPLASH_ACCESS_KEY = '1aZcwiarmEj7Ba3wwaJ5vt73FAUrkGNthH69vOdgFBg';
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&q=80&w=100&h=100";

interface MandiItem {
  id: string;
  crop: string;
  market: string;
  price: string;
  rawPrice: number;
  trend: string;
  up: boolean;
  distance: string;
  live: boolean;
  image: string;
  arrivalDate: string;
}

export default function MandiPricesPage() {
  const [mandiData, setMandiData] = useState<MandiItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Interactive States
  const [isNearMe, setIsNearMe] = useState(false);
  
  // Dialog Actions States
  const [selectedCrop, setSelectedCrop] = useState<MandiItem | null>(null);
  const [sellQuantity, setSellQuantity] = useState("10");
  const [isProcessing, setIsProcessing] = useState(false);
  const [saleSuccess, setSaleSuccess] = useState(false);
  
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isTransportOpen, setIsTransportOpen] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState<string | null>(null);
  
  const [manageAlertOpen, setManageAlertOpen] = useState(false);

  useEffect(() => {
    const fetchGovData = async () => {
      try {
        const fetchCropImage = async (cropName: string) => {
          try {
            const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(cropName + ' harvest crop')}&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1`);
            if (!res.ok) throw new Error('Unsplash API failed');
            const data = await res.json();
            return data.results?.[0]?.urls?.small || FALLBACK_IMAGE;
          } catch (error) {
            console.error(`Error fetching image for ${cropName}:`, error);
            return FALLBACK_IMAGE;
          }
        };

        const fetchCropGovData = async (crop: typeof TARGET_CROPS[0]) => {
          try {
            const res = await fetch(`https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${GOV_API_KEY}&format=json&filters[commodity]=${encodeURIComponent(crop.name)}&limit=1`);
            const json = await res.json();
            if (json?.records && json.records.length > 0) {
              return json.records[0];
            }
            return null; // Force fallback if 0 records
          } catch {
            return null;
          }
        };

        const generateData = async () => {
          const promises = TARGET_CROPS.map(async (crop, index) => {
            const govRecord = await fetchCropGovData(crop);
            const imageUrl = await fetchCropImage(crop.name);
            
            const isUp = index % 2 === 0;
            const trendVal = (Math.random() * 5 + 1).toFixed(1);
            
            // Smart Fallback
            let finalPrice = crop.basePrice + Math.floor(Math.random() * 100 - 50);
            let finalMarket = crop.baseMarket;
            let finalDate = "Live";

            if (govRecord && govRecord.modal_price) {
              finalPrice = Number(govRecord.modal_price);
              finalMarket = `${govRecord.market}, ${govRecord.state}`;
              finalDate = govRecord.arrival_date || "Live";
            }

            return {
              id: `${crop.name}-${index}`,
              crop: crop.name,
              market: finalMarket,
              price: `₹${finalPrice.toLocaleString('en-IN')}`,
              rawPrice: finalPrice,
              trend: `${isUp ? '+' : '-'}${trendVal}%`,
              up: isUp,
              distance: `${crop.distance} km`,
              live: !!govRecord, // Boolean indicator if true live data from gov API
              image: imageUrl,
              arrivalDate: finalDate
            };
          });

          const results = await Promise.all(promises);
          setMandiData(results);
        };

        await generateData();
      } catch (error) {
        console.error("Failed to fetch mandi data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGovData();
  }, []);

  // Filtered computed results
  const filteredData = useMemo(() => {
    let result = mandiData;
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (item) => 
          item.crop.toLowerCase().includes(lowerQuery) || 
          item.market.toLowerCase().includes(lowerQuery)
      );
    }
    
    if (isNearMe) {
      result = [...result].sort((a, b) => parseInt(a.distance) - parseInt(b.distance));
    }
    
    return result;
  }, [searchQuery, mandiData, isNearMe]);

  // Derived Highlight
  const topTrending = mandiData.filter(c => c.up).sort((a,b) => parseFloat(b.trend) - parseFloat(a.trend))[0];

  // Action Handlers
  const handleSimulateSale = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSaleSuccess(true);
      setTimeout(() => {
        setSaleSuccess(false);
        setSelectedCrop(null);
      }, 2000);
    }, 1500);
  };

  const handleBookTransport = () => {
    if (!selectedTransport) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsTransportOpen(false);
      // Optional: use a real Toast here, but we'll adapt depending on libraries available
      alert(`Transport successfully booked! Reference: TR-${Math.floor(Math.random() * 10000)}`);
    }, 1200);
  };

  return (
    <div className="w-full relative overflow-x-clip">
      {/* Background Ambient Glows confined to prevent horizontal scroll shifting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px]" />
      </div>

      <div className="container px-4 md:px-6 py-12 md:py-16 mx-auto min-h-screen relative">
        <SectionHeading
        title="Live Mandi Dashboard"
        subtitle="Real-time market rates directly connected to Govt. Mandi Data APMCs."
        alignment="left"
      />

      <div className="grid xl:grid-cols-3 gap-6 lg:gap-8 mt-10 relative z-10">
        {/* Left Column: Data & Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="xl:col-span-2 space-y-8"
        >
          {/* AI Banner dynamic depending on fetched top trending crop */}
          <div className="bg-gradient-to-r from-primary/15 via-primary/5 to-transparent border border-primary/20 rounded-3xl p-6 shadow-[0_0_40px_-10px_rgba(var(--primary),0.2)] relative overflow-hidden flex flex-col md:flex-row md:items-center gap-5">
            <div className="absolute -left-10 w-32 h-32 bg-primary/30 blur-[40px] rounded-full" />
            
            <div className="h-14 w-14 rounded-2xl bg-primary/20 flex flex-col items-center justify-center shrink-0 border border-primary/30 relative z-10 shadow-inner">
              <Sparkles className="h-6 w-6 text-primary mb-0.5" />
            </div>
            
            <div className="relative z-10 flex-1">
              <h3 className="text-base font-bold text-foreground">
                AI Insight: {topTrending ? `High Demand for ${topTrending.crop}` : "Market is Stabilizing"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                {topTrending 
                  ? `Data predicts ${topTrending.crop} prices could rise another ${topTrending.trend} in ${topTrending.market.split(',')[1] || 'nearby regions'} due to localized supply chain constraints.`
                  : "Algorithms indicate standard volatility across most target regions for the upcoming week."}
              </p>
            </div>
            
            <Dialog open={isAIOpen} onOpenChange={setIsAIOpen}>
              <DialogTrigger asChild>
                <Button className="w-full md:w-auto shrink-0 relative z-10 rounded-xl shadow-lg shadow-primary/20 font-bold px-6">
                  View AI Report
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] border-primary/20 bg-background/95 backdrop-blur-xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-xl font-heading">
                    <Sparkles className="h-5 w-5 text-primary" /> Market Intelligence Report
                  </DialogTitle>
                  <DialogDescription>
                    Predictive analysis generated by Annadata AI for current market conditions.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-6 space-y-6">
                  {topTrending && (
                    <div className="bg-primary/5 p-5 rounded-2xl border border-primary/10">
                      <h4 className="font-bold text-lg mb-2 capitalize">{topTrending.crop} Trend Analysis</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        Based on historical data and current local shortages in <strong className="text-foreground">{topTrending.market}</strong>, algorithms predict a continued upward trend of approximately {topTrending.trend} over the next 4-6 days. Recommendation is to hold inventory if moisture content is optimal, or sell immediately if storage capacity is maxed.
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="bg-background p-3 rounded-xl border border-border">
                           <span className="text-[10px] uppercase text-muted-foreground font-bold">Volatility</span>
                           <p className="font-bold text-orange-500">Medium-High</p>
                         </div>
                         <div className="bg-background p-3 rounded-xl border border-border">
                           <span className="text-[10px] uppercase text-muted-foreground font-bold">Confidence</span>
                           <p className="font-bold text-emerald-500">87%</p>
                         </div>
                      </div>
                    </div>
                  )}
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm">Actionable Advice</h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                       <li className="flex items-start gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0"/> Avoid long distance logistics for perishables this week.</li>
                       <li className="flex items-start gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0"/> Expect slight dip in local wheat prices as harvest influx begins.</li>
                    </ul>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 group">
              <div className="absolute inset-0 bg-primary/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search crop, state, or mandi name..." 
                className="pl-14 h-14 rounded-full bg-card/80 backdrop-blur-sm border-border/50 text-base shadow-sm relative z-10 focus-visible:ring-primary/50 transition-all font-medium" 
              />
            </div>
            <Button 
              onClick={() => setIsNearMe(!isNearMe)}
              className={`h-14 rounded-full px-8 shadow-lg font-bold gap-2 transition-all ${
                isNearMe 
                  ? "bg-primary text-primary-foreground shadow-primary/20" 
                  : "bg-background text-foreground hover:bg-muted border border-border/50 shadow-none border-b-2"
              }`}
            >
              <MapPin className="h-4 w-4" /> {isNearMe ? "Showing Closest" : "Near Me"}
            </Button>
          </div>

          {/* Connected Gov Data Banner */}
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border/50 pb-3">
             <div className="flex items-center gap-2">
               <ShieldCheck className="h-4 w-4 text-emerald-500" />
               Connected to <span className="text-emerald-500">Data.Gov.In</span> APMC Nodes
             </div>
             <div>
                {mandiData.length} Crops Tracked
             </div>
          </div>

          {/* Glassmorphic Grid Layout (Bento-style) */}
          <div className="relative">
            {loading ? (
              <div className="bg-card/30 backdrop-blur-xl border border-border/50 rounded-3xl p-16 flex flex-col items-center justify-center gap-4">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full border-4 border-muted border-t-primary animate-spin" />
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                  </div>
                  <h3 className="font-bold text-lg">Fetching Government Mandi Logs</h3>
                  <p className="text-muted-foreground text-sm">Translating commodity models & aggregating recent live data...</p>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="bg-card/30 backdrop-blur-xl border border-border/50 rounded-3xl p-16 text-center">
                  <Search className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="font-bold text-lg mb-2">No crops found</h3>
                  <p className="text-muted-foreground mb-6">Try adjusting your search criteria ({searchQuery})</p>
                  <Button variant="outline" onClick={() => setSearchQuery("")} className="rounded-xl font-bold">
                    Clear Search
                  </Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-5">
                <AnimatePresence mode="popLayout">
                  {filteredData.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group bg-card/80 backdrop-blur-sm rounded-3xl p-5 border border-border/50 shadow-lg hover:shadow-xl hover:border-primary/40 transition-all overflow-hidden relative flex flex-col will-change-transform"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                      
                      {/* Top Row: Crop Info */}
                      <div className="flex items-start justify-between gap-4 mb-5 relative z-10">
                        <div className="flex gap-3 sm:gap-4 flex-1 min-w-0">
                          <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-2xl overflow-hidden shadow-md shrink-0 ring-1 ring-border group-hover:ring-primary/50 transition-all">
                            <Image src={item.image} alt={item.crop} fill className="object-cover group-hover:scale-110 transition-transform duration-700 will-change-transform" sizes="(max-width: 640px) 56px, 64px" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <h4 className="font-bold text-lg text-foreground capitalize leading-none">{item.crop}</h4>
                              {item.live && (
                                <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  Live
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col gap-1 mt-0.5">
                              <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium" title={item.market}>
                                <MapPin className="h-3 w-3 shrink-0" /> <span className="line-clamp-1">{item.market}</span>
                              </span>
                              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-bold ml-4 pl-0.5">{item.distance}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Middle Row: Price Metrics */}
                      <div className="grid grid-cols-2 gap-3 mb-6 relative z-10 flex-1">
                         <div className="bg-background/50 rounded-2xl p-3 border border-border/50">
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Modal Price</p>
                            <p className="font-bold text-lg sm:text-xl text-foreground truncate">{item.price}</p>
                            <p className="text-[10px] text-muted-foreground mt-1">per Quintal</p>
                         </div>
                         <div className="bg-background/50 rounded-2xl p-3 border border-border/50 flex flex-col justify-between">
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Market Trend</p>
                            <div className={`inline-flex items-center w-fit gap-1.5 text-sm font-bold px-2 py-1 rounded-lg ${
                              item.up 
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                                : 'bg-red-500/10 text-red-600 dark:text-red-400'
                            }`}>
                              {item.up ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                              {item.trend}
                            </div>
                         </div>
                      </div>

                      {/* Bottom Row: Action */}
                      <div className="relative z-10 border-t border-border/50 pt-4 mt-auto flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground font-medium">Updated: {item.arrivalDate}</span>
                        <Dialog open={selectedCrop?.id === item.id} onOpenChange={(open) => !open ? setSelectedCrop(null) : setSelectedCrop(item)}>
                          <DialogTrigger asChild>
                            <Button className="rounded-xl font-bold shadow-md gap-1 sm:gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all text-xs sm:text-sm px-3 sm:px-4">
                              Sell Now <ArrowRight className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle className="capitalize text-2xl font-heading">Sell {item.crop}</DialogTitle>
                              <DialogDescription>
                                Lock in the current mandi rate at {item.market}.
                              </DialogDescription>
                            </DialogHeader>
                            
                            {saleSuccess ? (
                              <div className="py-12 flex flex-col items-center justify-center text-center">
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="h-16 w-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                                  <CheckCircle2 className="h-8 w-8" />
                                </motion.div>
                                <h3 className="text-xl font-bold mb-2">Sale Confirmed!</h3>
                                <p className="text-sm text-muted-foreground">Your commodity has been listed for sale at the locked rate. Buyers will contact you shortly.</p>
                              </div>
                            ) : (
                              <div className="grid gap-6 py-4">
                                <div className="p-4 bg-muted/30 rounded-2xl border border-border/50 flex justify-between items-center">
                                  <div>
                                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Locked Rate</p>
                                    <p className="text-xl font-bold font-heading">{item.price}<span className="text-sm font-normal text-muted-foreground">/qtl</span></p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Total Est.</p>
                                    <p className="text-xl font-bold text-emerald-500 font-heading">₹{(item.rawPrice * Number(sellQuantity || 0)).toLocaleString()}</p>
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <label className="text-sm font-bold text-foreground">Quantity Available (Quintals)</label>
                                    <Input
                                      type="number"
                                      value={sellQuantity}
                                      onChange={(e) => setSellQuantity(e.target.value)}
                                      className="h-12 text-lg font-bold rounded-xl bg-background border-border/60"
                                      min="1"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {!saleSuccess && (
                              <DialogFooter>
                                <Button disabled={isProcessing} onClick={handleSimulateSale} className="w-full h-12 rounded-xl text-md font-bold group">
                                  {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Processing...</> : <>Confirm Listing <Sparkles className="h-4 w-4 ml-2 group-hover:text-amber-300 transition-colors" /></>}
                                </Button>
                              </DialogFooter>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
          

          {/* Market Intelligence Section */}
          <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t border-border/30">
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
                    <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30 shadow-inner">
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
                    <div className="h-8 w-8 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30 shadow-inner">
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
                    <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30 shadow-inner">
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
              <Button variant="ghost" className="w-full mt-6 text-xs font-bold text-blue-500 hover:text-blue-600 hover:bg-blue-500/10 relative z-10 rounded-xl">
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
                <div 
                  onClick={() => setSelectedTransport('ashok')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer group/item ${
                    selectedTransport === 'ashok' 
                      ? 'bg-emerald-500/10 border-emerald-500 shadow-sm shadow-emerald-500/10' 
                      : 'bg-muted/40 border-border/50 hover:border-emerald-500/30 hover:bg-muted/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-sm text-foreground flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${selectedTransport === 'ashok' ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-emerald-500/50'}`} />
                      Ashok Leyland 14-W
                    </p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md transition-colors ${selectedTransport === 'ashok' ? 'bg-emerald-500 text-white' : 'text-emerald-500 group-hover/item:bg-emerald-500 group-hover/item:text-white'}`}>₹40/km</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                    <MapPin className="h-3 w-3" />
                    <span>2.4 km away</span> &bull; <span>Available Now</span>
                  </div>
                </div>
                <div 
                  onClick={() => setSelectedTransport('tata')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer group/item ${
                    selectedTransport === 'tata' 
                      ? 'bg-emerald-500/10 border-emerald-500 shadow-sm shadow-emerald-500/10' 
                      : 'bg-muted/40 border-border/50 hover:border-emerald-500/30 hover:bg-muted/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-sm text-foreground flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${selectedTransport === 'tata' ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-emerald-500/50'}`} />
                      Tata Ace Mini
                    </p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md transition-colors ${selectedTransport === 'tata' ? 'bg-emerald-500 text-white' : 'text-emerald-500 group-hover/item:bg-emerald-500 group-hover/item:text-white'}`}>₹18/km</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                    <MapPin className="h-3 w-3" />
                    <span>5.1 km away</span> &bull; <span>In 2 hours</span>
                  </div>
                </div>
              </div>
              <Dialog open={isTransportOpen} onOpenChange={setIsTransportOpen}>
                <DialogTrigger asChild>
                  <Button disabled={!selectedTransport} className="w-full mt-4 rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground relative z-10 shadow-lg shadow-primary/20">
                    Book Transport Now
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Transport Booking</DialogTitle>
                    <DialogDescription>
                      You are booking {selectedTransport === 'ashok' ? "Ashok Leyland 14-W at ₹40/km" : "Tata Ace Mini at ₹18/km"}. The driver will contact you for pickup details.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400">
                       <Truck className="h-6 w-6 shrink-0"/>
                       <p className="text-sm font-medium">Estimated arrival for loading is approx. {selectedTransport === 'ashok' ? "30 mins" : "2 hours"}.</p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsTransportOpen(false)}>Cancel</Button>
                    <Button onClick={handleBookTransport} disabled={isProcessing} className="font-bold">
                      {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Confirm Booking"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Column: Chart, Alerts & Guide */}
        <div className="xl:col-span-1 space-y-6">
          <div className="sticky top-24 space-y-8">
            
            {/* Chart Wrap */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative rounded-3xl overflow-hidden shadow-xl"
            >
              <MandiChart />
            </motion.div>

            {/* Price Alert Glass Card */}
            <div
              className="bg-amber-500/5 backdrop-blur-sm border border-amber-500/20 rounded-3xl p-6 shadow-xl shadow-amber-500/5 relative overflow-hidden group hover:border-amber-500/40 transition-colors"
            >
              <div className="absolute -right-4 -top-4 w-32 h-32 bg-amber-500/10 rounded-full blur-[30px] group-hover:bg-amber-500/20 transition-colors" />
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="h-12 w-12 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20 shadow-inner">
                  <Bell className="h-5 w-5 text-amber-600 dark:text-amber-500 group-hover:animate-bounce" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Active Price Alert</h3>
                  <p className="text-[10px] text-amber-500 uppercase tracking-widest font-bold">Target Locked</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-6 relative z-10 leading-relaxed">
                We will notify you instantly when <strong className="text-foreground border-b border-foreground/30">Wheat (Lokwan)</strong> crosses <strong className="text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded ml-1 mr-1">₹2,400</strong> per quintal in Delhi NCR.
              </p>
              
              <Dialog open={manageAlertOpen} onOpenChange={setManageAlertOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full rounded-xl font-bold bg-background/50 hover:bg-background border-amber-500/30 text-amber-600 dark:text-amber-500 relative z-10 transition-colors" variant="outline">
                    Manage Alerts
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Manage Price Alerts</DialogTitle>
                    <DialogDescription>Review and configure your active commodity targets.</DialogDescription>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                    <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm text-foreground">Wheat (Lokwan)</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Target: &gt; ₹2,400 /qtl</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-500/10 h-8">Remove</Button>
                    </div>
                    <Button variant="outline" className="w-full border-dashed border-2 h-14 bg-transparent text-muted-foreground">
                       + Add New Alert
                    </Button>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => setManageAlertOpen(false)}>Done</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* How-to Guide */}
            <div
              className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-3xl p-6 shadow-xl"
            >
              <h3 className="text-base font-bold mb-6 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                How to Sell Smart
              </h3>
              
              <div className="space-y-0 relative before:absolute before:inset-0 before:ml-[1.15rem] before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border before:via-border/50 before:to-transparent">
                {guideSteps.map((step, index) => (
                  <div key={index} className="relative flex items-start gap-4 mb-6 last:mb-0 group">
                    {/* Timeline Dot */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border/50 bg-background shadow-md shrink-0 z-10 relative mt-0.5 group-hover:border-primary/50 transition-colors">
                      <div className="h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-primary/20 group-hover:scale-125 transition-transform" />
                    </div>
                    {/* Content */}
                    <div className="flex-1 pt-0.5">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`p-1.5 rounded-md ${step.color}`}>
                          <step.icon className="h-3 w-3" />
                        </div>
                        <h4 className="font-bold text-sm text-foreground">{step.title}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed pl-1">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
