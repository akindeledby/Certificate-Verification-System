import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
export async function PATCH(req: NextRequest) {
  try {
    const { certificateId, newStatus } = await req.json();

    if (!certificateId || !["ISSUED", "REVOKED"].includes(newStatus)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Update certificate status in the database
    const updatedCertificate = await db.certificate.update({
      where: { certificateId },
      data: { status: newStatus },
    });

    return NextResponse.json({ message: "Status updated", updatedCertificate });
  } catch (error) {
    console.error("Error updating certificate status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
