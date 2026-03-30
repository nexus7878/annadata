"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LivePriceTicker } from "@/components/market/live-price-ticker";
import { MarketHeader } from "@/components/market/market-header";
import { MarketSidebar } from "@/components/market/market-sidebar";
import { MarketGrid, type ProductListing } from "@/components/market/market-grid";
import { MapView } from "@/components/market/map-view";
import { AIRecommendations } from "@/components/market/ai-recommendations";
import { PriceChart } from "@/components/market/price-chart";
import { Button } from "@/components/ui/button";
import {
  LayoutGrid,
  Sparkles,
  SlidersHorizontal,
  Sun,
  Moon,
  Heart,
  RefreshCw,
} from "lucide-react";

interface Filters {
  categories: string[];
  minPrice: number;
  maxPrice: number;
  organic: boolean;
  sort: string;
  rating: number;
  brands: string[];
}

const defaultFilters: Filters = {
  categories: [],
  minPrice: 0,
  maxPrice: 50000,
  organic: false,
  sort: "popular",
  rating: 0,
  brands: [],
};

// ─── PRODUCT CATALOG ─────────────────────────────────────────────
// Rich mock data matching an agriculture e-commerce store
const productCatalog: ProductListing[] = [
  // === SEEDS ===
  {
    id: "s1",
    name: "Hybrid Tomato Seeds – NS-501 (10g Pack)",
    category: "seeds",
    brand: "Namdhari Seeds",
    price: 280,
    originalPrice: 350,
    discount: 20,
    organic: false,
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop",
    rating: 4.8,
    reviews: 2453,
    inStock: true,
    freeDelivery: true,
    unit: "pack",
    badge: "Best Seller",
    description: "High-yield hybrid tomato seeds, disease resistant, suited for Rabi & Kharif season.",
  },
  {
    id: "s2",
    name: "Wheat Seeds HD-2967 (40kg Bag)",
    category: "seeds",
    brand: "IARI",
    price: 1800,
    originalPrice: 2200,
    discount: 18,
    organic: false,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop",
    rating: 4.6,
    reviews: 3120,
    inStock: true,
    freeDelivery: true,
    unit: "bag",
    badge: "Hot",
    description: "Premium wheat variety for North India plains, high tillering, rust resistant.",
  },
  {
    id: "s3",
    name: "Basmati Paddy Seeds – Pusa 1121 (25kg)",
    category: "seeds",
    brand: "National Seeds",
    price: 2400,
    originalPrice: 2800,
    discount: 14,
    organic: false,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
    rating: 4.5,
    reviews: 1890,
    inStock: true,
    freeDelivery: true,
    unit: "bag",
    description: "Extra-long grain basmati paddy, ideal for export quality rice production.",
  },
  {
    id: "s4",
    name: "Organic Vegetable Seeds Combo (12 Varieties)",
    category: "seeds",
    brand: "SeedBasket",
    price: 499,
    originalPrice: 799,
    discount: 37,
    organic: true,
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
    rating: 4.7,
    reviews: 956,
    inStock: true,
    freeDelivery: true,
    unit: "combo",
    badge: "Sale",
    description: "Includes tomato, chilli, brinjal, okra, spinach, coriander, fenugreek, radish & more.",
  },
  {
    id: "s5",
    name: "Hybrid Maize Seeds – Pioneer P3502 (4kg)",
    category: "seeds",
    brand: "Pioneer / Corteva",
    price: 1100,
    originalPrice: 1350,
    discount: 19,
    organic: false,
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=300&fit=crop",
    rating: 4.4,
    reviews: 1240,
    inStock: true,
    freeDelivery: false,
    unit: "bag",
    description: "Single cross hybrid maize, excellent cob size, 100-110 day maturity.",
  },
  {
    id: "s6",
    name: "Mustard Seeds – Pusa Bold (5kg)",
    category: "seeds",
    brand: "IARI",
    price: 650,
    originalPrice: 750,
    discount: 13,
    organic: false,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop",
    rating: 4.3,
    reviews: 810,
    inStock: true,
    freeDelivery: false,
    unit: "bag",
    description: "High oil content mustard variety, suited for Rabi season in North India.",
  },

  // === FERTILIZERS ===
  {
    id: "f1",
    name: "NPK 19-19-19 Water Soluble Fertilizer (25kg)",
    category: "fertilizers",
    brand: "IFFCO",
    price: 890,
    originalPrice: 1100,
    discount: 19,
    organic: false,
    image: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=400&h=300&fit=crop",
    rating: 4.6,
    reviews: 1892,
    inStock: true,
    freeDelivery: true,
    unit: "bag",
    badge: "Hot",
    description: "Balanced water-soluble fertilizer for vegetables, fruits, and field crops.",
  },
  {
    id: "f2",
    name: "Urea (Neem Coated) – 45kg Bag",
    category: "fertilizers",
    brand: "IFFCO",
    price: 267,
    originalPrice: 267,
    discount: 0,
    organic: false,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop",
    rating: 4.2,
    reviews: 4500,
    inStock: true,
    freeDelivery: false,
    unit: "bag",
    description: "Government-rate neem coated urea, essential nitrogen source for all crops.",
  },
  {
    id: "f3",
    name: "DAP Fertilizer (50kg Bag)",
    category: "fertilizers",
    brand: "Coromandel",
    price: 1350,
    originalPrice: 1350,
    discount: 0,
    organic: false,
    image: "https://images.unsplash.com/photo-1592982537447-3f4bfc03ca8f?w=400&h=300&fit=crop",
    rating: 4.4,
    reviews: 3200,
    inStock: true,
    freeDelivery: true,
    unit: "bag",
    description: "Di-Ammonium Phosphate, ideal basal dose fertilizer with 46% P2O5.",
  },
  {
    id: "f4",
    name: "Organic Vermicompost (50kg Bag)",
    category: "fertilizers",
    brand: "KisanKraft",
    price: 450,
    originalPrice: 600,
    discount: 25,
    organic: true,
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=300&fit=crop",
    rating: 4.5,
    reviews: 890,
    inStock: true,
    freeDelivery: true,
    unit: "bag",
    badge: "Best Seller",
    description: "100% natural earthworm compost, enriched with humic acid, perfect for organic farming.",
  },

  // === PESTICIDES / CROP PROTECTION ===
  {
    id: "p1",
    name: "Organic Neem Oil (1 Litre) – Cold Pressed",
    category: "pesticides",
    brand: "Greenlife",
    price: 320,
    originalPrice: 450,
    discount: 29,
    organic: true,
    image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400&h=300&fit=crop",
    rating: 4.5,
    reviews: 985,
    inStock: true,
    freeDelivery: true,
    unit: "litre",
    badge: "New",
    description: "Natural insect repellent & fungicide, safe for vegetables and fruits.",
  },
  {
    id: "p2",
    name: "Imidacloprid 17.8% SL (250ml)",
    category: "pesticides",
    brand: "Bayer",
    price: 380,
    originalPrice: 440,
    discount: 14,
    organic: false,
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop",
    rating: 4.3,
    reviews: 1560,
    inStock: true,
    freeDelivery: false,
    unit: "bottle",
    description: "Systemic insecticide for sucking pests — aphids, jassids, whitefly control.",
  },
  {
    id: "p3",
    name: "Mancozeb 75% WP (1kg) – Fungicide",
    category: "pesticides",
    brand: "UPL",
    price: 350,
    originalPrice: 420,
    discount: 17,
    organic: false,
    image: "https://images.unsplash.com/photo-1589923188651-268a9765e432?w=400&h=300&fit=crop",
    rating: 4.4,
    reviews: 1100,
    inStock: true,
    freeDelivery: true,
    unit: "kg",
    description: "Broad-spectrum fungicide for blight, downy mildew, and leaf spot control.",
  },

  // === FARM TOOLS ===
  {
    id: "t1",
    name: "Carbon Steel Khurpi with Wooden Handle",
    category: "tools",
    brand: "Falcon",
    price: 135,
    originalPrice: 180,
    discount: 25,
    organic: false,
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
    rating: 4.2,
    reviews: 3420,
    inStock: true,
    freeDelivery: false,
    unit: "piece",
    badge: "Best Seller",
    description: "Heavy duty garden khurpi for weeding and soil work, rust-resistant coating.",
  },
  {
    id: "t2",
    name: "Battery Powered Sprayer 16L (Double Motor)",
    category: "tools",
    brand: "Neptune",
    price: 2890,
    originalPrice: 3800,
    discount: 24,
    organic: false,
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop",
    rating: 4.5,
    reviews: 780,
    inStock: true,
    freeDelivery: true,
    unit: "piece",
    badge: "Hot",
    description: "Rechargeable 12V battery sprayer, 8-10m throw distance, 5-hour backup.",
  },
  {
    id: "t3",
    name: "Farm Tool Kit (5-in-1) – Spade, Fork, Rake, Hoe, Trowel",
    category: "tools",
    brand: "KisanKraft",
    price: 850,
    originalPrice: 1200,
    discount: 29,
    organic: false,
    image: "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400&h=300&fit=crop",
    rating: 4.6,
    reviews: 1150,
    inStock: true,
    freeDelivery: true,
    unit: "kit",
    badge: "Sale",
    description: "Complete gardening tool set with powder-coated steel & ergonomic handles.",
  },

  // === IRRIGATION ===
  {
    id: "i1",
    name: "Drip Irrigation Kit (1 Acre Complete Set)",
    category: "irrigation",
    brand: "Jain Irrigation",
    price: 4500,
    originalPrice: 5999,
    discount: 25,
    organic: false,
    image: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=400&h=300&fit=crop",
    rating: 4.7,
    reviews: 342,
    inStock: true,
    freeDelivery: true,
    unit: "set",
    badge: "Best Seller",
    description: "Complete drip system with main pipe, laterals, emitters & filters for 1-acre.",
  },
  {
    id: "i2",
    name: "Micro Sprinkler Kit (0.5 Acre)",
    category: "irrigation",
    brand: "Netafim",
    price: 3200,
    originalPrice: 4000,
    discount: 20,
    organic: false,
    image: "https://images.unsplash.com/photo-1559884743-74a57598c6c7?w=400&h=300&fit=crop",
    rating: 4.4,
    reviews: 210,
    inStock: true,
    freeDelivery: true,
    unit: "set",
    description: "360° micro sprinklers for orchards, nurseries, and vegetable farms.",
  },

  // === ORGANIC ===
  {
    id: "o1",
    name: "Bio Fertilizer Combo (Rhizobium + PSB + Trichoderma)",
    category: "organic",
    brand: "IARI Bio",
    price: 350,
    originalPrice: 500,
    discount: 30,
    organic: true,
    image: "https://images.unsplash.com/photo-1592982537447-3f4bfc03ca8f?w=400&h=300&fit=crop",
    rating: 4.6,
    reviews: 670,
    inStock: true,
    freeDelivery: true,
    unit: "combo",
    badge: "New",
    description: "IARI certified bio-fertilizer combo for nitrogen fixation & phosphorus mobilization.",
  },
  {
    id: "o2",
    name: "Seaweed Extract Liquid – 1 Litre",
    category: "organic",
    brand: "Biovita",
    price: 420,
    originalPrice: 550,
    discount: 24,
    organic: true,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop",
    rating: 4.3,
    reviews: 320,
    inStock: true,
    freeDelivery: false,
    unit: "litre",
    description: "Natural growth promoter from seaweed, boosts root growth & stress tolerance.",
  },

  // === ANIMAL FEED ===
  {
    id: "af1",
    name: "Cattle Feed – Super Gold (50kg)",
    category: "animal_feed",
    brand: "Amul",
    price: 1050,
    originalPrice: 1200,
    discount: 13,
    organic: false,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop",
    rating: 4.5,
    reviews: 2100,
    inStock: true,
    freeDelivery: true,
    unit: "bag",
    badge: "Best Seller",
    description: "High protein cattle feed for improved milk yield, balanced with minerals & vitamins.",
  },
  {
    id: "af2",
    name: "Poultry Starter Feed (25kg)",
    category: "animal_feed",
    brand: "Godrej Agrovet",
    price: 780,
    originalPrice: 900,
    discount: 13,
    organic: false,
    image: "https://images.unsplash.com/photo-1592982537447-3f4bfc03ca8f?w=400&h=300&fit=crop",
    rating: 4.2,
    reviews: 560,
    inStock: true,
    freeDelivery: false,
    unit: "bag",
    description: "Crumbled starter feed for 0-3 week chicks, optimized for fast growth.",
  },

  // === MACHINERY ===
  {
    id: "m1",
    name: "Power Weeder – 2HP Petrol Engine",
    category: "machinery",
    brand: "Honda",
    price: 28000,
    originalPrice: 32000,
    discount: 13,
    organic: false,
    image: "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400&h=300&fit=crop",
    rating: 4.7,
    reviews: 180,
    inStock: true,
    freeDelivery: true,
    unit: "piece",
    badge: "Hot",
    description: "Compact 4-stroke power weeder for inter-row cultivation, fuel efficient.",
  },
];

