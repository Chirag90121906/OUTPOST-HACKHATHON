import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount?: number | null, currency = "INR") {
  if (amount == null) return "Amount varies";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

export function formatDate(date?: Date | string | null) {
  if (!date) return "TBA";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "TBA";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function daysUntil(date?: Date | string | null) {
  if (!date) return null;
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return null;
  const diff = d.getTime() - Date.now();
  return Math.ceil(diff / 86400000);
}

export function deadlineLabel(date?: Date | string | null) {
  const days = daysUntil(date);
  if (days == null) return { text: "Deadline TBA", tone: "neutral" as const };
  if (days < 0) return { text: "Expired", tone: "danger" as const };
  if (days === 0) return { text: "Closing today", tone: "danger" as const };
  if (days <= 3) return { text: `Closing in ${days} day${days === 1 ? "" : "s"}`, tone: "danger" as const };
  if (days <= 7) return { text: `Closing in ${days} days`, tone: "warning" as const };
  if (days <= 30) return { text: `Closing in ${days} days`, tone: "info" as const };
  return { text: `Closes ${formatDate(date)}`, tone: "neutral" as const };
}
