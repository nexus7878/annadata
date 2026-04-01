import { NextRequest, NextResponse } from "next/server";
import { getDb, isDbAvailable } from "@/lib/mongodb";
import type { Order, ApiResponse } from "@/lib/types";

/**
 * POST /api/orders — Place a new order
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, subtotal, delivery, total, deliveryAddress, phone } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Cart is empty" },
        { status: 400 }
      );
    }

    const order: Order = {
      orderId: `AD-${Date.now().toString(36).toUpperCase()}`,
      items: items.map((i: { productId: string; name: string; price: number; quantity: number }) => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
      subtotal,
      delivery,
      total,
      status: "placed",
      createdAt: new Date().toISOString(),
      deliveryAddress: deliveryAddress || "",
      phone: phone || "",
    };

    const dbAvailable = await isDbAvailable();

    if (dbAvailable) {
      const db = await getDb();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, ...insertData } = order;
      const result = await db.collection("orders").insertOne(insertData);
      return NextResponse.json<ApiResponse<Order>>({
        success: true,
        data: { ...order, _id: result.insertedId.toString() },
        message: `Order ${order.orderId} placed successfully!`,
      });
    }

    // Fallback: return mock success
    return NextResponse.json<ApiResponse<Order>>({
      success: true,
      data: order,
      message: `Order ${order.orderId} placed successfully! (offline mode)`,
    });
  } catch (error) {
    console.error("Order API error:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Failed to place order" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/orders — List orders
 */
export async function GET() {
  try {
    const dbAvailable = await isDbAvailable();

    if (dbAvailable) {
      const db = await getDb();
      const orders = await db.collection("orders")
        .find()
        .sort({ createdAt: -1 })
        .limit(20)
        .toArray();

      return NextResponse.json<ApiResponse<Order[]>>({
        success: true,
        data: orders.map((o) => ({ ...o, _id: o._id?.toString() })) as Order[],
      });
    }

    return NextResponse.json<ApiResponse<Order[]>>({
      success: true,
      data: [],
      message: "No database connected",
    });
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
