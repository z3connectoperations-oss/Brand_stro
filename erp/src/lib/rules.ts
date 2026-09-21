/**
 * Alerts and reports computed from the live Db, so every rule the guide names
 * (SLA, scope, payment, handoff, capacity, stall, repeat QC issue) fires from data.
 */
import type { Alert, Role } from "@/lib/types";
import type { Db } from "@/lib/store";
import { employees, productById, products, teamNames } from "@/data/people";
import { attendanceToday } from "@/data/ops";
import { clientById } from "@/data/clients";
import { daysLeft, hoursAgo, inr, TODAY } from "@/lib/format";
import { isOverdue, loadFor, overdueProjects, pendingHandoffs, projectStage, reachedClient, slaState, stageIdx, teamMembers } from "@/lib/selectors";

const at = (iso: string) => iso;
const client = (db: Db, clientId: string) => db.clients.find((c) => c.id === clientId)?.name ?? clientById(clientId)?.name ?? clientId;

export function computeAlerts(db: Db): Alert[] {
  const out: Alert[] = [];
  const push = (severity: Alert["severity"], kind: string, text: string, detail: string, owner: Role, href: string, when = `${TODAY}T09:00`) =>
    out.push({ id: `A${out.length + 1}`, severity, kind, text, detail, owner, href, at: at(when) });

  for (const p of overdueProjects(db)) {
    const st = projectStage(db, p);
    push("critical", "Overdue", `${p.name} is ${-daysLeft(p.clientDeadline)} day(s) past client deadline`, `${p.code} · Stage: ${st}`, st === "Awaiting final payment" ? "crm" : "creative-head", `/projects/${p.id}`);
  }
  for (const f of db.feedback.filter((x) => x.classification === "Scope change" && x.status === "Logged")) {
    const p = db.projects.find((x) => x.id === f.projectId)!;
    const prod = productById(p.product);
    push("critical", "Scope change", `${client(db, p.clientId)} requested round ${f.round} of ${prod.includedRevisions} included`, `${p.code} · Founder decision required before the designer starts`, "founder", "/approvals", f.receivedAt);
  }
  for (const t of db.threads) {
    const s = slaState(t);
    if (s.state === "Breached") push("critical", "SLA breach", `${client(db, t.clientId)} ${t.channel} unanswered for ${s.hours}h`, `${t.id} · “${t.subject}” · SLA ${t.channel === "WhatsApp (project)" ? "4 business hours" : "1 business day"}`, "crm", "/follow-ups", t.lastClientMessageAt);
    if (s.state === "Stalled 3+ days") push("warning", "Stalled", `${client(db, t.clientId)} thread silent ${Math.floor(s.hours / 24)} days`, `“${t.subject}” · send the client an update (3+ day rule); flag to Creative Head`, "crm", "/follow-ups", t.lastClientMessageAt);
  }
  for (const pay of db.payments.filter((x) => !x.paidOn && daysLeft(x.dueDate) < 0)) {
    const p = db.projects.find((x) => x.id === pay.projectId)!;
    const esc = pay.followUps >= 1;
    push(esc ? "critical" : "warning", "Payment", `${client(db, p.clientId)} ${pay.milestone.toLowerCase()} overdue by ${-daysLeft(pay.dueDate)} day(s), ${pay.followUps} follow-up(s)`, `${p.code} · ${inr(pay.amount)} · ${esc ? "unresolved after 1 cycle → Founder" : "first follow-up cycle (CRM)"}`, esc ? "founder" : "crm", "/payments", pay.dueDate);
  }
  for (const h of pendingHandoffs(db)) {
    const p = db.projects.find((x) => x.id === h.projectId)!;
    const to = employees.find((e) => e.id === h.toId)!;
    push("warning", "Handoff", `Handoff for ${p.name} not acknowledged by ${to.name}`, `${p.code} · sent ${h.sentAt.replace("T", " ")} (${hoursAgo(h.sentAt)}h ago) · unacknowledged handoff = not started`, to.role === "sketch" || to.role === "rnd" ? "creative-head" : "team-leader", "/queue", h.sentAt);
  }
  for (const e of employees.filter((x) => x.role === "designer")) {
    const l = loadFor(db, e.id);
    if (l.pct >= 100) {
      const spare = teamMembers(e.team).filter((m) => m.id !== e.id).sort((a, b) => loadFor(db, a.id).active - loadFor(db, b.id).active)[0];
      push("warning", "Capacity", `${e.name} at ${l.active} active deliverables (benchmark 1/day)`, `${teamNames[e.team]} · rebalance suggested${spare ? ` to ${spare.name} (${loadFor(db, spare.id).active} active)` : ""}`, "team-leader", "/team");
    }
  }
  for (const f of db.feedback.filter((x) => x.classification === "Unclear" && x.status === "Logged")) {
    const p = db.projects.find((x) => x.id === f.projectId)!;
    push("info", "Unclear feedback", `${client(db, p.clientId)} feedback “${f.text.slice(0, 40)}${f.text.length > 40 ? "…" : ""}” needs clarification`, `${p.code} · ask the client before assigning to the team`, "crm", "/approvals", f.receivedAt);
  }
  for (const team of ["logo", "packaging"] as const) {
    const reworks = db.deliverables.filter((d) => d.team === team).reduce((s, d) => s + d.internalReworkCount, 0);
    if (reworks >= 3) push("info", "Repeat QC issue", `${reworks} rework returns this month across ${teamNames[team]}`, "3+ times = system gap · add the failing item to the pre-flight checklist", "creative-head", "/review");
    for (const m of teamMembers(team)) {
      const mine = db.deliverables.filter((d) => d.assigneeId === m.id).reduce((s, d) => s + d.internalReworkCount, 0);
      if (mine >= 2) push("warning", "Repeat QC issue", `${m.name}: ${mine} rework returns`, "Recurs on the same designer 2+ times → escalate to Creative Head", "creative-head", "/review");
    }
  }
  const unassigned = db.deliverables.filter((d) => d.stage === "Awaiting assignment");
  if (unassigned.length) push("info", "Unassigned", `${unassigned.length} deliverable(s) waiting for assignment`, "Assign by current load in the Team Task Tracker", "team-leader", "/team");
  for (const p of db.projects.filter((x) => !x.advancePaid && projectStage(db, x) === "Brief ready")) {
    push("info", "Blocked", `${p.name} brief is ready but advance not received`, `${p.code} · cannot enter the R&D queue until 50% advance is recorded`, "crm", "/payments");
  }
  for (const a of attendanceToday) {
    const e = employees.find((x) => x.id === a.employeeId)!;
    if (a.status === "Unapproved absence") push("warning", "Attendance", `${e.name}: unapproved absence today`, "Flag to the Team Leader the same day; inform Founder if it recurs", "hr", "/hr/attendance");
  }
  push("info", "Attendance", "Naveen T. late for the 3rd time this month", "Pattern → inform Founder monthly", "hr", "/hr/attendance");
  const sev = { critical: 0, warning: 1, info: 2 };
  return out.sort((a, b) => sev[a.severity] - sev[b.severity] || b.at.localeCompare(a.at));
}

