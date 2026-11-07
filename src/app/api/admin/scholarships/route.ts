import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { fail, ok } from "@/lib/api";

export async function GET() {
  const session = await requireSession(["ADMIN"]);
  if (!session) return fail("Unauthorized", 401);
  const items = await prisma.scholarship.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return ok({ items });
}

export async function POST(req: NextRequest) {
  const session = await requireSession(["ADMIN"]);
  if (!session) return fail("Unauthorized", 401);
  const b = await req.json().catch(() => ({}));
  if (!b.title || !b.description) return fail("Title and description are required");
  const item = await prisma.scholarship.create({
    data: {
      title: b.title, providerName: b.providerName || "Provider", organization: b.organization || null,
      description: b.description, benefits: b.benefits || null,
      amount: b.amount ? Number(b.amount) : null, fundingType: b.fundingType || null,
      educationLevels: b.educationLevels || null, eligibleCourses: b.eligibleCourses || null, eligibleStates: b.eligibleStates || null,
      minCgpa: b.minCgpa ? Number(b.minCgpa) : null, minPercentage: b.minPercentage ? Number(b.minPercentage) : null,
      maxFamilyIncome: b.maxFamilyIncome ? Number(b.maxFamilyIncome) : null,
      requiredDocuments: b.requiredDocuments || null, applicationProcedure: b.applicationProcedure || null,
      officialUrl: b.officialUrl || null, applicationUrl: b.applicationUrl || null,
      deadline: b.deadline ? new Date(b.deadline) : null, openDate: b.openDate ? new Date(b.openDate) : null,
      isPublished: b.isPublished !== false, isDemo: !!b.isDemo, isVerified: !!b.isVerified,
    },
  });
  await prisma.auditLog.create({ data: { actorId: session.id, action: "CREATE_SCHOLARSHIP", entity: "Scholarship", entityId: item.id } }).catch(() => null);
  return ok({ item }, 201);
}
