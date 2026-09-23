/**
 * Client-side store for the whole ERP. There is no backend yet: the seed data
 * from src/data is loaded into one immutable `Db` object, every action returns
 * a new Db, and the result is persisted to localStorage so a demo survives reloads.
 */
import type {
  AuditEntry, Client, Complaint, Deliverable, DiscoveryBrief, Feedback, FeedbackClass, Handoff, Lead, LeadStatus, Payment,
  Priority, ProductId, Project, Stage, Thread,
} from "@/lib/types";
import { clients as seedClients, leads as seedLeads } from "@/data/clients";
import { projects as seedProjects, deliverables as seedDeliverables, payments as seedPayments, feedback as seedFeedback, threads as seedThreads, complaints as seedComplaints } from "@/data/projects";
import { productById } from "@/data/people";
import { TODAY } from "@/lib/format";

export interface Db {
  projects: Project[];
  deliverables: Deliverable[];
  payments: Payment[];
  feedback: Feedback[];
  threads: Thread[];
  complaints: Complaint[];
  leads: Lead[];
  clients: Client[];
  handoffs: Handoff[];
  audit: AuditEntry[];
}

const STORAGE_KEY = "brandstro.db.v1";
const NOW = `${TODAY}T14:00`;

const seedHandoffs: Handoff[] = [
  { id: "H01", projectId: "P07", deliverableIds: ["D13"], fromId: "E05", toId: "E06", note: "Research brief in 02_R&D. Coffee category refs attached.", sentAt: "2026-09-20T17:00" },
  { id: "H02", projectId: "P01", deliverableIds: ["D02", "D03", "D04", "D05", "D06"], fromId: "E05", toId: "E11", note: "Branding collateral set — plan as one job.", sentAt: "2026-09-16T11:00", acknowledgedAt: "2026-09-16T11:40" },
];

const seedAudit: AuditEntry[] = [
  { id: "AU01", at: "2026-09-19T16:10", actorId: "E03", action: "Feedback classified", entity: "Feedback", entityId: "F02", summary: "Orange Surgicals round 4 → Scope change, escalated to Founder", before: "Unclear", after: "Scope change" },
  { id: "AU02", at: "2026-09-18T16:30", actorId: "E03", action: "Thread replied", entity: "Thread", entityId: "T04", summary: "Chaivanth: guidelines page 6 colour" },
  { id: "AU03", at: "2026-09-16T11:40", actorId: "E11", action: "Handoff acknowledged", entity: "Handoff", entityId: "H02", summary: "Packaging TL picked up ABC Foods collateral set" },
  { id: "AU04", at: "2026-09-16T09:05", actorId: "E01", action: "Payment recorded", entity: "Payment", entityId: "PAY09", summary: "Deccan Roasters advance ₹3,000", before: "Pending", after: "Paid 2026-09-16" },
  { id: "AU05", at: "2026-09-15T10:20", actorId: "E01", action: "Project created", entity: "Project", entityId: "P04", summary: "Mahalaxmi Builders — Corporate Kit (Branding + Logo Package, ₹15,000)" },
];

export const seedDb: Db = {
  projects: seedProjects,
  deliverables: seedDeliverables,
  payments: seedPayments,
  feedback: seedFeedback,
  threads: seedThreads,
  complaints: seedComplaints,
  leads: seedLeads,
  clients: seedClients,
  handoffs: seedHandoffs,
  audit: seedAudit,
};

import { getIdb, setIdb, deleteIdb } from "@/lib/idb";

/* ---------- external store plumbing (useSyncExternalStore + IndexedDB) ---------- */
let db: Db | null = null;
const listeners = new Set<() => void>();
let isHydratedFromIdb = false;

function load(): Db {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Db>;
      if (parsed && Array.isArray(parsed.projects)) return { ...seedDb, ...parsed };
    }
  } catch {
    /* corrupt or blocked storage: fall back to seed */
  }
  return seedDb;
}

