import Link from "next/link";
import { ArrowRight, Award, Bell, CalendarDays, CheckCircle2, Circle, Compass, FileStack, Radar, Sparkles, Target, TrendingUp, Wallet } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { matchScholarship } from "@/lib/matching";
import { cn, daysUntil, deadlineLabel, formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AssistantPanel } from "@/components/dashboard/assistant";

export const dynamic = "force-dynamic";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default async function StudentDashboard() {
  const session = await getSession();
  if (!session) return null;
  const [profile, scholarships, apps, saved, docs, notifications, history, recentDocs] = await Promise.all([
    prisma.studentProfile.findUnique({ where: { userId: session.id } }).catch(() => null),
    prisma.scholarship.findMany({ where: { isPublished: true }, orderBy: { deadline: "asc" }, take: 60 }).catch(() => []),
    prisma.application.findMany({ where: { userId: session.id }, include: { scholarship: true }, orderBy: { updatedAt: "desc" } }).catch(() => []),
    prisma.savedScholarship.count({ where: { userId: session.id } }).catch(() => 0),
    prisma.document.findMany({ where: { userId: session.id }, orderBy: { createdAt: "desc" } }).catch(() => []),
    prisma.notification.findMany({ where: { userId: session.id }, orderBy: { createdAt: "desc" }, take: 8 }).catch(() => []),
    prisma.applicationStatusHistory.findMany({ where: { application: { userId: session.id } }, include: { application: { include: { scholarship: true } } }, orderBy: { createdAt: "desc" }, take: 8 }).catch(() => []),
    prisma.document.findMany({ where: { userId: session.id }, orderBy: { createdAt: "desc" }, take: 5 }).catch(() => []),
  ]);

  const matches = scholarships.map((s) => ({ s, m: matchScholarship(profile || {}, s) })).sort((a, b) => b.m.score - a.m.score);
  const strong = matches.filter((x) => x.m.status === "Eligible" || (x.m.status === "Potentially Eligible" && x.m.score >= 70));
  const potential = matches.filter((x) => x.m.status === "Potentially Eligible" && x.m.score < 70);
  const closingSoon = scholarships.filter((s) => { const d = daysUntil(s.deadline); return d != null && d >= 0 && d <= 7; });
  const approvedApps = apps.filter((a) => a.status === "APPROVED");
  const confirmedFunding = approvedApps.reduce((sum, a) => sum + (a.scholarship.amount || 0), 0);
  const activeApps = apps.filter((a) => !["APPROVED", "REJECTED", "WITHDRAWN"].includes(a.status));
  const completion = profile?.completionPercent ?? 0;

  const pipeline = [
    { key: "Discovered", count: scholarships.length, hint: "Published opportunities" },
    { key: "Saved", count: saved, hint: "Bookmarked" },
    { key: "Preparing", count: apps.filter((a) => a.status === "DRAFT").length, hint: "Draft applications" },
    { key: "Submitted", count: apps.filter((a) => a.status === "SUBMITTED").length, hint: "Awaiting review" },
    { key: "In Review", count: apps.filter((a) => ["UNDER_REVIEW", "DOCUMENTS_REQUIRED", "SHORTLISTED"].includes(a.status)).length, hint: "Active process" },
    { key: "Decision", count: apps.filter((a) => ["APPROVED", "REJECTED"].includes(a.status)).length, hint: "Finalized" },
  ];

  function health(app: any) {
    const req = (app.scholarship.requiredDocuments || "").split(",").map((x: string) => x.trim().toLowerCase()).filter(Boolean);
    const haveCats = new Set(docs.map((d) => d.category.toLowerCase()));
    const docsOk = req.length === 0 ? 1 : req.filter((r: string) => [...haveCats].some((h) => h.includes(r.split(" ")[0]) || r.includes(h.split(" ")[0]))).length / req.length;
    let score = Math.round((completion / 100) * 35 + docsOk * 35 + (app.status !== "DRAFT" ? 20 : 10) + (daysUntil(app.scholarship.deadline) != null && (daysUntil(app.scholarship.deadline) as number) >= 0 ? 10 : 0));
    score = Math.max(0, Math.min(100, score));
    const tips: string[] = [];
    if (completion < 80) tips.push("Complete your Opportunity Passport/profile details.");
    if (docsOk < 1) tips.push("Upload missing required documents in Document Vault.");
    if (app.status === "DRAFT") tips.push("Review and submit when ready (demo workflow records status).");
    if (tips.length === 0) tips.push("Application looks well prepared. Verify official submission steps.");
    return { score, tips };
  }

  const todayTasks = [
    !profile || completion < 70 ? { text: "Complete your Opportunity Passport/profile", priority: "High", done: false, href: "/student/passport" } : null,
    docs.length === 0 ? { text: "Upload a required document to Document Vault", priority: "High", done: false, href: "/student/documents" } : null,
    closingSoon[0] ? { text: `Review scholarship closing soon: ${closingSoon[0].title}`, priority: "High", done: false, href: `/scholarships/${closingSoon[0].id}` } : null,
    activeApps.find((a) => a.status === "DRAFT") ? { text: "Finish an application draft", priority: "Medium", done: false, href: "/student/applications" } : null,
    { text: "Check AI Recommendations for new matches", priority: "Medium", done: false, href: "/student/recommended" },
  ].filter(Boolean) as any[];

  const activity = [
    ...history.map((h) => ({ at: h.createdAt, text: `${h.application.scholarship.title}: ${h.status.replaceAll("_", " ")}`, href: "/student/applications", icon: "status" })),
    ...recentDocs.map((d) => ({ at: d.createdAt, text: `Document uploaded: ${d.originalName}`, href: "/student/documents", icon: "doc" })),
  ].sort((a, b) => +new Date(b.at) - +new Date(a.at)).slice(0, 8);

  const scholarshipOfDay = strong[0]?.s || scholarships[0];
  const continueApp = apps.find((a) => ["DRAFT", "DOCUMENTS_REQUIRED"].includes(a.status));

  const statCards = [
    { label: "Matching scholarships", value: String(strong.length), sub: "Strong/potential matches from profile", href: "/student/recommended", icon: Sparkles },
    { label: "Saved opportunities", value: String(saved), sub: "Bookmarked listings", href: "/student/saved", icon: Award },
    { label: "Active applications", value: String(activeApps.length), sub: "Drafts and in-progress", href: "/student/applications", icon: Target },
    { label: "Upcoming deadlines", value: String(closingSoon.length), sub: "Closing within 7 days", href: "/student/calendar", icon: CalendarDays },
    { label: "Confirmed funding", value: formatCurrency(confirmedFunding), sub: "Approved applications only", href: "/student/funding", icon: Wallet },
    { label: "Profile completion", value: `${completion}%`, sub: "Opportunity Passport strength", href: "/student/passport", icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border bg-gradient-to-br from-primary via-[#16284d] to-secondary p-6 text-white shadow-[0_20px_50px_rgba(16,28,54,.18)] sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm text-white/70">{formatDate(new Date())}</p>
            <h2 className="mt-1 font-heading text-3xl font-bold tracking-tight sm:text-4xl">{greeting()}, {session.name.split(" ")[0]}!</h2>
            <p className="mt-2 max-w-2xl text-white/80">Your next educational opportunity is closer than you think. GRANTLY is tracking {strong.length} strong/potential matches, {activeApps.length} active application{activeApps.length===1?"":"s"}, and {closingSoon.length} deadline{closingSoon.length===1?"":"s"} in the next 7 days.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/student/discover"><Button className="bg-accent text-primary hover:bg-[#e1c37d]"><Compass size={16}/> Discover</Button></Link>
            <Link href="/student/copilot"><Button variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/15">AI Copilot</Button></Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((c) => (
          <Link key={c.label} href={c.href}>
            <Card className="group h-full p-5 transition hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-lg">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-muted">{c.label}</div>
                  <div className="mt-1 font-heading text-2xl font-bold text-foreground">{c.value}</div>
                  <div className="mt-1 text-xs text-muted">{c.sub}</div>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-secondary group-hover:bg-accent/15 group-hover:text-primary"><c.icon size={18}/></span>
              </div>
            </Card>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3"><div><h3 className="font-heading text-lg font-semibold flex items-center gap-2"><Radar size={18} className="text-secondary"/> Scholarship Match Radar</h3><p className="text-sm text-muted">Transparent matches from your profile. Scores never override failed mandatory criteria.</p></div><Link href="/student/recommended" className="text-sm font-medium text-secondary">View all</Link></div>
          <div className="mt-5 grid gap-3">
            {matches.slice(0, 4).map(({ s, m }) => (
              <Link key={s.id} href={`/scholarships/${s.id}`} className="rounded-xl border p-4 transition hover:border-accent/30 hover:bg-ivory/50">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-medium">{s.title}</div>
                  <div className="flex items-center gap-2"><Badge tone={m.status==="Eligible"?"success":m.status==="Not Eligible"?"danger":m.status==="Potentially Eligible"?"warning":"neutral"}>{m.status}</Badge><Badge tone="info">{m.score}% match</Badge></div>
                </div>
                <p className="mt-2 text-sm text-muted">{m.reasons[0] || "Complete your profile for a more specific explanation."}{m.missing.length ? ` Missing: ${m.missing.slice(0,2).join(", ")}.` : ""}</p>
              </Link>
            ))}
            {matches.length===0 && <p className="text-sm text-muted">No published scholarships available yet.</p>}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-5 sm:p-6">
            <h3 className="font-heading text-lg font-semibold">Opportunity Pipeline</h3>
            <p className="mt-1 text-sm text-muted">Your preparation and application stages (not official provider decisions).</p>
            <div className="mt-4 space-y-2">
              {pipeline.map((p) => (
                <div key={p.key} className="flex items-center gap-3 rounded-xl border p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-accent">{p.count}</div>
                  <div><div className="text-sm font-medium">{p.key}</div><div className="text-xs text-muted">{p.hint}</div></div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5 sm:p-6">
            <h3 className="font-heading text-lg font-semibold">Quick Actions</h3>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {[["Find Scholarships","/student/discover"],["AI Recommendations","/student/recommended"],["Upload Documents","/student/documents"],["Create Application","/student/applications"],["Compare","/student/compare"],["Ask AI Copilot","/student/copilot"]].map(([l,h])=>(
                <Link key={l} href={h} className="rounded-xl border bg-ivory/60 px-3 py-2.5 text-sm font-medium text-foreground hover:border-accent/30 hover:bg-white">{l}</Link>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <h3 className="font-heading text-lg font-semibold">Application Health Center</h3>
          <p className="mt-1 text-sm text-muted">Readiness scores explain preparation; they do not predict scholarship awards.</p>
          <div className="mt-4 space-y-3">
            {apps.slice(0,4).map((a) => { const h = health(a); return (
              <div key={a.id} className="rounded-xl border p-4">
                <div className="flex items-start justify-between gap-3"><div><div className="font-medium">{a.scholarship.title}</div><div className="text-xs text-muted">{a.status.replaceAll("_"," ")}</div></div><div className="text-right"><div className="font-heading text-xl font-bold text-primary">{h.score}</div><div className="text-xs text-muted">/ 100</div></div></div>
                <div className="mt-3 h-2 rounded-full bg-ivory"><div className="h-2 rounded-full bg-secondary" style={{width:`${h.score}%`}}/></div>
                <p className="mt-2 text-sm text-muted">Next: {h.tips[0]}</p>
              </div>
            );})}
            {apps.length===0 && <p className="text-sm text-muted">No applications yet. Start from Discover or a scholarship details page.</p>}
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <h3 className="font-heading text-lg font-semibold">AI Daily Action Planner</h3>
          <p className="mt-1 text-sm text-muted">Generated from your actual profile, documents, applications, and deadlines.</p>
          <div className="mt-4 space-y-2">
            {todayTasks.map((t, i) => (
              <Link key={i} href={t.href} className="flex items-start gap-3 rounded-xl border p-3 hover:bg-ivory/50">
                <Circle size={18} className="mt-0.5 text-accent"/>
                <div className="min-w-0"><div className="text-sm font-medium">{t.text}</div><div className="text-xs text-muted">Priority: {t.priority}</div></div>
              </Link>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5"><h3 className="font-heading font-semibold">Document Readiness</h3><div className="mt-3 font-heading text-2xl font-bold">{docs.length}</div><p className="text-sm text-muted">Documents uploaded in your private vault.</p><Link href="/student/documents" className="mt-3 inline-flex items-center text-sm font-medium text-secondary">Open vault <ArrowRight size={14}/></Link></Card>
        <Card className="p-5"><h3 className="font-heading font-semibold">Funding Goal Tracker</h3><div className="mt-3 font-heading text-2xl font-bold">{formatCurrency(confirmedFunding)}</div><p className="text-sm text-muted">Confirmed from approved applications only.</p><Link href="/student/funding" className="mt-3 inline-flex items-center text-sm font-medium text-secondary">Plan funding <ArrowRight size={14}/></Link></Card>
        <Card className="p-5"><h3 className="font-heading font-semibold">Profile Strength</h3><div className="mt-3 h-2 rounded-full bg-ivory"><div className="h-2 rounded-full bg-accent" style={{width:`${completion}%`}}/></div><p className="mt-2 text-sm text-muted">{completion}% complete. Improve for better matching.</p><Link href="/student/passport" className="mt-3 inline-flex items-center text-sm font-medium text-secondary">Opportunity Passport <ArrowRight size={14}/></Link></Card>
        <Card className="p-5"><h3 className="font-heading font-semibold">Notifications</h3><div className="mt-3 font-heading text-2xl font-bold">{notifications.filter((n)=>!n.isRead).length}</div><p className="text-sm text-muted">Unread updates and reminders.</p><Link href="/student/notifications" className="mt-3 inline-flex items-center text-sm font-medium text-secondary">Open center <ArrowRight size={14}/></Link></Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr_.95fr]">
        <Card className="p-5 sm:p-6">
          <h3 className="font-heading text-lg font-semibold">Smart Deadline Command Center</h3>
          <div className="mt-4 space-y-2">
            {scholarships.filter(s=>{const d=daysUntil(s.deadline); return d!=null && d>=0 && d<=30;}).slice(0,6).map((s)=>{const dl=deadlineLabel(s.deadline); return (
              <Link key={s.id} href={`/scholarships/${s.id}`} className="flex items-center justify-between gap-3 rounded-xl border p-3 text-sm hover:bg-ivory/50">
                <span className="font-medium">{s.title}</span><Badge tone={dl.tone}>{dl.text}</Badge>
              </Link>
            );})}
          </div>
        </Card>
        <Card className="p-5 sm:p-6">
          <h3 className="font-heading text-lg font-semibold">Recent Activity Timeline</h3>
          <div className="mt-4 space-y-3">
            {activity.map((a, i) => (
              <Link key={i} href={a.href} className="flex gap-3 rounded-xl border p-3 hover:bg-ivory/50">
                <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5 text-secondary">{a.icon==="doc"?<FileStack size={15}/>:<TrendingUp size={15}/>}</span>
                <div><div className="text-sm font-medium">{a.text}</div><div className="text-xs text-muted">{formatDate(a.at)}</div></div>
              </Link>
            ))}
            {activity.length===0 && <p className="text-sm text-muted">Your actions will appear here as you use GRANTLY.</p>}
          </div>
        </Card>
        <div className="space-y-6">
          {scholarshipOfDay && (
            <Card className="p-5 border-accent/25 gold-glow">
              <h3 className="font-heading font-semibold flex items-center gap-2"><Sparkles size={16} className="text-accent"/> Scholarship of the Day</h3>
              <p className="mt-2 font-medium">{scholarshipOfDay.title}</p>
              <p className="mt-1 text-sm text-muted">{formatCurrency(scholarshipOfDay.amount)} · {deadlineLabel(scholarshipOfDay.deadline).text}</p>
              <Link href={`/scholarships/${scholarshipOfDay.id}`} className="mt-3 inline-block"><Button size="sm">View details</Button></Link>
            </Card>
          )}
          {continueApp && (
            <Card className="p-5">
              <h3 className="font-heading font-semibold">Continue where you left off</h3>
              <p className="mt-2 text-sm text-muted">{continueApp.scholarship.title}</p>
              <Link href="/student/applications" className="mt-3 inline-block"><Button size="sm" variant="outline">Continue</Button></Link>
            </Card>
          )}
          <AssistantPanel />
        </div>
      </section>
    </div>
  );
}
