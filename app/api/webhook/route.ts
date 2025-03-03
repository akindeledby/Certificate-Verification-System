import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const secret = process.env.WEBHOOK_SECRET; // Fetch from Vercel env variables

  if (!secret) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  const receivedSignature = req.headers.get("x-webhook-signature");

  if (receivedSignature !== secret) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid Signature" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json(); // Parse the webhook request body
    console.log("Webhook verified successfully:", body);

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }
}
