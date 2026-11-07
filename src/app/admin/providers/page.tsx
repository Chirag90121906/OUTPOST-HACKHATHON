import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export default async function Page() {
  const items = await prisma.provider.findMany({ include: { user: true, _count: { select: { scholarships: true } } }, orderBy: { createdAt: "desc" } }).catch(() => []);
  return (
    <div className="space-y-6">
      <div><h2 className="font-heading text-2xl font-bold tracking-tight">Manage Providers</h2><p className="mt-1 text-muted">Provider organizations, verification status, and listing counts.</p></div>
      <div className="space-y-3">
        {items.map((p) => (
          <Card key={p.id} className="p-5"><div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div><div className="font-semibold">{p.organization}</div><div className="text-sm text-muted">{p.user.email} · {p._count.scholarships} scholarship(s) · Joined {formatDate(p.createdAt)}</div></div><Badge tone={p.verified?"success":"warning"}>{p.verified?"Verified":"Pending verification"}</Badge></div></Card>
        ))}
        {items.length===0 && <Card className="p-8 text-muted">No providers found.</Card>}
      </div>
    </div>
  );
}
