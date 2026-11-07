"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";

export default function CreateScholarshipPage() {
  const router = useRouter();
  const [msg, setMsg] = useState(""); const [loading, setLoading] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setMsg(""); setLoading(true);
    const body = Object.fromEntries(new FormData(e.currentTarget).entries());
    const res = await fetch("/api/provider/scholarships", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, isPublished: body.isPublished === "on" }) });
    const j = await res.json(); setLoading(false);
    setMsg(j.ok ? "Scholarship created." : j.error || "Failed");
    if (j.ok) router.push("/provider/scholarships");
  }
  return (
    <div className="space-y-6">
      <div><h2 className="font-heading text-2xl font-bold tracking-tight">Create Scholarship</h2><p className="mt-1 text-muted">Listings are subject to platform verification workflows. Provide accurate, official information.</p></div>
      <Card className="p-5 sm:p-6">
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><Label>Title</Label><Input name="title" required /></div>
          <div><Label>Amount (INR)</Label><Input name="amount" type="number" min="0" /></div>
          <div><Label>Funding type</Label><Select name="fundingType" defaultValue=""><option value="">Select</option><option value="partial">Partial</option><option value="full">Full</option></Select></div>
          <div><Label>Deadline</Label><Input name="deadline" type="date" /></div>
          <div><Label>Official URL</Label><Input name="officialUrl" type="url" /></div>
          <div className="sm:col-span-2"><Label>Education levels</Label><Input name="educationLevels" placeholder="Undergraduate,Postgraduate" /></div>
          <div className="sm:col-span-2"><Label>Eligible courses</Label><Input name="eligibleCourses" /></div>
          <div className="sm:col-span-2"><Label>Required documents</Label><Input name="requiredDocuments" placeholder="Comma-separated" /></div>
          <div className="sm:col-span-2"><Label>Description</Label><Textarea name="description" rows={5} required /></div>
          <label className="flex items-center gap-2 text-sm text-muted sm:col-span-2"><input type="checkbox" name="isPublished" /> Publish immediately (still subject to verification status display)</label>
          {msg && <p className="sm:col-span-2 text-sm text-muted">{msg}</p>}
          <div className="sm:col-span-2"><Button disabled={loading}>{loading ? "Creating..." : "Create Scholarship"}</Button></div>
        </form>
      </Card>
    </div>
  );
}
