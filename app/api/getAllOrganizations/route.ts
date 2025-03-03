import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

// Ensure this API route is always treated as dynamic
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "15", 10);
    const searchQuery = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    console.log(
      `📦 Fetching organizations - Page: ${page}, Limit: ${limit}, Search: ${searchQuery}`
    );

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

    console.log(`✅ Found ${organizations.length} organizations`);
    return NextResponse.json(
      { organizations, totalPages, currentPage: page },
      { status: 200 }
    );
  } catch (error) {
    console.error("🚨 Error fetching organizations:", error);
    return NextResponse.json(
      { message: "Failed to fetch organizations. Please try again later." },
      { status: 500 }
    );
  }
}
