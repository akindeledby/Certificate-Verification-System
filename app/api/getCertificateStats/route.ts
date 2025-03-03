import { NextRequest, NextResponse } from "next/server";
import { subDays, format, startOfDay } from "date-fns";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic"; // Ensures API is dynamic

export async function GET(req: NextRequest) {
  try {
    // Extract wallet address from query params
    const walletAddress = req.nextUrl.searchParams.get("walletAddress");

    if (!walletAddress) {
      return NextResponse.json(
        { message: "Wallet address is required" },
        { status: 400 }
      );
    }

    const normalizedWallet = walletAddress.toLowerCase();

    // Define date range for the last 7 days
    const days = Array.from({ length: 7 }, (_, i) =>
      format(subDays(new Date(), i), "yyyy-MM-dd")
    ).reverse();

    // Fetch all certificates issued in the last 7 days
    const recentCertificates = await db.certificate.findMany({
      where: {
        issuedBy: normalizedWallet,
        createdAt: { gte: subDays(new Date(), 7) },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Process and count certificates per day
    const trendData = days.map((day) => ({
      date: day,
      count: recentCertificates.filter(
        (cert) => format(cert.createdAt, "yyyy-MM-dd") === day
      ).length,
    }));

    // Fetch overall stats
    const [totalCertificates, issuedCertificates, revokedCertificates] =
      await Promise.all([
        db.certificate.count({ where: { issuedBy: normalizedWallet } }),
        db.certificate.count({
          where: { issuedBy: normalizedWallet, status: "ISSUED" },
        }),
        db.certificate.count({
          where: { issuedBy: normalizedWallet, status: "REVOKED" },
        }),
      ]);

    return NextResponse.json(
      {
        totalCertificates,
        issuedCertificates,
        revokedCertificates,
        trendData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching certificate stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch certificate stats" },
      { status: 500 }
    );
  }
}
