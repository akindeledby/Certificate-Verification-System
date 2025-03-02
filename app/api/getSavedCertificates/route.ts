import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("walletAddress");

    if (!walletAddress) {
      return NextResponse.json(
        { message: "Wallet address is required." },
        { status: 400 }
      );
    }

    console.log("🔍 Fetching saved certificates for wallet:", walletAddress);

    const savedCertificates = await db.savedCertificate.findMany({
      where: { walletAddress },
      include: {
        certificate: {
          select: {
            candidateName: true,
            ipfsHash: true,
            certificateId: true,
            status: true,
          },
        },
      },
    });

    if (!savedCertificates.length) {
      return NextResponse.json(
        { message: "No saved certificates found." },
        { status: 404 }
      );
    }

    console.log("✅ Saved Certificates Retrieved:", savedCertificates);

    return NextResponse.json(savedCertificates, { status: 200 });
  } catch (error) {
    console.error("🚨 Error fetching saved certificates:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
