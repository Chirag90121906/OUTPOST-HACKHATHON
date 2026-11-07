import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { fail, ok } from "@/lib/api";

export async function GET() {
  const session = await requireSession(["STUDENT", "ADMIN"]);
  if (!session) return fail("Unauthorized", 401);
  const items = await prisma.savedScholarship.findMany({ where: { userId: session.id }, include: { scholarship: true }, orderBy: { createdAt: "desc" } });
  return ok({ items });
}
export async function POST(req: NextRequest) {
  const session = await requireSession(["STUDENT", "ADMIN"]);
  if (!session) return fail("Unauthorized", 401);
  const { scholarshipId } = await req.json();
  if (!scholarshipId) return fail("Missing scholarshipId");
  await prisma.savedScholarship.upsert({ where: { userId_scholarshipId: { userId: session.id, scholarshipId } }, update: {}, create: { userId: session.id, scholarshipId } });
  return ok({ saved: true });
}
export async function DELETE(req: NextRequest) {
  const session = await requireSession(["STUDENT", "ADMIN"]);
  if (!session) return fail("Unauthorized", 401);
  const { scholarshipId } = await req.json();
  await prisma.savedScholarship.deleteMany({ where: { userId: session.id, scholarshipId } });
  return ok({ saved: false });
}
