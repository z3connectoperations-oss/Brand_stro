import type { Deliverable, Project, Stage, TeamId, Thread } from "@/lib/types";
import type { Tone } from "@/components/ui/primitives";
import type { Db } from "@/lib/store";
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

export const stageIdx = (s: Stage) => STAGE_ORDER.indexOf(s);
export const stagePct = (s: Stage) => Math.round((stageIdx(s) / (STAGE_ORDER.length - 1)) * 100);
export const reachedClient = (s: Stage) => stageIdx(s) >= stageIdx("With client");

/** Project stage = the least advanced of its deliverables (a project is only as far as its slowest piece). */
export function projectStage(db: Db, p: Project): Stage {
  const ds = db.deliverables.filter((d) => d.projectId === p.id);
  if (!ds.length) return "Discovery";
  return ds.reduce((min, d) => (stageIdx(d.stage) < stageIdx(min) ? d.stage : min), ds[0].stage);
}

export function projectProgress(db: Db, p: Project): number {
  const ds = db.deliverables.filter((d) => d.projectId === p.id);
  if (!ds.length) return 0;
  return Math.round(ds.reduce((s, d) => s + stagePct(d.stage), 0) / ds.length);
}

export const isActive = (db: Db, p: Project) => projectStage(db, p) !== "Closed";
export const isOverdue = (db: Db, p: Project) => isActive(db, p) && daysLeft(p.clientDeadline) < 0;
export const isAtRisk = (db: Db, p: Project) => isActive(db, p) && daysLeft(p.clientDeadline) >= 0 && daysLeft(p.clientDeadline) <= 2;

export const activeProjects = (db: Db) => db.projects.filter((p) => isActive(db, p));
export const overdueProjects = (db: Db) => db.projects.filter((p) => isOverdue(db, p));

export const teamDeliverables = (db: Db, team: TeamId) => db.deliverables.filter((d) => d.team === team && d.stage !== "Closed");
export const assignedTo = (db: Db, employeeId: string) => db.deliverables.filter((d) => d.assigneeId === employeeId && d.stage !== "Closed");

const WORKING: Stage[] = ["In design", "In correction", "TL review"];
export function loadFor(db: Db, employeeId: string) {
  const active = assignedTo(db, employeeId).filter((d) => WORKING.includes(d.stage));
  const pct = Math.min(100, active.length * 40);
  return { active: active.length, pct, status: pct >= 100 ? "Overloaded" : pct >= 70 ? "High" : pct >= 30 ? "Normal" : "Available" };
}

export const outstanding = (db: Db) => db.payments.filter((p) => !p.paidOn);
export const overduePayments = (db: Db) => outstanding(db).filter((p) => daysLeft(p.dueDate) < 0);

/** SLA: 4 business hours for active-project WhatsApp; 1 business day (~9h) for enquiry and email. */
export function slaState(t: Thread) {
  if (t.lastReplyAt && t.lastReplyAt > t.lastClientMessageAt) return { state: "Answered" as const, hours: 0 };
  const h = hoursAgo(t.lastClientMessageAt);
  const limit = t.channel === "WhatsApp (project)" ? 4 : 9;
  if (h > 72) return { state: "Stalled 3+ days" as const, hours: h };
  if (h > limit) return { state: "Breached" as const, hours: h };
  return { state: "Within SLA" as const, hours: h };
}

export const teamMembers = (team: TeamId) => employees.filter((e) => e.team === team && e.role === "designer");
export const openFeedback = (db: Db) => db.feedback.filter((f) => f.status !== "Approved");
export const pendingHandoffs = (db: Db, toId?: string) => db.handoffs.filter((h) => !h.acknowledgedAt && (!toId || h.toId === toId));

export const deliverableTone = (d: Deliverable): Tone => stageTone(d.stage);
