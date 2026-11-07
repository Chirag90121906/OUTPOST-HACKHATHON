import { Card } from "@/components/ui/card";
import { ContactForm } from "./contact-form";

export const metadata = { title: "Contact" };
export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Contact & Support</h1>
      <p className="mt-2 text-slate-600">Questions, feedback, or incorrect listing reports. Messages are stored securely in the platform database.</p>
      <Card className="mt-8 p-6"><ContactForm /></Card>
    </div>
  );
}
