import Link from "next/link";
import { Building2, Compass, GraduationCap, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Get Started" };

const roles = [
  { title: "Student", desc: "Discover scholarships, check eligibility, manage applications, and track your progress.", icon: GraduationCap, href: "/register?role=STUDENT", login: "/login?role=STUDENT", cta: "Create Student Account" },
  { title: "Scholarship Provider", desc: "Publish opportunities, manage listings, and review applications for your organization.", icon: Building2, href: "/register?role=PROVIDER", login: "/login?role=PROVIDER", cta: "Register as Provider" },
  { title: "Administrator", desc: "Secure platform oversight for verification, users, listings, and reports. Admin accounts are provisioned securely.", icon: Shield, href: "/login?role=ADMIN", login: "/login?role=ADMIN", cta: "Admin Login" },
];

export default function GetStartedPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-primary sm:text-4xl">Choose how you want to use GRANTLY</h1>
        <p className="mt-3 text-muted">Students, providers, and administrators each get a secure, role-appropriate experience. Guests can explore public scholarships without an account.</p>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {roles.map((r) => (
          <Card key={r.title} className="group p-6 transition duration-200 hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-accent ring-1 ring-accent/20"><r.icon size={22} /></div>
            <h2 className="mt-4 font-heading text-xl font-semibold">{r.title}</h2>
            <p className="mt-2 text-sm text-muted">{r.desc}</p>
            <div className="mt-6 grid gap-2">
              <Link href={r.href}><Button className="w-full">{r.cta}</Button></Link>
              {r.title !== "Administrator" && <Link href={r.login}><Button variant="outline" className="w-full">Login</Button></Link>}
            </div>
          </Card>
        ))}
      </div>
      <Card className="mt-6 flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ivory text-secondary"><Compass size={20}/></span><div><div className="font-heading font-semibold">Continue as Guest</div><p className="text-sm text-muted">Browse scholarships, search, filter, and view details without registering.</p></div></div>
        <Link href="/explore"><Button variant="secondary">Explore Scholarships</Button></Link>
      </Card>
    </div>
  );
}
