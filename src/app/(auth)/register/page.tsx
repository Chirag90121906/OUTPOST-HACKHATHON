"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(""); setLoading(true);
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());
    const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const json = await res.json(); setLoading(false);
    if (!json.ok) return setError(json.error || "Registration failed.");
    router.push(json.data?.user?.role === "PROVIDER" ? "/provider" : "/student"); router.refresh();
  }
  return (
    <Card>
      <CardHeader><CardTitle className="text-2xl">Create your GRANTLY account</CardTitle><p className="text-sm text-slate-600">Start discovering scholarships that match your profile.</p></CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label htmlFor="name">Full name</Label><Input id="name" name="name" required /></div>
            <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required /></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" minLength={8} required /></div>
            <div><Label htmlFor="confirmPassword">Confirm password</Label><Input id="confirmPassword" name="confirmPassword" type="password" minLength={8} required /></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label htmlFor="phone">Phone (optional)</Label><Input id="phone" name="phone" /></div>
            <div><Label htmlFor="educationLevel">Education level</Label><Select id="educationLevel" name="educationLevel" defaultValue=""><option value="">Select</option><option>Undergraduate</option><option>Postgraduate</option><option>Diploma</option><option>School</option></Select></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label htmlFor="institution">Institution</Label><Input id="institution" name="institution" /></div>
            <div><Label htmlFor="course">Course</Label><Input id="course" name="course" /></div>
          </div>
          <div><Label htmlFor="graduationYear">Graduation year</Label><Input id="graduationYear" name="graduationYear" type="number" min="2000" max="2045" /></div>
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>}
          <Button className="w-full" disabled={loading}>{loading ? "Creating account..." : "Create account"}</Button>
        </form>
        <p className="mt-4 text-sm text-slate-600">Already have an account? <Link href="/login" className="text-secondary hover:underline">Login</Link></p>
      </CardContent>
    </Card>
  );
}
