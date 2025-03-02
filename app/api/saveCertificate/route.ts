import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("📩 Received request body:", body);

    const { certificateId, walletAddress, candidateName, ipfsHash } = body;

    if (!certificateId || !walletAddress || !candidateName || !ipfsHash) {
      console.error("❌ Missing required fields:", {
        certificateId,
        walletAddress,
        candidateName,
        ipfsHash,
      });

      return NextResponse.json(
        {
          message:
            "All fields (certificateId, walletAddress, candidateName, ipfsHash, certificateStatus) are required.",
        },
        { status: 400 }
      );
    }

    console.log("💾 Saving certificate with data:", {
      certificateId,
      walletAddress,
      candidateName,
      ipfsHash,
    });

    // Check if certificate exists
    const certificate = await db.certificate.findUnique({
      where: { certificateId },
    });

    if (!certificate) {
      return NextResponse.json(
        { message: "Certificate not found." },
        { status: 404 }
      );
    }

    // Check if already saved
    const alreadySaved = await db.savedCertificate.findFirst({
      where: { certificateId, walletAddress },
    });

    if (alreadySaved) {
      return NextResponse.json(
        { message: "Certificate is already saved." },
        { status: 409 }
      );
    }

    // Save the certificate under the wallet address
    const savedCertificate = await db.savedCertificate.create({
      data: {
        certificateId,
        walletAddress,
        candidateName,
        ipfsHash,
      },
    });

    console.log("✅ Certificate saved successfully:", savedCertificate);

    return NextResponse.json(
      { message: "Certificate saved successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("🚨 Error saving certificate:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