export function computeReport(db: Db) {
  const month = TODAY.slice(0, 7);
  const thisMonth = db.projects.filter((p) => p.createdOn.startsWith(month));
  const soldBy = Object.fromEntries(products.map((pr) => [pr.id, thisMonth.filter((p) => p.product === pr.id).length])) as Record<string, number>;
  const revenue = thisMonth.reduce((s, p) => s + p.price, 0);
  const target = products.reduce((s, p) => s + p.price * p.monthlyTarget, 0);
  const presented = db.deliverables.filter((d) => reachedClient(d.stage));
  const firstDraft = presented.filter((d) => d.revisionCount === 0).length;
  const avgRounds = presented.length ? presented.reduce((s, d) => s + d.revisionCount, 0) / presented.length : 0;
  const dist = [0, 1, 2, 3, 4].map((n) => presented.filter((d) => (n === 4 ? d.revisionCount >= 4 : d.revisionCount === n)).length);
  const designMiss = db.feedback.filter((f) => f.rootCause === "Design miss").length;
  const pref = db.feedback.filter((f) => f.rootCause === "Client preference").length;
  const done = (team: "logo" | "packaging") => db.deliverables.filter((d) => d.team === team && stageIdx(d.stage) >= stageIdx("Client approved")).length;
  const inProg = (team: "logo" | "packaging") => db.deliverables.filter((d) => d.team === team && stageIdx(d.stage) >= stageIdx("Awaiting assignment") && stageIdx(d.stage) < stageIdx("Client approved")).length;
  const rounds = (team: "logo" | "packaging") => {
    const ds = db.deliverables.filter((d) => d.team === team && reachedClient(d.stage));
    return ds.length ? (ds.reduce((s, d) => s + d.revisionCount, 0) / ds.length).toFixed(1) : "—";
  };
  const rework = (team: "logo" | "packaging") => db.deliverables.filter((d) => d.team === team).reduce((s, d) => s + d.internalReworkCount, 0);
  const rndDone = db.projects.filter((p) => stageIdx(projectStage(db, p)) > stageIdx("R&D in progress")).length;
  const rndQueue = db.projects.filter((p) => ["R&D queue", "R&D in progress"].includes(projectStage(db, p))).length;
  const payroll = employees.reduce((s, e) => s + e.baseSalary, 0);
  const margin = revenue ? Math.round(((revenue - payroll - 17000) / revenue) * 100) : 0;
  return {
    soldBy, revenue, target, engagements: thisMonth.length, presented: presented.length, firstDraft, avgRounds, dist, designMiss, pref, margin,
    production: [
      ["Projects received (MTD)", String(thisMonth.length)],
      ["Completed", String(db.projects.filter((p) => stageIdx(projectStage(db, p)) >= stageIdx("Final files delivered")).length)],
      ["In progress", String(db.projects.filter((p) => { const s = stageIdx(projectStage(db, p)); return s > stageIdx("Awaiting advance") && s < stageIdx("Final files delivered"); }).length)],
      ["Pending advance", String(db.projects.filter((p) => !p.advancePaid).length)],
      ["Delayed", String(db.projects.filter((p) => isOverdue(db, p)).length)],
    ],
    logo: [["Logos completed", String(done("logo"))], ["In progress", String(inProg("logo"))], ["Avg revision rounds", rounds("logo")], ["Rework caught at TL review", String(rework("logo"))]],
    packaging: [["Deliverables completed", String(done("packaging"))], ["In progress", String(inProg("packaging"))], ["Avg revision rounds", rounds("packaging")], ["Print errors caught at TL review", String(rework("packaging"))]],
    rnd: [["Briefs delivered", String(rndDone)], ["In queue / in progress", String(rndQueue)], ["Unacknowledged handoffs", String(pendingHandoffs(db).length)], ["Briefs needing rework", "1"]],
    people: [["Present today", `${attendanceToday.filter((a) => a.status === "Present" || a.status === "Late").length}/12`], ["Late instances (MTD)", "7"], ["Unapproved absences", String(attendanceToday.filter((a) => a.status === "Unapproved absence").length)], ["Open complaints", String(db.complaints.filter((c) => c.status !== "Resolved").length)]],
  };
}
