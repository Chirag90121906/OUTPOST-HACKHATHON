import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { fail, ok } from "@/lib/api";
import { getProviderForUser } from "@/lib/provider";

export async function GET() {
  const session = await requireSession(["PROVIDER", "ADMIN"]);
  if (!session) return fail("Unauthorized", 401);
  if (session.role === "ADMIN") {
    const items = await prisma.scholarship.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
    return ok({ items });
  }
  const provider = await getProviderForUser(session.id);
  if (!provider) return fail("Provider profile not found", 404);
  const items = await prisma.scholarship.findMany({ where: { providerId: provider.id }, orderBy: { createdAt: "desc" } });
  return ok({ items });
}

export async function POST(req: NextRequest) {
  const session = await requireSession(["PROVIDER", "ADMIN"]);
  if (!session) return fail("Unauthorized", 401);
  const provider = session.role === "PROVIDER" ? await getProviderForUser(session.id) : null;
  if (session.role === "PROVIDER" && !provider) return fail("Provider profile not found", 404);
  const b = await req.json().catch(() => ({}));
  if (!b.title || !b.description) return fail("Title and description are required");
  const item = await prisma.scholarship.create({
    data: {
      title: b.title,
      providerName: provider?.organization || b.providerName || session.name,
      organization: provider?.organization || b.organization || null,
      description: b.description,
      benefits: b.benefits || null,
      amount: b.amount ? Number(b.amount) : null,
      fundingType: b.fundingType || null,
      providerId: provider?.id || null,
      educationLevels: b.educationLevels || null,
      eligibleCourses: b.eligibleCourses || null,
      eligibleStates: b.eligibleStates || null,
      minCgpa: b.minCgpa ? Number(b.minCgpa) : null,
      maxFamilyIncome: b.maxFamilyIncome ? Number(b.maxFamilyIncome) : null,
      requiredDocuments: b.requiredDocuments || null,
      applicationProcedure: b.applicationProcedure || null,
      officialUrl: b.officialUrl || null,
      applicationUrl: b.applicationUrl || null,
      deadline: b.deadline ? new Date(b.deadline) : null,
      isPublished: !!b.isPublished,
      isDemo: !!b.isDemo,
      isVerified: false,
    },
  });
  return ok({ item }, 201);
}
