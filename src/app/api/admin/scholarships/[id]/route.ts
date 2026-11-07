import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { fail, ok } from "@/lib/api";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession(["ADMIN"]);
  if (!session) return fail("Unauthorized", 401);
  const { id } = await params;
  const b = await req.json().catch(() => ({}));
  const item = await prisma.scholarship.update({
    where: { id },
    data: {
      ...(b.title != null ? { title: b.title } : {}),
      ...(b.providerName != null ? { providerName: b.providerName } : {}),
      ...(b.description != null ? { description: b.description } : {}),
      ...(b.amount !== undefined ? { amount: b.amount ? Number(b.amount) : null } : {}),
      ...(b.deadline !== undefined ? { deadline: b.deadline ? new Date(b.deadline) : null } : {}),
      ...(b.isPublished !== undefined ? { isPublished: !!b.isPublished } : {}),
      ...(b.isDemo !== undefined ? { isDemo: !!b.isDemo } : {}),
      ...(b.requiredDocuments != null ? { requiredDocuments: b.requiredDocuments } : {}),
      ...(b.officialUrl != null ? { officialUrl: b.officialUrl } : {}),
    },
  }).catch(() => null);
  if (!item) return fail("Not found", 404);
  await prisma.auditLog.create({ data: { actorId: session.id, action: "UPDATE_SCHOLARSHIP", entity: "Scholarship", entityId: id } }).catch(() => null);
  return ok({ item });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession(["ADMIN"]);
  if (!session) return fail("Unauthorized", 401);
  const { id } = await params;
  await prisma.scholarship.delete({ where: { id } }).catch(() => null);
  await prisma.auditLog.create({ data: { actorId: session.id, action: "DELETE_SCHOLARSHIP", entity: "Scholarship", entityId: id } }).catch(() => null);
  return ok({ deleted: true });
}
