"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

export function ContactForm() {
  const [msg, setMsg] = useState(""); const [loading, setLoading] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setMsg("");
    const body = Object.fromEntries(new FormData(e.currentTarget).entries());
    const res = await fetch("/api/support", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const j = await res.json(); setLoading(false);
    setMsg(j.ok ? "Thanks — your message was recorded." : j.error || "Failed to submit.");
    if (j.ok) (e.target as HTMLFormElement).reset();
  }
  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2"><div><Label htmlFor="name">Name</Label><Input id="name" name="name" /></div><div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" /></div></div>
      <div><Label htmlFor="subject">Subject</Label><Input id="subject" name="subject" required /></div>
      <div><Label htmlFor="message">Message</Label><Textarea id="message" name="message" rows={5} required /></div>
      {msg && <p className="text-sm text-foreground">{msg}</p>}
      <Button type="submit" disabled={loading}>{loading ? "Sending..." : "Submit"}</Button>
    </form>
  );
}
