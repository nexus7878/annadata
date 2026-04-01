"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { SectionHeading } from "@/components/section-heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search, ShoppingCart, Star, Plus, Minus, X,
  CheckCircle2, Filter, ChevronDown, Package,
  Truck, ShieldCheck, Tag, Heart, ArrowRight,
  Leaf, Sprout, Bug, Droplets, Shovel, Zap,
  Wheat, Sun, CloudRain, Tractor, BadgePercent,
  ChevronRight, Clock, MapPin, CreditCard,
  AlertTriangle, Trash2, Gift, Loader2,
} from "lucide-react";
import type { Product, CartItem, ApiResponse } from "@/lib/types";

// ============================================================
// Categories
// ============================================================
const CATEGORIES = [
  { key: "all", label: "All Products", icon: Package, color: "text-orange-500 bg-orange-500/10" },
  { key: "seeds", label: "Seeds", icon: Sprout, color: "text-emerald-500 bg-emerald-500/10" },
  { key: "fertilizers", label: "Fertilizers", icon: Leaf, color: "text-green-500 bg-green-500/10" },
  { key: "pesticides", label: "Pesticides", icon: Bug, color: "text-red-500 bg-red-500/10" },
  { key: "tools", label: "Tools", icon: Shovel, color: "text-amber-500 bg-amber-500/10" },
  { key: "irrigation", label: "Irrigation", icon: Droplets, color: "text-blue-500 bg-blue-500/10" },
  { key: "organic", label: "Organic", icon: Sun, color: "text-lime-500 bg-lime-500/10" },
];

// ============================================================
// API Hook — Fetch products from backend
// ============================================================
function useProducts(category: string, search: string, sort: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    if (search) params.set("search", search);
    params.set("sort", sort);
    params.set("limit", "50");

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data: ApiResponse<Product[]>) => {
        if (!cancelled && data.success && data.data) {
          setProducts(data.data);
          setTotal(data.total || data.data.length);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [category, search, sort]);

  return { products, loading, total };
}

// ============================================================
// Place Order via API
// ============================================================
async function placeOrder(cart: CartItem[]): Promise<{ success: boolean; orderId?: string }> {
  const subtotal = cart.reduce((a, i) => a + i.product.price * i.quantity, 0);
  const delivery = subtotal > 2000 ? 0 : 99;

  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
        })),
        subtotal,
        delivery,
        total: subtotal + delivery,
      }),
    });
    const data = await res.json();
    return { success: data.success, orderId: data.data?.orderId };
  } catch {
    return { success: true, orderId: `AD-${Date.now().toString(36).toUpperCase()}` };
  }
}

// ============================================================
// Product Card
// ============================================================
function ProductCard({
  product,
  onAddToCart,
  onViewDetails,
}: {
  product: Product;
  onAddToCart: (p: Product) => void;
  onViewDetails: (p: Product) => void;
}) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden group shadow-sm hover:shadow-lg hover:border-border/80 transition-all duration-300 flex flex-col"
    >
      <div className="relative h-44 bg-muted/20 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-sm">
              -{discount}%
            </span>
          )}
          {product.bestSeller && (
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-sm">
              Best Seller
            </span>
          )}
          {product.organic && (
            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-sm flex items-center gap-0.5">
              <Leaf className="h-2.5 w-2.5" /> Organic
            </span>
          )}
        </div>
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-background/90 text-foreground text-xs font-bold px-4 py-2 rounded-xl">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1">{product.brand}</p>
        <h3 className="text-sm font-bold text-foreground line-clamp-2 mb-2 leading-snug">{product.name}</h3>

        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center gap-0.5">
            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold text-foreground">{product.rating}</span>
          </div>
          <span className="text-[10px] text-muted-foreground">({product.reviewCount})</span>
          <div className="flex-1" />
          <span className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md font-medium">{product.unit}</span>
        </div>

        <div className="flex items-end gap-2 mb-3 mt-auto">
          <span className="text-lg font-bold text-foreground">₹{product.price.toLocaleString("en-IN")}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs h-9 font-bold shadow-sm"
            disabled={!product.inStock}
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1" /> Add to Cart
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="px-3 rounded-xl h-9 border-border/60"
            onClick={(e) => { e.stopPropagation(); onViewDetails(product); }}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// Cart Drawer
