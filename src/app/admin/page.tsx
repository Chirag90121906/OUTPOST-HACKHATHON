import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";
export default async function AdminDashboard() {
  const [students, scholarships, active, applications, approved, pending] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.scholarship.count(),
    prisma.scholarship.count({ where: { isPublished: true } }),
    prisma.application.count(),
    prisma.application.count({ where: { status: "APPROVED" } }),
    prisma.application.count({ where: { status: { in: ["SUBMITTED", "UNDER_REVIEW", "DRAFT"] as any } } }),
  ]).catch(() => [0,0,0,0,0,0]);
  const cards = [["Total students", students],["Total scholarships", scholarships],["Active scholarships", active],["Total applications", applications],["Approved applications", approved],["Pending/review/draft", pending]] as const;
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold tracking-tight">Admin dashboard</h2><p className="mt-1 text-slate-600">Real database aggregates for platform oversight.</p></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map(([l,v])=><Card key={l} className="p-5"><div className="text-sm text-slate-500">{l}</div><div className="mt-1 text-3xl font-bold text-primary">{v}</div></Card>)}</div>
    </div>
  );
}
