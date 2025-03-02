import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(req: Request) {
  try {
    const { userId, isEnabled } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Update user status in the database
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { isEnabled },
    });

    return NextResponse.json({
      message: "User status updated",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
