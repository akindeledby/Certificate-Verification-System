import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic"; // ✅ Prevents static rendering issues

export async function GET(req: NextRequest) {
  try {
    // Extract wallet address from query parameters
    const walletAddress = req.nextUrl.searchParams.get("walletAddress");

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required." },
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

    return NextResponse.json({ savedCertificates });
  } catch (error) {
    console.error("🚨 Error fetching saved certificates:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
