import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { deadlineLabel, formatDate, daysUntil } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const items = await prisma.scholarship.findMany({ where: { isPublished: true }, orderBy: { deadline: "asc" }, take: 100 }).catch(() => []);
  const groups = [
    { title: "Closing today", filter: (d: any) => daysUntil(d) === 0 },
    { title: "Within 3 days", filter: (d: any) => { const n = daysUntil(d); return n != null && n > 0 && n <= 3; } },
    { title: "Within 7 days", filter: (d: any) => { const n = daysUntil(d); return n != null && n > 3 && n <= 7; } },
    { title: "Within 30 days", filter: (d: any) => { const n = daysUntil(d); return n != null && n > 7 && n <= 30; } },
    { title: "Later / TBA", filter: (d: any) => { const n = daysUntil(d); return n == null || n > 30; } },
  ];
  return (
    <div className="space-y-6">
      <div><h2 className="font-heading text-2xl font-bold tracking-tight">Smart Deadline Command Center</h2><p className="mt-1 text-muted">Upcoming deadlines from published scholarships (sample data labeled on listings). Always verify official dates.</p></div>
      <div className="grid gap-4 xl:grid-cols-2">
        {groups.map((g) => {
          const list = items.filter((s) => g.filter(s.deadline));
          return (
            <Card key={g.title} className="p-5">
              <div className="flex items-center justify-between"><h3 className="font-heading font-semibold">{g.title}</h3><Badge tone={g.title.includes("today") || g.title.includes("3") ? "danger" : g.title.includes("7") ? "warning" : "neutral"}>{list.length}</Badge></div>
              <div className="mt-4 space-y-2">
                {list.slice(0, 8).map((s) => { const dl = deadlineLabel(s.deadline); return (
                  <Link key={s.id} href={`/scholarships/${s.id}`} className="flex items-center justify-between gap-3 rounded-xl border p-3 text-sm hover:bg-ivory">
                    <span className="font-medium">{s.title}</span>
                    <span className="shrink-0 text-muted">{formatDate(s.deadline)}</span>
                  </Link>
                );})}
                {list.length === 0 && <p className="text-sm text-muted">No items in this window.</p>}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
