import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = 10;

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

    return NextResponse.json(
      {
        certificates,
        totalPages: Math.ceil(totalCertificates / pageSize),
        currentPage: page,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching certificates:", error);
    return NextResponse.json(
      { error: "Failed to fetch certificates. Please try again later." },
      { status: 500 }
    );
  }
}
