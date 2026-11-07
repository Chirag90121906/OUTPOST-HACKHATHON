"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Bell, GraduationCap, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AppShell({ title, nav, children }: { title: string; nav: { href: string; label: string }[]; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  async function logout() { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); router.refresh(); }
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className={cn("border-r bg-white lg:sticky lg:top-0 lg:h-screen", open ? "block" : "hidden lg:block")}>
        <div className="flex h-16 items-center gap-2 border-b px-5 font-bold text-primary"><GraduationCap size={18}/> GRANTLY</div>
        <nav className="p-3">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className={cn("block rounded-xl px-3 py-2.5 text-sm font-medium transition", pathname === n.href ? "bg-primary text-white" : "text-slate-700 hover:bg-slate-50")}>{n.label}</Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-[#f7f8fc]/85 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-2"><button className="rounded-lg p-2 lg:hidden" onClick={()=>setOpen(v=>!v)} aria-label="Menu"><Menu size={18}/></button><h1 className="font-semibold">{title}</h1></div>
          <div className="flex items-center gap-2"><Link href="/student/notifications" className="rounded-lg p-2 hover:bg-white" aria-label="Notifications"><Bell size={18}/></Link><Button variant="outline" size="sm" onClick={logout}><LogOut size={16}/> Logout</Button></div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
