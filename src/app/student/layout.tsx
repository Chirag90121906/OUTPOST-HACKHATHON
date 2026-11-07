import { requireSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";

const nav = [
  { href: "/student", label: "Overview" },
  { href: "/student/discover", label: "Discover Scholarships" },
  { href: "/student/recommended", label: "AI Recommendations" },
  { href: "/student/applications", label: "My Applications" },
  { href: "/student/saved", label: "Saved Scholarships" },
  { href: "/student/compare", label: "Scholarship Comparison" },
  { href: "/student/calendar", label: "Deadline Calendar" },
  { href: "/student/documents", label: "Document Vault" },
  { href: "/student/passport", label: "Opportunity Passport" },
  { href: "/student/personal-statement", label: "Personal Statement Studio" },
  { href: "/student/funding", label: "Funding Planner" },
  { href: "/student/achievements", label: "Achievements" },
  { href: "/student/notifications", label: "Notifications" },
  { href: "/student/copilot", label: "AI Copilot" },
  { href: "/student/settings", label: "Settings" },
];

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession(["STUDENT", "ADMIN"]);
  if (!session) redirect("/login");
  return <AppShell title="Overview" nav={nav} userName={session.name}>{children}</AppShell>;
}
