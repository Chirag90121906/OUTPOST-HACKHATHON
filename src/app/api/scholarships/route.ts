import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { ok, fail } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const q = sp.get("q")?.trim();
    const category = sp.get("category");
    const level = sp.get("level");
    const funding = sp.get("funding");
    const sort = sp.get("sort") || "deadline";
    const where: any = { isPublished: true };
    if (q) where.OR = [{ title: { contains: q } }, { providerName: { contains: q } }, { description: { contains: q } }, { eligibleCourses: { contains: q } }];
    if (category) where.category = { slug: category };
    if (level) where.educationLevels = { contains: level };
    if (funding) where.fundingType = funding;
    const orderBy = sort === "amount_desc" ? { amount: "desc" } : sort === "amount_asc" ? { amount: "asc" } : sort === "recent" ? { createdAt: "desc" } : sort === "title" ? { title: "asc" } : { deadline: "asc" };
    const items = await prisma.scholarship.findMany({ where, orderBy: orderBy as any, include: { category: true }, take: 60 });
    return ok({ items });
  } catch { return fail("Failed to load scholarships", 500); }
}
