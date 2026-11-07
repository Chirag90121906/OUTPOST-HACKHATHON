"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { q: "Is GRANTLY free for students?", a: "GRANTLY is designed for scholarship discovery and application tracking. Any pricing or premium features should be clearly communicated in official product terms." },
  { q: "How does eligibility matching work?", a: "GRANTLY uses transparent, rule-based checks against published scholarship criteria (education, course, income, documents, deadlines). Results show why you match or what information is missing—never a guarantee of award." },
  { q: "Can I trust scholarship listings?", a: "Listings can show verification status (verified, pending, unverified, expired, reported). Always confirm eligibility, deadlines, and links on the official provider website before applying." },
  { q: "How is my location used?", a: "Location is optional and permission-based. When enabled, it can help surface region/state-relevant opportunities where supported. You can enter manually, update, or clear it in settings." },
  { q: "Who can post scholarships?", a: "Providers can register and manage listings for their organization, subject to verification workflows. Administrators review platform integrity and reported listings." },
];

export function HomeFaq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto mt-10 max-w-3xl space-y-3">
      {items.map((item, i) => {
        const active = open === i;
        return (
          <div key={item.q} className="overflow-hidden rounded-2xl border border-[#d6b56d]/20 bg-white shadow-sm">
            <button type="button" className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left" onClick={() => setOpen(active ? null : i)} aria-expanded={active}>
              <span className="font-heading font-semibold text-primary">{item.q}</span>
              <ChevronDown size={18} className={cn("shrink-0 text-accent transition", active && "rotate-180")} />
            </button>
            {active && <div className="border-t border-[#f0ead8] px-5 py-4 text-sm leading-6 text-muted">{item.a}</div>}
          </div>
        );
      })}
    </div>
  );
}
