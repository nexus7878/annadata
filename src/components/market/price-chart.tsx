"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sprout,
  FlaskConical,
  Bug,
  Wrench,
  Droplets,
  Leaf,
  Tractor,
  Package,
  ArrowRight,
  Percent,
} from "lucide-react";

interface CategoryBannerItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  count: number;
  color: string;
  gradient: string;
  offer?: string;
}

const categoryBanners: CategoryBannerItem[] = [
  {
    id: "seeds",
    label: "Seeds & Saplings",
    icon: <Sprout className="h-5 w-5" />,
    count: 1250,
    color: "text-emerald-600",
    gradient: "from-emerald-500/10 to-green-500/5",
    offer: "20% off",
  },
  {
    id: "fertilizers",
    label: "Fertilizers",
    icon: <FlaskConical className="h-5 w-5" />,
    count: 830,
    color: "text-blue-600",
    gradient: "from-blue-500/10 to-indigo-500/5",
    offer: "Season Sale",
  },
  {
    id: "pesticides",
    label: "Crop Protection",
    icon: <Bug className="h-5 w-5" />,
    count: 640,
    color: "text-red-600",
    gradient: "from-red-500/10 to-orange-500/5",
  },
  {
    id: "tools",
    label: "Farm Tools",
    icon: <Wrench className="h-5 w-5" />,
    count: 420,
    color: "text-amber-600",
    gradient: "from-amber-500/10 to-yellow-500/5",
    offer: "15% off",
  },
  {
    id: "irrigation",
    label: "Irrigation",
    icon: <Droplets className="h-5 w-5" />,
    count: 310,
    color: "text-cyan-600",
    gradient: "from-cyan-500/10 to-blue-500/5",
  },
  {
    id: "organic",
    label: "Organic Range",
    icon: <Leaf className="h-5 w-5" />,
    count: 580,
    color: "text-green-600",
    gradient: "from-green-500/10 to-lime-500/5",
    offer: "New Arrivals",
  },
  {
    id: "animal_feed",
    label: "Animal Feed",
    icon: <Package className="h-5 w-5" />,
    count: 290,
    color: "text-orange-600",
    gradient: "from-orange-500/10 to-amber-500/5",
  },
  {
    id: "machinery",
    label: "Machinery",
    icon: <Tractor className="h-5 w-5" />,
    count: 150,
    color: "text-slate-600",
    gradient: "from-slate-500/10 to-gray-500/5",
  },
];

interface PriceChartProps {
  selectedCrop?: string;
}

export function PriceChart({ selectedCrop }: PriceChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="border-border/40 overflow-hidden">
        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sprout className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-sm">
                  Shop by Category
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Browse all agricultural products
                </p>
              </div>
            </div>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {categoryBanners.map((cat, index) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.04 }}
                className={`relative p-3 rounded-xl bg-gradient-to-br ${cat.gradient} border border-border/30 hover:border-primary/20 transition-all text-left group/cat overflow-hidden`}
              >
                <div className={`${cat.color} mb-1.5`}>
                  {cat.icon}
                </div>
                <p className="text-[12px] font-semibold leading-tight">
                  {cat.label}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {cat.count}+ products
                </p>
                {cat.offer && (
                  <span className="absolute top-1.5 right-1.5 inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-red-500/90 text-white">
                    <Percent className="h-2.5 w-2.5" />
                    {cat.offer}
                  </span>
                )}
              </motion.button>
            ))}
          </div>

          <Button
            variant="outline"
            className="w-full mt-4 rounded-xl text-xs h-9 border-border/60 hover:border-primary/30"
          >
            View All Categories
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