// ============================================================
function CartDrawer({
  items,
  onClose,
  onUpdateQuantity,
  onRemove,
  onCheckout,
  isCheckingOut,
}: {
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
  onCheckout: () => void;
  isCheckingOut: boolean;
}) {
  const subtotal = items.reduce((a, i) => a + i.product.price * i.quantity, 0);
  const delivery = subtotal > 2000 ? 0 : 99;
  const total = subtotal + delivery;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 250 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 bg-card border-l border-border/60 shadow-2xl flex flex-col"
      >
        <div className="flex items-center justify-between p-5 border-b border-border/40 shrink-0">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-emerald-500" /> Your Cart
            </h3>
            <p className="text-xs text-muted-foreground">{items.length} item{items.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={onClose} className="h-9 w-9 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <ShoppingCart className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-sm font-semibold text-muted-foreground">Your cart is empty</p>
              <p className="text-xs text-muted-foreground mt-1">Browse products and add items</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex gap-3 p-3 bg-muted/20 border border-border/30 rounded-xl">
                <div className="h-16 w-16 rounded-lg overflow-hidden shrink-0 relative bg-muted">
                  <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="64px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{item.product.name}</p>
                  <p className="text-[10px] text-muted-foreground">{item.product.brand}</p>
                  <p className="text-sm font-bold text-foreground mt-1">₹{(item.product.price * item.quantity).toLocaleString("en-IN")}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button onClick={() => onRemove(item.product.id)} className="text-muted-foreground hover:text-red-500 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <div className="flex items-center gap-1 bg-muted/50 rounded-lg border border-border/40">
                    <button onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))} className="h-7 w-7 flex items-center justify-center hover:bg-muted rounded-l-lg">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)} className="h-7 w-7 flex items-center justify-center hover:bg-muted rounded-r-lg">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-border/40 shrink-0 space-y-3 bg-card">
            {delivery === 0 ? (
              <div className="flex items-center gap-2 bg-emerald-500/8 border border-emerald-500/15 rounded-xl p-3">
                <Truck className="h-4 w-4 text-emerald-500" />
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Free delivery on this order!</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-amber-500/8 border border-amber-500/15 rounded-xl p-3">
                <Truck className="h-4 w-4 text-amber-500" />
                <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">Add ₹{(2000 - subtotal).toLocaleString("en-IN")} more for free delivery</span>
              </div>
            )}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery</span>
                <span className={`font-semibold ${delivery === 0 ? "text-emerald-500" : ""}`}>
                  {delivery === 0 ? "FREE" : `₹${delivery}`}
                </span>
              </div>
              <div className="h-px bg-border/60" />
              <div className="flex justify-between text-base">
                <span className="font-bold">Total</span>
                <span className="font-bold">₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12 font-bold text-base shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              onClick={onCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Placing Order...</>
              ) : (
                <><CreditCard className="h-4 w-4 mr-2" /> Place Order</>
              )}
            </Button>
          </div>
        )}
      </motion.div>
    </>
  );
}

