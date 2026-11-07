import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export default async function Page() {
  const users = await prisma.user.findMany({ where: { role: "STUDENT" }, include: { studentProfile: true }, orderBy: { createdAt: "desc" }, take: 100 }).catch(() => []);
  return (
    <div className="space-y-6">
      <div><h2 className="font-heading text-2xl font-bold tracking-tight">Manage Students</h2><p className="mt-1 text-muted">Registered student accounts and profile summaries (privacy-conscious view).</p></div>
      <div className="space-y-3">
        {users.map((u) => (
          <Card key={u.id} className="p-5"><div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div><div className="font-semibold">{u.name}</div><div className="text-sm text-muted">{u.email} · Joined {formatDate(u.createdAt)}</div><div className="mt-1 text-xs text-muted">{u.studentProfile?.institution || "—"} · {u.studentProfile?.course || "—"} · Profile {u.studentProfile?.completionPercent ?? 0}%</div></div><Badge tone={u.isActive?"success":"danger"}>{u.isActive?"Active":"Inactive"}</Badge></div></Card>
        ))}
        {users.length===0 && <Card className="p-8 text-muted">No students found.</Card>}
      </div>
    </div>
  );
}
