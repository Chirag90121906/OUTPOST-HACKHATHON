import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { matchScholarship } from "@/lib/matching";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, deadlineLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function RecommendedPage() {
  const session = await getSession();
  if (!session) return null;
  const [profile, scholarships] = await Promise.all([
    prisma.studentProfile.findUnique({ where: { userId: session.id } }),
    prisma.scholarship.findMany({ where: { isPublished: true }, take: 50 }),
  ]);
  const ranked = scholarships.map((s) => ({ s, m: matchScholarship(profile || {}, s) }))
    .sort((a, b) => b.m.score - a.m.score);
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold tracking-tight">Recommended scholarships</h2><p className="mt-1 text-slate-600">Explainable, rule-based matching from your profile. Always verify official eligibility before applying.</p></div>
      {!profile && <Card className="p-5"><p className="text-sm text-slate-700">Complete your profile to improve recommendations. <Link href="/student/profile" className="text-secondary underline">Go to profile</Link></p></Card>}
      <div className="grid gap-5">
        {ranked.map(({ s, m }) => {
          const d = deadlineLabel(s.deadline);
          const tone = m.status === "Eligible" ? "success" : m.status === "Not Eligible" ? "danger" : m.status === "Potentially Eligible" ? "warning" : "neutral";
          return (
            <Card key={s.id} className="p-5 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{s.title}</h3>
                    <Badge tone={tone as any}>{m.status}</Badge>
                    <Badge tone="info">Match {m.score}%</Badge>
                    <Badge tone={d.tone}>{d.text}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{s.providerName} · {formatCurrency(s.amount, s.currency)}</p>
                  {m.reasons.length > 0 && <ul className="mt-3 space-y-1 text-sm text-slate-700">{m.reasons.map((r) => <li key={r}>• {r}</li>)}</ul>}
                  {m.missing.length > 0 && <p className="mt-2 text-sm text-amber-700"><strong>Missing info:</strong> {m.missing.join(", ")}</p>}
                  {m.failed.length > 0 && <p className="mt-2 text-sm text-red-700"><strong>Checks to review:</strong> {m.failed.join(" ")}</p>}
                </div>
                <div className="flex shrink-0 gap-2"><Link href={`/scholarships/${s.id}`}><Button variant="outline">Details</Button></Link></div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
