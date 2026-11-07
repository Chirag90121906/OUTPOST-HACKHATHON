import Link from "next/link";
import { prisma } from "@/lib/db";
import { ScholarshipCard } from "@/components/scholarships/scholarship-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";

export const dynamic = "force-dynamic";

export default async function DiscoverPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const level = typeof sp.level === "string" ? sp.level : "";
  const funding = typeof sp.funding === "string" ? sp.funding : "";
  const sort = typeof sp.sort === "string" ? sp.sort : "deadline";
  const where: any = { isPublished: true };
  if (q) where.OR = [{ title: { contains: q } }, { providerName: { contains: q } }, { description: { contains: q } }, { eligibleCourses: { contains: q } }];
  if (level) where.educationLevels = { contains: level };
  if (funding) where.fundingType = funding;
  const orderBy = sort === "amount_desc" ? { amount: "desc" } : sort === "amount_asc" ? { amount: "asc" } : sort === "recent" ? { createdAt: "desc" } : sort === "title" ? { title: "asc" } : { deadline: "asc" };
  const items = await prisma.scholarship.findMany({ where, orderBy: orderBy as any, take: 60 }).catch(() => []);
  return (
    <div className="space-y-6">
      <div><h2 className="font-heading text-2xl font-bold tracking-tight">Discover Scholarships</h2><p className="mt-1 text-muted">Search, filter, and open opportunities. Sample listings are labeled and must be verified on official sources.</p></div>
      <Card className="p-4 sm:p-5">
        <form className="grid gap-3 lg:grid-cols-[1fr_180px_180px_180px_auto]" action="/student/discover">
          <Input name="q" defaultValue={q} placeholder="Search title, provider, course..." aria-label="Search" />
          <Select name="level" defaultValue={level}><option value="">All levels</option><option>Undergraduate</option><option>Postgraduate</option><option>Diploma</option></Select>
          <Select name="funding" defaultValue={funding}><option value="">All funding</option><option value="full">Fully funded</option><option value="partial">Partial</option></Select>
          <Select name="sort" defaultValue={sort}><option value="deadline">Closing soon</option><option value="recent">Recently added</option><option value="amount_desc">Highest amount</option><option value="amount_asc">Lowest amount</option><option value="title">Alphabetical</option></Select>
          <div className="flex gap-2"><Button type="submit">Search</Button><Link href="/student/discover"><Button type="button" variant="outline">Clear</Button></Link></div>
        </form>
      </Card>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{items.map((s) => <ScholarshipCard key={s.id} s={s} />)}</div>
      {items.length === 0 && <Card className="p-8 text-muted">No scholarships matched your filters.</Card>}
    </div>
  );
}
