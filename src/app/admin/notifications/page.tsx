import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
export const dynamic = "force-dynamic";
export default async function Page() {
  const s = await getSession(); if (!s) return null;
  const items = await prisma.notification.findMany({ where: { userId: s.id }, orderBy: { createdAt: "desc" }, take: 50 }).catch(() => []);
  return (<div className="space-y-6"><div><h2 className="font-heading text-2xl font-bold tracking-tight">Notifications</h2><p className="mt-1 text-muted">Admin account notifications.</p></div><div className="space-y-3">{items.map(n=><Card key={n.id} className="p-4"><div className="font-medium">{n.title}</div><p className="mt-1 text-sm text-muted">{n.message}</p><div className="mt-2 text-xs text-muted">{formatDate(n.createdAt)}</div></Card>)}{items.length===0&&<Card className="p-8 text-muted">No notifications.</Card>}</div></div>);
}
