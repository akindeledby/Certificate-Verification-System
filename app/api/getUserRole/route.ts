import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db"; // Ensure this is correctly set up

// ✅ Ensure this API is always dynamic
export const dynamic = "force-dynamic"; // Prevents static rendering issues
export const fetchCache = "force-no-store"; // Disables caching

export async function GET() {
  try {
    // Get the currently authenticated user
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "User not signed in" },
        { status: 401 }
      );
    }

    // Fetch user role from the database
    const userData = await db.user.findUnique({
      where: { clerkUserId: user.id }, // Ensure `clerkUserId` is in your schema
      select: { role: true },
    });

    if (!userData?.role) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }

    return NextResponse.json({ role: userData.role }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user role:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
