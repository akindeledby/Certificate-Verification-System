import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Adjust based on your project setup

export async function GET() {
  try {
    // Fetch users with roles INSTITUTE, VERIFIER, GUEST and include organization
    const users = await db.user.findMany({
      where: {
        role: { in: ["INSTITUTE", "VERIFIER", "GUEST"] },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        organization: true, // Include organization
      },
    });

    // Group users by role
    const groupedUsers = {
      INSTITUTE: users.filter((user) => user.role === "INSTITUTE"),
      VERIFIER: users.filter((user) => user.role === "VERIFIER"),
      GUEST: users.filter((user) => user.role === "GUEST"),
    };

    return NextResponse.json(groupedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// =====================================================================
// import { NextResponse } from "next/server";
// import { db } from "@/lib/db"; // Adjust based on your project setup
// import { Role } from "@prisma/client"; // Import Role enum from Prisma

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const role = searchParams.get("role") as Role | null; // Explicitly cast
//     const page = parseInt(searchParams.get("page") || "1", 10);
//     const limit = parseInt(searchParams.get("limit") || "10", 10);
//     const skip = (page - 1) * limit;

//     // Validate role input
//     if (!role || !Object.values(Role).includes(role)) {
//       return NextResponse.json(
//         { error: "Invalid or missing role parameter" },
//         { status: 400 }
//       );
//     }

//     // Fetch paginated users for the selected role
//     const users = await db.user.findMany({
//       where: { role: { equals: role } }, // Fixed the type issue
//       select: {
//         id: true,
//         firstName: true,
//         lastName: true,
//         email: true,
//         role: true,
//         organization: true,
//       },
//       take: limit,
//       skip: skip,
//     });

//     // Count total users for pagination
//     const totalUsers = await db.user.count({
//       where: { role: { equals: role } },
//     });
//     const totalPages = Math.ceil(totalUsers / limit);

//     return NextResponse.json({
//       users,
//       page,
//       totalPages,
//     });
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch users" },
//       { status: 500 }
//     );
//   }
// }
