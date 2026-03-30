"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Filter,
  Sprout,
  FlaskConical,
  Bug,
  Wrench,
  Droplets,
  Leaf,
  Package,
  Tractor,
  X,
  Star,
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

interface MarketSidebarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  { id: "seeds", label: "Seeds & Saplings", icon: Sprout },
  { id: "fertilizers", label: "Fertilizers & Nutrients", icon: FlaskConical },
  { id: "pesticides", label: "Crop Protection", icon: Bug },
  { id: "tools", label: "Farm Tools", icon: Wrench },
  { id: "irrigation", label: "Irrigation Supplies", icon: Droplets },
  { id: "organic", label: "Organic Products", icon: Leaf },
  { id: "animal_feed", label: "Animal Feed", icon: Package },
  { id: "machinery", label: "Farm Machinery", icon: Tractor },
];

const sortOptions = [
  { value: "popular", label: "🔥 Most Popular" },
  { value: "price_low", label: "💰 Price: Low to High" },
  { value: "price_high", label: "💎 Price: High to Low" },
  { value: "newest", label: "🆕 Newest Arrivals" },
  { value: "rating", label: "⭐ Best Rated" },
  { value: "discount", label: "🏷️ Best Discount" },
];

const brands = [
  "UPL", "Bayer", "Syngenta", "IFFCO", "Coromandel",
  "Mahindra", "Rallis", "Dhanuka", "Crystal", "National",
];

export function MarketSidebar({
  filters,
  onFiltersChange,
  isOpen,
  onClose,
}: MarketSidebarProps) {
  const toggleCategory = (id: string) => {
    const cats = filters.categories.includes(id)
      ? filters.categories.filter((c) => c !== id)
      : [...filters.categories, id];
    onFiltersChange({ ...filters, categories: cats });
  };

  const toggleBrand = (brand: string) => {
    const b = filters.brands.includes(brand)
      ? filters.brands.filter((br) => br !== brand)
      : [...filters.brands, brand];
    onFiltersChange({ ...filters, brands: b });
  };

  const resetFilters = () => {
    onFiltersChange({
      categories: [],
      minPrice: 0,
      maxPrice: 50000,
      organic: false,
      sort: "popular",
      rating: 0,
      brands: [],
    });
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } fixed lg:relative top-0 left-0 h-full lg:h-auto w-80 lg:w-auto z-50 lg:z-auto transition-transform duration-300`}
      >
        <Card className="h-full lg:h-auto border-border/60 shadow-sm rounded-none lg:rounded-2xl overflow-y-auto">
          <CardContent className="p-5 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" />
                <h3 className="font-heading font-semibold text-sm">Filters</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetFilters}
                  className="text-xs text-primary hover:underline"
                >
                  Reset All
                </button>
                <button
                  onClick={onClose}
                  className="lg:hidden h-7 w-7 rounded-lg bg-muted/50 flex items-center justify-center"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Product Categories */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Product Category
              </h4>
              <div className="space-y-1.5">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const active = filters.categories.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all ${
                        active
                          ? "bg-primary/10 text-primary font-medium border border-primary/20"
                          : "hover:bg-muted/50 text-foreground border border-transparent"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Price Range
              </h4>
              <div className="space-y-3">
                <input
                  type="range"
                  min={0}
                  max={50000}
                  step={100}
                  value={filters.maxPrice}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      maxPrice: Number(e.target.value),
                    })
                  }
                  className="w-full h-2 rounded-full appearance-none cursor-pointer accent-emerald-600 bg-muted"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹0</span>
                  <span className="font-medium text-foreground">
                    Up to ₹{filters.maxPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Customer Rating
              </h4>
              <div className="space-y-1.5">
                {[4, 3, 2, 1].map((r) => (
                  <button
                    key={r}
                    onClick={() =>
                      onFiltersChange({ ...filters, rating: filters.rating === r ? 0 : r })
                    }
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
                      filters.rating === r
                        ? "bg-amber-500/10 text-amber-600 font-medium border border-amber-500/20"
                        : "hover:bg-muted/50 text-foreground border border-transparent"
                    }`}
                  >
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-3.5 w-3.5 ${
                            s <= r
                              ? "fill-amber-400 text-amber-400"
                              : "fill-muted text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs">& Up</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Brands
              </h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {brands.map((brand) => {
                  const active = filters.brands.includes(brand);
                  return (
                    <button
                      key={brand}
                      onClick={() => toggleBrand(brand)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all ${
                        active
                          ? "bg-primary/10 text-primary font-medium border border-primary/20"
                          : "hover:bg-muted/50 text-foreground border border-transparent"
                      }`}
                    >
                      <div className={`h-4 w-4 rounded border-2 flex items-center justify-center transition-colors ${
                        active ? "border-primary bg-primary" : "border-muted-foreground/30"
                      }`}>
                        {active && <span className="text-white text-[10px] font-bold">✓</span>}
                      </div>
                      {brand}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Organic Toggle */}
            <div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/40">
                <div className="flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-medium">Organic Only</span>
                </div>
                <button
                  onClick={() =>
                    onFiltersChange({ ...filters, organic: !filters.organic })
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    filters.organic ? "bg-emerald-500" : "bg-muted-foreground/20"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                      filters.organic ? "translate-x-[22px]" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Sort */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Sort By
              </h4>
              <div className="space-y-1.5">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() =>
                      onFiltersChange({ ...filters, sort: opt.value })
                    }
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all ${
                      filters.sort === opt.value
                        ? "bg-primary/10 text-primary font-medium border border-primary/20"
                        : "hover:bg-muted/50 text-foreground border border-transparent"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.aside>
    </>
  );
}
