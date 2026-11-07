import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { fail } from "@/lib/api";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession(["STUDENT", "ADMIN"]);
  if (!session) return fail("Unauthorized", 401);
  const { id } = await params;
  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) return fail("Not found", 404);
  if (session.role !== "ADMIN" && doc.userId !== session.id) return fail("Forbidden", 403);
  const filePath = path.join(process.cwd(), "data", "uploads", doc.userId, doc.storedName);
  const data = await fs.readFile(filePath).catch(() => null);
  if (!data) return fail("File missing", 404);
  return new NextResponse(data, { headers: { "Content-Type": doc.mimeType, "Content-Disposition": `inline; filename="${doc.originalName.replace(/"/g, "")}"` } });
}
