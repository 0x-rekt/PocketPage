import type { Request, Response } from "express";
import { getDb } from "../db/db";
import { Webhook } from "svix";

export const syncUser = async (req: Request, res: Response) => {
  const db = await getDb();

  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!;

  if (!WEBHOOK_SECRET) throw new Error("CLERK_WEBHOOK_SECRET is not defined");

  const svix_id = req.headers["svix-id"] as string | undefined;
  const svix_timestamp = req.headers["svix-timestamp"] as string | undefined;
  const svix_signature = req.headers["svix-signature"] as string | undefined;

  if (!svix_id || !svix_timestamp || !svix_signature)
    throw new Error("Invalid webhook headers");

  const payload = req.body;

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: any;
  try {
    evt = wh.verify(JSON.stringify(payload), {
      svixId: svix_id,
      svixTimestamp: svix_timestamp,
      svixSignature: svix_signature,
    });
  } catch (error) {
    return res.status(400).json({ error: "Invalid webhook signature" });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    try {
      await db.orm.public.User.create({
        clerkId: evt.data.id,
        email: evt.data.email_addresses[0].email_address,
        name: evt.data.first_name,
        profileImg: evt.data.image_url,
      });
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  if (eventType === "user.updated") {
    try {
      await db.orm.public.User.where({ clerkId: evt.data.id }).update({
        email: evt.data.email_addresses[0].email_address,
        name: evt.data.first_name,
        profileImg: evt.data.image_url,
      });
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(200).json({ success: true });
};
