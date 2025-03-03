import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db"; // Ensure this is correctly set up

export const runtime = "nodejs"; // Prisma requires Node.js environment

export async function GET() {
  try {
    // Get the currently authenticated user
    const user = await currentUser();

    if (!user) {
      return new NextResponse(JSON.stringify({ error: "User not signed in" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fetch user role from the database
    const userData = await db.user.findUnique({
      where: { clerkUserId: user.id }, // Ensure `clerkUserId` is in your schema
      select: { role: true },
    });

    if (!userData?.role) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized access" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new NextResponse(JSON.stringify({ role: userData.role }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching user role:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
