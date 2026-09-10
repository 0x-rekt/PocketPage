import { getAuth } from "@clerk/express";
import type { Request, Response } from "express";
import { getDb } from "../db/db";

export async function getDashboard(req: Request, res: Response) {
  const { isAuthenticated, userId } = getAuth(req);

  if (!isAuthenticated || !userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const db = await getDb();
    const user = await db.orm.public.User.where({ clerkId: userId }).first();

    if (!user) return res.status(404).json({ error: "User not found" });

    const membership = await db.orm.public.TeamMember.where({ userId: user.id }).first();

    if (!membership) {
      return res.status(200).json({ team: null, rotation: null, incidents: [] });
    }

    const team = await db.orm.public.Team.first({ id: membership.teamId });
    const rotation = await db.orm.public.Rotation
      .where({ teamId: membership.teamId, active: true })
      .first();

    const rotationMembers = rotation
      ? await db.orm.public.RotationMember
          .where({ rotationId: rotation.id })
          .orderBy((member) => member.position.asc())
          .all()
      : [];

    const members = await Promise.all(
      rotationMembers.map(async (member) => {
        const memberUser = await db.orm.public.User.first({ id: member.userId });
        return {
          id: member.id,
          position: member.position,
          name: memberUser?.name ?? "Unknown teammate",
          email: memberUser?.email ?? "",
          isCurrent: member.position === 0,
        };
      }),
    );

    const incidents = await db.orm.public.Incident
      .where({ teamId: membership.teamId })
      .orderBy((incident) => incident.createdAt.desc())
      .limit(50)
      .all();

    return res.status(200).json({
      team: team
        ? { id: team.id, name: team.name }
        : null,
      rotation: rotation
        ? {
            id: rotation.id,
            name: rotation.name,
            cadence: rotation.cadence,
            startDate: String(rotation.startDate),
            members,
          }
        : null,
      incidents: incidents.map((incident) => ({
        id: incident.id,
        title: incident.title,
        source: incident.source,
        severity: incident.severity,
        status: incident.status,
        createdAt: String(incident.createdAt),
      })),
    });
  } catch (error) {
    console.error("Dashboard read failed:", error);
    return res.status(500).json({ error: "Could not load dashboard" });
  }
}

export async function getIncident(req: Request, res: Response) {
  const { isAuthenticated, userId } = getAuth(req);
  if (!isAuthenticated || !userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const db = await getDb();
    const user = await db.orm.public.User.where({ clerkId: userId }).first();
    if (!user) return res.status(404).json({ error: "User not found" });

    const membership = await db.orm.public.TeamMember.where({ userId: user.id }).first();
    if (!membership) return res.status(404).json({ error: "Team not found" });

    const incidentId = typeof req.params.id === "string" ? req.params.id : undefined;
    const incident = incidentId
      ? await db.orm.public.Incident.first({ id: incidentId })
      : undefined;
    if (!incident || incident.teamId !== membership.teamId) {
      return res.status(404).json({ error: "Incident not found" });
    }

    return res.status(200).json({
      id: incident.id,
      title: incident.title,
      source: incident.source,
      severity: incident.severity,
      status: incident.status,
      payload: incident.payload,
      createdAt: String(incident.createdAt),
      ackedAt: incident.ackedAt ? String(incident.ackedAt) : null,
      resolvedAt: incident.resolvedAt ? String(incident.resolvedAt) : null,
    });
  } catch (error) {
    console.error("Incident read failed:", error);
    return res.status(500).json({ error: "Could not load incident" });
  }
}
