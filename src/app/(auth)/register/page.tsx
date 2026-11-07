"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/input";

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const role = (params.get("role") === "PROVIDER" ? "PROVIDER" : "STUDENT") as "STUDENT" | "PROVIDER";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(""); setLoading(true);
    const body = Object.fromEntries(new FormData(e.currentTarget).entries());
    const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const json = await res.json(); setLoading(false);
    if (!json.ok) return setError(json.error || "Registration failed.");
    router.push(json.data?.user?.role === "PROVIDER" ? "/provider" : "/student"); router.refresh();
  }
  return (
    <Card className="animate-fade-up">
      <CardHeader>
        <CardTitle className="font-heading text-2xl">{role === "PROVIDER" ? "Register your organization" : "Create your student account"}</CardTitle>
        <p className="text-sm text-muted">{role === "PROVIDER" ? "Create a provider account to publish and manage scholarship listings (subject to verification workflows)." : "Start discovering scholarships that match your profile."}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <input type="hidden" name="role" value={role} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label htmlFor="name">{role === "PROVIDER" ? "Contact person name" : "Full name"}</Label><Input id="name" name="name" required /></div>
            <div><Label htmlFor="email">{role === "PROVIDER" ? "Official email" : "Email"}</Label><Input id="email" name="email" type="email" required /></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" minLength={8} required /></div>
            <div><Label htmlFor="confirmPassword">Confirm password</Label><Input id="confirmPassword" name="confirmPassword" type="password" minLength={8} required /></div>
          </div>
          <div><Label htmlFor="phone">Phone number</Label><Input id="phone" name="phone" /></div>
          {role === "PROVIDER" ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label htmlFor="organization">Organization name</Label><Input id="organization" name="organization" required /></div>
                <div><Label htmlFor="organizationType">Organization type</Label><Select id="organizationType" name="organizationType" defaultValue=""><option value="">Select</option><option>Trust</option><option>Foundation</option><option>Government</option><option>Corporate</option><option>Educational Institution</option><option>NGO</option></Select></div>
              </div>
              <div><Label htmlFor="website">Official website</Label><Input id="website" name="website" type="url" placeholder="https://..." /></div>
            </>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label htmlFor="educationLevel">Education level</Label><Select id="educationLevel" name="educationLevel" defaultValue=""><option value="">Select</option><option>Undergraduate</option><option>Postgraduate</option><option>Diploma</option><option>School</option></Select></div>
                <div><Label htmlFor="graduationYear">Graduation year</Label><Input id="graduationYear" name="graduationYear" type="number" min="2000" max="2045" /></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label htmlFor="institution">Institution</Label><Input id="institution" name="institution" /></div>
                <div><Label htmlFor="course">Course / degree</Label><Input id="course" name="course" /></div>
              </div>
            </>
          )}
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>}
          <Button className="w-full" disabled={loading}>{loading ? "Creating account..." : role === "PROVIDER" ? "Register Provider" : "Create student account"}</Button>
        </form>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
          <span>Already have an account? <Link href={`/login?role=${role}`} className="text-secondary hover:underline">Login</Link></span>
          <Link href="/get-started" className="hover:underline">Choose a different role</Link>
        </div>
      </CardContent>
    </Card>
  );
}
export default function RegisterPage() { return <Suspense><RegisterForm /></Suspense>; }