async function initIdbHydration() {
  if (typeof window === "undefined" || isHydratedFromIdb) return;
  isHydratedFromIdb = true;
  try {
    const idbData = await getIdb<Partial<Db>>(STORAGE_KEY);
    if (idbData && Array.isArray(idbData.projects)) {
      db = { ...seedDb, ...idbData };
      listeners.forEach((l) => l());
    } else {
      // Migrate initial/existing data to IndexedDB
      const current = db || load();
      await setIdb(STORAGE_KEY, current);
    }
  } catch (err) {
    console.warn("Error hydrating from IndexedDB:", err);
  }
}

export function getDb(): Db {
  if (!db) {
    db = typeof window === "undefined" ? seedDb : load();
    if (typeof window !== "undefined") {
      initIdbHydration();
    }
  }
  return db;
}
export const getServerDb = () => seedDb;

export function subscribe(cb: () => void) {
  listeners.add(cb);
  if (typeof window !== "undefined" && !isHydratedFromIdb) {
    initIdbHydration();
  }
  return () => listeners.delete(cb);
}

function commit(next: Db) {
  db = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* storage full or blocked: state still updates in memory */
  }
  setIdb(STORAGE_KEY, next);
  listeners.forEach((l) => l());
}

export function resetDb() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  deleteIdb(STORAGE_KEY);
  commit(seedDb);
}

/* ---------- helpers ---------- */
let seq = 100;
const nextId = (prefix: string) => `${prefix}${String(seq++).padStart(3, "0")}`;

function withAudit(d: Db, actorId: string, action: string, entity: string, entityId: string, summary: string, before?: string, after?: string): Db {
  const entry: AuditEntry = { id: nextId("AU"), at: NOW, actorId, action, entity, entityId, summary, before, after };
  return { ...d, audit: [entry, ...d.audit] };
}

const setStage = (d: Db, ids: string[], stage: Stage, patch: Partial<Deliverable> = {}): Db => ({
  ...d,
  deliverables: d.deliverables.map((x) => (ids.includes(x.id) ? { ...x, stage, ...patch } : x)),
});

const patchProject = (d: Db, id: string, patch: Partial<Project>): Db => ({ ...d, projects: d.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) });

/* ---------- actions ---------- */
export interface CreateProjectInput {
  clientId: string;
  name: string;
  product: ProductId;
  price: number;
  priority: Priority;
  clientDeadline: string;
  route: Project["route"];
  advancePaid: boolean;
}

