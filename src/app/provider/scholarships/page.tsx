import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getProviderForUser } from "@/lib/provider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";
export default async function ProviderScholarships() {
  const session = await getSession();
  if (!session) return null;
  const provider = session.role === "ADMIN" ? null : await getProviderForUser(session.id);
  const items = await prisma.scholarship.findMany({ where: provider ? { providerId: provider.id } : {}, orderBy: { createdAt: "desc" } }).catch(() => []);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h2 className="font-heading text-2xl font-bold tracking-tight">My Scholarships</h2><p className="mt-1 text-muted">Manage listings, deadlines, and publication status.</p></div><Link href="/provider/create"><Button>Create Scholarship</Button></Link></div>
      <div className="space-y-3">
        {items.map((s) => (
          <Card key={s.id} className="p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div><div className="font-semibold">{s.title}</div><div className="text-sm text-muted">{formatCurrency(s.amount)} · Deadline {formatDate(s.deadline)}</div></div>
              <div className="flex gap-2"><Badge tone={s.isPublished ? "success" : "neutral"}>{s.isPublished ? "Published" : "Draft"}</Badge><Badge tone={s.isVerified ? "info" : "warning"}>{s.isVerified ? "Verified" : "Pending verification"}</Badge></div>
            </div>
          </Card>
        ))}
        {items.length === 0 && <Card className="p-8 text-muted">No scholarships yet. Create your first listing.</Card>}
      </div>
    </div>
  );
}
