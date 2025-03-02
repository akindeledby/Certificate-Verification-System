// ===========================================================================
// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/db";

// export async function GET(req: NextRequest) {
//   try {
//     // Extract query parameters
//     const { searchParams } = new URL(req.url);
//     const walletAddress = searchParams.get("walletAddress");
//     const page = parseInt(searchParams.get("page") || "1", 10);
//     const pageSize = 15;

//     if (!walletAddress) {
//       return NextResponse.json(
//         { message: "Wallet address is required" },
//         { status: 400 }
//       );
//     }

//     // Convert to lowercase to ensure case-insensitive matching
//     const normalizedWallet = walletAddress.toLowerCase();

//     console.log("Fetching certificates for:", normalizedWallet);

//     // Fetch certificates & total count simultaneously
//     const [certificates, totalCertificates] = await Promise.all([
//       db.certificate.findMany({
//         where: { issuedBy: normalizedWallet },
//         skip: (page - 1) * pageSize,
//         take: pageSize,
//         orderBy: { createdAt: "desc" },
//       }),
//       db.certificate.count({ where: { issuedBy: normalizedWallet } }),
//     ]);

//     if (certificates.length === 0) {
//       console.log("No certificates found for:", normalizedWallet);
//     }

//     return NextResponse.json({
//       certificates,
//       pagination: {
//         currentPage: page,
//         totalPages: Math.ceil(totalCertificates / pageSize),
//         totalCertificates,
//         pageSize,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching certificates:", error);
//     return NextResponse.json(
//       { message: "Failed to fetch certificates" },
//       { status: 500 }
//     );
//   }
// }
// =============================================================================
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

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

    // Normalize wallet address to lowercase
    walletAddress = walletAddress.toLowerCase();
    console.log(`🔍 Fetching certificates for: ${walletAddress}`);

    // Fetch certificates & total count simultaneously
    const [certificates, totalCertificates] = await Promise.all([
      db.certificate.findMany({
        where: { issuedBy: walletAddress },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
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
