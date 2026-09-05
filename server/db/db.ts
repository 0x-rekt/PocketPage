import "dotenv/config";
import { db } from "../prisma/db";

let runtime: Awaited<ReturnType<typeof db.connect>> | null = null;

export async function getDb() {
  if (!runtime) {
    runtime = await db.connect({ url: process.env.DATABASE_URL! });
  }
  return db;
}
