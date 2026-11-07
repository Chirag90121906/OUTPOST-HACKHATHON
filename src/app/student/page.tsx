import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, deadlineLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function StudentDashboard() {
  const session = await getSession();
  if (!session) return null;
  const [profile, saved, apps, notifications, scholarships] = await Promise.all([
    prisma.studentProfile.findUnique({ where: { userId: session.id } }),
    prisma.savedScholarship.count({ where: { userId: session.id } }),
    prisma.application.findMany({ where: { userId: session.id }, include: { scholarship: true }, orderBy: { updatedAt: "desc" }, take: 5 }),
    prisma.notification.findMany({ where: { userId: session.id }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.scholarship.findMany({ where: { isPublished: true }, orderBy: { deadline: "asc" }, take: 4 }),
  ]).catch(() => [null, 0, [], [], []] as any);
  const completion = profile?.completionPercent ?? 0;
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><h2 className="text-2xl font-bold tracking-tight">Welcome back, {session.name.split(" ")[0]}</h2><p className="mt-1 text-slate-600">Track opportunities, applications, and deadlines from one place.</p></div>
        <Link href="/explore"><Button>Discover Scholarships</Button></Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5"><div className="text-sm text-slate-500">Profile completion</div><div className="mt-1 text-2xl font-bold">{completion}%</div><div className="mt-3 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-secondary" style={{ width: `${completion}%` }} /></div></Card>
        <Card className="p-5"><div className="text-sm text-slate-500">Saved scholarships</div><div className="mt-1 text-2xl font-bold">{saved}</div><Link href="/student/saved" className="mt-2 inline-block text-sm text-secondary">View saved</Link></Card>
        <Card className="p-5"><div className="text-sm text-slate-500">Applications</div><div className="mt-1 text-2xl font-bold">{apps.length}</div><Link href="/student/applications" className="mt-2 inline-block text-sm text-secondary">Track progress</Link></Card>
        <Card className="p-5"><div className="text-sm text-slate-500">Notifications</div><div className="mt-1 text-2xl font-bold">{notifications.filter((n:any)=>!n.isRead).length}</div><Link href="/student/notifications" className="mt-2 inline-block text-sm text-secondary">Open center</Link></Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between"><h3 className="font-semibold">Recent applications</h3><Link href="/student/applications" className="text-sm text-secondary">All applications</Link></div>
          <div className="mt-4 space-y-3">
            {apps.map((a: any) => (
              <div key={a.id} className="flex flex-col gap-2 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
                <div><div className="font-medium">{a.scholarship?.title}</div><div className="text-sm text-slate-500">Updated {formatDate(a.updatedAt)}</div></div>
                <Badge tone={a.status === "APPROVED" ? "success" : a.status === "REJECTED" ? "danger" : a.status === "SUBMITTED" ? "info" : "neutral"}>{a.status.replaceAll("_"," ")}</Badge>
              </div>
            ))}
            {apps.length === 0 && <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">No applications yet. Explore scholarships and start with a draft.</div>}
          </div>
        </Card>
        <Card className="p-5 sm:p-6">
          <h3 className="font-semibold">Upcoming deadlines</h3>
          <div className="mt-4 space-y-3">
            {scholarships.map((s: any) => { const d = deadlineLabel(s.deadline); return (
              <Link key={s.id} href={`/scholarships/${s.id}`} className="block rounded-xl border p-3 hover:bg-slate-50">
                <div className="flex items-start justify-between gap-2"><span className="text-sm font-medium">{s.title}</span><Badge tone={d.tone}>{d.text}</Badge></div>
              </Link>
            );})}
          </div>
        </Card>
      </div>
    </div>
  );
}
