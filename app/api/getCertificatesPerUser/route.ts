import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic"; // ✅ Prevent static rendering issues

export async function GET(req: NextRequest) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(req.url);
    let walletAddress = searchParams.get("walletAddress");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = 15;

    // Validate wallet address
    if (!walletAddress || walletAddress.trim() === "") {
      return NextResponse.json(
        { message: "Wallet address is required" },
        { status: 400 }
      );
    }

    // Normalize wallet address
    walletAddress = walletAddress.toLowerCase();

    console.log(`🔍 Fetching certificates for: ${walletAddress}`);

    // Fetch certificates & total count simultaneously
    const [certificates, totalCertificates] = await Promise.all([
      db.certificate.findMany({
        where: { issuedBy: walletAddress },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          certificateId: true,
          candidateName: true,
          ipfsHash: true,
          issuedBy: true,
          organization: true,
          createdAt: true,
          status: true,
        },
      }),
      db.certificate.count({ where: { issuedBy: walletAddress } }),
    ]);

    if (!certificates.length) {
      console.log(`⚠️ No certificates found for: ${walletAddress}`);
    }

    return NextResponse.json({
      certificates,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCertificates / pageSize),
        totalCertificates,
        pageSize,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching certificates:", error);
    return NextResponse.json(
      { message: "Failed to fetch certificates" },
      { status: 500 }
    );
  }
}
