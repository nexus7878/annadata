import type { Product, IrrigationZone } from "./types";

// ============================================================
// Krishi Market — Seed Data  (used both for DB seeding & fallback)
// ============================================================

export const SEED_PRODUCTS: Product[] = [
  // ---- Seeds ----
  {
    id: "s1", name: "HD-2967 Wheat Seeds", brand: "Pusa Seeds", price: 450, originalPrice: 550,
    rating: 4.5, reviewCount: 234, category: "seeds", subcategory: "Wheat",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop",
    description: "High-yield wheat variety suited for irrigated conditions. Disease resistant, 120-140 day crop cycle.",
    inStock: true, tags: ["Best Seller", "High Yield"], unit: "per 5kg bag", bestSeller: true,
  },
  {
    id: "s2", name: "Pioneer Hybrid Corn Seeds", brand: "Pioneer", price: 890, originalPrice: 1050,
    rating: 4.7, reviewCount: 189, category: "seeds", subcategory: "Corn",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=400&fit=crop",
    description: "Premium hybrid corn with excellent cob quality. Resistant to stem borer and leaf blight.",
    inStock: true, tags: ["Hybrid", "Premium"], unit: "per 2kg bag",
  },
  {
    id: "s3", name: "Pusa Basmati 1121 Rice", brand: "IARI", price: 320,
    rating: 4.3, reviewCount: 312, category: "seeds", subcategory: "Rice",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop",
    description: "Extra-long grain basmati rice seeds. Excellent cooking quality with aromatic fragrance.",
    inStock: true, tags: ["Aromatic", "Export Quality"], unit: "per 5kg bag", bestSeller: true,
  },
  {
    id: "s4", name: "Organic Vegetable Seeds Kit", brand: "Navdanya", price: 599,
    rating: 4.6, reviewCount: 156, category: "seeds", subcategory: "Vegetables",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
    description: "10 organic vegetable varieties — tomato, okra, brinjal, chili, cucumber & more.",
    inStock: true, tags: ["Organic", "Combo Pack"], unit: "per kit", organic: true,
  },

  // ---- Fertilizers ----
  {
    id: "f1", name: "DAP Fertilizer (18-46-0)", brand: "IFFCO", price: 1350,
    rating: 4.4, reviewCount: 567, category: "fertilizers", subcategory: "Chemical",
    image: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=400&h=400&fit=crop",
    description: "Di-ammonium Phosphate — essential for root development and early crop growth. Government approved.",
    inStock: true, tags: ["Government Rate", "Essential"], unit: "per 50kg bag", bestSeller: true,
  },
  {
    id: "f2", name: "Urea (46% Nitrogen)", brand: "NFL", price: 267,
    rating: 4.2, reviewCount: 891, category: "fertilizers", subcategory: "Chemical",
    image: "https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=400&h=400&fit=crop",
    description: "High nitrogen fertilizer for vegetative growth. Subsidy rate available for registered farmers.",
    inStock: true, tags: ["Subsidized", "Essential"], unit: "per 45kg bag",
  },
  {
    id: "f3", name: "Vermicompost Organic Manure", brand: "Go Organic", price: 480,
    rating: 4.8, reviewCount: 234, category: "fertilizers", subcategory: "Organic",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=400&fit=crop",
    description: "Premium quality vermicompost enriched with beneficial microbes. Improves soil structure.",
    inStock: true, tags: ["Organic Certified", "Eco-friendly"], unit: "per 25kg bag", organic: true,
  },
  {
    id: "f4", name: "NPK 10-26-26 Complex", brand: "Zuari Agro", price: 1150, originalPrice: 1300,
    rating: 4.3, reviewCount: 178, category: "fertilizers", subcategory: "Chemical",
    image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&h=400&fit=crop",
    description: "Balanced NPK complex ideal for flowering and fruiting stages of crops.",
    inStock: true, tags: ["Multi-nutrient"], unit: "per 50kg bag",
  },

  // ---- Pesticides ----
  {
    id: "p1", name: "Imidacloprid 17.8% SL", brand: "Bayer", price: 320,
    rating: 4.1, reviewCount: 145, category: "pesticides", subcategory: "Insecticide",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=400&fit=crop",
    description: "Systemic insecticide effective against sucking pests — aphids, jassids, whiteflies.",
    inStock: true, tags: ["Systemic", "Broad Spectrum"], unit: "per 250ml",
  },
  {
    id: "p2", name: "Neem Oil Pesticide", brand: "Ozone Bio", price: 280,
    rating: 4.5, reviewCount: 289, category: "pesticides", subcategory: "Organic",
    image: "https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=400&h=400&fit=crop",
    description: "Cold-pressed neem oil — natural pest deterrent. Safe for beneficial insects and bees.",
    inStock: true, tags: ["Organic", "Bee-safe"], unit: "per 1L bottle", organic: true,
  },
  {
    id: "p3", name: "Mancozeb 75% WP Fungicide", brand: "UPL", price: 210,
    rating: 4.0, reviewCount: 198, category: "pesticides", subcategory: "Fungicide",
    image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&h=400&fit=crop",
    description: "Contact fungicide for leaf blight, downy mildew, and late blight in potatoes.",
    inStock: false, tags: ["Contact Fungicide"], unit: "per 500g",
  },

  // ---- Tools ----
  {
    id: "t1", name: "Heavy Duty Hand Hoe", brand: "Falcon Tools", price: 350, originalPrice: 450,
    rating: 4.6, reviewCount: 312, category: "tools", subcategory: "Hand Tools",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
    description: "Carbon steel blade with ergonomic wooden handle. Perfect for weeding and soil breaking.",
    inStock: true, tags: ["Durable", "Ergonomic"], unit: "per piece",
  },
  {
    id: "t2", name: "Battery Sprayer 16L", brand: "Neptune", price: 2850, originalPrice: 3500,
    rating: 4.4, reviewCount: 178, category: "tools", subcategory: "Sprayers",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=400&fit=crop",
    description: "Rechargeable battery-operated knapsack sprayer with adjustable nozzle and 6-hour battery life.",
    inStock: true, tags: ["Battery Operated", "16L Capacity"], unit: "per unit", bestSeller: true,
  },
  {
    id: "t3", name: "GI Wire Fencing Roll", brand: "Tata Wiron", price: 1200,
    rating: 4.2, reviewCount: 89, category: "tools", subcategory: "Fencing",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=400&fit=crop",
    description: "Galvanized iron wire mesh for farm boundary fencing. Rust-proof, 15m roll.",
    inStock: true, tags: ["Rust-proof", "15m Roll"], unit: "per roll",
  },

  // ---- Irrigation ----
  {
    id: "i1", name: "Drip Irrigation Kit (1 Acre)", brand: "Jain Irrigation", price: 8500, originalPrice: 10500,
    rating: 4.7, reviewCount: 256, category: "irrigation", subcategory: "Drip System",
    image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&h=400&fit=crop",
    description: "Complete drip irrigation with laterals, drippers, connectors, and filter. Saves 50% water.",
    inStock: true, tags: ["Complete Kit", "Water Saving"], unit: "per acre kit", bestSeller: true,
  },
  {
    id: "i2", name: "Submersible Pump 1.5 HP", brand: "Kirloskar", price: 6200,
    rating: 4.5, reviewCount: 167, category: "irrigation", subcategory: "Pumps",
    image: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=400&h=400&fit=crop",
    description: "Energy efficient submersible pump for borewell. Suitable for depths up to 150 feet.",
    inStock: true, tags: ["Energy Efficient", "BIS Certified"], unit: "per unit",
  },
  {
    id: "i3", name: "Soil Moisture Sensor IoT Kit", brand: "AgriSens", price: 1850, originalPrice: 2400,
    rating: 4.8, reviewCount: 98, category: "irrigation", subcategory: "Smart Sensors",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop",
    description: "WiFi-connected soil moisture sensor with mobile app. Real-time monitoring and alerts.",
    inStock: true, tags: ["IoT", "Smart Farming"], unit: "per sensor",
  },

  // ---- Organic ----
  {
    id: "o1", name: "Jeevamrut Culture Starter", brand: "Natural Farming", price: 150,
    rating: 4.9, reviewCount: 445, category: "organic", subcategory: "Bio-culture",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
    description: "Traditional Jeevamrut culture for natural farming. Boosts soil microbial activity 10x.",
    inStock: true, tags: ["Zero Budget", "Traditional"], unit: "per pack", organic: true, bestSeller: true,
  },
  {
    id: "o2", name: "Bio NPK Consortium", brand: "IARI Bio", price: 380,
    rating: 4.4, reviewCount: 156, category: "organic", subcategory: "Bio-fertilizer",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=400&fit=crop",
    description: "Consortium of nitrogen-fixing, phosphate-solubilizing, and potash-mobilizing bacteria.",
    inStock: true, tags: ["IARI Certified", "Bio-fertilizer"], unit: "per 1kg", organic: true,
  },
];

