import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { fail, ok } from "@/lib/api";

const schema = z.object({ name: z.string().optional(), email: z.string().email().optional(), subject: z.string().min(2), message: z.string().min(5) });

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = schema.parse(await req.json());
    const ticket = await prisma.supportTicket.create({ data: { userId: session?.id, name: body.name || session?.name, email: body.email || session?.email, subject: body.subject, message: body.message } });
    return ok({ ticket }, 201);
  } catch (e: any) {
    if (e?.name === "ZodError") return fail("Please check the form.", 422);
    return fail("Could not submit request", 500);
  }
}
