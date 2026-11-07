"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const roleHint = params.get("role");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(""); setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: fd.get("email"), password: fd.get("password") }) });
    const json = await res.json(); setLoading(false);
    if (!json.ok) return setError(json.error || "Login failed.");
    const role = json.data?.user?.role;
    router.push(params.get("next") || (role === "ADMIN" ? "/admin" : role === "PROVIDER" ? "/provider" : "/student"));
    router.refresh();
  }
  const title = roleHint === "ADMIN" ? "Admin Login" : roleHint === "PROVIDER" ? "Provider Login" : "Welcome back";
  return (
    <Card className="animate-fade-up">
      <CardHeader><CardTitle className="font-heading text-2xl">{title}</CardTitle><p className="text-sm text-muted">{roleHint === "ADMIN" ? "Secure access for authorized platform administrators only." : roleHint === "PROVIDER" ? "Sign in to manage your organization’s scholarships and applications." : "Log in to manage scholarships and applications."}</p></CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required autoComplete="email" /></div>
          <div><Label htmlFor="password">Password</Label><div className="flex gap-2"><Input id="password" name="password" type={show ? "text" : "password"} required autoComplete="current-password" /><Button type="button" variant="outline" onClick={() => setShow((v)=>!v)} aria-label={show?"Hide password":"Show password"}>{show ? "Hide" : "Show"}</Button></div></div>
          <label className="flex items-center gap-2 text-sm text-muted"><input type="checkbox" name="remember" className="rounded border-border" /> Remember me</label>
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>}
          <Button className="w-full" disabled={loading}>{loading ? "Signing in..." : "Login"}</Button>
        </form>
        <div className="mt-4 flex flex-wrap justify-between gap-2 text-sm"><Link href="/forgot-password" className="text-secondary hover:underline">Forgot password?</Link><Link href={roleHint ? `/register?role=${roleHint === "ADMIN" ? "STUDENT" : roleHint}` : "/get-started"} className="text-secondary hover:underline">{roleHint === "ADMIN" ? "Back to role selection" : "Create account"}</Link></div>
        <div className="mt-3"><Link href="/explore" className="text-sm text-muted hover:text-secondary hover:underline">Continue browsing scholarships as guest</Link></div>
        <div className="mt-5 rounded-xl bg-ivory p-3 text-xs text-muted"><strong className="text-foreground">Demo (non-production):</strong> student@grantly.demo / admin@grantly.demo / provider@grantly.demo — Demo@12345</div>
      </CardContent>
    </Card>
  );
}
export default function LoginPage() { return <Suspense><LoginForm /></Suspense>; }