export default function MarketPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("Pan India");
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [listings, setListings] = useState<ProductListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "featured">("grid");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Filter and sort products
  const fetchListings = useCallback(() => {
    setLoading(true);

    setTimeout(() => {
      let result = [...productCatalog];

      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        );
      }

      // Category filter
      if (filters.categories.length > 0) {
        result = result.filter((p) => filters.categories.includes(p.category));
      }

      // Price filter
      if (filters.maxPrice < 50000) {
        result = result.filter((p) => p.price <= filters.maxPrice);
      }

      // Organic filter
      if (filters.organic) {
        result = result.filter((p) => p.organic);
      }

      // Rating filter
      if (filters.rating > 0) {
        result = result.filter((p) => p.rating >= filters.rating);
      }

      // Brand filter
      if (filters.brands.length > 0) {
        result = result.filter((p) =>
          filters.brands.some((b) => p.brand.toLowerCase().includes(b.toLowerCase()))
        );
      }

      // Sort
      switch (filters.sort) {
        case "price_low":
          result.sort((a, b) => a.price - b.price);
          break;
        case "price_high":
          result.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          result.sort((a, b) => b.rating - a.rating);
          break;
        case "newest":
          result.reverse();
          break;
        case "discount":
          result.sort((a, b) => b.discount - a.discount);
          break;
        case "popular":
        default:
          result.sort((a, b) => b.reviews - a.reviews);
          break;
      }

      setListings(result);
      setLoading(false);
    }, 600);
  }, [searchQuery, filters]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return (
    <div className="min-h-screen -mx-4 md:-mx-6">
      {/* Deals & Offers Ticker */}
      <LivePriceTicker />

      <div className="w-full max-w-[2000px] px-4 sm:px-6 md:px-8 xl:px-12 mx-auto pt-8 pb-12">
        {/* Market Header */}
        <MarketHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={fetchListings}
          location={location}
          onLocationChange={setLocation}
          cartCount={cartCount}
        />

        {/* Quick Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
          {[
            { label: "🌱 Seeds", cat: "seeds" },
            { label: "🧪 Fertilizers", cat: "fertilizers" },
            { label: "🛡️ Crop Protection", cat: "pesticides" },
            { label: "🔧 Farm Tools", cat: "tools" },
            { label: "💧 Irrigation", cat: "irrigation" },
            { label: "🌿 Organic", cat: "organic" },
            { label: "📦 Animal Feed", cat: "animal_feed" },
            { label: "🚜 Machinery", cat: "machinery" },
          ].map((pill) => {
            const active = filters.categories.includes(pill.cat);
            return (
              <button
                key={pill.cat}
                onClick={() => {
                  const cats = active
                    ? filters.categories.filter((c) => c !== pill.cat)
                    : [...filters.categories, pill.cat];
                  setFilters({ ...filters, categories: cats });
                }}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                  active
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card border-border/60 text-foreground hover:border-primary/30 hover:bg-muted/50"
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Mobile filter toggle */}
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden rounded-xl text-xs h-9 border-border/60"
              onClick={() => setSidebarOpen(true)}
            >
              <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" />
              Filters
            </Button>

            {/* View toggle */}
            <div className="flex items-center bg-card border border-border/60 rounded-xl p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`h-8 px-3 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                All Products
              </button>
              <button
                onClick={() => setViewMode("featured")}
                className={`h-8 px-3 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  viewMode === "featured"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Featured
              </button>
            </div>

            <span className="text-xs text-muted-foreground ml-2 hidden sm:block">
              {listings.length} products found
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Refresh */}
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl text-xs h-9 border-border/60"
              onClick={fetchListings}
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>

            {/* Wishlist */}
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl text-xs h-9 border-border/60 hidden sm:flex"
            >
              <Heart className="h-3.5 w-3.5 mr-1.5" />
              Wishlist
            </Button>

            {/* Dark mode */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="h-9 w-9 rounded-xl bg-card border border-border/60 hover:border-primary/30 flex items-center justify-center transition-colors"
            >
              {darkMode ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col xl:flex-row gap-6">
          <div className="flex flex-col lg:flex-row gap-6 flex-1">
            {/* Sidebar */}
            <div className="lg:w-72 shrink-0">
              <MarketSidebar
                filters={filters}
                onFiltersChange={setFilters}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                {viewMode === "grid" ? (
                  <motion.div
                    key="grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MarketGrid
                      listings={listings}
                      loading={loading}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="featured"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MapView listings={listings} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Panel — Trending Products + Categories */}
          <div className="w-full xl:w-80 shrink-0 space-y-5">
            <div className="grid md:grid-cols-2 xl:grid-cols-1 gap-5">
              <AIRecommendations crop={searchQuery || undefined} />
              <PriceChart selectedCrop={searchQuery || undefined} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
