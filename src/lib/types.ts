// ============================================================
// Shared TypeScript types for the Annadata application
// ============================================================

// ----- Products (Krishi Market) -----

export interface Product {
  _id?: string;
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  subcategory: string;
  description: string;
  inStock: boolean;
  tags: string[];
  unit: string;
  bestSeller?: boolean;
  organic?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  _id?: string;
  orderId: string;
  items: { productId: string; name: string; price: number; quantity: number }[];
  subtotal: number;
  delivery: number;
  total: number;
  status: "placed" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  deliveryAddress?: string;
  phone?: string;
}

// ----- Irrigation -----

export interface IrrigationZone {
  _id?: string;
  id: string;
  name: string;
  crop: string;
  moisture: number;
  targetMoisture: number;
  lastWatered: string;
  status: "idle" | "watering" | "scheduled";
  waterUsedToday: number;
  pumpFlowRate: number;
  color: string;
  schedule?: { start: string; duration: number };
}

// ----- Warehouse -----

export interface Warehouse {
  _id?: string;
  id: string;
  name: string;
  type: string;
  lat: number;
  lon: number;
  address: string;
  distance?: number;
  rating: number;
  pricePerQuintal: number;
  capacity: number;
  occupancy: number;
  temperature?: { min: number; max: number };
  operatingHours: string;
  verified: boolean;
  facilities: string[];
  contact: { phone: string; email: string };
}

// ----- Schemes -----

export interface GovernmentScheme {
  _id?: string;
  id: string;
  name: string;
  ministry: string;
  description: string;
  eligibility: string[];
  benefits: string;
  deadline?: string;
  link: string;
  category: string;
}

// ----- API Response -----

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  total?: number;
}
