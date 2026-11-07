import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { fail, ok } from "@/lib/api";
export async function GET() {
  const session = await requireSession(["STUDENT", "ADMIN", "PROVIDER"]);
  if (!session) return fail("Unauthorized", 401);
  const items = await prisma.notification.findMany({ where: { userId: session.id }, orderBy: { createdAt: "desc" }, take: 50 });
  return ok({ items });
}
export async function POST() {
  const session = await requireSession(["STUDENT", "ADMIN", "PROVIDER"]);
  if (!session) return fail("Unauthorized", 401);
  await prisma.notification.updateMany({ where: { userId: session.id, isRead: false }, data: { isRead: true } });
  return ok({ updated: true });
}
