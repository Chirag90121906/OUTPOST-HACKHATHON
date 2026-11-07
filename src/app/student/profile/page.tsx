import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { ProfileForm } from "./profile-form";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) return null;
  const profile = await prisma.studentProfile.findUnique({ where: { userId: session.id } });
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold tracking-tight">Student profile</h2><p className="mt-1 text-slate-600">Keep your details accurate to improve scholarship matching and application readiness.</p></div>
      <Card className="p-5 sm:p-6"><ProfileForm initial={profile} /></Card>
    </div>
  );
}
