import { requireSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/scholarships", label: "Manage Scholarships" },
  { href: "/admin/verification", label: "Scholarship Verification" },
  { href: "/admin/students", label: "Manage Students" },
  { href: "/admin/providers", label: "Manage Providers" },
  { href: "/admin/applications", label: "Manage Applications" },
  { href: "/admin/reported", label: "Reported Listings" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/analytics", label: "Analytics & Reports" },
  { href: "/admin/notifications", label: "Notifications" },
  { href: "/admin/settings", label: "Platform Settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession(["ADMIN"]);
  if (!session) redirect("/login");
  return <AppShell title="Admin Portal" nav={nav} userName={session.name}>{children}</AppShell>;
}
