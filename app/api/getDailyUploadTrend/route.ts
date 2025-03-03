import { NextRequest, NextResponse } from "next/server";
import { subDays, format } from "date-fns";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic"; // ✅ Ensures dynamic route handling

export async function GET(req: NextRequest) {
  try {
    // Extract wallet address from query parameters
    const walletAddress = req.nextUrl.searchParams.get("walletAddress");

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    const normalizedWallet = walletAddress.toLowerCase();

    // Generate last 7 days' dates
    const days = Array.from({ length: 7 }, (_, i) =>
      format(subDays(new Date(), i), "yyyy-MM-dd")
    ).reverse();

    // Fetch daily upload trends
    const dailyUploads = await db.certificate.findMany({
      where: {
        issuedBy: normalizedWallet,
        createdAt: { gte: subDays(new Date(), 7) },
      },
      select: {
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    // Process data into daily trend format
    const trendData = days.map((day) => ({
      date: day,
      count: dailyUploads.filter(
        (d) => format(new Date(d.createdAt), "yyyy-MM-dd") === day
      ).length,
    }));

    return NextResponse.json({ trendData });
  } catch (error) {
    console.error("❌ Error fetching daily trend:", error);
    return NextResponse.json(
      { error: "Failed to fetch daily trend" },
      { status: 500 }
    );
  }
}
