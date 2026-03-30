"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { SectionHeading } from "@/components/section-heading";
import { WarehouseCard } from "@/components/dashboard/warehouse-card";
import { Input } from "@/components/ui/input";
import { Search, Filter, Map as MapIcon, List, Loader2 } from "lucide-react";
import type { WarehouseLocation } from "@/components/dashboard/warehouse-map";

// Dynamic import to avoid SSR issues with Leaflet
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

export default function WarehousePage() {
  const [view, setView] = useState<"map" | "list">("map");
  const [searchQuery, setSearchQuery] = useState("");
  const [nearbyWarehouses, setNearbyWarehouses] = useState<WarehouseLocation[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseLocation | null>(null);

  const handleSelectWarehouse = useCallback((warehouse: WarehouseLocation | null) => {
    setSelectedWarehouse(warehouse);
  }, []);

  const handleNearbyResults = useCallback((warehouses: WarehouseLocation[]) => {
    setNearbyWarehouses(warehouses);
  }, []);

  // The warehouses to display in the sidebar
  const rawWarehouses = nearbyWarehouses.length > 0
    ? nearbyWarehouses
    : [
        { id: "static-0", name: "Kisan Cold Storage", type: "warehouse" as const, lat: 0, lng: 0, distance: "12 km", capacity: "450 Tons", price: "₹20" },
        { id: "static-1", name: "AgriMart Warehouse", type: "warehouse" as const, lat: 0, lng: 0, distance: "18 km", capacity: "800 Tons", price: "₹15" },
        { id: "static-2", name: "Mandi Bazaar", type: "marketplace" as const, lat: 0, lng: 0, distance: "8 km", capacity: "Open Market", price: "Free" },
      ];

  const displayWarehouses = rawWarehouses.filter((w) =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container px-4 md:px-6 py-12 md:py-16 mx-auto min-h-screen flex flex-col">
      <SectionHeading
        title="Warehouse & Cold Storage"
        subtitle="Find secure, affordable, climate-controlled storage for your produce to prevent post-harvest losses."
        alignment="left"
      />

      {/* Controls */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search warehouses or markets..." 
            className="pl-10 h-10 rounded-xl border-border/60"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 shrink-0">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="p-2.5 border border-border/60 rounded-xl hover:bg-muted text-muted-foreground transition-colors"
          >
            <Filter className="h-4 w-4" />
          </motion.button>
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
        <div className={`space-y-3 overflow-y-auto max-h-[600px] pr-1 ${view === "map" ? "hidden lg:block" : "col-span-3"}`}>
          {displayWarehouses.map((w, i) => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <WarehouseCard
                name={w.name}
                location={w.distance ? `${w.distance} away` : "Nearby"}
                distance={w.distance}
                capacity={w.capacity}
                price={w.price}
                type={w.type}
                isSelected={selectedWarehouse?.id === w.id}
                onClick={() => handleSelectWarehouse(w)}
              />
            </motion.div>
          ))}
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
    </div>
  );
}
