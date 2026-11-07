import Link from "next/link";
import { prisma } from "@/lib/db";
import { ScholarshipCard } from "@/components/scholarships/scholarship-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";

export const dynamic = "force-dynamic";

export default async function ExplorePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const level = typeof sp.level === "string" ? sp.level : "";
  const funding = typeof sp.funding === "string" ? sp.funding : "";
  const sort = typeof sp.sort === "string" ? sp.sort : "deadline";
  const where: any = { isPublished: true };
  if (q) where.OR = [{ title: { contains: q } }, { providerName: { contains: q } }, { description: { contains: q } }, { eligibleCourses: { contains: q } }, { tags: { contains: q } }];
  if (level) where.educationLevels = { contains: level };
  if (funding) where.fundingType = funding;
  const orderBy = sort === "amount_desc" ? { amount: "desc" } : sort === "amount_asc" ? { amount: "asc" } : sort === "recent" ? { createdAt: "desc" } : sort === "title" ? { title: "asc" } : { deadline: "asc" };
  let items: any[] = [];
  try { items = await prisma.scholarship.findMany({ where, orderBy: orderBy as any, take: 60 }); } catch {}

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Explore scholarships</h1>
        <p className="mt-2 text-slate-600">Search and filter opportunities. Sample listings are labeled clearly and should be verified on official sources.</p>
      </div>
      <Card className="mt-8 p-4 sm:p-5">
        <form className="grid gap-3 lg:grid-cols-[1fr_180px_180px_180px_auto]" action="/explore">
          <Input name="q" defaultValue={q} placeholder="Search by title, provider, course..." aria-label="Search scholarships" />
          <Select name="level" defaultValue={level} aria-label="Education level"><option value="">All levels</option><option>Undergraduate</option><option>Postgraduate</option><option>Diploma</option></Select>
          <Select name="funding" defaultValue={funding} aria-label="Funding type"><option value="">All funding</option><option value="full">Fully funded</option><option value="partial">Partial</option></Select>
          <Select name="sort" defaultValue={sort} aria-label="Sort"><option value="deadline">Closing soon</option><option value="recent">Recently added</option><option value="amount_desc">Highest amount</option><option value="amount_asc">Lowest amount</option><option value="title">Alphabetical</option></Select>
          <div className="flex gap-2"><Button type="submit">Search</Button><Link href="/explore"><Button type="button" variant="outline">Clear</Button></Link></div>
        </form>
      </Card>
      <div className="mt-6 flex items-center justify-between text-sm text-slate-600"><span>{items.length} result{items.length === 1 ? "" : "s"}</span></div>
      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((s) => <ScholarshipCard key={s.id} s={s} />)}
      </div>
      {items.length === 0 && <Card className="mt-6 p-10 text-center text-slate-600">No scholarships matched your filters. Try clearing filters or running the demo seed.</Card>}
    </div>
  );
}
