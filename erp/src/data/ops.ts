import type { Alert, Attendance, IncentiveLine, Leave, QcItem } from "@/lib/types";

export const logoQc: QcItem[] = [
  { id: "l1", label: "Concept originality & relevance to the brief" },
  { id: "l2", label: "Typography quality & appropriateness" },
  { id: "l3", label: "Alignment & proportion" },
  { id: "l4", label: "Scalability (small and large) + works in black & white" },
  { id: "l5", label: "Colour accuracy and meaning" },
  { id: "l6", label: "Presentation quality & correct file exports" },
];

export const packagingQc: QcItem[] = [
  { id: "p1", label: "Brand consistency with approved identity" },
  { id: "p2", label: "Product / information hierarchy" },
  { id: "p3", label: "Typography and layout" },
  { id: "p4", label: "Information accuracy (no factual/spec errors)" },
  { id: "p5", label: "Correct dimensions for the product/material" },
  { id: "p6", label: "Bleed and safe area applied correctly" },
  { id: "p7", label: "Mockup quality suitable for client presentation" },
  { id: "p8", label: "Final artwork print-ready (CMYK, correct resolution)" },
];

export const sketchQc: QcItem[] = [
  { id: "s1", label: "Concepts are visually distinct from each other (not near-duplicates)" },
  { id: "s2", label: "Concepts trace back to the research brief's positioning / visual direction" },
  { id: "s3", label: "Concepts can scale to a clean digital logo (not overly intricate)" },
];

export const creativeReview: QcItem[] = [
  { id: "c1", label: "Strategy — does the concept make sense for this brand?" },
  { id: "c2", label: "Concept — is there a strong idea underneath the execution?" },
  { id: "c3", label: "Design — is the execution itself strong?" },
  { id: "c4", label: "Brand fit — does it belong to this brand, or could it belong to anyone?" },
  { id: "c5", label: "Distinctiveness — does it stand apart from competitors?" },
  { id: "c6", label: "Application — packaging, signage, small sizes?" },
  { id: "c7", label: "Technical quality — is the file production-ready?" },
];

export const researchBriefSections = [
  "Client & business overview",
  "Target audience",
  "Competitor / category references (3–5 examples)",
  "Positioning direction (1–2 sentence recommendation)",
  "Visual / symbol direction (mood, motifs, cultural references)",
  "Client must-haves and must-avoids",
];

export const alerts: Alert[] = [
  { id: "A01", severity: "critical", kind: "Overdue", text: "KPN Restaurant packaging is 2 days past client deadline", detail: "BRD-1021 · Stage: Awaiting final payment · Balance ₹1,750 withheld", owner: "crm", href: "/projects/P02", at: "2026-09-21T08:00" },
  { id: "A02", severity: "critical", kind: "Scope change", text: "Orange Surgicals requested round 4 of 2 included", detail: "BRD-1028 · Founder decision required before designer starts", owner: "founder", href: "/approvals", at: "2026-09-19T16:10" },
  { id: "A03", severity: "critical", kind: "SLA breach", text: "ABC Foods WhatsApp thread unanswered for 4h+", detail: "T01 · 'Logo V3 — when can we see it?' · SLA 4 business hours", owner: "crm", href: "/follow-ups", at: "2026-09-21T11:30" },
  { id: "A04", severity: "warning", kind: "Payment", text: "Chaivanth final 50% overdue by 1 day, 1 follow-up sent", detail: "BRD-1012 · ₹7,500 · escalate after 1 cycle", owner: "crm", href: "/payments", at: "2026-09-21T09:00" },
  { id: "A05", severity: "warning", kind: "Handoff", text: "R&D → Sketch handoff for Deccan Roasters not acknowledged", detail: "BRD-1031 · Sent 20 Sep 17:00 · unacknowledged handoff = not started", owner: "creative-head", href: "/queue", at: "2026-09-21T09:30" },
  { id: "A06", severity: "warning", kind: "Capacity", text: "Rasith M. at 3 active deliverables (benchmark 1/day)", detail: "Packaging team · rebalance suggested to Ayesha B. (1 active)", owner: "team-leader", href: "/team", at: "2026-09-21T09:00" },
  { id: "A07", severity: "warning", kind: "Stalled", text: "Mahalaxmi Builders thread silent 4 days", detail: "Reference photos pending · send client an update (3+ day rule)", owner: "crm", href: "/follow-ups", at: "2026-09-21T09:00" },
  { id: "A08", severity: "info", kind: "Unclear feedback", text: "Iyengar Bakery feedback 'make it pop more' needs clarification", detail: "BRD-1018 · Ask the client before assigning to the team", owner: "crm", href: "/approvals", at: "2026-09-17T13:10" },
  { id: "A09", severity: "info", kind: "Repeat QC issue", text: "Bleed/safe-area failed 3 times this month across Packaging", detail: "3+ times = system gap · consider adding a pre-flight template", owner: "creative-head", href: "/review", at: "2026-09-20T18:00" },
  { id: "A10", severity: "info", kind: "Attendance", text: "Naveen T. late for the 3rd time this month", detail: "Pattern → inform Founder monthly", owner: "hr", href: "/hr/attendance", at: "2026-09-21T10:15" },
];

