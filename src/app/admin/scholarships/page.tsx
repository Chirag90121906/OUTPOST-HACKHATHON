import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export default async function AdminScholarships() {
  const items = await prisma.scholarship.findMany({ orderBy: { createdAt: "desc" }, take: 50 }).catch(() => []);
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold tracking-tight">Scholarship management</h2><p className="mt-1 text-slate-600">Review listings, publication status, and key details. Create/edit workflows can be extended via admin APIs.</p></div>
      <div className="space-y-3">
        {items.map((s) => (
          <Card key={s.id} className="p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div><div className="font-semibold">{s.title}</div><div className="text-sm text-slate-500">{s.providerName} · {formatCurrency(s.amount, s.currency)} · Deadline {formatDate(s.deadline)}</div></div>
              <div className="flex gap-2"><Badge tone={s.isPublished ? "success" : "neutral"}>{s.isPublished ? "Published" : "Draft"}</Badge>{s.isDemo && <Badge>Demo</Badge>}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
