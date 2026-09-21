/** Indian-style currency and date helpers used across the UI. */

export function inr(amount: number, compact = false): string {
  if (compact) {
    if (amount >= 1_00_000) return `₹${(amount / 1_00_000).toFixed(amount % 1_00_000 === 0 ? 0 : 2)}L`;
    if (amount >= 1_000) return `₹${(amount / 1_000).toFixed(amount % 1_000 === 0 ? 0 : 1)}k`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

export const TODAY = "2026-09-21";

export function fmtDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function daysBetween(a: string, b: string): number {
  const ms = new Date(b + "T00:00:00").getTime() - new Date(a + "T00:00:00").getTime();
  return Math.round(ms / 86_400_000);
}

export function daysLeft(iso: string): number {
  return daysBetween(TODAY, iso);
}

export function relDays(iso: string): string {
  const n = daysLeft(iso);
  if (n === 0) return "Today";
  if (n === 1) return "Tomorrow";
  if (n === -1) return "Yesterday";
  return n > 0 ? `In ${n} days` : `${-n} days overdue`;
}

export function hoursAgo(isoDateTime: string): number {
  const now = new Date(TODAY + "T14:00:00").getTime();
  return Math.round((now - new Date(isoDateTime).getTime()) / 3_600_000);
}
