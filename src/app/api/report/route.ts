import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { fail, ok } from "@/lib/api";

const schema = z.object({ scholarshipId: z.string().min(1), message: z.string().min(5) });

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = schema.parse(await req.json());
    const item = await prisma.review.create({ data: { scholarshipId: body.scholarshipId, userId: session?.id, message: body.message, type: "report", status: "open" } });
    return ok({ report: item }, 201);
  } catch (e: any) {
    if (e?.name === "ZodError") return fail("Please provide details (at least 5 characters).", 422);
    return fail("Could not submit report", 500);
  }
}
