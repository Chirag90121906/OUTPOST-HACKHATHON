import Link from "next/link";
import { prisma } from "@/lib/db";
import { ScholarshipCard } from "@/components/scholarships/scholarship-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { requireSession } from "@/lib/auth";
import { scholarshipMatchesState } from "@/lib/location";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DiscoverPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const level = typeof sp.level === "string" ? sp.level : "";
  const funding = typeof sp.funding === "string" ? sp.funding : "";
  const session = await requireSession(["STUDENT", "ADMIN"]);
  if (!session) redirect("/login");
  const profile = await prisma.studentProfile.findUnique({ where: { userId: session.id }, select: { state: true } });
  const state = typeof sp.state === "string" ? sp.state.trim() : profile?.state ?? "";
  const sort = typeof sp.sort === "string" ? sp.sort : "deadline";
  const conditions: any[] = [];
  if (q) conditions.push({ OR: [{ title: { contains: q, mode: "insensitive" } }, { providerName: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }, { eligibleCourses: { contains: q, mode: "insensitive" } }] });
  if (level) conditions.push({ educationLevels: { contains: level, mode: "insensitive" } });
  if (funding) conditions.push({ fundingType: funding });
  if (state) conditions.push({ OR: [{ eligibleStates: null }, { eligibleStates: { contains: state, mode: "insensitive" } }, { eligibleStates: { contains: "all india", mode: "insensitive" } }, { eligibleStates: { contains: "nationwide", mode: "insensitive" } }, { eligibleStates: { contains: "pan india", mode: "insensitive" } }] });
  const where: any = { isPublished: true, ...(conditions.length ? { AND: conditions } : {}) };
  const orderBy = sort === "amount_desc" ? { amount: "desc" } : sort === "amount_asc" ? { amount: "asc" } : sort === "recent" ? { createdAt: "desc" } : sort === "title" ? { title: "asc" } : { deadline: "asc" };
  let items: Awaited<ReturnType<typeof prisma.scholarship.findMany>> = [];
  let loadError = false;
  try {
    items = await prisma.scholarship.findMany({ where, orderBy: orderBy as any, take: 100 });
    if (state) items = items.filter((scholarship) => scholarshipMatchesState(scholarship.eligibleStates, state));
  } catch (error) {
    console.error("Failed to load scholarships on student discovery page.", error);
    loadError = true;
  }
  return (
    <div className="space-y-6">
      <div><h2 className="font-heading text-2xl font-bold tracking-tight">Discover Scholarships</h2><p className="mt-1 text-muted">Search, filter, and open opportunities. Sample listings are labeled and must be verified on official sources.</p></div>
      <Card className="p-4 sm:p-5">
        <form className="grid gap-3 lg:grid-cols-[1fr_180px_180px_180px_180px_auto]" action="/student/discover">
          <Input name="q" defaultValue={q} placeholder="Search title, provider, course..." aria-label="Search" />
          <Input name="state" defaultValue={state} placeholder="State or region" aria-label="Filter by state or region" />
          <Select name="level" defaultValue={level}><option value="">All levels</option><option>Undergraduate</option><option>Postgraduate</option><option>Diploma</option></Select>
          <Select name="funding" defaultValue={funding}><option value="">All funding</option><option value="full">Fully funded</option><option value="partial">Partial</option></Select>
          <Select name="sort" defaultValue={sort}><option value="deadline">Closing soon</option><option value="recent">Recently added</option><option value="amount_desc">Highest amount</option><option value="amount_asc">Lowest amount</option><option value="title">Alphabetical</option></Select>
          <div className="flex gap-2"><Button type="submit">Search</Button><Link href="/student/discover"><Button type="button" variant="outline">Clear</Button></Link></div>
        </form>
      </Card>
      {!loadError && <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{items.map((s) => <ScholarshipCard key={s.id} s={s} />)}</div>}
      {loadError && <Card role="alert" className="p-8 text-muted">Scholarships could not be loaded right now. Please try again later.</Card>}
      {!loadError && items.length === 0 && <Card className="p-8 text-muted">No scholarships matched your filters.</Card>}
    </div>
  );
}
