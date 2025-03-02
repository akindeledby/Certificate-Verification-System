// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/db";

// export async function GET(req: NextRequest) {
//   try {
//     const userId = req.nextUrl.searchParams.get("userId");

//     if (!userId) {
//       return NextResponse.json(
//         { message: "User ID is required" },
//         { status: 400 }
//       );
//     }

//     // Fetch user details
//     const user = await db.user.findUnique({
//       where: { id: userId },
//     });

//     if (!user) {
//       return NextResponse.json({ message: "User not found" }, { status: 404 });
//     }

//     // Fetch wallet addresses from Certificate collection
//     const issuedCertificates = await db.certificate.findMany({
//       where: { issuedById: userId },
//       select: { issuedById: true },
//     });

//     const ownedCertificates = await db.certificate.findMany({
//       where: { ownerId: userId },
//       select: { ownerId: true },
//     });

//     // Extract unique wallet addresses
//     const walletAddresses = new Set([
//       ...issuedCertificates.map((cert) => cert.issuedById),
//       ...ownedCertificates.map((cert) => cert.ownerId),
//     ]);

//     return NextResponse.json({
//       user,
//       walletAddresses: Array.from(walletAddresses), // Convert Set to Array
//     });
//   } catch (error) {
//     console.error("Error fetching user with wallet addresses:", error);
//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// ========================================================================================
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch user details
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Fetch wallet addresses from Certificate collection
    const issuedCertificates = await db.certificate.findMany({
      where: { issuedBy: userId },
      select: { issuedBy: true },
    });

    const ownedCertificates = await db.certificate.findMany({
      where: { ownerId: userId },
      select: { ownerId: true },
    });

    // Extract unique wallet addresses
    const walletAddresses = new Set([
      ...issuedCertificates.map((cert) => cert.issuedBy),
      ...ownedCertificates.map((cert) => cert.ownerId),
    ]);

    return NextResponse.json({
      user,
      walletAddresses: Array.from(walletAddresses), // Convert Set to Array
    });
  } catch (error) {
    console.error("Error fetching user with wallet addresses:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
