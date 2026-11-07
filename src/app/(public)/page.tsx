import Link from "next/link";
import { ArrowRight, BadgeCheck, BellRing, BookOpen, Building2, CalendarClock, ClipboardCheck, Compass, FileCheck2, FileStack, GraduationCap, MapPinned, MessageSquareText, Search, ShieldCheck, Sparkles, Target, UserRound, Wallet } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScholarshipCard } from "@/components/scholarships/scholarship-card";
import { HomeFaq } from "@/components/home/home-faq";

export const dynamic = "force-dynamic";

function SectionHeading({ dark, eyebrow, title, highlight, desc }: { dark?: boolean; eyebrow?: string; title: string; highlight?: string; desc?: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow && <div className={dark ? "text-xs font-semibold uppercase tracking-[0.18em] text-accent" : "text-xs font-semibold uppercase tracking-[0.18em] text-secondary"}>{eyebrow}</div>}
      <h2 className={`mt-2 font-heading text-2xl font-bold tracking-tight sm:text-3xl ${dark ? "text-white" : "text-primary"}`}>{title} {highlight && <span className={dark ? "text-accent" : "text-secondary"}>{highlight}</span>}</h2>
      {desc && <p className={`mt-3 text-base leading-7 ${dark ? "text-white/72" : "text-muted"}`}>{desc}</p>}
    </div>
  );
}

