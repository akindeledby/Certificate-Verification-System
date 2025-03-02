import { NextRequest, NextResponse } from "next/server";
import { subDays, format } from "date-fns";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    // Extract wallet address from query params
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get("walletAddress");

    if (!walletAddress) {
      return NextResponse.json(
        { message: "Wallet address is required" },
        { status: 400 }
      );
    }

    const normalizedWallet = walletAddress.toLowerCase();

    // Fetch certificate statistics
    const totalCertificates = await db.certificate.count({
      where: { issuedBy: normalizedWallet },
    });

    const issuedCertificates = await db.certificate.count({
      where: { issuedBy: normalizedWallet, status: "ISSUED" },
    });

    const revokedCertificates = await db.certificate.count({
      where: { issuedBy: normalizedWallet, status: "REVOKED" },
    });

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

    return NextResponse.json({
      totalCertificates,
      issuedCertificates,
      revokedCertificates,
      trendData,
    });
  } catch (error) {
    console.error("Error fetching certificate stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch certificate stats" },
      { status: 500 }
    );
  }
}
