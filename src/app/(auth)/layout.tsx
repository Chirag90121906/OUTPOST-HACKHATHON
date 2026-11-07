import Link from "next/link";
import { GraduationCap } from "lucide-react";
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 font-bold text-primary"><GraduationCap /> GRANTLY</Link>
        {children}
      </div>
    </div>
  );
}
