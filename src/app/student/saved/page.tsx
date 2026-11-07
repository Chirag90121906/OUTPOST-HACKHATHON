import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ScholarshipCard } from "@/components/scholarships/scholarship-card";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";
export default async function SavedPage() {
  const session = await getSession();
  if (!session) return null;
  const items = await prisma.savedScholarship.findMany({ where: { userId: session.id }, include: { scholarship: true }, orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold tracking-tight">Saved scholarships</h2><p className="mt-1 text-slate-600">Bookmarks are stored in your account.</p></div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{items.map((i) => <ScholarshipCard key={i.id} s={i.scholarship} />)}</div>
      {items.length === 0 && <Card className="p-8 text-slate-600">No saved scholarships yet. Explore and bookmark opportunities.</Card>}
    </div>
  );
}
