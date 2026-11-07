import { Card } from "@/components/ui/card";
export default function Page() {
  return (<div className="space-y-6"><div><h2 className="font-heading text-2xl font-bold tracking-tight">Organization Profile</h2><p className="mt-1 text-muted">Manage your organization information and verification status.</p></div><Card className="p-6 text-sm text-muted">Organization profile editing and verification workflows are supported by the Provider model. Extend this page with an edit form connected to a provider profile API when needed.</Card></div>);
}
