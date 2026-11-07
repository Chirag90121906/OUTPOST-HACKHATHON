import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { fail, ok } from "@/lib/api";
import { getProviderForUser } from "@/lib/provider";
import { ApplicationStatus } from "@prisma/client";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession(["PROVIDER", "ADMIN"]);
  if (!session) return fail("Unauthorized", 401);
  const { id } = await params;
  const { status, reviewNotes } = await req.json().catch(() => ({}));
  if (!status || !Object.values(ApplicationStatus).includes(status)) return fail("Invalid status");
  const app = await prisma.application.findUnique({ where: { id }, include: { scholarship: true } });
  if (!app) return fail("Not found", 404);
  if (session.role === "PROVIDER") {
    const provider = await getProviderForUser(session.id);
    if (!provider || app.scholarship.providerId !== provider.id) return fail("Forbidden", 403);
  }
  const updated = await prisma.application.update({ where: { id }, data: { status, reviewNotes: reviewNotes ?? app.reviewNotes, lastStatusAt: new Date() } });
  await prisma.applicationStatusHistory.create({ data: { applicationId: id, status, note: reviewNotes || `Status updated to ${status}` , changedBy: session.id } }).catch(() => null);
  await prisma.notification.create({ data: { userId: app.userId, type: "STATUS", title: "Application status updated", message: `${app.scholarship.title}: ${status.replaceAll("_", " ")}`, href: "/student/applications" } }).catch(() => null);
  return ok({ application: updated });
}
