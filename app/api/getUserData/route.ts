import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic"; // ✅ Ensures server-side execution

export async function GET(req: NextRequest) {
  try {
    // Use Next.js optimized method to get query parameters
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    console.log("🔍 Fetching user data for ID:", userId);

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        organization: true,
        phoneNumber: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("✅ User data retrieved:", user);

    return NextResponse.json({ user });
  } catch (error) {
    console.error("🚨 Error fetching user data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
