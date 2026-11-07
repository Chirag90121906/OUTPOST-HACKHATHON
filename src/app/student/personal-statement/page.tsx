"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label, Textarea } from "@/components/ui/input";

const templates = [
  "I am applying for this scholarship because... My academic goals are... I have demonstrated commitment through... This support will help me...",
  "My educational journey has been shaped by... A key achievement was... I plan to use my education to...",
];

export default function PersonalStatementPage() {
  const [text, setText] = useState("");
  const [msg, setMsg] = useState("");
  useEffect(() => { try { setText(localStorage.getItem("grantly_ps_draft") || ""); } catch {} }, []);
  function save() { localStorage.setItem("grantly_ps_draft", text); setMsg("Draft saved locally. Review carefully before using in any application."); }
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  return (
    <div className="space-y-6">
      <div><h2 className="font-heading text-2xl font-bold tracking-tight">Personal Statement Studio</h2><p className="mt-1 text-muted">Draft, refine, and save your statement. You must review and approve all content. Do not include fabricated achievements.</p></div>
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <Card className="p-5 sm:p-6">
          <Label htmlFor="ps">Draft</Label>
          <Textarea id="ps" rows={16} value={text} onChange={(e)=>setText(e.target.value)} placeholder="Write your scholarship personal statement..." />
          <div className="mt-3 flex flex-wrap items-center gap-3"><Button onClick={save}>Save draft</Button><span className="text-sm text-muted">{words} words</span>{msg && <span className="text-sm text-muted">{msg}</span>}</div>
        </Card>
        <div className="space-y-4">
          <Card className="p-5"><h3 className="font-heading font-semibold">Templates</h3><div className="mt-3 space-y-2">{templates.map((t,i)=><button key={i} type="button" className="block w-full rounded-xl border p-3 text-left text-sm text-muted hover:bg-ivory" onClick={()=>setText((p)=>p? p+"\n\n"+t : t)}>Use template {i+1}</button>)}</div></Card>
          <Card className="p-5"><h3 className="font-heading font-semibold">Writing guidance</h3><ul className="mt-3 space-y-2 text-sm text-muted"><li>• Be specific and truthful.</li><li>• Match the scholarship’s criteria.</li><li>• Explain impact and goals clearly.</li><li>• Proofread before submission.</li></ul></Card>
        </div>
      </div>
    </div>
  );
}
