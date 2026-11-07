import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, Calendar, FileText, IndianRupee } from "lucide-react";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deadlineLabel, formatCurrency, formatDate } from "@/lib/utils";
import { getSession } from "@/lib/auth";
import { matchScholarship } from "@/lib/matching";
import { ScholarshipActions } from "@/components/scholarships/scholarship-actions";

export const dynamic = "force-dynamic";

export default async function ScholarshipDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [s, session] = await Promise.all([prisma.scholarship.findUnique({ where: { id }, include: { category: true } }), getSession()]);
  if (!s) notFound();
  const profile = session ? await prisma.studentProfile.findUnique({ where: { userId: session.id } }).catch(() => null) : null;
  const match = session ? matchScholarship(profile || {}, s) : null;
  const d = deadlineLabel(s.deadline);
  const docs = (s.requiredDocuments || "").split(",").map((x) => x.trim()).filter(Boolean);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/explore" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-primary"><ArrowLeft size={16} /> Back to explore</Link>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">{s.providerName}</p>
                  <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{s.title}</h1>
                </div>
                <div className="flex flex-wrap gap-2"><Badge tone={d.tone}>{d.text}</Badge>{s.isDemo && <Badge>Sample data</Badge>}</div>
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                <span className="flex items-center gap-1.5"><IndianRupee size={16} /> {formatCurrency(s.amount, s.currency)}</span>
                <span className="flex items-center gap-1.5"><Calendar size={16} /> Deadline: {formatDate(s.deadline)}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <section><h2 className="font-semibold">Description</h2><p className="mt-2 text-sm leading-7 text-slate-700">{s.description}</p></section>
              {s.benefits && <section><h2 className="font-semibold">Benefits</h2><p className="mt-2 text-sm leading-7 text-slate-700">{s.benefits}</p></section>}
              <section><h2 className="font-semibold">Eligibility summary</h2>
                <ul className="mt-2 space-y-2 text-sm text-slate-700">
                  {s.educationLevels && <li><strong>Education levels:</strong> {s.educationLevels}</li>}
                  {s.eligibleCourses && <li><strong>Eligible courses:</strong> {s.eligibleCourses}</li>}
                  {s.eligibleStates && <li><strong>Eligible locations:</strong> {s.eligibleStates}</li>}
                  {s.minCgpa != null && <li><strong>Minimum CGPA:</strong> {s.minCgpa}</li>}
                  {s.minPercentage != null && <li><strong>Minimum percentage:</strong> {s.minPercentage}%</li>}
                  {s.maxFamilyIncome != null && <li><strong>Max family income:</strong> {formatCurrency(s.maxFamilyIncome, s.currency)}</li>}
                </ul>
              </section>
              {docs.length > 0 && <section><h2 className="font-semibold flex items-center gap-2"><FileText size={16}/> Required documents</h2><ul className="mt-2 grid gap-2 sm:grid-cols-2">{docs.map((d) => <li key={d} className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">{d}</li>)}</ul></section>}
              {s.applicationProcedure && <section><h2 className="font-semibold">Application procedure</h2><p className="mt-2 text-sm leading-7 text-slate-700">{s.applicationProcedure}</p></section>}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Card className="p-5">
            <CardTitle>Take action</CardTitle>
            <p className="mt-2 text-sm text-slate-600">Save, draft, submit (demo workflow), and compare opportunities.</p>
            <div className="mt-4">
              <ScholarshipActions id={s.id} officialUrl={s.officialUrl} isLoggedIn={!!session} />
            </div>
            <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">This listing may be demo/sample data. Always verify eligibility, deadlines, and links on the official provider website.</div>
          </Card>
          <Card className="p-5">
            <div className="font-semibold flex items-center gap-2"><BadgeCheck size={16} className="text-success"/> Eligibility check</div>
            {!match ? (
              <p className="mt-2 text-sm text-slate-600">Log in and complete your profile for an explainable match result (Eligible, Potentially Eligible, Not Eligible, or Insufficient Information).</p>
            ) : (
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center gap-2"><Badge tone={match.status === "Eligible" ? "success" : match.status === "Not Eligible" ? "danger" : match.status === "Potentially Eligible" ? "warning" : "neutral"}>{match.status}</Badge><span className="text-slate-500">Score {match.score}%</span></div>
                {match.reasons.slice(0, 3).map((r) => <p key={r} className="text-slate-700">• {r}</p>)}
                {match.missing.length > 0 && <p className="text-amber-700"><strong>Missing:</strong> {match.missing.join(", ")}</p>}
                {match.failed.length > 0 && <p className="text-red-700"><strong>Review:</strong> {match.failed[0]}</p>}
                <Link href="/student/profile" className="inline-block pt-1 text-secondary underline">Update profile</Link>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
