import { requireSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/scholarships", label: "Scholarships" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/students", label: "Students" },
  { href: "/admin/providers", label: "Providers" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession(["ADMIN"]);
  if (!session) redirect("/login");
  return <AppShell title="Admin Portal" nav={nav}>{children}</AppShell>;
}
