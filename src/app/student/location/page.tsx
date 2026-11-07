import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { LocationSettings } from "./location-settings";

export default async function LocationPage() {
  const session = await requireSession(["STUDENT", "ADMIN"]);
  if (!session) return null;
  const profile = await prisma.studentProfile.findUnique({
    where: { userId: session.id },
    select: { city: true, state: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold tracking-tight">Location Settings</h2>
        <p className="mt-1 text-muted">Choose whether and how GRANTLY uses your location for regional scholarship discovery.</p>
      </div>
      <LocationSettings initialCity={profile?.city ?? ""} initialState={profile?.state ?? ""} />
    </div>
  );
}
