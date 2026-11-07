import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export default async function Page() {
  const [scholarships, providers] = await Promise.all([
    prisma.scholarship.findMany({ where: { isVerified: false }, orderBy: { createdAt: "desc" }, take: 50 }).catch(() => []),
    prisma.provider.findMany({ where: { verified: false }, include: { user: true }, orderBy: { createdAt: "desc" } }).catch(() => []),
  ]);
  return (
    <div className="space-y-6">
      <div><h2 className="font-heading text-2xl font-bold tracking-tight">Scholarship Verification</h2><p className="mt-1 text-muted">Review pending providers and listings. Only mark items verified after actual verification.</p></div>
      <Card className="p-5 sm:p-6"><h3 className="font-heading font-semibold">Pending providers</h3><div className="mt-4 space-y-2">{providers.map(p=><div key={p.id} className="flex items-center justify-between rounded-xl border p-3"><div><div className="font-medium">{p.organization}</div><div className="text-sm text-muted">{p.user.email} · {formatDate(p.createdAt)}</div></div><Badge tone="warning">Pending</Badge></div>)}{providers.length===0&&<p className="text-sm text-muted">No pending providers.</p>}</div></Card>
      <Card className="p-5 sm:p-6"><h3 className="font-heading font-semibold">Unverified scholarships</h3><div className="mt-4 space-y-2">{scholarships.map(s=><div key={s.id} className="flex items-center justify-between rounded-xl border p-3"><div><div className="font-medium">{s.title}</div><div className="text-sm text-muted">{s.providerName} · {formatDate(s.createdAt)}</div></div><Badge tone={s.isPublished?"info":"neutral"}>{s.isPublished?"Published":"Draft"}</Badge></div>)}{scholarships.length===0&&<p className="text-sm text-muted">No unverified scholarships.</p>}</div></Card>
    </div>
  );
}
