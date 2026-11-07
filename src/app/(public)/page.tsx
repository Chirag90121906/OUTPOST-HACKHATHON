import Link from "next/link";
import { ArrowRight, BadgeCheck, BellRing, Compass, FileStack, Sparkles, Target, Wallet } from "lucide-react";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScholarshipCard } from "@/components/scholarships/scholarship-card";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let scholarships: any[] = [];
  let scholarshipCount = 0;
  let studentCount = 0;
  let applicationCount = 0;
  let fundingTotal = 0;
  try {
    const results = await Promise.all([
      prisma.scholarship.findMany({ where: { isPublished: true }, orderBy: [{ deadline: "asc" }], take: 6 }),
      prisma.scholarship.count({ where: { isPublished: true } }),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.application.count(),
      prisma.scholarship.aggregate({ _sum: { amount: true }, where: { isPublished: true } }).then((r) => r._sum.amount || 0),
    ]);
    scholarships = results[0] as any[];
    scholarshipCount = results[1] as number;
    studentCount = results[2] as number;
    applicationCount = results[3] as number;
    fundingTotal = results[4] as number;
  } catch {}

  const statCards = [
    { label: "Available Scholarships", value: `${Math.max(scholarshipCount, scholarships.length)}+`, sub: "Published listings" },
    { label: "Total Scholarship Funding", value: `₹${Math.round((fundingTotal || 595000) / 1000)}K+`, sub: "Illustrative demo total" },
    { label: "Students Supported", value: `${Math.max(studentCount, 1)}+`, sub: "Registered demo accounts" },
    { label: "Applications Tracked", value: `${Math.max(applicationCount, 1)}+`, sub: "Status-aware tracking" },
  ];

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
          <div>
            <Badge tone="info" className="mb-4">Premium scholarship discovery platform</Badge>
            <h1 className="text-balance text-4xl font-extrabold tracking-tight text-primary sm:text-5xl lg:text-6xl">
              Your Future Deserves Every Opportunity.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Discover scholarships that match your ambitions, simplify your applications and take control of your educational future with GRANTLY.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/explore"><Button size="lg">Explore Scholarships <ArrowRight size={18} /></Button></Link>
              <Link href="/register"><Button size="lg" variant="outline">Create Free Account</Button></Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
              <span className="flex items-center gap-1.5"><BadgeCheck size={16} className="text-success" /> Explainable matching</span>
              <span className="flex items-center gap-1.5"><FileStack size={16} className="text-secondary" /> Document checklist</span>
              <span className="flex items-center gap-1.5"><BellRing size={16} className="text-accent" /> Deadline reminders</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-secondary/10 via-white to-accent/10 blur-2xl" />
            <div className="relative grid gap-4">
              <Card className="p-5">
                <div className="flex items-center justify-between"><div><p className="text-sm text-slate-500">Student dashboard</p><p className="mt-1 text-xl font-semibold">Welcome back, Aarav</p></div><Badge tone="success">78% profile</Badge></div>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {[["Matches", "12"], ["Saved", "5"], ["Applied", "3"]].map(([k,v]) => (
                    <div key={k} className="rounded-xl bg-slate-50 p-3"><div className="text-xs text-slate-500">{k}</div><div className="mt-1 text-lg font-semibold">{v}</div></div>
                  ))}
                </div>
              </Card>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="p-5"><div className="flex items-center gap-2 text-sm font-medium"><Sparkles size={16} className="text-secondary" /> Strong match</div><p className="mt-2 text-sm text-slate-600">Your CGPA and course align with listed criteria. Income eligibility needs verification.</p></Card>
                <Card className="p-5"><div className="flex items-center gap-2 text-sm font-medium"><Target size={16} className="text-accent" /> Application tracker</div><div className="mt-3 h-2 rounded-full bg-slate-100"><div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-secondary to-accent" /></div><p className="mt-2 text-xs text-slate-500">Submitted → Under Review</p></Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((s) => (
            <Card key={s.label} className="p-5">
              <div className="text-2xl font-bold text-primary">{s.value}</div>
              <div className="mt-1 font-medium">{s.label}</div>
              <div className="mt-1 text-xs text-slate-500">{s.sub}</div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div><h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Featured scholarships</h2><p className="mt-2 text-slate-600">Sample listings for demonstration. Verify all details on official sources.</p></div>
          <Link href="/explore" className="hidden sm:block"><Button variant="outline">View all</Button></Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {scholarships.map((s) => <ScholarshipCard key={s.id} s={s} />)}
          {scholarships.length === 0 && <Card className="p-8 text-slate-600">No scholarships found. Run the seed script to load demo data.</Card>}
        </div>
      </section>

      <section className="border-y bg-white/70">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">How GRANTLY works</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              ["Create Your Profile", "Add academic, course, and eligibility details once.", Compass],
              ["Discover Matching Scholarships", "Search, filter, and get explainable recommendations.", Sparkles],
              ["Submit Your Applications", "Use checklists and document guidance before applying.", FileStack],
              ["Track Your Progress", "Monitor statuses, deadlines, and next steps in one place.", Target],
            ].map(([title, desc, Icon]: any, i) => (
              <Card key={title} className="p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white"><Icon size={18} /></div>
                <div className="mt-4 text-xs font-semibold text-secondary">Step {i + 1}</div>
                <h3 className="mt-1 font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-slate-600">{desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Built for real student workflows</h2>
            <p className="mt-3 text-slate-600">GRANTLY combines discovery, eligibility clarity, document readiness, and application tracking into one calm, reliable experience.</p>
            <div className="mt-6 space-y-3">
              {["Transparent eligibility checks with missing-information states.", "Role-based access for students, providers, and admins.", "Secure backend validation and private document handling design.", "Responsive, accessible UI for desktop and mobile."].map((t) => (
                <div key={t} className="flex items-start gap-3 text-sm text-slate-700"><BadgeCheck size={18} className="mt-0.5 text-success" /><span>{t}</span></div>
              ))}
            </div>
          </div>
          <Card className="p-6">
            <div className="flex items-center gap-2 font-semibold"><Wallet size={18} className="text-secondary" /> AI-powered matching explanation</div>
            <p className="mt-3 text-sm text-slate-600">GRANTLY uses a transparent, rule-based eligibility engine and can be extended with an LLM assistant through a secure backend endpoint when API credentials are configured. It never invents official eligibility decisions.</p>
            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm">
              <div className="font-medium text-foreground">Example explanation</div>
              <p className="mt-1 text-slate-600">“Potentially eligible — your education level and course align. Add family income to verify the income requirement before applying.”</p>
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-primary px-6 py-10 text-white sm:px-10">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Start your scholarship journey with GRANTLY</h2>
              <p className="mt-2 max-w-2xl text-white/75">Create a profile, discover relevant opportunities, and track every application with clarity.</p>
            </div>
            <Link href="/register"><Button size="lg" variant="secondary">Get Started Free</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
