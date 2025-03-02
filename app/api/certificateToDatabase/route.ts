// ===============================================================================
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * POST /api/certificateToDatabase
 * Saves a certificate with full details into the database.
 */
export async function POST(req: Request) {
  try {
    const {
      certificateId,
      ipfsHash,
      candidateName,
      issuedBy,
      organization,
      status,
    } = await req.json();

    if (
      !certificateId ||
      !ipfsHash ||
      !candidateName ||
      !issuedBy ||
      !organization ||
      !status
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Convert wallet address to lowercase before storing
    const normalizedIssuedBy = issuedBy.toLowerCase();

    // Store certificate in the database
    const certificate = await db.certificate.create({
      data: {
        certificateId,
        ipfsHash,
        candidateName,
        issuedBy: normalizedIssuedBy, // Store as lowercase
        organization,
        status,
      },
    });

    return NextResponse.json({
      message: "Certificate saved successfully",
      certificate,
    });
  } catch (error) {
    console.error("Error saving certificate:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
