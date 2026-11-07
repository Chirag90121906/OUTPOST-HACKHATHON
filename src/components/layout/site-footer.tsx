import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2 font-bold text-primary"><GraduationCap size={18} /> GRANTLY</div>
          <p className="mt-3 text-sm text-slate-600">Discover Opportunities. Unlock Your Future. A unified platform for scholarship discovery and application management.</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Platform</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><Link href="/explore" className="hover:text-primary">Explore Scholarships</Link></li>
            <li><Link href="/how-it-works" className="hover:text-primary">How It Works</Link></li>
            <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Company</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><Link href="/about" className="hover:text-primary">About GRANTLY</Link></li>
            <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
            <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-primary">Terms</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">For Students</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><Link href="/register" className="hover:text-primary">Create Account</Link></li>
            <li><Link href="/login" className="hover:text-primary">Login</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t px-4 py-5 text-center text-xs text-slate-500">© {new Date().getFullYear()} GRANTLY. Demo scholarship listings are labeled as sample data and must be verified on official sources.</div>
    </footer>
  );
}
