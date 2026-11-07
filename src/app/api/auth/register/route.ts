import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createSession, hashPassword } from "@/lib/auth";
import { fail, ok } from "@/lib/api";
import { Role } from "@prisma/client";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
  phone: z.string().optional(),
  educationLevel: z.string().optional(),
  institution: z.string().optional(),
  course: z.string().optional(),
  graduationYear: z.coerce.number().int().optional(),
  role: z.enum(["STUDENT", "PROVIDER"]).optional(),
}).refine((d) => d.password === d.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const existing = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } });
    if (existing) return fail("An account with this email already exists.", 409);
    const role = body.role === "PROVIDER" ? Role.PROVIDER : Role.STUDENT;
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email.toLowerCase(),
        passwordHash: await hashPassword(body.password),
        phone: body.phone,
        role,
        studentProfile: role === Role.STUDENT ? {
          create: {
            educationLevel: body.educationLevel,
            institution: body.institution,
            course: body.course,
            graduationYear: body.graduationYear,
            completionPercent: [body.educationLevel, body.institution, body.course].filter(Boolean).length * 15,
          },
        } : undefined,
        provider: role === Role.PROVIDER ? { create: { organization: body.institution || body.name, verified: false } } : undefined,
      },
      select: { id: true, name: true, email: true, role: true },
    });
    await createSession(user);
    return ok({ user }, 201);
  } catch (e: any) {
    if (e?.name === "ZodError") return fail("Please check the form fields.", 422, e.errors);
    return fail("Registration failed.", 500);
  }
}
