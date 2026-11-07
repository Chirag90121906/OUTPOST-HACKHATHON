import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";
export default async function Page() {
  const items = await prisma.scholarshipCategory.findMany({ include: { _count: { select: { scholarships: true } } }, orderBy: { name: "asc" } }).catch(() => []);
  return (
    <div className="space-y-6">
      <div><h2 className="font-heading text-2xl font-bold tracking-tight">Categories</h2><p className="mt-1 text-muted">Scholarship categories and listing counts.</p></div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((c) => <Card key={c.id} className="p-5"><div className="font-semibold">{c.name}</div><div className="text-sm text-muted">{c.slug} · {c._count.scholarships} scholarship(s)</div></Card>)}
        {items.length===0 && <Card className="p-8 text-muted">No categories. Run seed or add category management.</Card>}
      </div>
    </div>
  );
}
