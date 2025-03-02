import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Role } from "@prisma/client"; // Import Prisma Role Enum

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

    // ✅ Fetch user and only their activities
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        role: true,
        organization: true,
        // activities: {
        //   orderBy: { timestamp: "desc" }, // Get latest activities first
        // },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // ✅ Redirect to role selection if role or organization is missing
    if (!user.role || !user.organization) {
      return NextResponse.json({ redirectUrl: "/role-selection" });
    }

    return NextResponse.json({
      redirectUrl: user.role
        ? dashboardRoutes[user.role](userId)
        : "/role-selection",
      //activities: user.activities, // ✅ Send only user's activities
    });
  } catch (error) {
    console.error("❌ Error checking user role:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
