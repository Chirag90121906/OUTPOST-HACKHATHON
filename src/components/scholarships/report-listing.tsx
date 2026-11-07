"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";

export function ReportListing({ scholarshipId }: { scholarshipId: string }) {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/report", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ scholarshipId, message: msg }) });
    const j = await res.json();
    setDone(j.ok ? "Report submitted. Thank you." : j.error || "Failed");
    if (j.ok) { setMsg(""); setOpen(false); }
  }
  return (
    <div className="mt-3">
      <button type="button" className="text-xs text-muted underline hover:text-secondary" onClick={() => setOpen((v) => !v)}>Report incorrect or suspicious listing</button>
      {open && <form onSubmit={submit} className="mt-2 space-y-2"><Textarea rows={3} value={msg} onChange={(e)=>setMsg(e.target.value)} placeholder="Describe the issue (expired link, incorrect eligibility, suspicious fee, duplicate, etc.)" required /><div className="flex gap-2"><Button type="submit" size="sm" variant="outline">Submit report</Button></div></form>}
      {done && <p className="mt-2 text-xs text-muted">{done}</p>}
    </div>
  );
}
