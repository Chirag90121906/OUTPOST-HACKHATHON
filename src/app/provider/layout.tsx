import { requireSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";

const nav = [
  { href: "/provider", label: "Overview" },
  { href: "/provider/scholarships", label: "My Scholarships" },
  { href: "/provider/create", label: "Create Scholarship" },
  { href: "/provider/applications", label: "Applications Received" },
  { href: "/provider/review", label: "Review Applications" },
  { href: "/provider/performance", label: "Scholarship Performance" },
  { href: "/provider/notifications", label: "Notifications" },
  { href: "/provider/profile", label: "Organization Profile" },
  { href: "/provider/settings", label: "Settings" },
];

export default async function ProviderLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession(["PROVIDER", "ADMIN"]);
  if (!session) redirect("/login?role=PROVIDER");
  return <AppShell title="Provider Portal" nav={nav} userName={session.name}>{children}</AppShell>;
}
