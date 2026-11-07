import { Card } from "@/components/ui/card";
import { AssistantPanel } from "@/components/dashboard/assistant";

export const metadata = { title: "AI Copilot" };
export default function CopilotPage() {
  return (
    <div className="space-y-6">
      <div><h2 className="font-heading text-2xl font-bold tracking-tight">GRANTLY AI Copilot</h2><p className="mt-1 text-muted">Context-aware guidance for eligibility, documents, deadlines, and applications. Rule-based and grounded in platform workflows; connect a secure LLM backend for expanded capabilities.</p></div>
      <div className="max-w-2xl"><AssistantPanel /></div>
      <Card className="max-w-2xl p-5 text-sm text-muted"><strong className="text-foreground">Suggested questions:</strong> Find scholarships for my profile · Which deadlines are close? · Am I eligible for a scholarship? · Which documents am I missing? · How do I track my application?</Card>
    </div>
  );
}