export default async function HomePage() {
  let scholarships: any[] = [];
  let scholarshipCount = 0;
  let studentCount = 0;
  let applicationCount = 0;
  let fundingTotal = 0;
  let session: any = null;
  let readiness: { completion: number; documents: number; hasProfile: boolean } | null = null;
  try {
    session = await getSession().catch(() => null);
    const readinessPromise = session?.role === "STUDENT"
      ? Promise.all([
          prisma.studentProfile.findUnique({ where: { userId: session.id }, select: { completionPercent: true } }).catch(() => null),
          prisma.document.count({ where: { userId: session.id } }).catch(() => 0),
        ]).then(([p, d]) => ({ completion: p?.completionPercent ?? 0, documents: d, hasProfile: !!p }))
      : Promise.resolve(null);
    const results = await Promise.all([
      prisma.scholarship.findMany({ where: { isPublished: true }, orderBy: [{ deadline: "asc" }], take: 4 }),
      prisma.scholarship.count({ where: { isPublished: true } }),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.application.count(),
      prisma.scholarship.aggregate({ _sum: { amount: true }, where: { isPublished: true } }).then((r) => r._sum.amount || 0),
      readinessPromise,
    ]);
    [scholarships, scholarshipCount, studentCount, applicationCount, fundingTotal, readiness] = results as any;
  } catch {}

  const statCards = [
    { label: "Published Scholarships", value: `${scholarshipCount}`, sub: "From database (live count)" },
    { label: "Funding Listed", value: fundingTotal ? `₹${Math.round(fundingTotal / 1000)}K+` : "—", sub: fundingTotal ? "Sum of published amounts" : "Live data appears when configured" },
    { label: "Student Accounts", value: `${studentCount}`, sub: "Registered students" },
    { label: "Applications Tracked", value: `${applicationCount}`, sub: "Status-aware records" },
  ];

  const categories = [
    ["Merit-based", GraduationCap], ["Need-based", Wallet], ["Government", Building2], ["Private/Trust", BadgeCheck],
    ["State & Regional", MapPinned], ["Women & Inclusion", UserRound], ["STEM & Research", BookOpen], ["Professional Courses", Target],
  ] as const;

  const why = [
    ["AI-powered matching", "Transparent, rule-based recommendations with clear reasons and missing criteria.", Sparkles],
    ["Eligibility checking", "Understand eligible, potentially eligible, and insufficient-information states before applying.", BadgeCheck],
    ["Application tracking", "Track drafts, submissions, and status changes in one calm workflow.", Target],
    ["Document readiness", "Keep required documents organized with checklists and secure handling design.", FileStack],
    ["Deadline reminders", "Stay ahead of closing dates with timelines and notification-ready workflows.", BellRing],
    ["Role-based ecosystem", "Students, providers, admins, and guests each get appropriate access and tools.", ShieldCheck],
  ];

  return (
    <div>
      {/* 1. Hero — Deep Navy */}
      <section className="relative overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 bg-[radial-gradient(900px_420px_at_15%_10%,rgba(35,63,112,.55),transparent_55%),radial-gradient(700px_360px_at_85%_20%,rgba(214,181,109,.18),transparent_55%)]" />
        <div className="absolute -left-16 top-24 h-40 w-40 rounded-full bg-accent/10 blur-2xl animate-float-soft" aria-hidden />
        <div className="absolute right-10 top-16 h-24 w-24 rounded-full bg-white/5 blur-xl animate-float-soft" style={{ animationDelay: "1.2s" }} aria-hidden />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
          <div className="animate-fade-up">
            <span className="mb-4 inline-flex items-center rounded-full border border-accent/25 bg-white/5 px-3 py-1 text-xs font-semibold text-accent">Royal Navy · Champagne Gold · Premium scholarship platform</span>
            <h1 className="text-balance font-heading text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">Your Future Deserves <span className="text-accent">Every Opportunity</span>.</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/78">Discover scholarships that match your ambitions, simplify your applications, and take control of your educational future with GRANTLY.</p>
            <form action="/explore" className="mt-7 flex max-w-xl flex-col gap-2 rounded-2xl border border-white/10 bg-white/8 p-2 backdrop-blur sm:flex-row">
              <div className="flex flex-1 items-center gap-2 rounded-xl bg-white px-3"><Search size={16} className="text-muted" /><Input name="q" placeholder="Search scholarships, courses, providers..." className="border-0 bg-transparent shadow-none focus-visible:outline-none" aria-label="Search scholarships" /></div>
              <Button type="submit" size="lg" className="bg-accent text-primary hover:bg-[#e1c37d]">Search</Button>
            </form>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/explore"><Button size="lg" variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white">Explore Scholarships <ArrowRight size={18} /></Button></Link>
              <Link href="/get-started"><Button size="lg" variant="secondary" className="animate-pulse-gold">Get Started</Button></Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/75">
              <span className="flex items-center gap-1.5"><BadgeCheck size={16} className="text-accent" /> Explainable matching</span>
              <span className="flex items-center gap-1.5"><FileStack size={16} className="text-accent" /> Document checklist</span>
              <span className="flex items-center gap-1.5"><BellRing size={16} className="text-accent" /> Deadline reminders</span>
            </div>
          </div>
          <div className="relative animate-fade-up" style={{ animationDelay: ".12s" }}>
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-secondary/20 via-transparent to-accent/15 blur-2xl" />
            <div className="relative grid gap-4">
              <Card className="border-[#d6b56d]/20 bg-white p-5 text-foreground shadow-xl">
                <div className="flex items-center justify-between"><div><p className="text-sm text-muted">Student dashboard preview</p><p className="mt-1 font-heading text-xl font-semibold">Welcome back</p></div><Badge tone="success">Profile insight</Badge></div>
                <div className="mt-5 grid grid-cols-3 gap-3">{[["Matches", "—"], ["Saved", "—"], ["Applied", "—"]].map(([k, v]) => (<div key={k} className="rounded-xl bg-ivory p-3"><div className="text-xs text-muted">{k}</div><div className="mt-1 text-lg font-semibold">{v}</div></div>))}</div>
                <p className="mt-3 text-xs text-muted">Preview illustration. Real counts appear in your dashboard after login and data setup.</p>
              </Card>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="border-white/10 bg-white/95 p-5 text-foreground"><div className="flex items-center gap-2 text-sm font-medium"><Sparkles size={16} className="text-accent" /> Strong match</div><p className="mt-2 text-sm text-muted">Transparent reasons and missing criteria are shown before you apply.</p></Card>
                <Card className="border-white/10 bg-white/95 p-5 text-foreground"><div className="flex items-center gap-2 text-sm font-medium"><Target size={16} className="text-secondary" /> Application tracker</div><div className="mt-3 h-2 rounded-full bg-ivory"><div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-secondary to-accent" /></div><p className="mt-2 text-xs text-muted">Draft → Submitted → Review</p></Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Statistics — Ivory */}
      <section className="bg-ivory">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Platform snapshot" title="Built on" highlight="real data" desc="Counts below reflect live database records when the environment is connected. Connect Vercel Postgres and seed data to populate listings." />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((s) => (
              <Card key={s.label} className="border-[#d6b56d]/20 p-6 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                <div className="font-heading text-3xl font-bold text-primary">{s.value}</div>
                <div className="mt-1 font-medium text-foreground">{s.label}</div>
                <div className="mt-2 text-xs text-muted">{s.sub}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Scholarships — Deep Navy */}
      <section className="bg-primary text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div><div className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Opportunities</div><h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">Featured <span className="text-accent">Scholarships</span></h2><p className="mt-2 max-w-2xl text-white/72">Published listings from the platform. Demo/sample data is labeled where applicable—always verify details on official sources.</p></div>
            {scholarships.length > 0 && <Link href="/explore" className="hidden sm:block"><Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10">View all</Button></Link>}
          </div>
          {scholarships.length > 0 ? (
            <>
              <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {scholarships.map((s) => <div key={s.id} className="text-foreground animate-fade-up"><ScholarshipCard s={s} /></div>)}
              </div>
              <Link href="/explore" className="mt-6 inline-block sm:hidden"><Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10">View all scholarships</Button></Link>
            </>
          ) : (
            <div className="mt-8 animate-fade-up">
              <div className="mx-auto max-w-5xl rounded-[1.75rem] border border-white/10 bg-white/5 p-6 sm:p-8">
                <div className="text-center">
                  <h3 className="font-heading text-2xl font-bold text-white sm:text-3xl">Your Next Scholarship Opportunity <span className="text-accent">Starts Here</span></h3>
                  <p className="mx-auto mt-3 max-w-2xl text-white/72">Explore scholarship opportunities, prepare your documents, and get ready to apply for financial support.</p>
                </div>
                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  <Card className="border-[#d6b56d]/20 bg-white p-5 text-foreground transition duration-200 hover:-translate-y-1 hover:shadow-xl">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10 text-secondary ring-1 ring-accent/25"><ClipboardCheck size={20} className="text-accent" /></div>
                    <h4 className="mt-4 font-heading font-semibold text-primary">Check Your Eligibility</h4>
                    <p className="mt-2 text-sm leading-6 text-muted">Understand the profile and eligibility information you’ll need before applying to opportunities.</p>
                    <Link href={session ? "/student/profile" : "/get-started"} className="mt-4 inline-block"><Button variant="outline" size="sm">{session ? "Complete Your Profile" : "Get Started"}</Button></Link>
                  </Card>
                  <Card className="border-[#d6b56d]/20 bg-white p-5 text-foreground transition duration-200 hover:-translate-y-1 hover:shadow-xl">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10 text-secondary ring-1 ring-accent/25"><FileCheck2 size={20} className="text-accent" /></div>
                    <h4 className="mt-4 font-heading font-semibold text-primary">Prepare Your Documents</h4>
                    <p className="mt-2 text-sm leading-6 text-muted">Common examples: academic marksheets, identity proof, income certificate, and admission proof. Actual requirements vary by scholarship.</p>
                    <Link href="/student/documents" className="mt-4 inline-block"><Button variant="outline" size="sm">Open Document Vault</Button></Link>
                  </Card>
                  <Card className="border-[#d6b56d]/20 bg-white p-5 text-foreground transition duration-200 hover:-translate-y-1 hover:shadow-xl">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10 text-secondary ring-1 ring-accent/25"><CalendarClock size={20} className="text-accent" /></div>
                    <h4 className="mt-4 font-heading font-semibold text-primary">Never Miss a Deadline</h4>
                    <p className="mt-2 text-sm leading-6 text-muted">Track application timelines and stay organized so you can apply with confidence.</p>
                    <Link href="/explore" className="mt-4 inline-block"><Button variant="outline" size="sm">Explore Scholarships</Button></Link>
                  </Card>
                </div>
                <div className="mt-8 text-center">
                  <Link href="/explore"><Button size="lg">Explore All Scholarships <ArrowRight size={18} /></Button></Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. Get Scholarship Ready — Ivory */}
      <section className="bg-ivory">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Preparation" title="Get Scholarship" highlight="Ready" desc={session?.role === "STUDENT" ? "A quick view of your preparation using your saved profile and document information." : "A simple path to prepare for scholarships. Sign in as a student for personalized progress."} />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { title: "Complete your student profile", text: "Add academic and eligibility details so matching and readiness checks can work.", icon: ClipboardCheck },
              { title: "Organize your required documents", text: "Keep commonly requested documents ready; each scholarship lists its own requirements.", icon: FileStack },
              { title: "Discover matching scholarships", text: "Search and review opportunities with transparent eligibility guidance.", icon: Search },
            ].map((s) => (
              <Card key={s.title} className="border-[#d6b56d]/15 p-5 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-accent"><s.icon size={18} /></div>
                <h3 className="mt-4 font-heading font-semibold text-primary">{s.title}</h3>
                <p className="mt-2 text-sm text-muted">{s.text}</p>
              </Card>
            ))}
          </div>
          {readiness ? (
            <Card className="mt-6 border-[#d6b56d]/20 p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-heading font-semibold text-primary">Your readiness (from saved data)</div>
                  <div className="mt-1 text-sm text-muted">Profile completion: <strong className="text-foreground">{readiness.completion}%</strong> · Documents on file: <strong className="text-foreground">{readiness.documents}</strong></div>
                </div>
                <Link href="/student/profile"><Button size="sm">Update profile</Button></Link>
              </div>
              <div className="mt-4 h-2 rounded-full bg-ivory"><div className="h-2 rounded-full bg-gradient-to-r from-secondary to-accent" style={{ width: `${Math.min(100, Math.max(0, readiness.completion))}%` }} /></div>
            </Card>
          ) : (
            <Card className="mt-6 border-[#d6b56d]/20 p-5 text-center sm:p-6">
              <p className="text-sm text-muted">Guests can explore scholarships now. Create an account to save progress and see personalized readiness.</p>
              <div className="mt-4"><Link href="/get-started"><Button>Get Started</Button></Link></div>
            </Card>
          )}
        </div>
      </section>

      {/* 5. Categories — Deep Navy */}
      <section className="bg-primary text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading dark eyebrow="Browse" title="Scholarship" highlight="Categories" desc="Explore common opportunity types. Filters on the Explore page help you narrow by eligibility, amount, deadline, and more." />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map(([name, Icon]) => (
              <Link key={name} href={`/explore?q=${encodeURIComponent(name.split(/[\s&]/)[0])}`} className="group">
                <Card className="h-full border-white/10 bg-white/95 p-5 text-foreground transition duration-200 hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10 text-secondary ring-1 ring-accent/20 transition group-hover:bg-primary group-hover:text-accent"><Icon size={20} /></div>
                  <h3 className="mt-4 font-heading font-semibold text-primary">{name}</h3>
                  <p className="mt-1 text-sm text-muted">Discover relevant listings</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. How GRANTLY Works — Ivory */}
      <section className="bg-ivory">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Simple flow" title="How GRANTLY" highlight="Works" desc="A clear path from discovery to confident application tracking." />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[["Create Your Profile", "Add academic, course, and eligibility details once.", Compass], ["Discover Matches", "Search, filter, and get explainable recommendations.", Sparkles], ["Prepare & Apply", "Use checklists and document guidance before applying.", FileStack], ["Track Progress", "Monitor statuses, deadlines, and next steps in one place.", Target]].map(([title, desc, Icon]: any, i) => (
              <Card key={title} className="border-white/10 bg-white/95 p-6 text-foreground">
                <div className="flex items-center justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-accent"><Icon size={18} /></div><span className="font-heading text-sm font-bold text-accent">0{i + 1}</span></div>
                <h3 className="mt-4 font-heading font-semibold text-primary">{title}</h3>
                <p className="mt-2 text-sm text-muted">{desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Why Choose GRANTLY — Deep Navy */}
      <section className="bg-primary text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading dark eyebrow="Benefits" title="Why Choose" highlight="GRANTLY" desc="Designed for real student workflows with transparency, security-minded design, and role-based access." />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {why.map(([title, desc, Icon]: any) => (
              <Card key={title} className="border-white/10 bg-white/95 p-6 text-foreground transition hover:shadow-md">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-accent"><Icon size={18} /></div>
                <h3 className="mt-4 font-heading font-semibold text-primary">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 8. AI Copilot — Ivory */}
      <section className="relative overflow-hidden bg-ivory">
        <div className="absolute inset-0 bg-[radial-gradient(600px_300px_at_80%_30%,rgba(35,63,112,.06),transparent)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent ring-1 ring-accent/25"><MessageSquareText size={22} /></div>
            <h2 className="mt-4 font-heading text-2xl font-bold text-primary sm:text-3xl">GRANTLY <span className="text-secondary">AI Copilot</span></h2>
            <p className="mt-3 text-muted">A grounded assistant for discovery, eligibility understanding, and next steps. Uses rule-based fallback when no LLM API is configured and never invents official award decisions.</p>
            <ul className="mt-6 space-y-2 text-sm text-foreground">{["Suggested questions and clear explanations", "Secure backend integration path for LLM providers", "Honest responses when information is missing"].map((t) => <li key={t} className="flex items-start gap-2"><BadgeCheck size={16} className="mt-0.5 shrink-0 text-accent" />{t}</li>)}</ul>
            <Link href="/student/copilot" className="mt-6 inline-block"><Button>Open Copilot (student)</Button></Link>
          </div>
          <Card className="border-[#d6b56d]/20 bg-white p-5 text-foreground shadow-xl">
            <div className="text-sm font-medium text-muted">Chat preview (illustration)</div>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl bg-ivory p-3 text-sm">Which scholarships match my profile?</div>
              <div className="ml-6 rounded-2xl bg-secondary p-3 text-sm text-white">I can compare your saved profile fields against published criteria and explain matches, potential matches, and missing information. Complete your profile for better results.</div>
              <div className="rounded-2xl bg-ivory p-3 text-sm text-muted">Typing indicator and history appear in the live Copilot.</div>
            </div>
          </Card>
        </div>
      </section>

      {/* 9. Opportunity Passport — Deep Navy */}
      <section className="bg-primary text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <Card className="order-2 border-white/10 bg-white/95 p-6 text-foreground lg:order-1">
            <div className="flex items-center justify-between"><div className="font-heading font-semibold text-primary">Opportunity Passport</div><Badge tone="info">Reusable profile</Badge></div>
            <div className="mt-5 space-y-3">{[["Academic details", 80], ["Documents", 60], ["Achievements & skills", 45]].map(([l, p]: any) => (<div key={l}><div className="flex justify-between text-sm"><span className="text-muted">{l}</span><span className="font-medium text-primary">{p}%</span></div><div className="mt-1 h-2 rounded-full bg-ivory"><div className="h-2 rounded-full bg-gradient-to-r from-secondary to-accent" style={{ width: `${p}%` }} /></div></div>))}</div>
            <p className="mt-4 text-xs text-muted">Preview illustration. Actual progress is calculated from your profile data.</p>
          </Card>
          <div className="order-1 lg:order-2">
            <SectionHeading dark eyebrow="Student profile" title="Opportunity" highlight="Passport" desc="Keep academic history, achievements, skills, certifications, and application-ready information in one reusable place with privacy-aware controls." />
            <div className="mt-6 text-center lg:text-left"><Link href="/student/passport"><Button className="bg-accent text-primary hover:bg-[#e1c37d]">Explore Passport (student)</Button></Link></div>
          </div>
        </div>
      </section>

      {/* 10. Application Tracking — Ivory */}
      <section className="bg-ivory">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <SectionHeading eyebrow="Workflow" title="Application" highlight="Tracking" desc="Move from discovered to decision with status-aware stages, readiness checks, and clear next steps." />
            <div className="mt-8 space-y-3">{["Discovered / Saved", "Eligibility checked & preparing", "Submitted / Under review", "Decision received"].map((s, i) => (<div key={s} className="flex items-center gap-3 rounded-xl border border-[#d6b56d]/20 bg-white px-4 py-3 shadow-sm"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-accent">{i + 1}</span><span className="text-sm text-foreground">{s}</span></div>))}</div>
          </div>
          <Card className="border-[#d6b56d]/20 bg-white p-6 text-foreground">
            <div className="font-heading font-semibold text-primary">Tracking preview</div>
            <div className="mt-4 h-2 rounded-full bg-ivory"><div className="h-2 w-3/4 rounded-full bg-secondary" /></div>
            <div className="mt-4 grid gap-2 text-sm">{[["Drafts prepared", "Real in dashboard"], ["Deadlines monitored", "Calendar + reminders"], ["Provider/admin review", "Authorized workflows"]].map(([a,b]) => <div key={a} className="flex justify-between rounded-lg bg-ivory px-3 py-2"><span>{a}</span><span className="text-muted">{b}</span></div>)}</div>
          </Card>
        </div>
      </section>

      {/* 11. Trust & Verification — Deep Navy */}
      <section className="bg-primary text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading dark eyebrow="Safety" title="Trust &" highlight="Verification" desc="Scholarship listings can carry clear status signals. Verification is only shown when actually performed through platform workflows." />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[["Verified", "Confirmed through workflow", "success"], ["Pending", "Awaiting verification", "warning"], ["Unverified", "Not yet confirmed", "neutral"], ["Expired", "Deadline passed", "neutral"], ["Reported", "User-reported concern", "danger"]].map(([t, d, tone]: any) => (
              <Card key={t} className="border-white/10 bg-white/95 p-5 text-center text-foreground"><Badge tone={tone as any}>{t}</Badge><p className="mt-3 text-sm text-muted">{d}</p></Card>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-3xl text-center text-sm text-white/72"><ShieldCheck className="mr-1 inline text-accent" size={16} /> Always verify eligibility, deadlines, fees, and links on the official provider source before applying.</p>
        </div>
      </section>

      {/* 12. Testimonials — Ivory */}
      <section className="bg-ivory">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Voices" title="Student & Partner" highlight="Stories" desc="Demonstration testimonials shown below for design preview. Replace with verified, permissioned testimonials before production marketing use." />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[["The eligibility explanations helped me focus on scholarships I could actually prepare for.", "Student user (demo)", "Student"], ["Having deadlines and document checklists in one place made applications less stressful.", "Applicant (demo)", "Student"], ["A unified portal makes it easier to publish opportunities and review applications responsibly.", "Provider team (demo)", "Provider"]].map(([quote, name, role]) => (
              <Card key={name} className="border-[#d6b56d]/20 bg-white p-6 text-foreground shadow-sm"><p className="text-sm leading-6 text-foreground">“{quote}”</p><div className="mt-4 border-t pt-4"><div className="font-heading font-semibold text-primary">{name}</div><div className="text-xs text-muted">{role} · clearly labeled demo</div></div></Card>
            ))}
          </div>
        </div>
      </section>

      {/* 13. FAQ — Deep Navy */}
      <section className="bg-primary text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading dark eyebrow="Help" title="Frequently Asked" highlight="Questions" desc="Quick answers about discovery, matching, trust, and privacy." />
          <HomeFaq />
          <div className="mt-8 text-center"><Link href="/faq"><Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10">View full FAQ</Button></Link></div>
        </div>
      </section>

      {/* 14. Final CTA — Ivory */}
      <section className="bg-ivory">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] border border-[#d6b56d]/20 bg-primary px-6 py-12 text-white sm:px-10">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/15 blur-2xl" aria-hidden />
            <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <h2 className="font-heading text-2xl font-bold sm:text-3xl">Start your scholarship journey with <span className="text-accent">GRANTLY</span></h2>
                <p className="mt-2 max-w-2xl text-white/75">Create a profile, discover relevant opportunities, and track every application with clarity and trust.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/get-started"><Button size="lg" className="bg-accent text-primary hover:bg-[#e1c37d]">Get Started</Button></Link>
                <Link href="/explore"><Button size="lg" variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10">Explore Scholarships</Button></Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 15. Footer rendered by layout (Deep Navy) */}
    </div>
  );
}
