import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { fail, ok } from "@/lib/api";
import { ApplicationStatus } from "@prisma/client";

export async function GET() {
  const session = await requireSession(["STUDENT", "ADMIN"]);
  if (!session) return fail("Unauthorized", 401);
  const items = await prisma.application.findMany({ where: { userId: session.id }, include: { scholarship: true }, orderBy: { updatedAt: "desc" } });
  return ok({ items });
}
export async function POST(req: NextRequest) {
  const session = await requireSession(["STUDENT", "ADMIN"]);
  if (!session) return fail("Unauthorized", 401);
  const { scholarshipId, submit } = await req.json();
  if (!scholarshipId) return fail("Missing scholarshipId");
  const status = submit ? ApplicationStatus.SUBMITTED : ApplicationStatus.DRAFT;
  const app = await prisma.application.upsert({
    where: { userId_scholarshipId: { userId: session.id, scholarshipId } },
    update: { status, submittedAt: submit ? new Date() : undefined, lastStatusAt: new Date() },
    create: { userId: session.id, scholarshipId, status, submittedAt: submit ? new Date() : undefined },
  });
  await prisma.applicationStatusHistory.create({ data: { applicationId: app.id, status, note: submit ? "Application submitted." : "Draft saved." } }).catch(() => null);
  await prisma.notification.create({ data: { userId: session.id, type: submit ? "APPLICATION" : "SYSTEM", title: submit ? "Application submitted" : "Draft saved", message: submit ? "Your application was submitted (demo workflow)." : "Your draft was saved.", href: "/student/applications" } }).catch(() => null);
  return ok({ application: app });
}
