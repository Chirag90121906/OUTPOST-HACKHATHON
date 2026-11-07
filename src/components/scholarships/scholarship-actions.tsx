"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bookmark, CheckCircle2, ExternalLink, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ScholarshipActions({ id, officialUrl, isLoggedIn }: { id: string; officialUrl?: string | null; isLoggedIn: boolean }) {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  async function save() {
    if (!isLoggedIn) return router.push(`/login?next=/scholarships/${id}`);
    setLoading("save"); setMsg("");
    const res = await fetch("/api/saved", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ scholarshipId: id }) });
    const j = await res.json(); setLoading(null); setMsg(j.ok ? "Saved to your bookmarks." : j.error || "Could not save."); router.refresh();
  }
  async function apply(submit: boolean) {
    if (!isLoggedIn) return router.push(`/login?next=/scholarships/${id}`);
    setLoading(submit ? "submit" : "draft"); setMsg("");
    const res = await fetch("/api/applications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ scholarshipId: id, submit }) });
    const j = await res.json(); setLoading(null); setMsg(j.ok ? (submit ? "Application submitted (demo workflow)." : "Draft saved.") : j.error || "Action failed."); router.refresh();
  }
  function compare() {
    try {
      const key = "grantly_compare"; const arr = JSON.parse(localStorage.getItem(key) || "[]");
      if (!arr.includes(id)) arr.unshift(id);
      localStorage.setItem(key, JSON.stringify(arr.slice(0, 4)));
      setMsg("Added to comparison (view in Student → Compare).");
    } catch { setMsg("Could not update comparison."); }
  }
  return (
    <div className="grid gap-2">
      <Button className="w-full" disabled={!!loading} onClick={() => apply(true)}>{loading === "submit" ? "Submitting..." : "Submit Application (Demo)"}</Button>
      <Button variant="outline" className="w-full" disabled={!!loading} onClick={() => apply(false)}>{loading === "draft" ? "Saving..." : "Save as Draft"}</Button>
      <Button variant="outline" className="w-full" disabled={!!loading} onClick={save}><Bookmark size={16}/> {loading === "save" ? "Saving..." : "Save Scholarship"}</Button>
      <Button variant="ghost" className="w-full" onClick={compare}><CheckCircle2 size={16}/> Add to Compare</Button>
      {officialUrl && <a href={officialUrl} target="_blank" rel="noreferrer"><Button variant="ghost" className="w-full"><Globe size={16}/> Official Website <ExternalLink size={14}/></Button></a>}
      {msg && <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700">{msg}</p>}
    </div>
  );
}
