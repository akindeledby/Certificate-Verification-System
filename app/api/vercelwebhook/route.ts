import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Ensure Prisma is configured properly

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // Extract user data from Clerk webhook payload
    const { id, email_addresses, first_name, last_name } = payload;

    if (!id || !email_addresses?.[0]?.email_address) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Upsert user into the database
    await db.user.upsert({
      where: { clerkUserId: id }, // Ensure your schema uses `clerkUserId`
      update: {
        email: email_addresses[0].email_address,
        firstName: first_name,
        lastName: last_name,
      },
      create: {
        clerkUserId: id,
        email: email_addresses[0].email_address,
        firstName: first_name,
        lastName: last_name,
      },
    });

    return NextResponse.json({ message: "User synced successfully" });
  } catch (error) {
    console.error("Clerk Webhook Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
