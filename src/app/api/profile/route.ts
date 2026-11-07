import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { fail, ok } from "@/lib/api";

export async function GET() {
  const session = await requireSession(["STUDENT", "ADMIN"]);
  if (!session) return fail("Unauthorized", 401);
  const profile = await prisma.studentProfile.findUnique({ where: { userId: session.id } });
  return ok({ profile });
}

export async function POST(req: NextRequest) {
  const session = await requireSession(["STUDENT", "ADMIN"]);
  if (!session) return fail("Unauthorized", 401);
  const body = await req.json().catch(() => ({}));
  const data = {
    educationLevel: body.educationLevel || null,
    institution: body.institution || null,
    degree: body.degree || null,
    course: body.course || null,
    currentYear: body.currentYear || null,
    graduationYear: body.graduationYear ? Number(body.graduationYear) : null,
    cgpa: body.cgpa ? Number(body.cgpa) : null,
    percentage: body.percentage ? Number(body.percentage) : null,
    state: body.state || null,
    city: body.city || null,
    familyIncome: body.familyIncome ? Number(body.familyIncome) : null,
    incomeCategory: body.incomeCategory || null,
    skills: body.skills || null,
    achievements: body.achievements || null,
  };
  const filled = Object.values(data).filter((v) => v !== null && v !== "").length;
  const completionPercent = Math.min(100, Math.round((filled / Object.keys(data).length) * 100));
  const profile = await prisma.studentProfile.upsert({
    where: { userId: session.id },
    update: { ...data, completionPercent },
    create: { userId: session.id, ...data, completionPercent },
  });
  return ok({ profile });
}
