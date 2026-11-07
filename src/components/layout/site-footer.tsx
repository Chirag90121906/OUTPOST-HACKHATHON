import Link from "next/link";
import { GraduationCap, Mail, MapPin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#d6b56d]/15 bg-primary text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2.5 font-bold"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-accent ring-1 ring-accent/25"><GraduationCap size={18} /></span><span className="font-heading text-lg tracking-tight">GRANTLY</span></div>
          <p className="mt-4 text-sm leading-6 text-white/72">Discover Opportunities. Unlock Your Future. A unified platform for scholarship discovery and application management.</p>
          <div className="mt-4 space-y-2 text-sm text-white/68">
            <div className="flex items-center gap-2"><Mail size={14} className="text-accent" /> support@grantly.demo</div>
            <div className="flex items-center gap-2"><MapPin size={14} className="text-accent" /> India (demo contact)</div>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-accent">Platform</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/75">
            <li><Link href="/explore" className="transition hover:text-accent">Explore Scholarships</Link></li>
            <li><Link href="/how-it-works" className="transition hover:text-accent">How It Works</Link></li>
            <li><Link href="/faq" className="transition hover:text-accent">FAQ</Link></li>
            <li><Link href="/get-started" className="transition hover:text-accent">Get Started</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-accent">Company</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/75">
            <li><Link href="/about" className="transition hover:text-accent">About GRANTLY</Link></li>
            <li><Link href="/contact" className="transition hover:text-accent">Contact</Link></li>
            <li><Link href="/privacy" className="transition hover:text-accent">Privacy Policy</Link></li>
            <li><Link href="/terms" className="transition hover:text-accent">Terms</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-accent">Accounts</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/75">
            <li><Link href="/login" className="transition hover:text-accent">Login</Link></li>
            <li><Link href="/get-started" className="transition hover:text-accent">Choose Role</Link></li>
            <li><Link href="/explore" className="transition hover:text-accent">Continue as Guest</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-white/55">© {new Date().getFullYear()} GRANTLY. Demo scholarship listings are labeled as sample data and must be verified on official sources.</div>
    </footer>
  );
}
