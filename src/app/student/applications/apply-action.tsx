"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";

export function ApplyAction({ scholarships, defaultId }: { scholarships: {id:string;title:string}[]; defaultId?: string }) {
  const [id, setId] = useState(defaultId || scholarships[0]?.id || "");
  const [loading, setLoading] = useState("");
  const router = useRouter();
  async function act(submit: boolean) {
    if (!id) return; setLoading(submit ? "submit" : "draft");
    await fetch("/api/applications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ scholarshipId: id, submit }) });
    setLoading(""); router.refresh();
  }
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Select value={id} onChange={(e)=>setId(e.target.value)} className="sm:max-w-md">{scholarships.map(s=><option key={s.id} value={s.id}>{s.title}</option>)}</Select>
      <div className="flex gap-2"><Button variant="outline" disabled={!!loading} onClick={()=>act(false)}>{loading==="draft"?"Saving...":"Save draft"}</Button><Button disabled={!!loading} onClick={()=>act(true)}>{loading==="submit"?"Submitting...":"Submit"}</Button></div>
    </div>
  );
}
