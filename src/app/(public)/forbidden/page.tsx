import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ForbiddenPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20">
      <Card className="p-8 text-center">
        <h1 className="font-heading text-3xl font-bold text-primary">Access restricted</h1>
        <p className="mt-3 text-muted">You don’t have permission to view this page. Sign in with the correct role or return to a public page.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/get-started"><Button>Choose role / Login</Button></Link>
          <Link href="/"><Button variant="outline">Go home</Button></Link>
        </div>
      </Card>
    </div>
  );
}
