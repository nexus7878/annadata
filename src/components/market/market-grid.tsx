"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Star,
  ShoppingCart,
  Leaf,
  Truck,
  ShieldCheck,
  Heart,
  Eye,
  Package,
} from "lucide-react";

export interface ProductListing {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  originalPrice: number;
  discount: number;
  organic: boolean;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  freeDelivery: boolean;
  unit: string;
  badge?: string;
  description: string;
}

interface MarketGridProps {
  listings: ProductListing[];
  loading: boolean;
}

function BadgeTag({ text, variant }: { text: string; variant: "hot" | "new" | "sale" | "best" }) {
  const colors = {
    hot: "bg-red-500/90 text-white",
    new: "bg-blue-500/90 text-white",
    sale: "bg-amber-500/90 text-black",
    best: "bg-emerald-500/90 text-white",
  };
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm shadow-sm ${colors[variant]}`}>
      {text}
    </span>
  );
}

function SkeletonCard() {
  return (
    <Card className="border-border/40 overflow-hidden">
      <div className="h-44 bg-muted/50 animate-pulse" />
      <CardContent className="p-4 space-y-3">
        <div className="h-3 bg-muted/50 rounded-lg animate-pulse w-1/3" />
        <div className="h-4 bg-muted/50 rounded-lg animate-pulse w-3/4" />
        <div className="h-3 bg-muted/50 rounded-lg animate-pulse w-1/2" />
        <div className="flex gap-2">
          <div className="h-6 bg-muted/50 rounded-lg animate-pulse w-20" />
          <div className="h-6 bg-muted/50 rounded-lg animate-pulse w-16" />
        </div>
        <div className="h-9 bg-muted/50 rounded-xl animate-pulse" />
      </CardContent>
    </Card>
  );
}

export function MarketGrid({ listings, loading }: MarketGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
          <Package className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <h3 className="font-heading font-semibold text-lg mb-1">
          No products found
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Try adjusting your filters or search for different agricultural products
          like seeds, fertilizers, or farm tools.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {listings.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: index * 0.04,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <Card className="rounded-lg border-border/40 overflow-hidden hover:shadow-xl transition-all duration-300 bg-card flex flex-col h-full group">
            {/* Image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=300&fit=crop";
                }}
              />
              {/* Overlays */}
              <div className="absolute top-2 left-2 flex flex-col gap-1.5 items-start">
                {item.badge && (
                  <BadgeTag
                    text={item.badge}
                    variant={
                      item.badge.toLowerCase().includes("hot") ? "hot" :
                      item.badge.toLowerCase().includes("new") ? "new" :
                      item.badge.toLowerCase().includes("sale") ? "sale" : "best"
                    }
                  />
                )}
                {item.organic && (
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm bg-emerald-500/90 text-white shadow-sm">
                    <Leaf className="h-3 w-3" />
                    Organic
                  </span>
                )}
              </div>
              {/* Discount badge */}
              {item.discount > 0 && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow">
                  {item.discount}% OFF
                </div>
              )}
              {/* Wishlist */}
              <button className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 shadow-sm">
                <Heart className="h-4 w-4 text-muted-foreground hover:text-red-500 transition-colors" />
              </button>
              {/* Quick View */}
              <button className="absolute bottom-2 left-2 h-8 px-3 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-sm flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all hover:bg-white shadow-sm text-[11px] font-medium">
                <Eye className="h-3.5 w-3.5" />
                Quick View
              </button>
            </div>

            <CardContent className="p-3.5 flex-1 flex flex-col">
              {/* Brand & Category */}
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-primary font-semibold uppercase tracking-wide">
                  {item.brand}
                </span>
                <span className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md capitalize">
                  {item.category.replace(/_/g, " ")}
                </span>
              </div>

              {/* Product Name */}
              <h3 className="font-semibold text-[14px] leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-1">
                {item.name}
              </h3>
              <p className="text-[11px] text-muted-foreground line-clamp-1 mb-2">
                {item.description}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-3">
                <div className="flex items-center gap-0.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-md">
                  <span className="font-bold text-[12px]">{item.rating}</span>
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                </div>
                <span className="text-muted-foreground">
                  ({item.reviews.toLocaleString("en-IN")} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mt-auto pt-1 mb-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold tracking-tight text-foreground">
                    ₹{item.price.toLocaleString("en-IN")}
                  </span>
                  {item.originalPrice > item.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{item.originalPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                  <span className="text-[11px] text-muted-foreground">/{item.unit}</span>
                </div>
              </div>

              {/* Stock & Delivery Info */}
              <div className="flex items-center gap-3 text-[11px] mb-3">
                <span className={`font-medium ${item.inStock ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                  {item.inStock ? "✓ In Stock" : "✗ Out of Stock"}
                </span>
                {item.freeDelivery && (
                  <span className="inline-flex items-center gap-1 text-primary font-medium">
                    <Truck className="h-3 w-3" />
                    Free Delivery
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="mt-auto flex gap-2 w-full">
                <Button
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-bold tracking-wide rounded-lg shadow-sm h-9 text-xs"
                  disabled={!item.inStock}
                >
                  <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  className="h-9 rounded-lg border-border/60 text-xs px-3"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
