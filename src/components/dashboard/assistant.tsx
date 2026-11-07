"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function answer(q: string) {
  const s = q.toLowerCase();
  if (s.includes("eligib")) return "GRANTLY shows explainable eligibility: Eligible, Potentially Eligible, Not Eligible, or Insufficient Information. Open a scholarship and check the eligibility panel, or review Recommendations after completing your profile. Always verify official criteria on the provider site.";
  if (s.includes("document")) return "Use the Document Manager to upload transcripts, ID, income/bonafide certificates, and other required files (PDF/images). Each scholarship lists required documents — upload what’s missing before applying.";
  if (s.includes("deadline") || s.includes("closing")) return "Deadlines appear on scholarship cards/details and in dashboard reminders. Prioritize ‘Closing soon’ opportunities and save drafts early. GRANTLY labels urgency based on actual dates.";
  if (s.includes("apply") || s.includes("application")) return "You can save a draft or submit from a scholarship’s action panel or My Applications. Track status updates in My Applications and Notifications. Demo workflows record status history in the database.";
  if (s.includes("match") || s.includes("recommend")) return "Recommendations use your profile (education, course, CGPA/percentage, location, income where relevant). Complete your profile to reduce ‘Insufficient Information’ results.";
  return "I can help with eligibility explanations, required documents, deadlines, applications, and recommendations. This assistant is rule-based and grounded in GRANTLY workflows; for official scholarship decisions, always check the provider’s website.";
}

export function AssistantPanel() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<{q:string;a:string}[]>([{ q: "How does eligibility matching work?", a: answer("eligibility") }]);
  return (
    <Card className="p-5">
      <div className="font-semibold">GRANTLY Assistant (rule-based)</div>
      <p className="mt-1 text-xs text-slate-500">Grounded guidance for platform workflows. No official eligibility decisions are made by AI.</p>
      <div className="mt-4 max-h-56 space-y-3 overflow-auto pr-1">
        {items.map((it, i) => (
          <div key={i} className="rounded-xl bg-slate-50 p-3 text-sm"><div className="font-medium text-slate-800">You: {it.q}</div><div className="mt-1 text-slate-600">{it.a}</div></div>
        ))}
      </div>
      <form className="mt-4 flex gap-2" onSubmit={(e)=>{e.preventDefault(); if(!q.trim()) return; setItems((p)=>[...p,{q,a:answer(q)}]); setQ("");}}>
        <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Ask about eligibility, documents, deadlines…" aria-label="Ask GRANTLY Assistant" />
        <Button type="submit">Ask</Button>
      </form>
    </Card>
  );
}
