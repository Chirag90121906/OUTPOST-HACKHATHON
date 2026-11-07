import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";
export default async function AdminDashboard() {
  const [students, providers, scholarships, active, pendingVerification, applications, reported] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }).catch(()=>0),
    prisma.provider.count().catch(()=>0),
    prisma.scholarship.count().catch(()=>0),
    prisma.scholarship.count({ where: { isPublished: true } }).catch(()=>0),
    prisma.scholarship.count({ where: { isVerified: false } }).catch(()=>0),
    prisma.application.count().catch(()=>0),
    prisma.review.count({ where: { type: "report", status: "open" } }).catch(()=>0),
  ]);
  const cards = [["Total students", students],["Total providers", providers],["Total scholarships", scholarships],["Active scholarships", active],["Pending verification", pendingVerification],["Total applications", applications],["Reported listings", reported]] as const;
  return (
    <div className="space-y-6">
      <div><h2 className="font-heading text-2xl font-bold tracking-tight">Admin Overview</h2><p className="mt-1 text-muted">Real database aggregates for platform oversight. Sensitive actions should be audited.</p></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([l,v])=><Card key={l} className="p-5"><div className="text-sm text-muted">{l}</div><div className="mt-1 font-heading text-3xl font-bold text-primary">{v}</div></Card>)}</div>
    </div>
  );
}
