import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const certificateId = searchParams.get("certificateId");
    const candidateName = searchParams.get("candidateName");

    if (!certificateId && !candidateName) {
      return NextResponse.json(
        {
          message:
            "At least one query parameter (certificateId or candidateName) is required",
        },
        { status: 400 }
      );
    }

    console.log("🔍 Searching for certificate with:", {
      certificateId,
      candidateName,
    });

    // Prepare search conditions
    const whereCondition: any = {};
    if (certificateId) whereCondition.certificateId = certificateId;
    if (candidateName) {
      whereCondition.candidateName = {
        contains: candidateName,
        mode: "insensitive",
      };
    }

    // Fetch certificate
    const certificate = await db.certificate.findFirst({
      where: whereCondition,
      select: {
        candidateName: true,
        certificateId: true,
        organization: true,
        ipfsHash: true,
      },
    });

    if (!certificate) {
      return NextResponse.json(
        { message: "Certificate not found" },
        { status: 404 }
      );
    }

    console.log("✅ Certificate found:", certificate);

    return NextResponse.json(certificate);
  } catch (error) {
    console.error("🚨 Error fetching certificate:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
