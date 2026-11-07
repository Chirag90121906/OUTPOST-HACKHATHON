"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ComparePage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    try {
      const ids = JSON.parse(localStorage.getItem("grantly_compare") || "[]");
      if (!ids.length) { setItems([]); return; }
      const res = await fetch(`/api/scholarships?ids=${encodeURIComponent(ids.join(","))}`);
      const j = await res.json();
      setItems(j.data?.items || []);
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  function remove(id: string) {
    const ids = JSON.parse(localStorage.getItem("grantly_compare") || "[]").filter((x: string) => x !== id);
    localStorage.setItem("grantly_compare", JSON.stringify(ids)); load();
  }
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold tracking-tight">Compare scholarships</h2><p className="mt-1 text-slate-600">Side-by-side comparison of saved selections (stored locally in your browser for this demo).</p></div>
      {loading ? <Card className="p-6 text-sm text-slate-600">Loading comparison…</Card> : items.length === 0 ? <Card className="p-6 text-sm text-slate-600">No scholarships selected. Open a scholarship and click “Add to Compare”, or <Link href="/explore" className="text-secondary underline">explore scholarships</Link>.</Card> : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead><tr>{["Field", ...items.map((s) => s.title)].map((h, i) => <th key={i} className="border bg-slate-50 p-3 text-left align-top font-semibold">{h}</th>)}</tr></thead>
            <tbody>
              {[
                ["Provider", (s: any) => s.providerName],
                ["Amount", (s: any) => formatCurrency(s.amount, s.currency)],
                ["Deadline", (s: any) => formatDate(s.deadline)],
                ["Education", (s: any) => s.educationLevels || "—"],
                ["Courses", (s: any) => s.eligibleCourses || "—"],
                ["Min CGPA", (s: any) => s.minCgpa ?? "—"],
                ["Max income", (s: any) => s.maxFamilyIncome ? formatCurrency(s.maxFamilyIncome, s.currency) : "—"],
                ["Documents", (s: any) => s.requiredDocuments || "—"],
              ].map(([label, fn]: any) => (
                <tr key={label}><td className="border p-3 font-medium text-slate-700">{label}</td>{items.map((s) => <td key={s.id} className="border p-3 align-top text-slate-600">{String(fn(s))}</td>)}</tr>
              ))}
              <tr><td className="border p-3 font-medium">Actions</td>{items.map((s) => <td key={s.id} className="border p-3"><div className="flex gap-2"><Link href={`/scholarships/${s.id}`}><Button size="sm" variant="outline">Details</Button></Link><Button size="sm" variant="ghost" onClick={() => remove(s.id)}>Remove</Button></div></td>)}</tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
