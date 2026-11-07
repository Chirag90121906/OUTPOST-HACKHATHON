import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";
export default async function Page() {
  const items = await prisma.review.findMany({ where: { type: "report" }, include: { scholarship: true, user: { select: { name: true, email: true } } }, orderBy: { createdAt: "desc" }, take: 100 }).catch(() => []);
  return (
    <div className="space-y-6">
      <div><h2 className="font-heading text-2xl font-bold tracking-tight">Reported Listings</h2><p className="mt-1 text-muted">User-submitted reports for incorrect, expired, duplicate, or suspicious scholarship listings.</p></div>
      <div className="space-y-3">
        {items.map((r) => (
          <Card key={r.id} className="p-5"><div className="flex flex-wrap items-start justify-between gap-2"><div><Link href={`/scholarships/${r.scholarshipId}`} className="font-semibold text-secondary hover:underline">{r.scholarship.title}</Link><div className="text-sm text-muted">{r.user?.email || "Guest"} · {formatDate(r.createdAt)}</div><p className="mt-2 text-sm text-foreground">{r.message}</p></div><Badge tone={r.status==="open"?"warning":"success"}>{r.status}</Badge></div></Card>
        ))}
        {items.length===0 && <Card className="p-8 text-muted">No reports submitted.</Card>}
      </div>
    </div>
  );
}
