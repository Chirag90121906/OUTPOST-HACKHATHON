"use client";
import { useEffect, useState } from "react";
import { Award, X } from "lucide-react";

const defs = [
  { key: "profile_pioneer", title: "Profile Pioneer", when: (d: any) => (d.completion || 0) >= 30, msg: "You started building your Opportunity Passport." },
  { key: "doc_ready", title: "Document Ready", when: (d: any) => (d.docs || 0) >= 1, msg: "You uploaded your first supporting document." },
  { key: "opportunity_explorer", title: "Opportunity Explorer", when: (d: any) => (d.saved || 0) >= 1, msg: "You saved a scholarship opportunity." },
  { key: "application_prepared", title: "Application Prepared", when: (d: any) => (d.apps || 0) >= 1, msg: "You created an application record." },
  { key: "deadline_planner", title: "Deadline Planner", when: (d: any) => (d.saved || 0) >= 1 || (d.apps || 0) >= 1, msg: "You’re actively tracking opportunities." },
];

export function AchievementUnlock({ data }: { data: { completion: number; saved: number; apps: number; docs: number } }) {
  const [item, setItem] = useState<{ title: string; msg: string } | null>(null);
  useEffect(() => {
    try {
      const seen = new Set(JSON.parse(localStorage.getItem("grantly_achievements_seen") || "[]"));
      const next = defs.find((d) => d.when(data) && !seen.has(d.key));
      if (!next) return;
      seen.add(next.key);
      localStorage.setItem("grantly_achievements_seen", JSON.stringify([...seen]));
      setItem({ title: next.title, msg: next.msg });
      const t = setTimeout(() => setItem(null), 6500);
      return () => clearTimeout(t);
    } catch {}
  }, [data]);
  if (!item) return null;
  return (
    <div className="fixed bottom-24 right-4 z-[55] max-w-sm animate-fade-up lg:bottom-6" role="status" aria-live="polite">
      <div className="gold-glow rounded-2xl border border-accent/25 bg-white p-4 shadow-xl">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/20 text-primary"><Award size={20}/></span>
          <div className="min-w-0 flex-1"><div className="text-xs font-semibold uppercase tracking-wide text-accent">Achievement unlocked</div><div className="font-heading font-semibold">{item.title}</div><p className="mt-0.5 text-sm text-muted">{item.msg}</p></div>
          <button onClick={()=>setItem(null)} className="rounded-lg p-1 text-muted hover:bg-ivory" aria-label="Dismiss"><X size={16}/></button>
        </div>
      </div>
    </div>
  );
}
