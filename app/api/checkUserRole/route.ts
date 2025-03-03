import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Role } from "@prisma/client"; // Import Prisma Role Enum

// Ensure this API route is always treated as dynamic
export const dynamic = "force-dynamic";

const dashboardRoutes: Record<Role, (userId: string) => string> = {
  ADMIN: (userId) => `/admin/${userId}/dashboard`,
  INSTITUTE: (userId) => `/institute/${userId}/dashboard`,
  VERIFIER: (userId) => `/verifier/${userId}/dashboard`,
  GUEST: (userId) => `/guest/${userId}`,
};

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    console.log("🔍 Checking role for user:", userId);

    // ✅ Fetch user and only their activities
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        role: true,
        organization: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // ✅ Redirect to role selection if role or organization is missing
    if (!user.role || !user.organization) {
      return NextResponse.json({ redirectUrl: "/role-selection" });
    }

    console.log("✅ User role found:", user.role);

    return NextResponse.json({
      redirectUrl: dashboardRoutes[user.role](userId),
    });
  } catch (error) {
    console.error("🚨 Error checking user role:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
