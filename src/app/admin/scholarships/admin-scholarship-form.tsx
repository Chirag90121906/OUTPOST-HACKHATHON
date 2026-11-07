"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";

export function AdminScholarshipForm() {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setMsg("");
    const body = Object.fromEntries(new FormData(e.currentTarget).entries());
    const res = await fetch("/api/admin/scholarships", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, isDemo: true, isPublished: true }) });
    const j = await res.json(); setMsg(j.ok ? "Scholarship created." : j.error || "Failed"); if (j.ok) { (e.target as HTMLFormElement).reset(); router.refresh(); }
  }
  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
      <div className="sm:col-span-2"><Label>Title</Label><Input name="title" required /></div>
      <div><Label>Provider</Label><Input name="providerName" /></div>
      <div><Label>Amount</Label><Input name="amount" type="number" /></div>
      <div><Label>Deadline</Label><Input name="deadline" type="date" /></div>
      <div><Label>Funding type</Label><Select name="fundingType"><option value="">Select</option><option value="partial">Partial</option><option value="full">Full</option></Select></div>
      <div className="sm:col-span-2"><Label>Education levels</Label><Input name="educationLevels" placeholder="Undergraduate,Postgraduate" /></div>
      <div className="sm:col-span-2"><Label>Eligible courses</Label><Input name="eligibleCourses" /></div>
      <div className="sm:col-span-2"><Label>Required documents</Label><Input name="requiredDocuments" placeholder="Comma-separated" /></div>
      <div className="sm:col-span-2"><Label>Official URL</Label><Input name="officialUrl" type="url" /></div>
      <div className="sm:col-span-2"><Label>Description</Label><Textarea name="description" rows={4} required /></div>
      {msg && <p className="sm:col-span-2 text-sm text-slate-700">{msg}</p>}
      <div className="sm:col-span-2"><Button type="submit">Create scholarship (demo-labeled)</Button></div>
    </form>
  );
}
