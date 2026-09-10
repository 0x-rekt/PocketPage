import type { Request, Response } from "express";
import { getDb } from "../db/db";
import { Webhook } from "svix";

export const syncUser = async (req: Request, res: Response) => {
  let evt: any;

  try {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("CLERK_WEBHOOK_SECRET is not defined");
      return res.status(500).json({ error: "Webhook is not configured" });
    }

    const svixId = req.get("svix-id");
    const svixTimestamp = req.get("svix-timestamp");
    const svixSignature = req.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error("Clerk webhook headers are missing");
      return res.status(400).json({ error: "Invalid webhook headers" });
    }

    if (!Buffer.isBuffer(req.body)) {
      console.error("Clerk webhook body was not received as raw bytes");
      return res.status(400).json({ error: "Invalid webhook body" });
    }

    const wh = new Webhook(webhookSecret);
    wh.verify(req.body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });

    evt = JSON.parse(req.body.toString("utf8"));
  } catch (error) {
    console.error("Clerk webhook verification failed:", error);
    return res.status(400).json({ error: "Invalid Clerk webhook" });
  }

  try {
    const db = await getDb();
    if (evt.type === "user.created") {
      await db.orm.public.User.create({
        clerkId: evt.data.id,
        email: evt.data.email_addresses[0]?.email_address ?? "",
        name:
          [evt.data.first_name, evt.data.last_name].filter(Boolean).join(" ") ||
          "Unknown user",
        profileImg: evt.data.image_url,
      });
    }

    if (evt.type === "user.updated") {
      await db.orm.public.User.where({ clerkId: evt.data.id }).update({
        email: evt.data.email_addresses[0]?.email_address ?? "",
        name:
          [evt.data.first_name, evt.data.last_name].filter(Boolean).join(" ") ||
          "Unknown user",
        profileImg: evt.data.image_url,
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Clerk webhook processing failed:", error);
    return res.status(500).json({ error: "Webhook processing failed" });
  }
};
