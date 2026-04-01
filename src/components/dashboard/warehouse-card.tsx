"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, PackageSearch, Thermometer, Shield, Clock, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface WarehouseCardProps {
  name?: string;
  location?: string;
  distance?: string;
  capacity?: string;
  capacityUsed?: number; // percentage 0-100
  price?: string;
  type?: "warehouse" | "marketplace";
  isSelected?: boolean;
  temperature?: string;
  rating?: number;
  verified?: boolean;
  operatingHours?: string;
  onNavigate?: () => void;
  onClick?: () => void;
  onReserve?: () => void;
}

export function WarehouseCard({
  name = "Nearest Cold Storage",
  location = "Based on your current location",
  distance,
  capacity = "450 Tons",
  capacityUsed = 62,
  price = "₹20",
  type = "warehouse",
  isSelected = false,
  temperature,
  rating = 4.2,
  verified = true,
  operatingHours = "6 AM – 10 PM",
  onNavigate,
  onClick,
  onReserve,
}: WarehouseCardProps) {
  const isWarehouse = type === "warehouse";
  const colorAccent = isWarehouse ? "orange" : "blue";
  const capacityPercent = Math.min(100, Math.max(0, capacityUsed));
  const capacityColor = capacityPercent > 85 ? "bg-red-500" : capacityPercent > 60 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <Card
      className={cn(
        "border-border/60 shadow-sm h-full flex flex-col cursor-pointer transition-all duration-300 group overflow-hidden",
        "hover:shadow-md hover:border-border/80",
        isSelected && `border-${colorAccent}-500/40 shadow-${colorAccent}-500/10 shadow-md bg-${colorAccent}-500/[0.03]`
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={cn(
              "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border",
              isWarehouse
                ? "bg-orange-500/10 border-orange-500/20"
                : "bg-blue-500/10 border-blue-500/20"
            )}>
              <PackageSearch className={cn("h-4.5 w-4.5", isWarehouse ? "text-orange-500" : "text-blue-500")} />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-sm font-bold truncate">{name}</CardTitle>
              <div className="flex items-center gap-1.5 mt-0.5">
                {distance && (
                  <span className="flex items-center gap-0.5 text-[11px] text-muted-foreground">
                    <MapPin className="h-2.5 w-2.5" /> {distance}
                  </span>
                )}
                {verified && (
                  <span className="flex items-center gap-0.5 text-[10px] text-emerald-500 font-semibold">
                    <Shield className="h-2.5 w-2.5" /> Verified
                  </span>
                )}
              </div>
            </div>
          </div>
          <span className={cn(
            "text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg shrink-0",
            isWarehouse ? "bg-orange-500/10 text-orange-500" : "bg-blue-500/10 text-blue-500"
          )}>
            {isWarehouse ? "Warehouse" : "Mandi"}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col px-4 pb-4 pt-1">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 py-3 border-y border-border/40">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
              {isWarehouse ? "Total Space" : "Market Type"}
            </p>
            <p className="font-bold text-sm text-foreground mt-0.5">{capacity}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
              {isWarehouse ? "Price" : "Entry"}
            </p>
            <p className="font-bold text-sm text-foreground mt-0.5">
              {price}
              {isWarehouse && <span className="text-[9px] font-normal text-muted-foreground">/qtl/mo</span>}
            </p>
          </div>
          {isWarehouse && (
            <>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Rating</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-sm">{rating}</span>
                  <span className="text-[10px] text-muted-foreground">/5</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Hours</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-foreground font-medium">{operatingHours}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Capacity Bar (warehouses only) */}
        {isWarehouse && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Occupancy</span>
              <span className={cn(
                "text-[11px] font-bold",
                capacityPercent > 85 ? "text-red-500" : capacityPercent > 60 ? "text-amber-500" : "text-emerald-500"
              )}>
                {capacityPercent}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${capacityPercent}%` }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className={cn("h-full rounded-full", capacityColor)}
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              {capacityPercent > 85 ? "Almost full — reserve soon" : capacityPercent > 60 ? "Filling up" : "Good availability"}
            </p>
          </div>
        )}

        {/* Temperature badge (cold storage) */}
        {isWarehouse && temperature && (
          <div className="flex items-center gap-1.5 mt-2 bg-sky-500/8 border border-sky-500/15 rounded-lg px-2.5 py-1.5">
            <Thermometer className="h-3.5 w-3.5 text-sky-500" />
            <span className="text-[11px] text-sky-600 dark:text-sky-400 font-semibold">{temperature}</span>
            <span className="text-[10px] text-muted-foreground">Cold Storage</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-3">
          <Button
            className={cn(
              "flex-1 text-white rounded-xl text-xs h-9 shadow-sm transition-all font-semibold",
              isWarehouse
                ? "bg-orange-500 hover:bg-orange-600 shadow-orange-500/10"
                : "bg-blue-500 hover:bg-blue-600 shadow-blue-500/10"
            )}
            size="sm"
            onClick={(e) => { e.stopPropagation(); onReserve?.(); }}
          >
            {isWarehouse ? "Reserve Space" : "View Market"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="px-3 rounded-xl h-9 border-border/60 group-hover:border-border"
            onClick={(e) => { e.stopPropagation(); onNavigate?.(); }}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
