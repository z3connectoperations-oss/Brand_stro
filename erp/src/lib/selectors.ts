import type { Deliverable, Project, Stage, TeamId } from "@/lib/types";
import type { Tone } from "@/components/ui/primitives";
import { deliverables, projects, payments, threads, feedback } from "@/data/projects";
import { employees } from "@/data/people";
import { daysLeft, hoursAgo } from "@/lib/format";

export const STAGE_ORDER: Stage[] = [
  "Awaiting advance", "Discovery", "Brief ready", "R&D queue", "R&D in progress", "Sketch queue", "Sketching",
  "Awaiting assignment", "In design", "TL review", "Ready for client", "With client", "Feedback received",
  "In correction", "Scope change pending", "Client approved", "Awaiting final payment", "Final files delivered", "Closed",
];

export function stageTone(s: Stage): Tone {
  if (s === "Closed" || s === "Final files delivered" || s === "Client approved") return "green";
  if (s === "Scope change pending" || s === "Awaiting advance") return "red";
  if (s === "With client" || s === "Feedback received" || s === "Awaiting final payment") return "amber";
  if (s === "TL review" || s === "Ready for client") return "violet";
  if (s === "In design" || s === "In correction" || s === "Sketching" || s === "R&D in progress") return "brand";
  return "slate";
}

export function stagePct(s: Stage): number {
  return Math.round((STAGE_ORDER.indexOf(s) / (STAGE_ORDER.length - 1)) * 100);
}

/** Project stage = the least advanced of its deliverables (a project is only as far as its slowest piece). */
export function projectStage(p: Project): Stage {
  const ds = deliverables.filter((d) => d.projectId === p.id);
  if (!ds.length) return "Discovery";
  return ds.reduce((min, d) => (STAGE_ORDER.indexOf(d.stage) < STAGE_ORDER.indexOf(min) ? d.stage : min), ds[0].stage);
}

export function projectProgress(p: Project): number {
  const ds = deliverables.filter((d) => d.projectId === p.id);
  if (!ds.length) return 0;
  return Math.round(ds.reduce((s, d) => s + stagePct(d.stage), 0) / ds.length);
}

export const isActive = (p: Project) => !["Closed"].includes(projectStage(p));
export const isOverdue = (p: Project) => isActive(p) && daysLeft(p.clientDeadline) < 0;
export const isAtRisk = (p: Project) => isActive(p) && daysLeft(p.clientDeadline) >= 0 && daysLeft(p.clientDeadline) <= 2;

export const activeProjects = () => projects.filter(isActive);
export const overdueProjects = () => projects.filter(isOverdue);

export function deliverableTone(d: Deliverable): Tone {
  return stageTone(d.stage);
}

export function teamDeliverables(team: TeamId) {
  return deliverables.filter((d) => d.team === team && d.stage !== "Closed");
}

export function assignedTo(employeeId: string) {
  return deliverables.filter((d) => d.assigneeId === employeeId && d.stage !== "Closed");
}

export function loadFor(employeeId: string) {
  const active = assignedTo(employeeId).filter((d) => ["In design", "In correction", "TL review"].includes(d.stage));
  const pct = Math.min(100, active.length * 40);
  return { active: active.length, pct, status: pct >= 100 ? "Overloaded" : pct >= 70 ? "High" : pct >= 30 ? "Normal" : "Available" };
}

export function outstanding() {
  return payments.filter((p) => !p.paidOn);
}
export const overduePayments = () => outstanding().filter((p) => daysLeft(p.dueDate) < 0);

/** SLA: 4 business hours for active-project WhatsApp; 1 business day (~9h) for enquiry and email. */
export function slaState(t: (typeof threads)[number]) {
  if (t.lastReplyAt && t.lastReplyAt > t.lastClientMessageAt) return { state: "Answered" as const, hours: 0 };
  const h = hoursAgo(t.lastClientMessageAt);
  const limit = t.channel === "WhatsApp (project)" ? 4 : 9;
  if (h > 72) return { state: "Stalled 3+ days" as const, hours: h };
  if (h > limit) return { state: "Breached" as const, hours: h };
  return { state: "Within SLA" as const, hours: h };
}

export const teamMembers = (team: TeamId) => employees.filter((e) => e.team === team && e.role === "designer");

export const openFeedback = () => feedback.filter((f) => f.status !== "Approved");
