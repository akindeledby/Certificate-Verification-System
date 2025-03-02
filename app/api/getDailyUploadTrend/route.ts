import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subDays, format } from "date-fns";

export async function GET(req: NextRequest) {
  try {
    // Extract wallet address from query params
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get("walletAddress");

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    const normalizedWallet = walletAddress.toLowerCase();

    // Get data for the last 7 days
    const days = Array.from({ length: 7 }, (_, i) =>
      format(subDays(new Date(), i), "yyyy-MM-dd")
    ).reverse();

    const dailyUploads = await db.certificate.groupBy({
      by: ["createdAt"],
      _count: { createdAt: true },
      where: {
        issuedBy: normalizedWallet,
        createdAt: { gte: subDays(new Date(), 7) },
      },
      orderBy: { createdAt: "asc" },
    });

    const trendData = days.map((day) => ({
      date: day,
      count:
        dailyUploads.find(
          (d) => format(new Date(d.createdAt), "yyyy-MM-dd") === day
        )?._count.createdAt || 0,
    }));

    return NextResponse.json(trendData);
  } catch (error) {
    console.error("Error fetching daily trend:", error);
    return NextResponse.json(
      { error: "Failed to fetch daily trend" },
      { status: 500 }
    );
  }
}
