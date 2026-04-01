"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { SectionHeading } from "@/components/section-heading";
import { WarehouseCard } from "@/components/dashboard/warehouse-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search, Filter, Map as MapIcon, List, Loader2,
  X, CheckCircle2, Package, Thermometer, Star,
  Building2, Clock, Phone, Mail, MapPin,
  CalendarDays, ArrowRight, Info, AlertTriangle,
  Snowflake, Warehouse as WarehouseIcon, ShieldCheck,
  ChevronDown,
} from "lucide-react";
import type { WarehouseLocation } from "@/components/dashboard/warehouse-map";

const WarehouseMap = dynamic(
  () => import("@/components/dashboard/warehouse-map").then((mod) => mod.WarehouseMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="h-6 w-6 text-primary animate-spin" />
      </div>
    ),
  }
);

// ============================================================
// Extended warehouse data (static enrichments for demo)
// ============================================================
interface WarehouseDetail {
  description: string;
  phone: string;
  email: string;
  address: string;
  features: string[];
  temperature?: string;
  capacityUsed: number;
  rating: number;
  reviewCount: number;
  operatingHours: string;
  storageTypes: { name: string; price: string; available: boolean }[];
  images: string[];
}

const WAREHOUSE_DETAILS: Record<string, WarehouseDetail> = {
  default: {
    description: "Modern, climate-controlled storage facility designed for agricultural produce. CCTV monitored 24/7 with insurance coverage for all stored goods.",
    phone: "+91 98765 43210",
    email: "contact@warehouse.in",
    address: "Near Agricultural Market Yard",
    features: ["CCTV 24/7", "Insurance", "Loading Dock", "Pest Control", "Fire Safety"],
    temperature: "2°C – 8°C",
    capacityUsed: 62,
    rating: 4.2,
    reviewCount: 47,
    operatingHours: "6 AM – 10 PM",
    storageTypes: [
      { name: "Dry Storage", price: "₹15/qtl/mo", available: true },
      { name: "Cold Room (2-8°C)", price: "₹25/qtl/mo", available: true },
      { name: "Deep Freeze (-18°C)", price: "₹40/qtl/mo", available: false },
      { name: "Open Yard", price: "₹8/qtl/mo", available: true },
    ],
    images: [],
  },
};

function getWarehouseDetail(id: string): WarehouseDetail {
  // Generate varied data based on ID hash
  const hash = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const base = WAREHOUSE_DETAILS.default;
  const capacityUsed = 30 + (hash % 60);
  const rating = 3.5 + ((hash % 15) / 10);
  return {
    ...base,
    capacityUsed,
    rating: Math.min(5, parseFloat(rating.toFixed(1))),
    reviewCount: 10 + (hash % 120),
    temperature: hash % 3 === 0 ? undefined : `${(hash % 6) + 1}°C – ${(hash % 6) + 7}°C`,
    storageTypes: base.storageTypes.map((s, i) => ({
      ...s,
      available: i === 2 ? hash % 2 === 0 : true,
    })),
  };
}

// ============================================================
// Filter types
// ============================================================
type FilterType = "all" | "warehouse" | "marketplace";
type SortType = "distance" | "price" | "rating" | "capacity";