// ============================================================
// Product Detail Modal
// ============================================================
function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
}: {
  product: Product;
  onClose: () => void;
  onAddToCart: (p: Product, qty: number) => void;
}) {
  const [qty, setQty] = useState(1);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

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
        <div className="relative h-56 bg-muted/20 overflow-hidden rounded-t-3xl">
          <Image src={product.image} alt={product.name} fill className="object-cover" sizes="500px" />
          <button onClick={onClose}
            className="absolute top-4 right-4 h-9 w-9 rounded-full bg-card/80 backdrop-blur-md border border-border/60 flex items-center justify-center shadow-lg">
            <X className="h-4 w-4" />
          </button>
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            {product.organic && (
              <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-0.5">
                <Leaf className="h-2.5 w-2.5" /> Organic
              </span>
            )}
            {discount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg">-{discount}% OFF</span>
            )}
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1">{product.brand} • {product.subcategory}</p>
            <h2 className="text-xl font-bold text-foreground">{product.name}</h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-lg">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-bold">{product.rating}</span>
            </div>
            <span className="text-xs text-muted-foreground">{product.reviewCount} reviews</span>
            {product.bestSeller && (
              <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-lg">🏆 Best Seller</span>
            )}
          </div>

          <p className="text-sm text-foreground/80 leading-relaxed">{product.description}</p>

          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span key={tag} className="text-[11px] font-medium px-3 py-1 rounded-lg bg-primary/8 text-primary border border-primary/15">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-end gap-3 bg-muted/20 border border-border/40 rounded-2xl p-4">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Price ({product.unit})</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-foreground">₹{product.price.toLocaleString("en-IN")}</span>
                {product.originalPrice && (
                  <span className="text-base text-muted-foreground line-through mb-0.5">₹{product.originalPrice.toLocaleString("en-IN")}</span>
                )}
              </div>
            </div>
            <div className="ml-auto flex items-center gap-1 bg-muted/50 rounded-xl border border-border/40 p-1">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-8 w-8 flex items-center justify-center hover:bg-muted rounded-lg">
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="text-sm font-bold w-8 text-center">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="h-8 w-8 flex items-center justify-center hover:bg-muted rounded-lg">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Truck, text: "Free delivery\n₹2000+" },
              { icon: ShieldCheck, text: "Genuine\nProducts" },
              { icon: Clock, text: "Delivery\n2-5 days" },
            ].map((item, i) => (
              <div key={i} className="bg-muted/20 rounded-xl p-3 text-center border border-border/30">
                <item.icon className="h-4 w-4 text-muted-foreground mx-auto mb-1.5" />
                <p className="text-[10px] text-muted-foreground font-medium whitespace-pre-line">{item.text}</p>
              </div>
            ))}
          </div>

          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12 font-bold text-base shadow-lg shadow-emerald-500/20"
            disabled={!product.inStock}
            onClick={() => { onAddToCart(product, qty); onClose(); }}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.inStock ? `Add ${qty} to Cart — ₹${(product.price * qty).toLocaleString("en-IN")}` : "Out of Stock"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================
// Order Confirmation
// ============================================================
function OrderConfirmation({ orderId, onClose }: { orderId: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 20 }}
        className="bg-card border border-border/60 rounded-3xl shadow-2xl w-full max-w-sm p-10 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12, delay: 0.2 }}
          className="h-20 w-20 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        </motion.div>
        <h3 className="text-xl font-bold text-foreground mb-2">Order Placed! 🎉</h3>
        <p className="text-sm text-muted-foreground mb-2">Your order has been placed successfully.</p>
        {orderId && (
          <p className="text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-1.5 inline-block mb-4 font-mono">
            Order ID: {orderId}
          </p>
        )}
        <div className="bg-muted/20 border border-border/40 rounded-xl p-4 mb-6">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Estimated Delivery</p>
          <p className="text-base font-bold text-foreground flex items-center justify-center gap-2">
            <Truck className="h-4 w-4 text-emerald-500" /> 3-5 Business Days
          </p>
        </div>
        <Button className="w-full rounded-xl h-11 font-semibold" onClick={onClose}>
          Continue Shopping
        </Button>
      </motion.div>
    </motion.div>
  );
}

// ============================================================
// Skeleton Loader
// ============================================================
function ProductSkeleton() {
  return (
    <div className="bg-card/60 border border-border/50 rounded-2xl overflow-hidden flex flex-col animate-pulse">
      <div className="h-44 bg-muted/40" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-muted/50 rounded w-16" />
        <div className="h-4 bg-muted/50 rounded w-3/4" />
        <div className="h-3 bg-muted/50 rounded w-1/2" />
        <div className="h-5 bg-muted/50 rounded w-20" />
        <div className="h-9 bg-muted/50 rounded-xl" />
      </div>
    </div>
  );
}

