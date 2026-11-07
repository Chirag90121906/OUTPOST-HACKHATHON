import { z } from "zod";
import { requireSession } from "@/lib/auth";
import { fail, ok } from "@/lib/api";
import { prisma } from "@/lib/db";

const locationSchema = z.object({
  city: z.string().trim().max(100).optional(),
  state: z.string().trim().max(100).optional(),
  clear: z.boolean().optional(),
}).refine(
  (value) => value.clear || value.city !== undefined || value.state !== undefined,
  "Enter a city or state, or choose clear saved location.",
);

const profileFields = [
  "educationLevel",
  "institution",
  "degree",
  "course",
  "currentYear",
  "graduationYear",
  "cgpa",
  "percentage",
  "state",
  "city",
  "familyIncome",
  "incomeCategory",
  "skills",
  "achievements",
] as const;

export async function POST(request: Request) {
  const session = await requireSession(["STUDENT", "ADMIN"]);
  if (!session) return fail("Unauthorized", 401);

  const parsed = locationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail("Enter a valid city or state.", 400, parsed.error.flatten());

  const { city, state, clear } = parsed.data;
  const existing = await prisma.studentProfile.findUnique({
    where: { userId: session.id },
  });
  const location = clear
    ? { city: null, state: null }
    : { city: city ?? existing?.city ?? null, state: state ?? existing?.state ?? null };
  const profileData = {
    educationLevel: existing?.educationLevel ?? null,
    institution: existing?.institution ?? null,
    degree: existing?.degree ?? null,
    course: existing?.course ?? null,
    currentYear: existing?.currentYear ?? null,
    graduationYear: existing?.graduationYear ?? null,
    cgpa: existing?.cgpa ?? null,
    percentage: existing?.percentage ?? null,
    ...location,
    familyIncome: existing?.familyIncome ?? null,
    incomeCategory: existing?.incomeCategory ?? null,
    skills: existing?.skills ?? null,
    achievements: existing?.achievements ?? null,
  };
  const filled = profileFields.filter((field) => {
    const value = profileData[field];
    return value !== null && value !== "";
  }).length;
  const completionPercent = Math.min(100, Math.round((filled / profileFields.length) * 100));

  const profile = await prisma.studentProfile.upsert({
    where: { userId: session.id },
    update: { ...location, completionPercent },
    create: { userId: session.id, ...location, completionPercent },
    select: { city: true, state: true },
  });

  return ok({ location: profile });
}