// ============================================================
// Booking Modal
// ============================================================
function BookingModal({
  warehouse,
  detail,
  onClose,
}: {
  warehouse: WarehouseLocation;
  detail: WarehouseDetail;
  onClose: () => void;
}) {
  const [step, setStep] = useState(1);
  const [selectedStorage, setSelectedStorage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState("10");
  const [duration, setDuration] = useState("3");
  const [booked, setBooked] = useState(false);

  const selectedType = detail.storageTypes.find((s) => s.name === selectedStorage);
  const priceNum = selectedType ? parseInt(selectedType.price.replace(/[^\d]/g, "")) : 0;
  const totalCost = priceNum * parseInt(quantity || "0") * parseInt(duration || "0");

  const handleBook = () => {
    setBooked(true);
    setTimeout(() => {
      onClose();
    }, 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 250 }}
        className="bg-card border border-border/60 rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {booked ? (
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
              className="h-20 w-20 rounded-full bg-emerald-500/15 flex items-center justify-center mb-6"
            >
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </motion.div>
            <h3 className="text-xl font-bold text-foreground mb-2">Reservation Confirmed!</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Your space at <strong>{warehouse.name}</strong> has been reserved. You'll receive a confirmation SMS shortly.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border/40">
              <div>
                <h3 className="text-lg font-bold text-foreground">Reserve Storage</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{warehouse.name}</p>
              </div>
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center gap-2 px-5 py-3 bg-muted/20">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step >= s ? "bg-orange-500 text-white" : "bg-muted text-muted-foreground"
                  }`}>
                    {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
                  </div>
                  <span className={`text-[11px] font-medium ${step >= s ? "text-foreground" : "text-muted-foreground"}`}>
                    {s === 1 ? "Type" : s === 2 ? "Details" : "Confirm"}
                  </span>
                  {s < 3 && <div className={`flex-1 h-px ${step > s ? "bg-orange-500" : "bg-border"}`} />}
                </div>
              ))}
            </div>

            <div className="p-5">
              {/* Step 1: Select Storage Type */}
              {step === 1 && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-foreground mb-4">Choose storage type</p>
                  {detail.storageTypes.map((st) => (
                    <button
                      key={st.name}
                      disabled={!st.available}
                      onClick={() => setSelectedStorage(st.name)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        !st.available
                          ? "opacity-40 cursor-not-allowed border-border/30 bg-muted/10"
                          : selectedStorage === st.name
                            ? "border-orange-500 bg-orange-500/5 shadow-sm"
                            : "border-border/40 hover:border-border/80 hover:bg-muted/20"
                      }`}
                    >
                      <div className="flex items-center gap-3 text-left">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                          st.name.includes("Cold") || st.name.includes("Freeze")
                            ? "bg-sky-500/10 text-sky-500"
                            : st.name.includes("Yard")
                              ? "bg-amber-500/10 text-amber-500"
                              : "bg-orange-500/10 text-orange-500"
                        }`}>
                          {st.name.includes("Cold") || st.name.includes("Freeze")
                            ? <Snowflake className="h-5 w-5" />
                            : <WarehouseIcon className="h-5 w-5" />
                          }
                        </div>
                        <div>
                          <p className="text-sm font-bold">{st.name}</p>
                          {!st.available && <p className="text-[10px] text-red-500 font-medium">Fully booked</p>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">{st.price}</p>
                        {selectedStorage === st.name && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <CheckCircle2 className="h-4 w-4 text-orange-500 ml-auto mt-1" />
                          </motion.div>
                        )}
                      </div>
                    </button>
                  ))}
                  <Button
                    className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-11 font-semibold"
                    disabled={!selectedStorage}
                    onClick={() => setStep(2)}
                  >
                    Continue <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}

              {/* Step 2: Quantity & Duration */}
              {step === 2 && (
                <div className="space-y-5">
                  <p className="text-sm font-semibold text-foreground mb-1">Storage details for <span className="text-orange-500">{selectedStorage}</span></p>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-2 block">
                      Quantity (Quintals)
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="500"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="h-11 rounded-xl text-base font-semibold"
                      placeholder="e.g. 50"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-2 block">
                      Duration (Months)
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {["1", "3", "6", "12"].map((d) => (
                        <button
                          key={d}
                          onClick={() => setDuration(d)}
                          className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${
                            duration === d
                              ? "border-orange-500 bg-orange-500/10 text-orange-500"
                              : "border-border/40 text-muted-foreground hover:border-border/80"
                          }`}
                        >
                          {d} {parseInt(d) === 1 ? "mo" : "mo"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cost Preview */}
                  <div className="bg-muted/30 border border-border/40 rounded-2xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-muted-foreground">Rate</span>
                      <span className="text-sm font-semibold">{selectedType?.price}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-muted-foreground">Qty × Duration</span>
                      <span className="text-sm font-semibold">{quantity} qtl × {duration} mo</span>
                    </div>
                    <div className="h-px bg-border/60 my-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold">Estimated Total</span>
                      <span className="text-lg font-bold text-gradient">₹{totalCost.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 rounded-xl h-11" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-11 font-semibold"
                      disabled={!quantity || parseInt(quantity) < 1}
                      onClick={() => setStep(3)}
                    >
                      Continue <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Confirm */}
              {step === 3 && (
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-foreground">Review your reservation</p>

                  <div className="bg-muted/20 border border-border/40 rounded-2xl divide-y divide-border/40">
                    <div className="flex justify-between items-center px-4 py-3">
                      <span className="text-xs text-muted-foreground">Warehouse</span>
                      <span className="text-sm font-semibold text-foreground">{warehouse.name}</span>
                    </div>
                    <div className="flex justify-between items-center px-4 py-3">
                      <span className="text-xs text-muted-foreground">Storage Type</span>
                      <span className="text-sm font-semibold">{selectedStorage}</span>
                    </div>
                    <div className="flex justify-between items-center px-4 py-3">
                      <span className="text-xs text-muted-foreground">Quantity</span>
                      <span className="text-sm font-semibold">{quantity} Quintals</span>
                    </div>
                    <div className="flex justify-between items-center px-4 py-3">
                      <span className="text-xs text-muted-foreground">Duration</span>
                      <span className="text-sm font-semibold">{duration} Month{parseInt(duration) > 1 ? "s" : ""}</span>
                    </div>
                    <div className="flex justify-between items-center px-4 py-3 bg-orange-500/5">
                      <span className="text-sm font-bold text-foreground">Total Cost</span>
                      <span className="text-lg font-bold text-gradient">₹{totalCost.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-amber-500/8 border border-amber-500/15 rounded-xl p-3">
                    <Info className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-amber-700 dark:text-amber-400">
                      Payment will be collected at the warehouse. Cancellation is free up to 24 hours before your scheduled start date.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 rounded-xl h-11" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 font-semibold"
                      onClick={handleBook}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1.5" /> Confirm Reservation
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

// ============================================================
// Detail Panel (slide-in panel)
// ============================================================
function DetailPanel({
  warehouse,
  detail,
  onClose,
  onReserve,
}: {
  warehouse: WarehouseLocation;
  detail: WarehouseDetail;
  onClose: () => void;
  onReserve: () => void;
}) {
  const isWarehouse = warehouse.type === "warehouse";

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 28, stiffness: 250 }}
      className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 bg-card border-l border-border/60 shadow-2xl overflow-y-auto"
    >
      {/* Header Image Area */}
      <div className="h-40 bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-primary/10 relative flex items-end">
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-9 w-9 rounded-full bg-card/80 backdrop-blur-md border border-border/60 flex items-center justify-center shadow-lg"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="relative z-10 p-5 w-full">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
              isWarehouse ? "bg-orange-500/15 text-orange-500" : "bg-blue-500/15 text-blue-500"
            }`}>
              {isWarehouse ? "Warehouse" : "Mandi"}
            </span>
            {isWarehouse && <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-500 flex items-center gap-0.5">
              <ShieldCheck className="h-2.5 w-2.5" /> Verified
            </span>}
          </div>
          <h2 className="text-xl font-bold text-foreground">{warehouse.name}</h2>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            {warehouse.distance && (
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {warehouse.distance}</span>
            )}
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {detail.operatingHours}</span>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Rating & Reviews */}
        {isWarehouse && (
          <div className="flex items-center gap-4 bg-muted/20 border border-border/40 rounded-2xl p-4">
            <div className="flex items-center gap-1.5">
              <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
              <span className="text-2xl font-bold">{detail.rating}</span>
            </div>
            <div>
              <p className="text-sm font-semibold">{detail.reviewCount} reviews</p>
              <p className="text-[11px] text-muted-foreground">Trusted by local farmers</p>
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">About</h3>
          <p className="text-sm text-foreground/80 leading-relaxed">{detail.description}</p>
        </div>

        {/* Features */}
        {isWarehouse && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Facilities</h3>
            <div className="flex flex-wrap gap-2">
              {detail.features.map((f) => (
                <span key={f} className="text-[11px] font-medium px-3 py-1.5 rounded-lg bg-primary/8 text-primary border border-primary/15">
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Temperature */}
        {detail.temperature && (
          <div className="flex items-center gap-3 bg-sky-500/8 border border-sky-500/15 rounded-2xl p-4">
            <div className="h-10 w-10 rounded-xl bg-sky-500/15 flex items-center justify-center">
              <Thermometer className="h-5 w-5 text-sky-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Cold Storage Available</p>
              <p className="text-xs text-muted-foreground">Temperature maintained at {detail.temperature}</p>
            </div>
          </div>
        )}

        {/* Occupancy */}
        {isWarehouse && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Current Occupancy</h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${detail.capacityUsed}%` }}
                  transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className={`h-full rounded-full ${
                    detail.capacityUsed > 85 ? "bg-red-500" : detail.capacityUsed > 60 ? "bg-amber-500" : "bg-emerald-500"
                  }`}
                />
              </div>
              <span className="text-sm font-bold">{detail.capacityUsed}%</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5">
              {detail.capacityUsed > 85
                ? "⚠️ Almost full — book now to secure your spot"
                : detail.capacityUsed > 60
                  ? "Filling up — good availability"
                  : "✅ Plenty of space available"}
            </p>
          </div>
        )}

        {/* Storage Types & Pricing */}
        {isWarehouse && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Storage Options</h3>
            <div className="space-y-2">
              {detail.storageTypes.map((st) => (
                <div
                  key={st.name}
                  className={`flex items-center justify-between p-3 rounded-xl border ${
                    st.available ? "border-border/40" : "border-border/20 opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                      st.name.includes("Cold") || st.name.includes("Freeze")
                        ? "bg-sky-500/10 text-sky-500"
                        : "bg-orange-500/10 text-orange-500"
                    }`}>
                      {st.name.includes("Cold") || st.name.includes("Freeze")
                        ? <Snowflake className="h-4 w-4" />
                        : <Package className="h-4 w-4" />
                      }
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{st.name}</p>
                      {!st.available && <p className="text-[10px] text-red-500">Unavailable</p>}
                    </div>
                  </div>
                  <span className="text-sm font-bold">{st.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Contact</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground font-medium">{detail.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground font-medium">{detail.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground font-medium">{detail.address}</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-2 pb-4 sticky bottom-0 bg-card">
          <Button
            className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-12 font-bold text-base shadow-lg shadow-orange-500/20"
            onClick={onReserve}
          >
            {isWarehouse ? "Reserve Storage Space" : "View Market Details"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// Main Page
// ============================================================
export default function WarehousePage() {
  const [view, setView] = useState<"map" | "list">("map");
  const [searchQuery, setSearchQuery] = useState("");
  const [nearbyWarehouses, setNearbyWarehouses] = useState<WarehouseLocation[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseLocation | null>(null);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>("distance");
  const [showFilters, setShowFilters] = useState(false);
  const [detailWarehouse, setDetailWarehouse] = useState<WarehouseLocation | null>(null);
  const [bookingWarehouse, setBookingWarehouse] = useState<WarehouseLocation | null>(null);

  const handleSelectWarehouse = useCallback((warehouse: WarehouseLocation | null) => {
    setSelectedWarehouse(warehouse);
  }, []);

  const handleNearbyResults = useCallback((warehouses: WarehouseLocation[]) => {
    setNearbyWarehouses(warehouses);
  }, []);

  // The warehouses to display
  const rawWarehouses = nearbyWarehouses.length > 0
    ? nearbyWarehouses
    : [
        { id: "static-0", name: "Kisan Cold Storage", type: "warehouse" as const, lat: 0, lng: 0, distance: "12 km", capacity: "450 Tons", price: "₹20" },
        { id: "static-1", name: "AgriMart Warehouse", type: "warehouse" as const, lat: 0, lng: 0, distance: "18 km", capacity: "800 Tons", price: "₹15" },
        { id: "static-2", name: "GreenHarvest Storage", type: "warehouse" as const, lat: 0, lng: 0, distance: "24 km", capacity: "1200 Tons", price: "₹25" },
        { id: "static-3", name: "Mandi Bazaar", type: "marketplace" as const, lat: 0, lng: 0, distance: "8 km", capacity: "Open Market", price: "Free" },
        { id: "static-4", name: "FreshProduce Hub", type: "warehouse" as const, lat: 0, lng: 0, distance: "30 km", capacity: "600 Tons", price: "₹18" },
      ];

  const displayWarehouses = rawWarehouses
    .filter((w) => {
      const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === "all" || w.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === "price") {
        const pa = parseInt(a.price?.replace(/[^\d]/g, "") || "0");
        const pb = parseInt(b.price?.replace(/[^\d]/g, "") || "0");
        return pa - pb;
      }
      if (sortBy === "rating") {
        return getWarehouseDetail(b.id).rating - getWarehouseDetail(a.id).rating;
      }
      return 0; // default: keep API order (distance)
    });

  // Stats summary
  const warehouseCount = rawWarehouses.filter((w) => w.type === "warehouse").length;
  const marketCount = rawWarehouses.filter((w) => w.type === "marketplace").length;

  return (
    <div className="container px-4 md:px-6 py-8 md:py-12 mx-auto min-h-screen flex flex-col">
      <SectionHeading
        title="Warehouse & Cold Storage"
        subtitle="Find, compare, and book secure storage for your produce — prevent post-harvest losses."
        alignment="left"
      />

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Warehouses Found", value: warehouseCount, icon: Building2, color: "text-orange-500 bg-orange-500/10" },
          { label: "Mandis Nearby", value: marketCount, icon: Package, color: "text-blue-500 bg-blue-500/10" },
          { label: "Avg Price", value: "₹19/qtl", icon: CalendarDays, color: "text-emerald-500 bg-emerald-500/10" },
          { label: "Cold Storage", value: `${Math.ceil(warehouseCount * 0.6)}`, icon: Snowflake, color: "text-sky-500 bg-sky-500/10" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border/60 rounded-2xl p-4 flex items-center gap-3"
          >
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search warehouses or markets..."
            className="pl-10 h-10 rounded-xl border-border/60"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 shrink-0 flex-wrap">
          {/* Filter button */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 border rounded-xl transition-colors flex items-center gap-1.5 text-xs font-medium ${
                showFilters || filterType !== "all"
                  ? "border-orange-500/40 bg-orange-500/5 text-orange-500"
                  : "border-border/60 hover:bg-muted text-muted-foreground"
              }`}
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
              <ChevronDown className={`h-3 w-3 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </motion.button>

            {/* Filter Dropdown */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.95 }}
                  className="absolute top-full mt-2 right-0 z-40 bg-card border border-border/60 rounded-2xl shadow-xl p-4 min-w-[240px]"
                >
                  <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">Type</p>
                  <div className="flex gap-2 mb-4">
                    {(["all", "warehouse", "marketplace"] as FilterType[]).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilterType(f)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          filterType === f
                            ? "border-orange-500 bg-orange-500/10 text-orange-500"
                            : "border-border/40 text-muted-foreground hover:border-border/80"
                        }`}
                      >
                        {f === "all" ? "All" : f === "warehouse" ? "Warehouses" : "Mandis"}
                      </button>
                    ))}
                  </div>

                  <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">Sort By</p>
                  <div className="flex flex-wrap gap-2">
                    {([
                      { key: "distance", label: "Distance" },
                      { key: "price", label: "Price" },
                      { key: "rating", label: "Rating" },
                    ] as { key: SortType; label: string }[]).map((s) => (
                      <button
                        key={s.key}
                        onClick={() => setSortBy(s.key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          sortBy === s.key
                            ? "border-orange-500 bg-orange-500/10 text-orange-500"
                            : "border-border/40 text-muted-foreground hover:border-border/80"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* View Toggle */}
          <div className="flex bg-muted/50 rounded-xl p-1 border border-border/60">
            <button
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                view === "list" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
              }`}
              onClick={() => setView("list")}
            >
              <List className="h-3.5 w-3.5 inline mr-1" /> List
            </button>
            <button
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                view === "map" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
              }`}
              onClick={() => setView("map")}
            >
              <MapIcon className="h-3.5 w-3.5 inline mr-1" /> Map
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-3 gap-5 flex-1 min-h-[500px]">
        {/* Sidebar List */}
        <div className={`space-y-3 overflow-y-auto max-h-[650px] pr-1 custom-scrollbar ${
          view === "map" ? "hidden lg:block" : "col-span-3"
        }`}>
          {displayWarehouses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <AlertTriangle className="h-8 w-8 text-muted-foreground mb-3" />
              <p className="text-sm font-semibold text-foreground">No results found</p>
              <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className={view === "list" ? "grid sm:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-3"}>
              {displayWarehouses.map((w, i) => {
                const detail = getWarehouseDetail(w.id);
                return (
                  <motion.div
                    key={w.id}
                    initial={{ opacity: 0, x: view === "list" ? 0 : -12, y: view === "list" ? 12 : 0 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <WarehouseCard
                      name={w.name}
                      location={w.distance ? `${w.distance} away` : "Nearby"}
                      distance={w.distance}
                      capacity={w.capacity}
                      capacityUsed={detail.capacityUsed}
                      price={w.price}
                      type={w.type}
                      isSelected={selectedWarehouse?.id === w.id}
                      temperature={detail.temperature}
                      rating={detail.rating}
                      operatingHours={detail.operatingHours}
                      onClick={() => handleSelectWarehouse(w)}
                      onNavigate={() => setDetailWarehouse(w)}
                      onReserve={() => setBookingWarehouse(w)}
                    />
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Map Area */}
        {view === "map" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2 bg-muted/10 border border-border/60 rounded-2xl overflow-hidden relative"
          >
            <WarehouseMap
              onSelectWarehouse={handleSelectWarehouse}
              onNearbyResults={handleNearbyResults}
            />
          </motion.div>
        )}
      </div>

      {/* Detail Panel Overlay */}
      <AnimatePresence>
        {detailWarehouse && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setDetailWarehouse(null)}
            />
            <DetailPanel
              warehouse={detailWarehouse}
              detail={getWarehouseDetail(detailWarehouse.id)}
              onClose={() => setDetailWarehouse(null)}
              onReserve={() => {
                setBookingWarehouse(detailWarehouse);
                setDetailWarehouse(null);
              }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <AnimatePresence>
        {bookingWarehouse && (
          <BookingModal
            warehouse={bookingWarehouse}
            detail={getWarehouseDetail(bookingWarehouse.id)}
            onClose={() => setBookingWarehouse(null)}
          />
        )}
      </AnimatePresence>

      {/* Close filter dropdown when clicking outside */}
      {showFilters && (
        <div className="fixed inset-0 z-30" onClick={() => setShowFilters(false)} />
      )}
    </div>
  );
}
