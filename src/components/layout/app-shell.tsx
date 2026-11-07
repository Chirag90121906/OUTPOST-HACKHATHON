"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Bell, Bot, GraduationCap, LogOut, Menu, Search, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AppShell({ title, nav, children, userName }: { title: string; nav: { href: string; label: string }[]; children: React.ReactNode; userName?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  async function logout() { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); router.refresh(); }
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <aside className={cn("fixed inset-y-0 left-0 z-50 w-[280px] border-r border-white/10 bg-primary text-white transition-transform lg:static lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <Link href="/" className="flex items-center gap-2 font-bold"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-accent"><GraduationCap size={18}/></span><span className="font-heading tracking-tight">GRANTLY</span></Link>
          <button className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 lg:hidden" onClick={()=>setOpen(false)} aria-label="Close menu"><X size={18}/></button>
        </div>
        <nav className="h-[calc(100vh-4rem)] overflow-y-auto p-3">
          {nav.map((n) => {
            const active = pathname === n.href;
            return (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className={cn("group mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition", active ? "bg-white/10 text-white" : "text-white/72 hover:bg-white/5 hover:text-white")}>
                <span className={cn("h-5 w-1 rounded-full transition", active ? "bg-accent" : "bg-transparent group-hover:bg-accent/40")} aria-hidden />
                <span>{n.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      {open && <button className="fixed inset-0 z-40 bg-black/40 lg:hidden" aria-label="Close overlay" onClick={()=>setOpen(false)} />}
      <div className="min-w-0 bg-background">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border/70 bg-ivory/88 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-2">
            <button className="rounded-lg p-2 text-foreground hover:bg-white lg:hidden" onClick={()=>setOpen(true)} aria-label="Open menu"><Menu size={18}/></button>
            <div>
              <h1 className="font-heading text-base font-semibold text-foreground sm:text-lg">{title}</h1>
              {userName && <p className="hidden text-xs text-muted sm:block">Student scholarship command center</p>}
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="hidden items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm text-muted md:flex"><Search size={15}/> <span>Search scholarships, applications…</span></div>
            <Link href={nav.some(n=>n.href==="/admin")?"/admin":"/student/notifications"} className="relative rounded-xl p-2.5 text-foreground hover:bg-white" aria-label="Notifications"><Bell size={18}/><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" /></Link>
            <Link href={nav.some(n=>n.href==="/admin")?"/admin":"/student/copilot"} className="rounded-xl p-2.5 text-foreground hover:bg-white" aria-label="AI Copilot"><Bot size={18}/></Link>
            <Link href={nav.some(n=>n.href==="/admin")?"/admin":"/student/profile"} className="hidden items-center gap-2 rounded-xl border bg-white px-2.5 py-1.5 sm:flex"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-accent">{(userName||"S").slice(0,1).toUpperCase()}</span><span className="max-w-[120px] truncate text-sm font-medium">{userName||"Student"}</span></Link>
            <Button variant="outline" size="sm" onClick={logout} className="border-primary/15"><LogOut size={16}/><span className="hidden sm:inline">Logout</span></Button>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
