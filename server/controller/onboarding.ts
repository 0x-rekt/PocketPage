import { getAuth } from "@clerk/express";
import type { Request, Response } from "express";
import { getDb } from "../db/db";

const temporal = (globalThis as Record<string, unknown>).Temporal as {
  Instant: { from(value: string): unknown };
};

interface CompleteOnboardingBody {
  teamName?: string;
  teamMode?: "create" | "join";
  inviteCode?: string;
  cadence?: "daily" | "weekly";
  memberEmails?: string[];
}

export async function completeOnboarding(req: Request, res: Response) {
  const { isAuthenticated, userId } = getAuth(req);

  if (!isAuthenticated || !userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const body = req.body as CompleteOnboardingBody;
  const teamName = body.teamName?.trim();
  const cadence = body.cadence === "daily" ? "daily" : "weekly";

  if (!teamName) {
    return res.status(400).json({ error: "A team name is required" });
  }

  if (body.teamMode === "join") {
    return res.status(400).json({
      error: "Joining by invite code is not available yet",
    });
  }

  try {
    const db = await getDb();
    const user = await db.orm.public.User.where({ clerkId: userId }).first();

    if (!user) {
      return res.status(409).json({
        error: "Your user profile is still syncing. Please try again shortly.",
      });
    }

    const existingMembership = await db.orm.public.TeamMember.where({
      userId: user.id,
    }).first();

    if (existingMembership) {
      return res.status(200).json({
        teamId: existingMembership.teamId,
        alreadyConfigured: true,
      });
    }

    const team = await db.orm.public.Team.create({ name: teamName });

    await db.orm.public.TeamMember.create({
      teamId: team.id,
      userId: user.id,
      role: "admin",
    });

    const rotation = await db.orm.public.Rotation.create({
      teamId: team.id,
      name: "Primary rotation",
      cadence,
      startDate: temporal.Instant.from(new Date().toISOString()) as never,
    });

    const emails = new Set(
      (body.memberEmails ?? [])
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean),
    );

    const rotationUsers = [user];
    for (const email of emails) {
      if (email === user.email.toLowerCase()) continue;

      const member = await db.orm.public.User.where({ email }).first();
      if (!member) continue;

      await db.orm.public.TeamMember.create({
        teamId: team.id,
        userId: member.id,
        role: "member",
      });
      rotationUsers.push(member);
    }

    for (const [position, rotationUser] of rotationUsers.entries()) {
      await db.orm.public.RotationMember.create({
        rotationId: rotation.id,
        userId: rotationUser.id,
        position,
      });
    }

    return res.status(201).json({
      teamId: team.id,
      rotationId: rotation.id,
      alreadyConfigured: false,
    });
  } catch (error) {
    console.error("Onboarding persistence failed:", error);
    return res.status(500).json({ error: "Could not save onboarding" });
  }
}
