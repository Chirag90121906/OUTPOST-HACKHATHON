import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Award, FileCheck, Search, Send, Star } from "lucide-react";

export const dynamic = "force-dynamic";
export default async function AchievementsPage() {
  const session = await getSession();
  if (!session) return null;
  const [profile, saved, apps, docs] = await Promise.all([
    prisma.studentProfile.findUnique({ where: { userId: session.id } }),
    prisma.savedScholarship.count({ where: { userId: session.id } }),
    prisma.application.count({ where: { userId: session.id } }),
    prisma.document.count({ where: { userId: session.id } }),
  ]).catch(() => [null,0,0,0] as any);
  const badges = [
    { title: "Profile Starter", desc: "Added profile information.", ok: (profile?.completionPercent ?? 0) >= 20, icon: Star },
    { title: "Opportunity Scout", desc: "Saved at least one scholarship.", ok: saved >= 1, icon: Search },
    { title: "Applicant", desc: "Created an application draft or submission.", ok: apps >= 1, icon: Send },
    { title: "Document Ready", desc: "Uploaded a supporting document.", ok: docs >= 1, icon: FileCheck },
    { title: "Profile Champion", desc: "Reached 70% profile completion.", ok: (profile?.completionPercent ?? 0) >= 70, icon: Award },
  ];
  return (
    <div className="space-y-6">
      <div><h2 className="font-heading text-2xl font-bold tracking-tight">Achievements</h2><p className="mt-1 text-muted">Badges reflect your real progress in GRANTLY. They celebrate preparation, not guaranteed scholarship outcomes.</p></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {badges.map((b) => (
          <Card key={b.title} className={`p-5 ${b.ok ? "border-accent/30 gold-glow" : "opacity-80"}`}>
            <div className="flex items-center gap-3"><span className={`flex h-11 w-11 items-center justify-center rounded-xl ${b.ok ? "bg-accent/20 text-primary" : "bg-slate-100 text-muted"}`}><b.icon size={18}/></span><div><div className="font-heading font-semibold">{b.title}</div><div className="text-xs text-muted">{b.ok ? "Earned" : "In progress"}</div></div></div>
            <p className="mt-3 text-sm text-muted">{b.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
