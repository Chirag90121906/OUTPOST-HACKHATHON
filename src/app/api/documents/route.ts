import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { fail, ok } from "@/lib/api";

const MAX = 5 * 1024 * 1024; // 5MB
const ALLOWED = new Set(["application/pdf", "image/png", "image/jpeg", "image/webp"]);

export async function GET() {
  const session = await requireSession(["STUDENT", "ADMIN"]);
  if (!session) return fail("Unauthorized", 401);
  const where = session.role === "ADMIN" ? {} : { userId: session.id };
  const items = await prisma.document.findMany({ where, orderBy: { createdAt: "desc" }, take: 100 });
  return ok({ items });
}

export async function POST(req: NextRequest) {
  const session = await requireSession(["STUDENT", "ADMIN"]);
  if (!session) return fail("Unauthorized", 401);
  try {
    const form = await req.formData();
    const file = form.get("file");
    const category = String(form.get("category") || "Other");
    if (!(file instanceof File)) return fail("Missing file");
    if (file.size > MAX) return fail("File too large (max 5MB)", 400);
    if (!ALLOWED.has(file.type)) return fail("Unsupported file type. Use PDF, PNG, JPEG, or WEBP.", 400);
    const safeBase = path.basename(file.name).replace(/[^a-zA-Z0-9._-]/g, "_");
    const storedName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${safeBase}`;
    const dir = path.join(process.cwd(), "data", "uploads", session.id);
    await fs.mkdir(dir, { recursive: true });
    const buf = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(dir, storedName), buf);
    const doc = await prisma.document.create({
      data: { userId: session.id, category, originalName: file.name, storedName, mimeType: file.type, size: file.size },
    });
    return ok({ document: doc }, 201);
  } catch {
    return fail("Upload failed", 500);
  }
}

export async function DELETE(req: NextRequest) {
  const session = await requireSession(["STUDENT", "ADMIN"]);
  if (!session) return fail("Unauthorized", 401);
  const { id } = await req.json().catch(() => ({}));
  if (!id) return fail("Missing id");
  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) return fail("Not found", 404);
  if (session.role !== "ADMIN" && doc.userId !== session.id) return fail("Forbidden", 403);
  const filePath = path.join(process.cwd(), "data", "uploads", doc.userId, doc.storedName);
  await fs.unlink(filePath).catch(() => null);
  await prisma.document.delete({ where: { id } });
  return ok({ deleted: true });
}
