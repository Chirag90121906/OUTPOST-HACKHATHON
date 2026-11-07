"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";

const categories = ["Academic transcripts", "Mark sheets", "Income certificate", "Identity document", "Bonafide certificate", "Recommendation letter", "Other"];

export default function DocumentsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  async function load() { const r = await fetch("/api/documents"); const j = await r.json(); if (j.ok) setItems(j.data.items || []); }
  useEffect(() => { load(); }, []);
  async function onUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setMsg("");
    const fd = new FormData(e.currentTarget);
    const r = await fetch("/api/documents", { method: "POST", body: fd });
    const j = await r.json(); setLoading(false);
    setMsg(j.ok ? "Document uploaded." : j.error || "Upload failed.");
    if (j.ok) { (e.target as HTMLFormElement).reset(); load(); }
  }
  async function remove(id: string) {
    await fetch("/api/documents", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  }
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold tracking-tight">Document manager</h2><p className="mt-1 text-slate-600">Upload required documents (PDF/images, max 5MB). Files are stored privately and served only to authorized users.</p></div>
      <Card className="p-5 sm:p-6">
        <form onSubmit={onUpload} className="grid gap-4 sm:grid-cols-[1fr_220px_auto] sm:items-end">
          <div><Label htmlFor="file">File</Label><Input id="file" name="file" type="file" accept=".pdf,image/png,image/jpeg,image/webp" required /></div>
          <div><Label htmlFor="category">Category</Label><Select id="category" name="category">{categories.map(c => <option key={c}>{c}</option>)}</Select></div>
          <Button disabled={loading}>{loading ? "Uploading..." : "Upload"}</Button>
        </form>
        {msg && <p className="mt-3 text-sm text-slate-700">{msg}</p>}
      </Card>
      <div className="space-y-3">
        {items.map((d) => (
          <Card key={d.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div><div className="font-medium">{d.originalName}</div><div className="text-sm text-slate-500">{d.category} · {(d.size/1024).toFixed(1)} KB · {new Date(d.createdAt).toLocaleDateString()}</div></div>
            <div className="flex gap-2"><a href={`/api/documents/${d.id}`} target="_blank" rel="noreferrer"><Button variant="outline" size="sm">View</Button></a><Button variant="ghost" size="sm" onClick={() => remove(d.id)}>Delete</Button></div>
          </Card>
        ))}
        {items.length === 0 && <Card className="p-8 text-slate-600">No documents uploaded yet. Use the checklist in scholarship details to know what’s required.</Card>}
      </div>
    </div>
  );
}
