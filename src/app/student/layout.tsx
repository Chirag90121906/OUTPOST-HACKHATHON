import { requireSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";

const nav = [
  { href: "/student", label: "Dashboard" },
  { href: "/student/profile", label: "Profile" },
  { href: "/student/recommended", label: "Recommended" },
  { href: "/student/search", label: "Search" },
  { href: "/student/saved", label: "Saved" },
  { href: "/student/compare", label: "Compare" },
  { href: "/student/applications", label: "My Applications" },
  { href: "/student/documents", label: "Documents" },
  { href: "/student/notifications", label: "Notifications" },
  { href: "/student/settings", label: "Settings" },
  { href: "/student/support", label: "Help & Support" },
];

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession(["STUDENT", "ADMIN"]);
  if (!session) redirect("/login");
  return <AppShell title="Student Portal" nav={nav}>{children}</AppShell>;
}
