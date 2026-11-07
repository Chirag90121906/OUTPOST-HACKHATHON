import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { MarkRead } from "./mark-read";

export const dynamic = "force-dynamic";
export default async function NotificationsPage() {
  const session = await getSession(); if (!session) return null;
  const items = await prisma.notification.findMany({ where: { userId: session.id }, orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h2 className="text-2xl font-bold tracking-tight">Notifications</h2><p className="mt-1 text-slate-600">Deadline reminders, application events, and profile guidance.</p></div><MarkRead /></div>
      <div className="space-y-3">
        {items.map((n) => (
          <Card key={n.id} className={`p-4 ${n.isRead ? "opacity-80" : "border-secondary/20 bg-blue-50/20"}`}>
            <div className="font-medium">{n.title}</div>
            <p className="mt-1 text-sm text-slate-600">{n.message}</p>
            <div className="mt-2 text-xs text-slate-500">{formatDate(n.createdAt)} {n.isRead ? "" : "· Unread"}</div>
          </Card>
        ))}
        {items.length === 0 && <Card className="p-8 text-slate-600">No notifications yet.</Card>}
      </div>
    </div>
  );
}
