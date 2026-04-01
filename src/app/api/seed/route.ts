import { NextResponse } from "next/server";
import { getDb, isDbAvailable } from "@/lib/mongodb";
import { SEED_PRODUCTS, SEED_ZONES } from "@/lib/seed-data";
import type { ApiResponse } from "@/lib/types";

/**
 * POST /api/seed — Seed the database with initial data.
 * Creates products and irrigation_zones collections if they don't exist.
 */
export async function POST() {
  try {
    const dbAvailable = await isDbAvailable();

    if (!dbAvailable) {
      return NextResponse.json<ApiResponse<never>>({
        success: false,
        error: "MongoDB is not connected. Set MONGODB_URI in .env.local",
      }, { status: 503 });
    }

    const db = await getDb();

    // ---- Products ----
    const productsCol = db.collection("products");
    const existingProducts = await productsCol.countDocuments();

    let productsInserted = 0;
    if (existingProducts === 0) {
      const result = await productsCol.insertMany(
        SEED_PRODUCTS.map((p) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { _id, ...rest } = p;
          return {
            ...rest,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        })
      );
      productsInserted = result.insertedCount;

      // Create useful indexes
      await productsCol.createIndex({ category: 1 });
      await productsCol.createIndex({ name: "text", brand: "text", tags: "text" });
      await productsCol.createIndex({ price: 1 });
      await productsCol.createIndex({ rating: -1 });
    }

    // ---- Irrigation Zones ----
    const zonesCol = db.collection("irrigation_zones");
    const existingZones = await zonesCol.countDocuments();

    let zonesInserted = 0;
    if (existingZones === 0) {
      const result = await zonesCol.insertMany(
        SEED_ZONES.map((z) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { _id, ...rest } = z;
          return {
            ...rest,
            createdAt: new Date().toISOString(),
          };
        })
      );
      zonesInserted = result.insertedCount;
    }

    // ---- Orders (just create the collection) ----
    const collections = await db.listCollections().toArray();
    const collNames = collections.map((c) => c.name);
    if (!collNames.includes("orders")) {
      await db.createCollection("orders");
    }

    return NextResponse.json<ApiResponse<{ productsInserted: number; zonesInserted: number }>>({
      success: true,
      data: { productsInserted, zonesInserted },
      message: existingProducts > 0
        ? `Database already seeded (${existingProducts} products, ${existingZones} zones). Skipped.`
        : `Seeded ${productsInserted} products and ${zonesInserted} zones.`,
    });
  } catch (error) {
    console.error("Seed API error:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: `Seed failed: ${error}` },
      { status: 500 }
    );
  }
}
