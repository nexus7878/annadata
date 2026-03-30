"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Star,
  TrendingUp,
  ArrowRight,
  Flame,
  Leaf,
} from "lucide-react";

interface TrendingProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  soldCount: number;
  tag: string;
}

interface AIRecommendationsProps {
  crop?: string;
}

const trendingProducts: TrendingProduct[] = [
  {
    id: "t1",
    name: "Hybrid Tomato Seeds (Namdhari NS-501)",
    brand: "Namdhari",
    price: 280,
    originalPrice: 350,
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100&h=100&fit=crop",
    rating: 4.8,
    soldCount: 2450,
    tag: "Best Seller",
  },
  {
    id: "t2",
    name: "NPK 19-19-19 Fertilizer 25kg",
    brand: "IFFCO",
    price: 890,
    originalPrice: 1100,
    image: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=100&h=100&fit=crop",
    rating: 4.6,
    soldCount: 1890,
    tag: "Hot Deal",
  },
  {
    id: "t3",
    name: "Organic Neem Oil 1L Pesticide",
    brand: "Greenleaf",
    price: 320,
    originalPrice: 450,
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&h=100&fit=crop",
    rating: 4.5,
    soldCount: 985,
    tag: "Organic",
  },
  {
    id: "t4",
    name: "Drip Irrigation Kit (1 Acre)",
    brand: "Jain Irrigation",
    price: 4500,
    originalPrice: 5999,
    image: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=100&h=100&fit=crop",
    rating: 4.7,
    soldCount: 342,
    tag: "Popular",
  },
];

export function AIRecommendations({ crop }: AIRecommendationsProps) {
  const products = crop
    ? trendingProducts.filter(p => p.name.toLowerCase().includes(crop.toLowerCase()))
    : trendingProducts;

  const displayProducts = products.length > 0 ? products : trendingProducts;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.03] to-green-500/[0.06] overflow-hidden">
        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-sm">
                Trending Now
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Most popular products this week
              </p>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-3">
            {displayProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.08 }}
              >
                <div className="p-3 rounded-xl bg-card/80 border border-border/40 hover:border-primary/20 transition-all group/rec cursor-pointer">
                  <div className="flex gap-3">
                    {/* Mini Image */}
                    <div className="h-16 w-16 rounded-lg overflow-hidden bg-muted/20 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      {/* Tag */}
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-sm mb-1 ${product.tag === "Hot Deal" ? "bg-red-500/10 text-red-500" :
                          product.tag === "Organic" ? "bg-emerald-500/10 text-emerald-600" :
                            product.tag === "Best Seller" ? "bg-amber-500/10 text-amber-600" :
                              "bg-blue-500/10 text-blue-600"
                        }`}>
                        {product.tag === "Hot Deal" && <Flame className="h-3 w-3" />}
                        {product.tag === "Organic" && <Leaf className="h-3 w-3" />}
                        {product.tag === "Best Seller" && <TrendingUp className="h-3 w-3" />}
                        {product.tag}
                      </span>
                      {/* Name */}
                      <p className="text-[12px] font-semibold leading-tight line-clamp-2">
                        {product.name}
                      </p>
                      {/* Brand */}
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        by {product.brand}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-bold text-foreground">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[11px] text-muted-foreground line-through">
                        ₹{product.originalPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-0.5">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {product.rating}
                      </span>
                      <span>{product.soldCount.toLocaleString()} sold</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <Button
            variant="outline"
            className="w-full mt-4 rounded-xl text-xs h-9 border-border/60 hover:border-primary/30"
          >
            View All Trending Products
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
