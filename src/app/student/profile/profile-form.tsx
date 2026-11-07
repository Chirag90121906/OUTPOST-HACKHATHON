"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";

export function ProfileForm({ initial }: { initial: any }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setMsg("");
    const body = Object.fromEntries(new FormData(e.currentTarget).entries());
    const res = await fetch("/api/profile", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const json = await res.json(); setLoading(false);
    setMsg(json.ok ? "Profile saved." : json.error || "Failed to save.");
  }
  const f = (k: string) => initial?.[k] ?? "";
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div><Label>Education level</Label><Select name="educationLevel" defaultValue={f("educationLevel")}><option value="">Select</option><option>Undergraduate</option><option>Postgraduate</option><option>Diploma</option></Select></div>
        <div><Label>Institution</Label><Input name="institution" defaultValue={f("institution")} /></div>
        <div><Label>Degree</Label><Input name="degree" defaultValue={f("degree")} /></div>
        <div><Label>Course</Label><Input name="course" defaultValue={f("course")} /></div>
        <div><Label>Current year</Label><Input name="currentYear" defaultValue={f("currentYear")} /></div>
        <div><Label>Graduation year</Label><Input name="graduationYear" type="number" defaultValue={f("graduationYear")} /></div>
        <div><Label>CGPA</Label><Input name="cgpa" type="number" step="0.01" defaultValue={f("cgpa")} /></div>
        <div><Label>Percentage</Label><Input name="percentage" type="number" step="0.01" defaultValue={f("percentage")} /></div>
        <div><Label>State</Label><Input name="state" defaultValue={f("state")} /></div>
        <div><Label>City</Label><Input name="city" defaultValue={f("city")} /></div>
        <div><Label>Family income (annual)</Label><Input name="familyIncome" type="number" defaultValue={f("familyIncome")} /></div>
        <div><Label>Income category</Label><Input name="incomeCategory" defaultValue={f("incomeCategory")} /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label>Skills</Label><Input name="skills" defaultValue={f("skills")} /></div>
        <div><Label>Achievements</Label><Input name="achievements" defaultValue={f("achievements")} /></div>
      </div>
      {msg && <p className="text-sm text-slate-700">{msg}</p>}
      <Button disabled={loading}>{loading ? "Saving..." : "Save profile"}</Button>
    </form>
  );
}
