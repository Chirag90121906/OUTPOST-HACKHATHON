"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function SaveIntent() {
  const params = useSearchParams();
  const router = useRouter();
  const save = params.get("save");
  useEffect(() => {
    if (!save) return;
    fetch("/api/saved", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ scholarshipId: save }) })
      .finally(() => router.replace("/student/saved"));
  }, [save, router]);
  return null;
}
