import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, Calendar, ExternalLink, FileText, Globe, IndianRupee } from "lucide-react";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deadlineLabel, formatCurrency, formatDate } from "@/lib/utils";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ScholarshipDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [s, session] = await Promise.all([prisma.scholarship.findUnique({ where: { id }, include: { category: true } }), getSession()]);
  if (!s) notFound();
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
            <p className="mt-2 text-sm text-slate-600">Save, check eligibility in your dashboard, and track your application progress.</p>
            <div className="mt-4 grid gap-2">
              <Link href={session ? `/student/applications?apply=${s.id}` : `/login?next=/scholarships/${s.id}`}><Button className="w-full">Apply / Track</Button></Link>
              <Link href={session ? `/student/saved?save=${s.id}` : `/login?next=/scholarships/${s.id}`}><Button variant="outline" className="w-full">Save Scholarship</Button></Link>
              {s.officialUrl && <a href={s.officialUrl} target="_blank" rel="noreferrer"><Button variant="ghost" className="w-full"><Globe size={16}/> Official Website <ExternalLink size={14}/></Button></a>}
            </div>
            <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">This listing may be demo/sample data. Always verify eligibility, deadlines, and links on the official provider website.</div>
          </Card>
          <Card className="p-5">
            <div className="font-semibold flex items-center gap-2"><BadgeCheck size={16} className="text-success"/> Eligibility guidance</div>
            <p className="mt-2 text-sm text-slate-600">Log in and complete your profile for an explainable match result (Eligible, Potentially Eligible, Not Eligible, or Insufficient Information).</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
