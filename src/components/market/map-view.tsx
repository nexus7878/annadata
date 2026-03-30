"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Star,
  Leaf,
  Truck,
  Heart,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import type { ProductListing } from "./market-grid";
import { useState } from "react";

interface MapViewProps {
  listings: ProductListing[];
}

// Replaces map view with a featured products carousel / banner view
export function MapView({ listings }: MapViewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const featured = listings.filter(l => l.badge || l.discount > 15).slice(0, 6);
  const display = featured.length > 0 ? featured : listings.slice(0, 6);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % Math.max(display.length, 1));
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + display.length) % Math.max(display.length, 1));

  if (display.length === 0) {
    return (
      <Card className="border-border/40">
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">No featured products available</p>
        </CardContent>
      </Card>
    );
  }

  const product = display[currentSlide];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="border-border/40 overflow-hidden">
        <div className="relative bg-gradient-to-br from-emerald-500/5 via-transparent to-amber-500/5">
          {/* Main Featured Product */}
          <div className="flex flex-col md:flex-row items-center gap-8 p-8">
            {/* Image */}
            <div className="relative w-full md:w-1/2 aspect-square max-h-[400px] rounded-2xl overflow-hidden bg-muted/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&h=600&fit=crop";
                }}
              />
              {/* Discount */}
              {product.discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-xl shadow-lg">
                  {product.discount}% OFF
                </div>
              )}
              {product.organic && (
                <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <Leaf className="h-3.5 w-3.5" />
                  Organic
                </div>
              )}
              {/* Wishlist */}
              <button className="absolute bottom-4 right-4 h-10 w-10 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-lg">
                <Heart className="h-5 w-5 text-muted-foreground hover:text-red-500 transition-colors" />
              </button>
            </div>

            {/* Details */}
            <div className="flex-1 w-full md:w-1/2">
              {product.badge && (
                <span className="inline-flex items-center gap-1 text-[11px] uppercase font-bold px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-600 mb-3">
                  ⭐ {product.badge}
                </span>
              )}
              <span className="text-xs text-primary font-semibold uppercase tracking-wide block mb-1">
                {product.brand}
              </span>
              <h2 className="text-2xl font-bold text-foreground mb-2 leading-tight">
                {product.name}
              </h2>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {product.description}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-lg">
                  <span className="font-bold">{product.rating}</span>
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.reviews.toLocaleString("en-IN")} ratings
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-foreground">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      ₹{product.originalPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-sm font-semibold text-emerald-600">
                      Save ₹{(product.originalPrice - product.price).toLocaleString("en-IN")}
                    </span>
                  </>
                )}
              </div>
              <span className="text-xs text-muted-foreground mb-4 block">
                Per {product.unit} • Inclusive of all taxes
              </span>

              {/* Stock & Delivery */}
              <div className="flex items-center gap-4 mb-6 text-sm">
                <span className={`font-medium ${product.inStock ? "text-emerald-600" : "text-red-500"}`}>
                  {product.inStock ? "✓ In Stock" : "✗ Out of Stock"}
                </span>
                {product.freeDelivery && (
                  <span className="inline-flex items-center gap-1 text-primary font-medium">
                    <Truck className="h-4 w-4" />
                    Free Delivery
                  </span>
                )}
              </div>

              {/* CTA buttons */}
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-bold h-11 rounded-xl shadow-sm text-sm"
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  className="flex-1 h-11 rounded-xl font-bold text-sm"
                  disabled={!product.inStock}
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between px-8 pb-6">
            <div className="flex gap-2">
              <button
                onClick={prevSlide}
                className="h-9 w-9 rounded-lg bg-card border border-border/60 hover:border-primary/30 flex items-center justify-center transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextSlide}
                className="h-9 w-9 rounded-lg bg-card border border-border/60 hover:border-primary/30 flex items-center justify-center transition-colors"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="flex gap-1.5">
              {display.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === currentSlide
                      ? "w-6 bg-primary"
                      : "w-2 bg-muted-foreground/20 hover:bg-muted-foreground/40"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {currentSlide + 1} of {display.length} featured
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
