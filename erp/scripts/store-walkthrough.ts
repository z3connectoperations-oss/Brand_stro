/**
 * Runs the full project lifecycle through the store actions and asserts every
 * stage gate. Run with: npx tsx scripts/store-walkthrough.ts
 */
import assert from "node:assert/strict";
import { actions, getDb } from "../src/lib/store";
import { projectStage, pendingHandoffs } from "../src/lib/selectors";
import { computeAlerts, computeReport } from "../src/lib/rules";

const stage = (id: string) => projectStage(getDb(), getDb().projects.find((p) => p.id === id)!);
const dl = (pid: string) => getDb().deliverables.filter((d) => d.projectId === pid);

// 1. Founder creates a logo project without advance → blocked at Awaiting advance
const pid = actions.createProject("E01", { clientId: "C01", name: "ABC Foods — Sub-brand Logo", product: "logo", price: 6000, priority: "P2", clientDeadline: "2026-10-05", route: "with-sketch", advancePaid: false });
assert.equal(stage(pid), "Awaiting advance");
assert.ok(computeAlerts(getDb()).length > 0);

// 2. Record advance → Discovery
const adv = getDb().payments.find((x) => x.projectId === pid && x.milestone === "Advance 50%")!;
actions.recordPayment("E03", adv.id);
assert.equal(stage(pid), "Discovery");
assert.equal(getDb().projects.find((p) => p.id === pid)!.advancePaid, true);

// 3. CRM completes discovery → R&D queue, brief stored with gaps flagged
actions.completeDiscovery("E03", pid, { brandInOneSentence: "Honest organic snacks", targetAudience: "Urban families", positioning: "Premium", businessObjective: "Launch", communicateAndAvoid: "Warm; avoid clip-art", competitors: "", deliverablesAndDeadline: "Logo by 5 Oct", expectsToSeeFirst: "", referencesAndConstraints: "" });
assert.equal(stage(pid), "R&D queue");
assert.ok(getDb().projects.find((p) => p.id === pid)!.brief?.completedOn);

// 4. R&D starts and hands off → Sketch queue with a pending handoff to E06
actions.startResearch("E05", pid);
assert.equal(stage(pid), "R&D in progress");
actions.handoffFromRnd("E05", pid);
assert.equal(stage(pid), "Sketch queue");
const h = pendingHandoffs(getDb(), "E06").find((x) => x.projectId === pid)!;
assert.ok(h, "handoff to sketch artist exists");
assert.ok(computeAlerts(getDb()).some((a) => a.kind === "Handoff" && a.text.includes("Sub-brand")));

// 5. Sketch acknowledges → Sketching; submits → Awaiting assignment
actions.acknowledgeHandoff("E06", h.id);
assert.equal(stage(pid), "Sketching");
actions.submitSketch("E06", pid);
assert.equal(stage(pid), "Awaiting assignment");

// 6. TL assigns → In design; designer submits → TL review (version 1)
const logo = dl(pid)[0];
actions.assignDeliverable("E07", logo.id, "E10");
assert.equal(stage(pid), "In design");
actions.submitToTl("E10", logo.id);
assert.equal(stage(pid), "TL review");
assert.equal(dl(pid)[0].version, 1);

// 7. TL sends back once (rework +1), designer resubmits (v2), TL passes → Ready for client
actions.reviewDecision("E07", logo.id, "rework", "Mono export missing");
assert.equal(stage(pid), "In design");
assert.equal(dl(pid)[0].internalReworkCount, 1);
actions.submitToTl("E10", logo.id);
actions.reviewDecision("E07", logo.id, "pass", "");
assert.equal(stage(pid), "Ready for client");
assert.equal(dl(pid)[0].version, 2);

// 8. CRM submits → With client; logs feedback → Feedback received; classifies in scope → In correction, round 1
actions.submitToClient("E03", logo.id);
assert.equal(stage(pid), "With client");
actions.logFeedback("E03", { deliverableId: logo.id, channel: "WhatsApp", text: "Make the leaf smaller" });
assert.equal(stage(pid), "Feedback received");
const fb = getDb().feedback.find((f) => f.deliverableId === logo.id)!;
assert.equal(fb.round, 1);
actions.classifyFeedback("E03", fb.id, "In scope", "Client preference");
assert.equal(stage(pid), "In correction");
assert.equal(dl(pid)[0].revisionCount, 1);

// 9. Correction re-enters TL review, passes, resubmitted; client requests round 4 → scope change → Founder approves goodwill
actions.submitToTl("E10", logo.id);
actions.reviewDecision("E07", logo.id, "pass", "");
actions.submitToClient("E03", logo.id);
for (let i = 0; i < 2; i++) {
  actions.logFeedback("E03", { deliverableId: logo.id, channel: "Email", text: `Tweak ${i}` });
  const f = getDb().feedback.find((x) => x.deliverableId === logo.id && x.status === "Logged")!;
  actions.classifyFeedback("E03", f.id, "In scope", "Client preference");
  actions.submitToTl("E10", logo.id);
  actions.reviewDecision("E07", logo.id, "pass", "");
  actions.submitToClient("E03", logo.id);
}
assert.equal(dl(pid)[0].revisionCount, 3);
actions.logFeedback("E03", { deliverableId: logo.id, channel: "Call", text: "Completely different concept please" });
const f4 = getDb().feedback.find((x) => x.deliverableId === logo.id && x.status === "Logged")!;
assert.equal(f4.round, 4);
actions.classifyFeedback("E03", f4.id, "Scope change");
assert.equal(stage(pid), "Scope change pending");
assert.ok(computeAlerts(getDb()).some((a) => a.kind === "Scope change" && a.owner === "founder"));
actions.decideScope("E01", f4.id, "decline");
assert.equal(stage(pid), "With client");

// 10. Sign-off → Awaiting final payment (single deliverable); final payment → Final files delivered
actions.recordSignOff("E03", logo.id);
assert.equal(stage(pid), "Awaiting final payment");
const fin = getDb().payments.find((x) => x.projectId === pid && x.milestone === "Final 50%")!;
actions.recordPayment("E03", fin.id);
assert.equal(stage(pid), "Final files delivered");
assert.equal(getDb().projects.find((p) => p.id === pid)!.finalPaid, true);

// 11. Audit trail grew and report reflects the new project
const audit = getDb().audit.filter((a) => a.entityId === pid || a.entityId === logo.id || a.entity === "Feedback");
assert.ok(audit.length >= 15, `audit entries: ${audit.length}`);
const r = computeReport(getDb());
assert.ok(r.engagements >= 1 && r.revenue >= 6000);

// 12. Other actions
actions.createLead("E01", { business: "Test Co", contact: "T", interest: "label", source: "Referral", estValue: 2500, nextAction: "Call", nextActionDate: "2026-09-22" });
actions.setLeadStatus("E01", getDb().leads[0].id, "Contacted");
assert.equal(getDb().leads[0].status, "Contacted");
actions.replyThread("E03", "T01");
assert.ok(getDb().threads.find((t) => t.id === "T01")!.lastReplyAt);
actions.logComplaint("E03", { clientId: "C01", category: "Delay", summary: "Late", escalated: false });
actions.advanceComplaint("E03", getDb().complaints[0].id);
assert.equal(getDb().complaints[0].status, "Categorised");
actions.sendReminder("E03", "PAY04");
assert.equal(getDb().payments.find((x) => x.id === "PAY04")!.followUps, 3);

console.log(`OK — lifecycle walkthrough passed. ${getDb().audit.length} audit entries, ${computeAlerts(getDb()).length} live alerts.`);
