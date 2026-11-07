import Link from "next/link";
import { Bookmark, Building2, Calendar, IndianRupee } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { deadlineLabel, formatCurrency, formatDate } from "@/lib/utils";

export function ScholarshipCard({ s }: { s: any }) {
  const d = deadlineLabel(s.deadline);
  return (
    <Card className="group h-full transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <CardContent className="flex h-full flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-primary"><Building2 size={18} /></div>
            <div>
              <p className="text-xs font-medium text-slate-500">{s.providerName || s.organization}</p>
              <h3 className="mt-0.5 line-clamp-2 font-semibold leading-snug text-foreground">{s.title}</h3>
            </div>
          </div>
          <Badge tone={d.tone}>{d.text}</Badge>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {s.fundingType && <Badge tone="info">{s.fundingType === "full" ? "Fully funded" : "Partial funding"}</Badge>}
          {s.isDemo && <Badge>Sample data</Badge>}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
          <div className="flex items-center gap-2"><IndianRupee size={15} className="text-slate-400" /><span>{formatCurrency(s.amount, s.currency)}</span></div>
          <div className="flex items-center gap-2"><Calendar size={15} className="text-slate-400" /><span>{formatDate(s.deadline)}</span></div>
        </div>
        <p className="mt-3 line-clamp-2 text-sm text-slate-600">{s.description}</p>
        <div className="mt-5 flex items-center gap-2 pt-2">
          <Link href={`/scholarships/${s.id}`} className="flex-1"><Button variant="outline" className="w-full">View Details</Button></Link>
          <Link href={`/scholarships/${s.id}`}><Button variant="ghost" aria-label="Save scholarship"><Bookmark size={18} /></Button></Link>
        </div>
      </CardContent>
    </Card>
  );
}
