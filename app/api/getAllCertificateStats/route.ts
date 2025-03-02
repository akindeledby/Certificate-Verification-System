import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const totalCertificates = await db.certificate.count();
    const issuedCertificates = await db.certificate.count({
      where: { status: "ISSUED" }, // Adjust according to your schema
    });
    const revokedCertificates = await db.certificate.count({
      where: { status: "REVOKED" },
    });

    return NextResponse.json({
      totalCertificates,
      issuedCertificates,
      revokedCertificates,
    });
  } catch (error) {
    console.error("Error fetching certificate statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch certificate statistics" },
      { status: 500 }
    );
  }
}
