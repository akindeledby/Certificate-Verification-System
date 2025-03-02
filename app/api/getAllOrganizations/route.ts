import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "15", 10);
    const searchQuery = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    // Filtering condition for organizations with search functionality
    const filterCondition: Prisma.UserWhereInput = {
      organization: { not: null }, // ✅ Ensure only users with organizations are selected
      ...(searchQuery && {
        organization: { contains: searchQuery, mode: "insensitive" }, // ✅ Case-insensitive search
      }),
    };

    // Fetch organizations with Name, Email, and Phone Number
    const organizations = await db.user.findMany({
      where: filterCondition,
      select: {
        organization: true,
        role: true,
        email: true,
        phoneNumber: true, // ✅ Now fetching phone number
      },
      skip,
      take: limit,
    });

    // Count total organizations for pagination
    const totalOrganizations = await db.user.count({ where: filterCondition });
    const totalPages = Math.ceil(totalOrganizations / limit);

    return NextResponse.json(
      { organizations, totalPages, currentPage: page },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching organizations:", error);
    return NextResponse.json(
      { message: "Failed to fetch organizations. Please try again later." },
      { status: 500 }
    );
  }
}
