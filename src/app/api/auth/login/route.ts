import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createSession, verifyPassword } from "@/lib/auth";
import { fail, ok } from "@/lib/api";

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const user = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } });
    if (!user || !(await verifyPassword(body.password, user.passwordHash))) return fail("Invalid email or password.", 401);
    if (!user.isActive) return fail("This account is inactive.", 403);
    await createSession({ id: user.id, name: user.name, email: user.email, role: user.role });
    return ok({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (e: any) {
    if (e?.name === "ZodError") return fail("Invalid login data.", 422);
    return fail("Login failed.", 500);
  }
}