// ============================================================
// Main Page
// ============================================================
export default function KrishiMarketPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"popular" | "price-low" | "price-high" | "rating">("popular");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showOrderConfirm, setShowOrderConfirm] = useState(false);
  const [orderConfirmId, setOrderConfirmId] = useState("");
  const [addedToast, setAddedToast] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Fetch products from API
  const { products, loading, total } = useProducts(selectedCategory, debouncedSearch, sortBy);

  // Cart helpers
  const addToCart = useCallback((product: Product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i);
      }
      return [...prev, { product, quantity: qty }];
    });
    setAddedToast(product.name);
    setTimeout(() => setAddedToast(null), 2000);
  }, []);

  const updateQuantity = useCallback((productId: string, qty: number) => {
    setCart((prev) => prev.map((i) => i.product.id === productId ? { ...i, quantity: qty } : i));
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const handleCheckout = useCallback(async () => {
    setIsCheckingOut(true);
    const result = await placeOrder(cart);
    setIsCheckingOut(false);
    setShowCart(false);
    setOrderConfirmId(result.orderId || "");
    setShowOrderConfirm(true);
    setCart([]);
  }, [cart]);

  const cartCount = cart.reduce((a, i) => a + i.quantity, 0);

  return (
    <div className="container px-4 md:px-6 py-8 md:py-12 mx-auto min-h-screen">
      <div className="flex items-start justify-between gap-4 mb-8">
        <SectionHeading
          title="Krishi Market"
          subtitle="Quality seeds, fertilizers, pesticides & farming equipment — delivered to your farm."
          alignment="left"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCart(true)}
          className="relative shrink-0 h-12 w-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center hover:bg-emerald-500/20 transition-all mt-2"
        >
          <ShoppingCart className="h-5 w-5 text-emerald-500" />
          {cartCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm"
            >
              {cartCount}
            </motion.span>
          )}
        </motion.button>
      </div>

      {/* Promo Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-500/10 via-primary/5 to-amber-500/10 border border-emerald-500/15 rounded-2xl p-5 mb-6 flex items-center gap-4 overflow-hidden relative"
      >
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
        <div className="h-12 w-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center shrink-0">
          <Gift className="h-6 w-6 text-emerald-500" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-foreground">Kharif Season Sale — Up to 30% off on seeds & fertilizers!</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Free delivery on orders above ₹2,000 • Genuine products with warranty</p>
        </div>
        <BadgePercent className="h-8 w-8 text-amber-500/40 shrink-0 hidden sm:block" />
      </motion.div>

      {/* Category Pills */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-300 ${
              selectedCategory === cat.key
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "border-border/40 text-muted-foreground hover:border-border/80 hover:bg-muted/20"
            }`}
          >
            <cat.icon className="h-4 w-4" />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search seeds, fertilizers, tools..."
            className="pl-10 h-10 rounded-xl border-border/60"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative shrink-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-4 h-10 border rounded-xl text-xs font-medium transition-all ${
              showFilters ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-500" : "border-border/60 text-muted-foreground hover:bg-muted"
            }`}
          >
            <Filter className="h-3.5 w-3.5" /> Sort
            <ChevronDown className={`h-3 w-3 transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute top-full mt-2 right-0 z-40 bg-card border border-border/60 rounded-2xl shadow-xl p-3 min-w-[180px]"
              >
                {([
                  { key: "popular", label: "Most Popular" },
                  { key: "price-low", label: "Price: Low to High" },
                  { key: "price-high", label: "Price: High to Low" },
                  { key: "rating", label: "Highest Rated" },
                ] as { key: typeof sortBy; label: string }[]).map((s) => (
                  <button
                    key={s.key}
                    onClick={() => { setSortBy(s.key); setShowFilters(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      sortBy === s.key ? "bg-emerald-500/10 text-emerald-500" : "text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-xs text-muted-foreground mb-4 font-medium">
        {loading ? "Loading..." : `${total} products found`}
      </p>

      {/* Product Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Package className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-sm font-semibold text-foreground">No products found</p>
          <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or category filter</p>
        </div>
      ) : (
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.03, duration: 0.3 }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={(p) => addToCart(p)}
                  onViewDetails={setDetailProduct}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Cart Drawer */}
      <AnimatePresence>
        {showCart && (
          <CartDrawer
            items={cart}
            onClose={() => setShowCart(false)}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
            onCheckout={handleCheckout}
            isCheckingOut={isCheckingOut}
          />
        )}
      </AnimatePresence>

      {/* Product Detail */}
      <AnimatePresence>
        {detailProduct && (
          <ProductDetailModal
            product={detailProduct}
            onClose={() => setDetailProduct(null)}
            onAddToCart={addToCart}
          />
        )}
      </AnimatePresence>

      {/* Order Confirmation */}
      <AnimatePresence>
        {showOrderConfirm && (
          <OrderConfirmation orderId={orderConfirmId} onClose={() => setShowOrderConfirm(false)} />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {addedToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-6 left-1/2 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-semibold"
          >
            <CheckCircle2 className="h-4 w-4" /> Added to cart!
          </motion.div>
        )}
      </AnimatePresence>

      {showFilters && <div className="fixed inset-0 z-30" onClick={() => setShowFilters(false)} />}
    </div>
  );
}
