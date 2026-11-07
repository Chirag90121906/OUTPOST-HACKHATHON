"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
export function MarkRead() {
  const router = useRouter();
  return <Button variant="outline" onClick={async()=>{ await fetch("/api/notifications",{method:"POST"}); router.refresh(); }}>Mark all read</Button>;
}
