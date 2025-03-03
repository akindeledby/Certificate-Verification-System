import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Ensure this API route is always treated as dynamic
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = 10;

    console.log(`📦 Fetching certificates - Page: ${page}`);

    const [certificates, totalCertificates] = await Promise.all([
      db.certificate.findMany({
        select: {
          id: true,
          certificateId: true,
          candidateName: true,
          ipfsHash: true,
          issuedBy: true,
          organization: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      db.certificate.count(), // Get total count for pagination
    ]);

    console.log(`✅ Found ${certificates.length} certificates`);

    return NextResponse.json({
      certificates,
      totalPages: Math.ceil(totalCertificates / pageSize),
      currentPage: page,
    });
  } catch (error) {
    console.error("🚨 Error fetching certificates:", error);
    return NextResponse.json(
      { error: "Failed to fetch certificates. Please try again later." },
      { status: 500 }
    );
  }
}
