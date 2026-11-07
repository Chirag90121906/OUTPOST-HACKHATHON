import { prisma } from "@/lib/db";
import { ok, fail } from "@/lib/api";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const item = await prisma.scholarship.findUnique({ where: { id }, include: { category: true, provider: true } });
    if (!item) return fail("Scholarship not found", 404);
    return ok({ item });
  } catch { return fail("Failed to load scholarship", 500); }
}
