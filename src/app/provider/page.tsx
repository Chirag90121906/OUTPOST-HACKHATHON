import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getProviderForUser } from "@/lib/provider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProviderOverview() {
  const session = await getSession();
  if (!session) return null;
  const provider = session.role === "ADMIN" ? null : await getProviderForUser(session.id);
  const scholarshipWhere = provider ? { providerId: provider.id } : {};
  const appWhere = provider ? { scholarship: { providerId: provider.id } } : {};
  const [published, draft, active, expired, appsTotal, awaiting, recentApps, myScholarships] = await Promise.all([
    prisma.scholarship.count({ where: { ...scholarshipWhere, isPublished: true } }).catch(() => 0),
    prisma.scholarship.count({ where: { ...scholarshipWhere, isPublished: false } }).catch(() => 0),
    prisma.scholarship.count({ where: { ...scholarshipWhere, isPublished: true, OR: [{ deadline: null }, { deadline: { gte: new Date() } }] } }).catch(() => 0),
    prisma.scholarship.count({ where: { ...scholarshipWhere, deadline: { lt: new Date() } } }).catch(() => 0),
    prisma.application.count({ where: appWhere }).catch(() => 0),
    prisma.application.count({ where: { ...appWhere, status: { in: ["SUBMITTED", "UNDER_REVIEW", "DOCUMENTS_REQUIRED"] as any } } }).catch(() => 0),
    prisma.application.findMany({ where: appWhere, include: { scholarship: true, user: { select: { name: true } } }, orderBy: { updatedAt: "desc" }, take: 5 }).catch(() => []),
    prisma.scholarship.count({ where: scholarshipWhere }).catch(() => 0),
  ]);

  const stats = [
    ["Total scholarships", myScholarships], ["Published", published], ["Draft", draft], ["Active (not expired)", active],
    ["Expired", expired], ["Applications received", appsTotal], ["Awaiting review", awaiting],
  ];
  return (
    <div className="space-y-6">
      <div><h2 className="font-heading text-2xl font-bold tracking-tight">Provider Overview</h2><p className="mt-1 text-muted">{provider ? `${provider.organization}${provider.verified ? " · Verified" : " · Verification pending"}` : "Admin view across providers."}</p></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([l,v]) => <Card key={String(l)} className="p-5"><div className="text-sm text-muted">{l}</div><div className="mt-1 font-heading text-2xl font-bold text-primary">{v}</div></Card>)}
      </div>
      <Card className="p-5 sm:p-6">
        <div className="flex items-center justify-between"><h3 className="font-heading font-semibold">Recently submitted applications</h3><Link href="/provider/applications" className="text-sm font-medium text-secondary">View all</Link></div>
        <div className="mt-4 space-y-3">
          {recentApps.map((a) => (
            <div key={a.id} className="flex flex-col gap-2 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div><div className="font-medium">{a.scholarship.title}</div><div className="text-sm text-muted">{a.user.name} · {formatDate(a.updatedAt)}</div></div>
              <Badge tone="info">{a.status.replaceAll("_"," ")}</Badge>
            </div>
          ))}
          {recentApps.length === 0 && <p className="text-sm text-muted">No applications received yet for your listings.</p>}
        </div>
      </Card>
    </div>
  );
}
