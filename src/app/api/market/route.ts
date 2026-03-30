import { NextResponse } from "next/server";

// Sample mock listings
let mockListings = [
  {
    id: "mock-1",
    cropName: "Premium Wheat",
    price: 3200,
    quantity: 50,
    mandiName: "Azadpur Mandi",
    userId: "mock-user-1",
    category: "Cereals",
    quality: "Premium",
    metric: "Quintal",
    change: 2,
    organic: true,
    demand: "High",
    distance: 15,
    rating: 4.8,
    reviews: 120,
    user: { name: "Ramesh Farmer", email: "ramesh@example.com" },
    createdAt: new Date().toISOString()
  },
  {
    id: "mock-2",
    cropName: "Organic Tomatoes",
    price: 1500,
    quantity: 200,
    mandiName: "Ghazipur Mandi",
    userId: "mock-user-2",
    category: "Vegetables",
    quality: "Standard",
    metric: "Quintal",
    change: -5,
    organic: true,
    demand: "Medium",
    distance: 45,
    rating: 4.2,
    reviews: 85,
    user: { name: "Suresh Farm", email: "suresh@example.com" },
    createdAt: new Date().toISOString()
  }
];

// Fetch all market listings
export async function GET() {
  try {
    return NextResponse.json(mockListings);
  } catch (error) {
    console.error("GET MARKET ERROR:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

// Create a new market listing (For Farmers)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cropName, price, quantity, mandiName, userId } = body;

    if (!cropName || !price || !mandiName || !userId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const listing = {
      id: "mock-" + Date.now(),
      cropName,
      price: Number(price),
      quantity: Number(quantity),
      mandiName,
      userId,
      category: "Produce",
      quality: "Premium",
      metric: "Quintal",
      change: Math.round(Math.random() * 10 - 5),
      organic: true,
      demand: "High",
      distance: Math.round(Math.random() * 100),
      rating: 4.5 + Math.random() * 0.5,
      reviews: Math.round(Math.random() * 300),
      createdAt: new Date().toISOString(),
      user: { name: "Mock Local Farmer", email: "local@farmer.test" }
    };
    
    // In-memory update
    mockListings.unshift(listing);

    return NextResponse.json(listing);
  } catch (error) {
    console.error("POST MARKET ERROR:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
