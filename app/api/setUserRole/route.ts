import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";

// Dashboard Routes for Different User Roles
const dashboardRoutes: Record<Role, (userId: string) => string> = {
  ADMIN: (userId) => `/admin/${userId}/dashboard`,
  INSTITUTE: (userId) => `/institute/${userId}/dashboard`,
  VERIFIER: (userId) => `/verifier/${userId}/dashboard`,
  GUEST: (userId) => `/guest/${userId}`,
};

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const {
      userId,
      role,
      email = "",
      organization = "",
      phoneNumber = "",
    } = await req.json();

    if (!userId || !role) {
      return NextResponse.json(
        { message: "User ID and role are required" },
        { status: 400 }
      );
    }

    // Validate Role
    const prismaRole = role.toUpperCase() as Role;
    if (!Object.values(Role).includes(prismaRole)) {
      return NextResponse.json(
        { message: "Invalid role selection" },
        { status: 400 }
      );
    }

    // Check if the user already exists in the database
    const existingUser = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    const now = new Date();

    // Upsert user (update if exists, create otherwise)
    await db.user.upsert({
      where: { clerkUserId: userId },
      update: {
        role: prismaRole,
        organization,
        phoneNumber, // ✅ Update phone number if user already exists
        updatedAt: now,
      },
      create: {
        clerkUserId: userId,
        email,
        firstName: "",
        lastName: "",
        imageUrl: "",
        role: prismaRole,
        organization,
        phoneNumber, // ✅ Set phone number for new users
        createdAt: now,
        updatedAt: now,
      },
    });

    return NextResponse.json({
      message: "Role set successfully",
      redirectUrl: dashboardRoutes[prismaRole](userId),
    });
  } catch (error) {
    console.error("Error setting user role:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
