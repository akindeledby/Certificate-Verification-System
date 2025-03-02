// =================================================================================

import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    console.error("❌ Missing CLERK_WEBHOOK_SECRET in environment variables.");
    return new Response("Server error: Missing secret", { status: 500 });
  }

  const svixHeaders = headers();
  const svix_id = svixHeaders.get("svix-id");
  const svix_timestamp = svixHeaders.get("svix-timestamp");
  const svix_signature = svixHeaders.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Bad Request: Missing Svix headers", { status: 400 });
  }

  try {
    const body = await req.text();
    const wh = new Webhook(SIGNING_SECRET);

    // ✅ Verify Webhook Signature
    const event = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;

    if (event.type !== "user.created") {
      return new Response("Webhook type not handled", { status: 400 });
    }

    const eventData = event.data;
    const emailAddresses = eventData.email_addresses || [];

    if (!eventData.id || emailAddresses.length === 0) {
      return new Response("Bad Request: Missing required user data", {
        status: 400,
      });
    }

    // ✅ Upsert User in db
    const user = await db.user.upsert({
      where: { clerkUserId: eventData.id },
      update: {
        email: emailAddresses[0]?.email_address || "",
        firstName: eventData.first_name || "",
        lastName: eventData.last_name || "",
        imageUrl: eventData.image_url || "",
        updatedAt: new Date(), // ✅ db automatically handles updatedAt
      },
      create: {
        clerkUserId: eventData.id,
        email: emailAddresses[0]?.email_address || "",
        firstName: eventData.first_name || "",
        lastName: eventData.last_name || "",
        imageUrl: eventData.image_url || "",
        role: null, // ✅ Set as null initially
        organization: null,
      },
    });

    console.log("✅ User successfully saved:", user);

    return new Response("Webhook received and user saved", { status: 200 });
  } catch (error) {
    console.error("❌ Webhook verification failed:", error);
    return new Response("Unauthorized: Invalid webhook signature", {
      status: 401,
    });
  }
}
