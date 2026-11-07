"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GraduationCap, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore Scholarships" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-[#101c36]/10 bg-[#f8f7f2]/88 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-primary">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-accent ring-1 ring-accent/30"><GraduationCap size={18} /></span>
          <span className="text-lg tracking-tight font-heading">GRANTLY</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={cn("rounded-lg px-3 py-2 text-sm font-medium transition", pathname === l.href ? "bg-white text-primary shadow-sm" : "text-slate-600 hover:bg-white/70 hover:text-primary")}>{l.label}</Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link href="/login"><Button variant="ghost">Login</Button></Link>
          <Link href="/register"><Button>Get Started</Button></Link>
        </div>
        <button className="rounded-lg p-2 md:hidden" aria-label="Toggle menu" onClick={() => setOpen((v) => !v)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <div className="border-t bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">{l.label}</Link>)}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link href="/login" onClick={() => setOpen(false)}><Button variant="outline" className="w-full">Login</Button></Link>
              <Link href="/register" onClick={() => setOpen(false)}><Button className="w-full">Get Started</Button></Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