export const attendanceToday: Attendance[] = [
  { employeeId: "E03", date: "2026-09-21", status: "Present", inTime: "09:28" },
  { employeeId: "E04", date: "2026-09-21", status: "Present", inTime: "09:15" },
  { employeeId: "E05", date: "2026-09-21", status: "Present", inTime: "09:32" },
  { employeeId: "E06", date: "2026-09-21", status: "Present", inTime: "09:40" },
  { employeeId: "E07", date: "2026-09-21", status: "Present", inTime: "09:20" },
  { employeeId: "E08", date: "2026-09-21", status: "Present", inTime: "09:35" },
  { employeeId: "E09", date: "2026-09-21", status: "Leave", note: "Planned leave (approved 18 Sep)" },
  { employeeId: "E10", date: "2026-09-21", status: "Late", inTime: "10:12", note: "Traffic" },
  { employeeId: "E11", date: "2026-09-21", status: "Present", inTime: "09:25" },
  { employeeId: "E12", date: "2026-09-21", status: "Present", inTime: "09:30" },
  { employeeId: "E13", date: "2026-09-21", status: "Present", inTime: "09:45" },
  { employeeId: "E14", date: "2026-09-21", status: "Unapproved absence", note: "No message received" },
];

export const leaves: Leave[] = [
  { id: "LV01", employeeId: "E09", from: "2026-09-21", to: "2026-09-22", type: "Planned", status: "Logged", coverageGap: "BRD-1026 correction due 22 Sep — reassign to Shihaf" },
  { id: "LV02", employeeId: "E13", from: "2026-09-25", to: "2026-09-25", type: "Planned", status: "TL acknowledged" },
  { id: "LV03", employeeId: "E06", from: "2026-09-29", to: "2026-09-30", type: "Planned", status: "Requested", coverageGap: "Sketch queue will pause 2 days — no backup" },
];

export const leaveBalances: Record<string, number> = {
  E03: 8, E04: 10, E05: 7, E06: 9, E07: 6, E08: 8, E09: 5, E10: 4, E11: 7, E12: 9, E13: 8, E14: 6,
};

/** Month-to-date incentive progress (September 2026) per the Incentive Plan tiers. */
export const incentiveLines: IncentiveLine[] = [
  { employeeId: "E05", workType: "R&D concepts", baseline: 18, target: 24, done: 16, clean: 0, partial: 0, heavy: 0, rateClean: 350, ratePartial: 175 },
  { employeeId: "E08", workType: "Logos", baseline: 4, target: 7, done: 5, clean: 1, partial: 0, heavy: 0, rateClean: 1650, ratePartial: 825 },
  { employeeId: "E09", workType: "Logos", baseline: 4, target: 7, done: 4, clean: 0, partial: 0, heavy: 0, rateClean: 1650, ratePartial: 825 },
  { employeeId: "E10", workType: "Logos", baseline: 4, target: 7, done: 6, clean: 1, partial: 1, heavy: 0, rateClean: 1650, ratePartial: 825 },
  { employeeId: "E12", workType: "Branding sets", baseline: 1, target: 5, done: 3, clean: 2, partial: 0, heavy: 0, rateClean: 700, ratePartial: 350 },
  { employeeId: "E12", workType: "Labels", baseline: 1, target: 4, done: 3, clean: 1, partial: 0, heavy: 1, rateClean: 450, ratePartial: 225 },
  { employeeId: "E12", workType: "Packaging", baseline: 1, target: 2, done: 2, clean: 1, partial: 0, heavy: 0, rateClean: 900, ratePartial: 450 },
  { employeeId: "E13", workType: "Branding sets", baseline: 1, target: 5, done: 2, clean: 1, partial: 0, heavy: 0, rateClean: 700, ratePartial: 350 },
  { employeeId: "E13", workType: "Labels", baseline: 1, target: 4, done: 3, clean: 2, partial: 0, heavy: 0, rateClean: 450, ratePartial: 225 },
  { employeeId: "E13", workType: "Packaging", baseline: 1, target: 2, done: 1, clean: 0, partial: 0, heavy: 0, rateClean: 900, ratePartial: 450 },
  { employeeId: "E14", workType: "Branding sets", baseline: 1, target: 5, done: 3, clean: 1, partial: 1, heavy: 0, rateClean: 700, ratePartial: 350 },
  { employeeId: "E14", workType: "Labels", baseline: 1, target: 4, done: 2, clean: 1, partial: 0, heavy: 0, rateClean: 450, ratePartial: 225 },
  { employeeId: "E14", workType: "Packaging", baseline: 1, target: 2, done: 1, clean: 0, partial: 0, heavy: 0, rateClean: 900, ratePartial: 450 },
];

export function lineBonus(l: IncentiveLine): number {
  return l.clean * l.rateClean + l.partial * l.ratePartial;
}

/** Roles with tiered/other formulas, month-to-date. */
export const specialIncentives = [
  { employeeId: "E06", label: "Sketch clean pass-through", metric: "17 of 19 sketches needed no rework", pct: 89, bonus: 3000, tier: "75–89% → ₹3,000" },
  { employeeId: "E07", label: "Team 70% + personal 30%", metric: "Team 15 of 21 logos · personal 3 (2 baseline)", pct: 71, bonus: 750, tier: "Team component pending month-end" },
  { employeeId: "E11", label: "Team 70% + personal 30%", metric: "Team 8+8+4 of 15+12+6 · personal on track", pct: 60, bonus: 900, tier: "Team component pending month-end" },
  { employeeId: "E03", label: "Clean closes, paid on time", metric: "29 of 42 target closed clean + paid", pct: 69, bonus: 6960, tier: "₹240 × 29" },
  { employeeId: "E04", label: "Team members on target", metric: "9 of 12 on pace", pct: 75, bonus: 3000, tier: "9–10 of 12 → ₹3,000" },
];