// ============================================================
// Irrigation Zones — Seed Data
// ============================================================

export const SEED_ZONES: IrrigationZone[] = [
  {
    id: "zone-a", name: "Zone A", crop: "Wheat", moisture: 42, targetMoisture: 65,
    lastWatered: "2 hours ago", status: "idle", waterUsedToday: 1200, pumpFlowRate: 40,
    color: "bg-blue-500", schedule: { start: "06:00", duration: 30 },
  },
  {
    id: "zone-b", name: "Zone B", crop: "Corn", moisture: 71, targetMoisture: 70,
    lastWatered: "45 min ago", status: "idle", waterUsedToday: 850, pumpFlowRate: 35,
    color: "bg-cyan-400",
  },
  {
    id: "zone-c", name: "Zone C", crop: "Rice Paddy", moisture: 88, targetMoisture: 85,
    lastWatered: "20 min ago", status: "watering", waterUsedToday: 2400, pumpFlowRate: 50,
    color: "bg-emerald-400", schedule: { start: "05:30", duration: 45 },
  },
  {
    id: "zone-d", name: "Zone D", crop: "Vegetables", moisture: 35, targetMoisture: 60,
    lastWatered: "5 hours ago", status: "scheduled", waterUsedToday: 600, pumpFlowRate: 25,
    color: "bg-purple-400", schedule: { start: "17:00", duration: 20 },
  },
];
