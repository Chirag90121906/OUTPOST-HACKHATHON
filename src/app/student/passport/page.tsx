import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";
export default async function PassportPage() {
  const session = await getSession();
  if (!session) return null;
  const profile = await prisma.studentProfile.findUnique({ where: { userId: session.id } }).catch(() => null);
  const docs = await prisma.document.count({ where: { userId: session.id } }).catch(() => 0);
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div><h2 className="font-heading text-2xl font-bold tracking-tight">Opportunity Passport</h2><p className="mt-1 text-muted">A reusable profile summary for scholarship workflows. Review and update information before using it in applications.</p></div>
        <Link href="/student/profile"><Button variant="outline">Edit Profile</Button></Link>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h3 className="font-heading font-semibold">{session.name}</h3>
          <p className="text-sm text-muted">{session.email}</p>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            {[
              ["Education", profile?.educationLevel],["Institution", profile?.institution],["Degree", profile?.degree],["Course", profile?.course],
              ["CGPA", profile?.cgpa?.toString()],["Percentage", profile?.percentage?.toString()],["State", profile?.state],["Graduation year", profile?.graduationYear?.toString()],
              ["Skills", profile?.skills],["Achievements", profile?.achievements],
            ].map(([k,v]) => (<div key={String(k)}><dt className="text-muted">{k}</dt><dd className="font-medium text-foreground">{v || "—"}</dd></div>))}
          </dl>
        </Card>
        <Card className="p-5">
          <h3 className="font-heading font-semibold">Readiness</h3>
          <div className="mt-3 space-y-3 text-sm">
            <div className="flex items-center justify-between"><span>Profile completion</span><Badge tone="info">{profile?.completionPercent ?? 0}%</Badge></div>
            <div className="flex items-center justify-between"><span>Documents uploaded</span><Badge>{docs}</Badge></div>
          </div>
          <p className="mt-4 text-xs text-muted">Personal data is reused for applications only with your explicit submission actions. Export/consent workflows can be expanded for production.</p>
        </Card>
      </div>
    </div>
  );
}
