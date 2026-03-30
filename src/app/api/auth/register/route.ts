import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role, farmingType } = body;

    if (!email || !password) {
      return new NextResponse("Missing Info", { status: 400 });
    }

    // Mock Registration: Simply return a success mock user
    const user = {
      id: "mock-new-user-" + Date.now(),
      name,
      email,
      role: role || "BUYER",
      farmingType: farmingType || "None",
    };

    return NextResponse.json(user);
  } catch (error) {
    console.error("REGISTRATION ERROR:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
