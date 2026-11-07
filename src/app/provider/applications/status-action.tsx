"use client";
import { useRouter } from "next/navigation";
import { Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const statuses = ["UNDER_REVIEW", "DOCUMENTS_REQUIRED", "SHORTLISTED", "APPROVED", "REJECTED"];

export function ProviderStatusAction({ id }: { id: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(statuses[0]);
  const [loading, setLoading] = useState(false);
  async function update() {
    setLoading(true);
    await fetch(`/api/provider/applications/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    setLoading(false); router.refresh();
  }
  return <div className="flex items-center gap-2"><Select value={status} onChange={(e)=>setStatus(e.target.value)} className="h-9 w-auto text-sm">{statuses.map(s=><option key={s} value={s}>{s.replaceAll("_"," ")}</option>)}</Select><Button size="sm" variant="outline" disabled={loading} onClick={update}>{loading?"...":"Update"}</Button></div>;
}
