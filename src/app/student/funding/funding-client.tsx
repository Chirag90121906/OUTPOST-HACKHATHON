"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

export function FundingPlannerClient({ confirmed, potential }: { confirmed: number; potential: number }) {
  const [v, setV] = useState({ tuition: 0, accommodation: 0, books: 0, transport: 0, other: 0 });
  useEffect(() => { try { const s = localStorage.getItem("grantly_funding"); if (s) setV(JSON.parse(s)); } catch {} }, []);
  useEffect(() => { try { localStorage.setItem("grantly_funding", JSON.stringify(v)); } catch {} }, [v]);
  const total = v.tuition + v.accommodation + v.books + v.transport + v.other;
  const gap = Math.max(0, total - confirmed);
  const pct = total > 0 ? Math.min(100, Math.round((confirmed / total) * 100)) : 0;
  return (
    <Card className="p-5 sm:p-6">
      <h3 className="font-heading font-semibold">Education expense planner</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {([["tuition","Tuition"],["accommodation","Accommodation"],["books","Books/supplies"],["transport","Transportation"],["other","Other"]] as const).map(([k,l])=> (
          <div key={k}><Label>{l}</Label><Input type="number" min={0} value={v[k]||""} onChange={(e)=>setV(p=>({...p,[k]:Number(e.target.value||0)}))} /></div>
        ))}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-ivory p-4"><div className="text-sm text-muted">Estimated expenses</div><div className="font-heading text-xl font-bold">{formatCurrency(total)}</div></div>
        <div className="rounded-xl border bg-ivory p-4"><div className="text-sm text-muted">Remaining gap (after confirmed)</div><div className="font-heading text-xl font-bold text-primary">{formatCurrency(gap)}</div></div>
        <div className="rounded-xl border bg-ivory p-4"><div className="text-sm text-muted">Confirmed coverage</div><div className="font-heading text-xl font-bold">{pct}%</div><div className="mt-2 h-2 rounded-full bg-white"><div className="h-2 rounded-full bg-accent" style={{width:`${pct}%`}}/></div></div>
      </div>
      <p className="mt-4 text-xs text-muted">Potential funding ({formatCurrency(potential)}) is shown separately and is never treated as guaranteed.</p>
    </Card>
  );
}
