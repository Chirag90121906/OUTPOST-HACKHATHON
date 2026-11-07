"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Bell, Bot, Command, Compass, FileStack, GraduationCap, LayoutDashboard, LogOut, Menu, Search, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AppShell({ title, nav, children, userName }: { title: string; nav: { href: string; label: string }[]; children: React.ReactNode; userName?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQ, setCmdQ] = useState("");
  const isStudent = !nav.some((n) => n.href === "/admin") && nav.some((n) => n.href.startsWith("/student"));

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setCmdOpen((v) => !v); }
      if (e.key === "Escape") setCmdOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const cmdItems = useMemo(() => {
    const base = nav.map((n) => ({ label: n.label, href: n.href }));
    const q = cmdQ.toLowerCase().trim();
    return q ? base.filter((i) => i.label.toLowerCase().includes(q)) : base;
  }, [nav, cmdQ]);

  async function logout() { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); router.refresh(); }

  const mobileNav = [
    { href: "/student", label: "Home", icon: LayoutDashboard },
    { href: "/student/discover", label: "Discover", icon: Compass },
    { href: "/student/applications", label: "Apply", icon: Send },
    { href: "/student/documents", label: "Docs", icon: FileStack },
    { href: "/student/copilot", label: "Copilot", icon: Bot },
  ];

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <aside className={cn("fixed inset-y-0 left-0 z-50 w-[280px] border-r border-white/10 bg-primary text-white transition-transform duration-200 lg:static lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <Link href="/" className="flex items-center gap-2 font-bold"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-accent ring-1 ring-accent/20"><GraduationCap size={18}/></span><span className="font-heading tracking-tight">GRANTLY</span></Link>
          <button className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 lg:hidden" onClick={()=>setOpen(false)} aria-label="Close menu"><X size={18}/></button>
        </div>
        <nav className="h-[calc(100vh-4rem)] overflow-y-auto p-3 pb-24 lg:pb-3">
          {nav.map((n) => {
            const active = pathname === n.href;
            return (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className={cn("group mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition", active ? "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(214,181,109,.12)]" : "text-white/72 hover:bg-white/5 hover:text-white")}> 
                <span className={cn("h-5 w-1 rounded-full transition", active ? "bg-accent shadow-[0_0_12px_rgba(214,181,109,.35)]" : "bg-transparent group-hover:bg-accent/40")} aria-hidden />
                <span>{n.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      {open && <button className="fixed inset-0 z-40 bg-black/40 lg:hidden" aria-label="Close overlay" onClick={()=>setOpen(false)} />}
      <div className={cn("min-w-0 bg-background", isStudent && "pb-20 lg:pb-0")}>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border/70 bg-ivory/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-2">
            <button className="rounded-lg p-2 text-foreground hover:bg-white lg:hidden" onClick={()=>setOpen(true)} aria-label="Open menu"><Menu size={18}/></button>
            <div>
              <h1 className="font-heading text-base font-semibold text-foreground sm:text-lg">{title}</h1>
              {userName && <p className="hidden text-xs text-muted sm:block">Student scholarship command center</p>}
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={()=>setCmdOpen(true)} className="hidden items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm text-muted transition hover:border-accent/30 md:flex" aria-label="Open command palette"><Search size={15}/> <span>Search…</span><kbd className="ml-1 rounded border bg-ivory px-1.5 py-0.5 text-[10px]">⌘K</kbd></button>
            <Link href={nav.some(n=>n.href==="/admin")?"/admin":"/student/notifications"} className="relative rounded-xl p-2.5 text-foreground transition hover:bg-white" aria-label="Notifications"><Bell size={18}/><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" /></Link>
            <Link href={nav.some(n=>n.href==="/admin")?"/admin":"/student/copilot"} className="rounded-xl p-2.5 text-foreground transition hover:bg-white" aria-label="AI Copilot"><Bot size={18}/></Link>
            <Link href={nav.some(n=>n.href==="/admin")?"/admin":"/student/profile"} className="hidden items-center gap-2 rounded-xl border bg-white px-2.5 py-1.5 sm:flex"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-accent">{(userName||"S").slice(0,1).toUpperCase()}</span><span className="max-w-[120px] truncate text-sm font-medium">{userName||"Student"}</span></Link>
            <Button variant="outline" size="sm" onClick={logout} className="border-primary/15"><LogOut size={16}/><span className="hidden sm:inline">Logout</span></Button>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      {isStudent && (
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 px-2 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur lg:hidden" aria-label="Mobile navigation">
          <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
            {mobileNav.map((n) => {
              const active = pathname === n.href;
              return (
                <Link key={n.href} href={n.href} className={cn("flex flex-col items-center rounded-xl px-1 py-2 text-[11px] font-medium transition", active ? "bg-primary text-accent" : "text-muted hover:bg-ivory")}> 
                  <n.icon size={18} />
                  <span className="mt-1">{n.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      {cmdOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center bg-primary/30 p-4 pt-[12vh] backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Command palette" onClick={()=>setCmdOpen(false)}>
          <div className="w-full max-w-xl overflow-hidden rounded-2xl border bg-white shadow-2xl" onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-center gap-2 border-b px-4 py-3"><Command size={16} className="text-muted"/><input autoFocus value={cmdQ} onChange={(e)=>setCmdQ(e.target.value)} placeholder="Go to page or action..." className="w-full bg-transparent text-sm outline-none" aria-label="Command search"/></div>
            <div className="max-h-72 overflow-auto p-2">
              {cmdItems.map((i) => (
                <button key={i.href} className="flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm hover:bg-ivory" onClick={()=>{setCmdOpen(false); setCmdQ(""); router.push(i.href);}}>{i.label}</button>
              ))}
              {cmdItems.length===0 && <p className="px-3 py-4 text-sm text-muted">No matching actions.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
