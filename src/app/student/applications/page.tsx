import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { ApplyAction } from "./apply-action";

export const dynamic = "force-dynamic";
export default async function ApplicationsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await getSession(); if (!session) return null;
  const sp = await searchParams;
  const applyId = typeof sp.apply === "string" ? sp.apply : undefined;
  const [apps, scholarships] = await Promise.all([
    prisma.application.findMany({ where: { userId: session.id }, include: { scholarship: true }, orderBy: { updatedAt: "desc" } }),
    prisma.scholarship.findMany({ where: { isPublished: true }, orderBy: { deadline: "asc" }, take: 20 }),
  ]);
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold tracking-tight">My applications</h2><p className="mt-1 text-slate-600">Draft, submit, and track status history in a demo workflow.</p></div>
      <Card className="p-5"><h3 className="font-semibold">Start or update an application</h3><div className="mt-4"><ApplyAction scholarships={scholarships.map(s=>({id:s.id,title:s.title}))} defaultId={applyId} /></div></Card>
      <div className="space-y-3">
        {apps.map((a) => (
          <Card key={a.id} className="p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="font-semibold">{a.scholarship.title}</div>
                <div className="mt-1 text-sm text-slate-500">Last updated {formatDate(a.updatedAt)} {a.submittedAt ? `· Submitted ${formatDate(a.submittedAt)}` : ""}</div>
                <div className="mt-3 text-xs text-slate-500">Progress: Draft → Submitted → Under Review → Decision</div>
              </div>
              <div className="flex items-center gap-2"><Badge tone={a.status==="APPROVED"?"success":a.status==="REJECTED"?"danger":"info"}>{a.status.replaceAll("_"," ")}</Badge><Link href={`/scholarships/${a.scholarshipId}`}><Button variant="outline" size="sm">Scholarship</Button></Link></div>
            </div>
          </Card>
        ))}
        {apps.length === 0 && <Card className="p-8 text-slate-600">No applications yet. Choose a scholarship above to save a draft or submit.</Card>}
      </div>
    </div>
  );
}
