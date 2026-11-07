import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { fail, ok } from "@/lib/api";
import { getProviderForUser } from "@/lib/provider";

export async function GET() {
  const session = await requireSession(["PROVIDER", "ADMIN"]);
  if (!session) return fail("Unauthorized", 401);
  if (session.role === "ADMIN") {
    const items = await prisma.application.findMany({ include: { scholarship: true, user: { select: { name: true, email: true } } }, orderBy: { updatedAt: "desc" }, take: 100 });
    return ok({ items });
  }
  const provider = await getProviderForUser(session.id);
  if (!provider) return fail("Provider profile not found", 404);
  const items = await prisma.application.findMany({
    where: { scholarship: { providerId: provider.id } },
    include: { scholarship: true, user: { select: { name: true, email: true } } },
    orderBy: { updatedAt: "desc" },
  });
  return ok({ items });
}
