import { NextRequest, NextResponse } from "next/server";
import { getDb, isDbAvailable } from "@/lib/mongodb";
import { SEED_PRODUCTS } from "@/lib/seed-data";
import type { Product, ApiResponse } from "@/lib/types";

/**
 * GET /api/products
 * Query params:  category, search, sort (popular|price-low|price-high|rating), page, limit
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || "all";
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "popular";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));

    const dbAvailable = await isDbAvailable();

    let products: Product[];

    if (dbAvailable) {
      const db = await getDb();
      const col = db.collection<Product>("products");

      // Build filter
      const filter: Record<string, unknown> = {};
      if (category !== "all") filter.category = category;
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { brand: { $regex: search, $options: "i" } },
          { tags: { $regex: search, $options: "i" } },
        ];
      }

      // Build sort
      let sortDoc: Record<string, 1 | -1> = {};
      switch (sort) {
        case "price-low": sortDoc = { price: 1 }; break;
        case "price-high": sortDoc = { price: -1 }; break;
        case "rating": sortDoc = { rating: -1 }; break;
        default: sortDoc = { reviewCount: -1 }; break; // popular
      }

      const total = await col.countDocuments(filter);
      const items = await col.find(filter)
        .sort(sortDoc)
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray();

      products = items.map((p) => ({ ...p, _id: p._id?.toString() })) as Product[];

      return NextResponse.json<ApiResponse<Product[]>>({
        success: true,
        data: products,
        total,
      });
    }

    // ---- Fallback: use seed data ----
    let filtered = SEED_PRODUCTS.filter((p) => {
      const matchCat = category === "all" || p.category === category;
      const matchSearch = !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      return matchCat && matchSearch;
    });

    switch (sort) {
      case "price-low": filtered.sort((a, b) => a.price - b.price); break;
      case "price-high": filtered.sort((a, b) => b.price - a.price); break;
      case "rating": filtered.sort((a, b) => b.rating - a.rating); break;
      default: filtered.sort((a, b) => b.reviewCount * b.rating - a.reviewCount * a.rating); break;
    }

    const total = filtered.length;
    products = filtered.slice((page - 1) * limit, page * limit);

    return NextResponse.json<ApiResponse<Product[]>>({
      success: true,
      data: products,
      total,
    });
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
