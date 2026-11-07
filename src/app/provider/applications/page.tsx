import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getProviderForUser } from "@/lib/provider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { ProviderStatusAction } from "./status-action";

export const dynamic = "force-dynamic";
export default async function ProviderApplications() {
  const session = await getSession();
  if (!session) return null;
  const provider = session.role === "ADMIN" ? null : await getProviderForUser(session.id);
  const items = await prisma.application.findMany({
    where: provider ? { scholarship: { providerId: provider.id } } : {},
    include: { scholarship: true, user: { select: { name: true, email: true } } },
    orderBy: { updatedAt: "desc" },
  }).catch(() => []);
  return (
    <div className="space-y-6">
      <div><h2 className="font-heading text-2xl font-bold tracking-tight">Applications Received</h2><p className="mt-1 text-muted">Review authorized applications for your own listings. Updates are recorded and notify students.</p></div>
      <div className="space-y-3">
        {items.map((a) => (
          <Card key={a.id} className="p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div><div className="font-semibold">{a.scholarship.title}</div><div className="text-sm text-muted">{a.user.name} ({a.user.email}) · Updated {formatDate(a.updatedAt)}</div></div>
              <div className="flex flex-wrap items-center gap-2"><Badge tone="info">{a.status.replaceAll("_"," ")}</Badge><ProviderStatusAction id={a.id} /></div>
            </div>
          </Card>
        ))}
        {items.length === 0 && <Card className="p-8 text-muted">No applications received for your listings yet.</Card>}
      </div>
    </div>
  );
}