export const actions = {
  createProject(actorId: string, input: CreateProjectInput) {
    const d = getDb();
    const product = productById(input.product);
    const id = nextId("P");
    const code = `BRD-${1040 + d.projects.length}`;
    const stage: Stage = input.advancePaid ? "Discovery" : "Awaiting advance";
    const project: Project = {
      id, code, name: input.name, clientId: input.clientId, product: input.product, price: input.price, priority: input.priority,
      route: input.route, clientDeadline: input.clientDeadline, currentOwnerId: "E03", crmOwnerId: "E03",
      advancePaid: input.advancePaid, finalPaid: false, createdOn: TODAY, paymentConfirmedOn: input.advancePaid ? TODAY : undefined,
    };
    const deliverables: Deliverable[] = product.deliverables.map((type) => ({
      id: nextId("D"), projectId: id, type, team: type === "Logo" ? "logo" : "packaging", stage, version: 0, revisionCount: 0, internalReworkCount: 0, dueDate: input.clientDeadline,
    }));
    const half = Math.round(input.price / 2);
    const payments: Payment[] = [
      { id: nextId("PAY"), projectId: id, milestone: "Advance 50%", amount: half, dueDate: TODAY, paidOn: input.advancePaid ? TODAY : undefined, followUps: 0 },
      { id: nextId("PAY"), projectId: id, milestone: "Final 50%", amount: input.price - half, dueDate: input.clientDeadline, followUps: 0 },
    ];
    let next: Db = { ...d, projects: [project, ...d.projects], deliverables: [...d.deliverables, ...deliverables], payments: [...d.payments, ...payments] };
    next = withAudit(next, actorId, "Project created", "Project", id, `${input.name} (${product.name}, ₹${input.price.toLocaleString("en-IN")})`);
    commit(next);
    return id;
  },

  createLead(actorId: string, input: Omit<Lead, "id" | "ownerId" | "lastContact" | "status">) {
    const d = getDb();
    const id = nextId("L");
    const lead: Lead = { ...input, id, ownerId: actorId, lastContact: TODAY, status: "New" };
    commit(withAudit({ ...d, leads: [lead, ...d.leads] }, actorId, "Lead added", "Lead", id, `${input.business} — ${input.interest}`));
  },

  setLeadStatus(actorId: string, leadId: string, status: LeadStatus, nextAction?: string) {
    const d = getDb();
    const lead = d.leads.find((l) => l.id === leadId);
    if (!lead) return;
    const next = { ...d, leads: d.leads.map((l) => (l.id === leadId ? { ...l, status, lastContact: TODAY, nextAction: nextAction ?? l.nextAction } : l)) };
    commit(withAudit(next, actorId, "Lead updated", "Lead", leadId, `${lead.business}: ${lead.status} → ${status}`, lead.status, status));
  },

  recordPayment(actorId: string, paymentId: string) {
    const d = getDb();
    const pay = d.payments.find((p) => p.id === paymentId);
    if (!pay || pay.paidOn) return;
    let next: Db = { ...d, payments: d.payments.map((p) => (p.id === paymentId ? { ...p, paidOn: TODAY } : p)) };
    const ids = d.deliverables.filter((x) => x.projectId === pay.projectId).map((x) => x.id);
    if (pay.milestone === "Advance 50%") {
      next = patchProject(next, pay.projectId, { advancePaid: true, paymentConfirmedOn: TODAY });
      next = { ...next, deliverables: next.deliverables.map((x) => (ids.includes(x.id) && x.stage === "Awaiting advance" ? { ...x, stage: "Discovery" } : x)) };
    } else {
      next = patchProject(next, pay.projectId, { finalPaid: true });
      next = { ...next, deliverables: next.deliverables.map((x) => (ids.includes(x.id) && x.stage === "Awaiting final payment" ? { ...x, stage: "Final files delivered" } : x)) };
    }
    const proj = d.projects.find((p) => p.id === pay.projectId);
    commit(withAudit(next, actorId, "Payment recorded", "Payment", paymentId, `${proj?.name}: ${pay.milestone} ₹${pay.amount.toLocaleString("en-IN")}`, "Pending", `Paid ${TODAY}`));
  },

  sendReminder(actorId: string, paymentId: string) {
    const d = getDb();
    const pay = d.payments.find((p) => p.id === paymentId);
    if (!pay) return;
    const next = { ...d, payments: d.payments.map((p) => (p.id === paymentId ? { ...p, followUps: p.followUps + 1 } : p)) };
    commit(withAudit(next, actorId, "Payment reminder sent", "Payment", paymentId, `${pay.milestone} — follow-up ${pay.followUps + 1}`));
  },

  completeDiscovery(actorId: string, projectId: string, brief: DiscoveryBrief) {
    const d = getDb();
    const proj = d.projects.find((p) => p.id === projectId);
    if (!proj) return;
    const ids = d.deliverables.filter((x) => x.projectId === projectId).map((x) => x.id);
    const stage: Stage = proj.advancePaid ? "R&D queue" : "Brief ready";
    let next = patchProject(d, projectId, { brief: { ...brief, completedOn: TODAY }, currentOwnerId: proj.advancePaid ? "E05" : "E03" });
    next = setStage(next, ids, stage);
    commit(withAudit(next, actorId, "Discovery completed", "Project", projectId, `${proj.name}: Project Brief handed to R&D (${proj.priority})`, "Discovery", stage));
  },

  startResearch(actorId: string, projectId: string) {
    const d = getDb();
    const ids = d.deliverables.filter((x) => x.projectId === projectId && x.stage === "R&D queue").map((x) => x.id);
    if (!ids.length) return;
    commit(withAudit(setStage(d, ids, "R&D in progress"), actorId, "Research started", "Project", projectId, "Picked from R&D queue"));
  },

  /** R&D finishes the brief and hands off. Deliverables wait in the next queue until acknowledged. */
  handoffFromRnd(actorId: string, projectId: string) {
    const d = getDb();
    const proj = d.projects.find((p) => p.id === projectId);
    if (!proj) return;
    const ds = d.deliverables.filter((x) => x.projectId === projectId && (x.stage === "R&D in progress" || x.stage === "R&D queue"));
    const logo = ds.filter((x) => x.type === "Logo" && proj.route === "with-sketch");
    const rest = ds.filter((x) => !logo.includes(x));
    let next: Db = d;
    const handoffs: Handoff[] = [];
    if (logo.length) {
      next = setStage(next, logo.map((x) => x.id), "Sketch queue");
      handoffs.push({ id: nextId("H"), projectId, deliverableIds: logo.map((x) => x.id), fromId: actorId, toId: "E06", note: "Research brief saved to 02_R&D.", sentAt: NOW });
    }
    if (rest.length) {
      next = setStage(next, rest.map((x) => x.id), "Awaiting assignment");
      const toId = rest.some((x) => x.team === "logo") ? "E07" : "E11";
      handoffs.push({ id: nextId("H"), projectId, deliverableIds: rest.map((x) => x.id), fromId: actorId, toId, note: "Direction in 02_R&D.", sentAt: NOW });
    }
    next = { ...next, handoffs: [...handoffs, ...next.handoffs] };
    next = patchProject(next, projectId, { currentOwnerId: handoffs[0]?.toId ?? proj.currentOwnerId });
    commit(withAudit(next, actorId, "Brief handed off", "Project", projectId, `${proj.name}: ${handoffs.length} handoff(s) sent — awaiting acknowledgement`));
  },

  acknowledgeHandoff(actorId: string, handoffId: string) {
    const d = getDb();
    const h = d.handoffs.find((x) => x.id === handoffId);
    if (!h || h.acknowledgedAt) return;
    let next: Db = { ...d, handoffs: d.handoffs.map((x) => (x.id === handoffId ? { ...x, acknowledgedAt: NOW } : x)) };
    next = { ...next, deliverables: next.deliverables.map((x) => (h.deliverableIds.includes(x.id) && x.stage === "Sketch queue" ? { ...x, stage: "Sketching" } : x)) };
    commit(withAudit(next, actorId, "Handoff acknowledged", "Handoff", handoffId, `${h.deliverableIds.length} deliverable(s) picked up`));
  },

  submitSketch(actorId: string, projectId: string) {
    const d = getDb();
    const ids = d.deliverables.filter((x) => x.projectId === projectId && x.stage === "Sketching").map((x) => x.id);
    if (!ids.length) return;
    const h: Handoff = { id: nextId("H"), projectId, deliverableIds: ids, fromId: actorId, toId: "E07", note: "Concept set with research brief attached.", sentAt: NOW, acknowledgedAt: NOW };
    let next = setStage(d, ids, "Awaiting assignment");
    next = { ...next, handoffs: [h, ...next.handoffs] };
    next = patchProject(next, projectId, { currentOwnerId: "E07" });
    commit(withAudit(next, actorId, "Concept set submitted", "Project", projectId, "Sketches handed to Logo Team Leader"));
  },

  assignDeliverable(actorId: string, deliverableId: string, employeeId: string) {
    const d = getDb();
    const x = d.deliverables.find((y) => y.id === deliverableId);
    if (!x) return;
    let next = setStage(d, [deliverableId], x.stage === "Awaiting assignment" ? "In design" : x.stage, { assigneeId: employeeId });
    next = patchProject(next, x.projectId, { currentOwnerId: employeeId });
    commit(withAudit(next, actorId, "Work assigned", "Deliverable", deliverableId, `${x.type} → ${employeeId}`, x.assigneeId ?? "Unassigned", employeeId));
  },

  submitToTl(actorId: string, deliverableId: string) {
    const d = getDb();
    const x = d.deliverables.find((y) => y.id === deliverableId);
    if (!x) return;
    const tl = x.team === "logo" ? "E07" : "E11";
    let next = setStage(d, [deliverableId], "TL review", { version: x.version + 1 });
    next = patchProject(next, x.projectId, { currentOwnerId: tl });
    commit(withAudit(next, actorId, "Submitted for TL review", "Deliverable", deliverableId, `${x.type} v${x.version + 1}`));
  },

  reviewDecision(actorId: string, deliverableId: string, decision: "pass" | "rework", note: string) {
    const d = getDb();
    const x = d.deliverables.find((y) => y.id === deliverableId);
    if (!x) return;
    let next: Db;
    if (decision === "pass") {
      next = setStage(d, [deliverableId], "Ready for client");
      next = patchProject(next, x.projectId, { currentOwnerId: "E03" });
    } else {
      next = setStage(d, [deliverableId], "In design", { internalReworkCount: x.internalReworkCount + 1 });
      next = patchProject(next, x.projectId, { currentOwnerId: x.assigneeId ?? actorId });
    }
    commit(withAudit(next, actorId, decision === "pass" ? "QC passed" : "Sent back for rework", "Deliverable", deliverableId, `${x.type} v${x.version}${note ? ` — ${note}` : ""}`));
  },

  submitToClient(actorId: string, deliverableId: string) {
    const d = getDb();
    const x = d.deliverables.find((y) => y.id === deliverableId);
    if (!x) return;
    commit(withAudit(setStage(d, [deliverableId], "With client"), actorId, "Submitted to client", "Deliverable", deliverableId, `${x.type} v${x.version} sent; acknowledgement logged`));
  },

  logFeedback(actorId: string, input: { deliverableId: string; channel: Feedback["channel"]; text: string }) {
    const d = getDb();
    const x = d.deliverables.find((y) => y.id === input.deliverableId);
    if (!x) return;
    const fb: Feedback = { id: nextId("F"), deliverableId: x.id, projectId: x.projectId, receivedAt: NOW, channel: input.channel, text: input.text, classification: "Unclear", round: x.revisionCount + 1, status: "Logged" };
    let next: Db = { ...d, feedback: [fb, ...d.feedback] };
    next = setStage(next, [x.id], "Feedback received");
    commit(withAudit(next, actorId, "Feedback logged", "Feedback", fb.id, `${x.type}: “${input.text.slice(0, 60)}”`));
  },

  classifyFeedback(actorId: string, feedbackId: string, classification: FeedbackClass, rootCause?: Feedback["rootCause"]) {
    const d = getDb();
    const f = d.feedback.find((y) => y.id === feedbackId);
    if (!f) return;
    const x = d.deliverables.find((y) => y.id === f.deliverableId);
    let next: Db = { ...d, feedback: d.feedback.map((y) => (y.id === feedbackId ? { ...y, classification, rootCause: rootCause ?? y.rootCause, status: classification === "In scope" ? "Assigned" : "Logged" } : y)) };
    if (classification === "In scope" && x) {
      next = setStage(next, [x.id], "In correction", { revisionCount: x.revisionCount + 1 });
      next = patchProject(next, x.projectId, { currentOwnerId: x.assigneeId ?? (x.team === "logo" ? "E07" : "E11") });
    } else if (classification === "Scope change" && x) {
      next = setStage(next, [x.id], "Scope change pending");
      next = patchProject(next, x.projectId, { scopeFlag: `Round ${f.round} requested — needs Founder decision`, currentOwnerId: "E01" });
    }
    commit(withAudit(next, actorId, "Feedback classified", "Feedback", feedbackId, `${x?.type ?? ""}: ${classification}${rootCause ? ` (${rootCause})` : ""}`, f.classification, classification));
  },

  decideScope(actorId: string, feedbackId: string, decision: "paid" | "goodwill" | "decline") {
    const d = getDb();
    const f = d.feedback.find((y) => y.id === feedbackId);
    const x = f && d.deliverables.find((y) => y.id === f.deliverableId);
    if (!f || !x) return;
    let next: Db = { ...d, feedback: d.feedback.map((y) => (y.id === feedbackId ? { ...y, status: decision === "decline" ? "Approved" : "Assigned", classification: decision === "decline" ? "Scope change" : "In scope" } : y)) };
    if (decision === "decline") {
      next = setStage(next, [x.id], "With client");
      next = patchProject(next, x.projectId, { scopeFlag: undefined, currentOwnerId: "E03" });
    } else {
      next = setStage(next, [x.id], "In correction", { revisionCount: x.revisionCount + 1 });
      next = patchProject(next, x.projectId, { scopeFlag: decision === "paid" ? "Extra round approved as paid extra" : "Extra round approved as goodwill", currentOwnerId: x.assigneeId ?? "E11" });
    }
    commit(withAudit(next, actorId, "Scope decision", "Feedback", feedbackId, `${x.type}: ${decision === "paid" ? "approved as paid extra" : decision === "goodwill" ? "approved as goodwill" : "declined"}`));
  },

  recordSignOff(actorId: string, deliverableId: string) {
    const d = getDb();
    const x = d.deliverables.find((y) => y.id === deliverableId);
    if (!x) return;
    let next = setStage(d, [deliverableId], "Client approved");
    next = { ...next, feedback: next.feedback.map((f) => (f.deliverableId === deliverableId ? { ...f, status: "Approved" } : f)) };
    const siblings = next.deliverables.filter((y) => y.projectId === x.projectId);
    const proj = next.projects.find((p) => p.id === x.projectId);
    if (siblings.every((y) => ["Client approved", "Awaiting final payment", "Final files delivered", "Closed"].includes(y.stage)) && proj && !proj.finalPaid) {
      next = setStage(next, siblings.map((y) => y.id), "Awaiting final payment");
    }
    commit(withAudit(next, actorId, "Client sign-off recorded", "Deliverable", deliverableId, `${x.type} v${x.version} approved by client`));
  },

  replyThread(actorId: string, threadId: string) {
    const d = getDb();
    const t = d.threads.find((y) => y.id === threadId);
    if (!t) return;
    commit(withAudit({ ...d, threads: d.threads.map((y) => (y.id === threadId ? { ...y, lastReplyAt: NOW } : y)) }, actorId, "Thread replied", "Thread", threadId, t.subject));
  },

  logComplaint(actorId: string, input: Omit<Complaint, "id" | "receivedAt" | "status">) {
    const d = getDb();
    const id = nextId("CM");
    const c: Complaint = { ...input, id, receivedAt: TODAY, status: "Received" };
    commit(withAudit({ ...d, complaints: [c, ...d.complaints] }, actorId, "Complaint logged", "Complaint", id, `${input.category}: ${input.summary.slice(0, 60)}`));
  },

  advanceComplaint(actorId: string, complaintId: string) {
    const d = getDb();
    const steps: Complaint["status"][] = ["Received", "Categorised", "Team informed", "Root cause", "Resolved"];
    const c = d.complaints.find((y) => y.id === complaintId);
    if (!c || c.status === "Resolved") return;
    const nextStatus = steps[steps.indexOf(c.status) + 1];
    commit(withAudit({ ...d, complaints: d.complaints.map((y) => (y.id === complaintId ? { ...y, status: nextStatus } : y)) }, actorId, "Complaint advanced", "Complaint", complaintId, `${c.status} → ${nextStatus}`, c.status, nextStatus));
  },
};
