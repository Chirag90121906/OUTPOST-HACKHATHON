import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { FundingPlannerClient } from "./funding-client";

export const dynamic = "force-dynamic";
export default async function FundingPage() {
  const session = await getSession();
  const applications = session ? await prisma.application.findMany({ where: { userId: session.id }, include: { scholarship: true } }).catch(()=>[]) : [];
  // Confirmed funding only from approved applications (amount stored on scholarship)
  const approvedApps = applications.filter((a) => a.status === "APPROVED");
  const confirmed = approvedApps.reduce((sum, a) => sum + (a.scholarship.amount || 0), 0);
  const potentialSum = applications.filter((a) => !["REJECTED","WITHDRAWN"].includes(a.status)).reduce((sum, a) => sum + (a.scholarship?.amount || 0), 0);
  return (
    <div className="space-y-6">
      <div><h2 className="font-heading text-2xl font-bold tracking-tight">Financial Aid Intelligence</h2><p className="mt-1 text-muted">Plan education expenses and track funding. <strong className="text-foreground">Confirmed funding</strong> only reflects approved applications in this platform; <strong className="text-foreground">potential funding</strong> is not guaranteed.</p></div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5"><div className="text-sm text-muted">Confirmed funding (approved)</div><div className="mt-1 font-heading text-2xl font-bold text-primary">{formatCurrency(confirmed)}</div></Card>
        <Card className="p-5"><div className="text-sm text-muted">Potential opportunities (not guaranteed)</div><div className="mt-1 font-heading text-2xl font-bold text-secondary">{formatCurrency(potentialSum)}</div></Card>
        <Card className="p-5"><div className="text-sm text-muted">Status</div><div className="mt-1 text-sm text-muted">Use the planner below to estimate your funding gap.</div></Card>
      </div>
      <FundingPlannerClient confirmed={confirmed} potential={potentialSum} />
    </div>
  );
}
