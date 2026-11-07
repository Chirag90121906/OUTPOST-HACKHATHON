"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function AdminRowActions({ id, isPublished }: { id: string; isPublished: boolean }) {
  const router = useRouter();
  async function patch(data: any) { await fetch(`/api/admin/scholarships/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); router.refresh(); }
  async function del() { if (!confirm("Delete this scholarship?")) return; await fetch(`/api/admin/scholarships/${id}`, { method: "DELETE" }); router.refresh(); }
  return <div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => patch({ isPublished: !isPublished })}>{isPublished ? "Unpublish" : "Publish"}</Button><Button size="sm" variant="ghost" onClick={del}>Delete</Button></div>;
}
