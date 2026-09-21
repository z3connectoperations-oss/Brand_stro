import type { Deliverable, Project, Payment, Feedback, Thread, Complaint } from "@/lib/types";

export const projects: Project[] = [
  { id: "P01", code: "BRD-1024", name: "ABC Foods — Brand Identity", clientId: "C01", product: "branding", price: 15000, priority: "P1", route: "with-sketch", paymentConfirmedOn: "2026-09-12", clientDeadline: "2026-09-24", currentOwnerId: "E07", crmOwnerId: "E03", advancePaid: true, finalPaid: false, createdOn: "2026-09-12" },
  { id: "P02", code: "BRD-1021", name: "KPN Restaurant — Packaging Concept", clientId: "C02", product: "packaging", price: 3500, priority: "P2", route: "direct", paymentConfirmedOn: "2026-08-30", clientDeadline: "2026-09-19", currentOwnerId: "E03", crmOwnerId: "E03", advancePaid: true, finalPaid: false, createdOn: "2026-08-30" },
  { id: "P03", code: "BRD-1018", name: "Iyengar Bakery — Packaging (3 SKUs)", clientId: "C03", product: "packaging", price: 3500, priority: "P2", route: "direct", paymentConfirmedOn: "2026-08-22", clientDeadline: "2026-09-23", currentOwnerId: "E11", crmOwnerId: "E03", advancePaid: true, finalPaid: false, createdOn: "2026-08-22" },
  { id: "P04", code: "BRD-1030", name: "Mahalaxmi Builders — Corporate Kit", clientId: "C04", product: "branding", price: 15000, priority: "P2", route: "with-sketch", paymentConfirmedOn: "2026-09-15", clientDeadline: "2026-10-02", currentOwnerId: "E05", crmOwnerId: "E03", advancePaid: true, finalPaid: false, createdOn: "2026-09-15" },
  { id: "P05", code: "BRD-1028", name: "Orange Surgicals — Front Label", clientId: "C05", product: "label", price: 2500, priority: "P2", route: "direct", paymentConfirmedOn: "2026-09-08", clientDeadline: "2026-09-16", currentOwnerId: "E03", crmOwnerId: "E03", advancePaid: true, finalPaid: false, createdOn: "2026-09-08", scopeFlag: "Round 4 requested — exceeds 2 included" },
  { id: "P06", code: "BRD-1033", name: "Fresh Basket Organics — Jar Label", clientId: "C06", product: "label", price: 2500, priority: "P2", route: "direct", clientDeadline: "2026-09-30", currentOwnerId: "E03", crmOwnerId: "E03", advancePaid: false, finalPaid: false, createdOn: "2026-09-18" },
  { id: "P07", code: "BRD-1031", name: "Deccan Roasters — Logo", clientId: "C07", product: "logo", price: 6000, priority: "P2", route: "with-sketch", paymentConfirmedOn: "2026-09-16", clientDeadline: "2026-09-28", currentOwnerId: "E06", crmOwnerId: "E03", advancePaid: true, finalPaid: false, createdOn: "2026-09-16" },
  { id: "P08", code: "BRD-1012", name: "Chaivanth — Brand Guidelines", clientId: "C08", product: "branding", price: 15000, priority: "P2", route: "with-sketch", paymentConfirmedOn: "2026-08-10", clientDeadline: "2026-09-20", currentOwnerId: "E03", crmOwnerId: "E03", advancePaid: true, finalPaid: false, createdOn: "2026-08-10" },
  { id: "P09", code: "BRD-1009", name: "Filters & Flavours — Logo", clientId: "C09", product: "logo", price: 6000, priority: "P2", route: "with-sketch", paymentConfirmedOn: "2026-08-05", clientDeadline: "2026-09-05", currentOwnerId: "E03", crmOwnerId: "E03", advancePaid: true, finalPaid: true, createdOn: "2026-08-05" },
  { id: "P10", code: "BRD-1035", name: "Good Flour Co. — Branding", clientId: "C10", product: "branding", price: 15000, priority: "P3", route: "with-sketch", clientDeadline: "2026-10-10", currentOwnerId: "E03", crmOwnerId: "E03", advancePaid: false, finalPaid: false, createdOn: "2026-09-20" },
  { id: "P11", code: "BRD-1026", name: "Iyengar Bakery — Logo Refresh", clientId: "C03", product: "logo", price: 6000, priority: "P2", route: "designer-originated", paymentConfirmedOn: "2026-09-05", clientDeadline: "2026-09-22", currentOwnerId: "E09", crmOwnerId: "E03", advancePaid: true, finalPaid: false, createdOn: "2026-09-05" },
  { id: "P12", code: "BRD-1029", name: "KPN Restaurant — Menu Label Set", clientId: "C02", product: "label", price: 2500, priority: "P2", route: "direct", paymentConfirmedOn: "2026-09-10", clientDeadline: "2026-09-25", currentOwnerId: "E13", crmOwnerId: "E03", advancePaid: true, finalPaid: false, createdOn: "2026-09-10" },
];

export const projectById = (id: string) => projects.find((p) => p.id === id);

export const deliverables: Deliverable[] = [
  { id: "D01", projectId: "P01", type: "Logo", team: "logo", assigneeId: "E08", stage: "TL review", version: 3, revisionCount: 1, internalReworkCount: 1, dueDate: "2026-09-21" },
  { id: "D02", projectId: "P01", type: "Brand Guidelines", team: "packaging", assigneeId: "E12", stage: "In design", version: 1, revisionCount: 0, internalReworkCount: 0, dueDate: "2026-09-23" },
  { id: "D03", projectId: "P01", type: "Visiting Card", team: "packaging", assigneeId: "E13", stage: "Awaiting assignment", version: 0, revisionCount: 0, internalReworkCount: 0, dueDate: "2026-09-23" },
  { id: "D04", projectId: "P01", type: "Letterhead", team: "packaging", stage: "Awaiting assignment", version: 0, revisionCount: 0, internalReworkCount: 0, dueDate: "2026-09-23" },
  { id: "D05", projectId: "P01", type: "T-Shirt", team: "packaging", stage: "Awaiting assignment", version: 0, revisionCount: 0, internalReworkCount: 0, dueDate: "2026-09-24" },
  { id: "D06", projectId: "P01", type: "Custom Packaging", team: "packaging", assigneeId: "E14", stage: "In design", version: 1, revisionCount: 0, internalReworkCount: 0, dueDate: "2026-09-24" },
  { id: "D07", projectId: "P02", type: "Packaging", team: "packaging", assigneeId: "E12", stage: "Awaiting final payment", version: 4, revisionCount: 2, internalReworkCount: 0, dueDate: "2026-09-19" },
  { id: "D08", projectId: "P03", type: "Packaging", team: "packaging", assigneeId: "E13", stage: "TL review", version: 2, revisionCount: 1, internalReworkCount: 1, dueDate: "2026-09-22" },
  { id: "D09", projectId: "P04", type: "Logo", team: "logo", stage: "R&D in progress", version: 0, revisionCount: 0, internalReworkCount: 0, dueDate: "2026-09-28" },
  { id: "D10", projectId: "P04", type: "Brand Guidelines", team: "packaging", stage: "R&D in progress", version: 0, revisionCount: 0, internalReworkCount: 0, dueDate: "2026-10-01" },
  { id: "D11", projectId: "P05", type: "Label", team: "packaging", assigneeId: "E12", stage: "Scope change pending", version: 4, revisionCount: 3, internalReworkCount: 0, dueDate: "2026-09-16" },
  { id: "D12", projectId: "P06", type: "Label", team: "packaging", stage: "Awaiting advance", version: 0, revisionCount: 0, internalReworkCount: 0, dueDate: "2026-09-30" },
  { id: "D13", projectId: "P07", type: "Logo", team: "logo", stage: "Sketching", version: 0, revisionCount: 0, internalReworkCount: 0, dueDate: "2026-09-26" },
  { id: "D14", projectId: "P08", type: "Logo", team: "logo", assigneeId: "E10", stage: "Client approved", version: 2, revisionCount: 1, internalReworkCount: 0, dueDate: "2026-09-12" },
  { id: "D15", projectId: "P08", type: "Brand Guidelines", team: "packaging", assigneeId: "E14", stage: "With client", version: 3, revisionCount: 1, internalReworkCount: 0, dueDate: "2026-09-20" },
  { id: "D16", projectId: "P08", type: "Visiting Card", team: "packaging", assigneeId: "E14", stage: "Client approved", version: 1, revisionCount: 0, internalReworkCount: 0, dueDate: "2026-09-18" },
  { id: "D17", projectId: "P09", type: "Logo", team: "logo", assigneeId: "E08", stage: "Closed", version: 2, revisionCount: 1, internalReworkCount: 0, dueDate: "2026-09-05" },
  { id: "D18", projectId: "P10", type: "Logo", team: "logo", stage: "Awaiting advance", version: 0, revisionCount: 0, internalReworkCount: 0, dueDate: "2026-10-05" },
  { id: "D19", projectId: "P11", type: "Logo", team: "logo", assigneeId: "E09", stage: "In correction", version: 2, revisionCount: 2, internalReworkCount: 0, dueDate: "2026-09-22" },
  { id: "D20", projectId: "P12", type: "Label", team: "packaging", assigneeId: "E13", stage: "In design", version: 1, revisionCount: 0, internalReworkCount: 0, dueDate: "2026-09-24" },
];

export const deliverablesFor = (projectId: string) => deliverables.filter((d) => d.projectId === projectId);

export const payments: Payment[] = [
  { id: "PAY01", projectId: "P01", milestone: "Advance 50%", amount: 7500, dueDate: "2026-09-12", paidOn: "2026-09-12", followUps: 0 },
  { id: "PAY02", projectId: "P01", milestone: "Final 50%", amount: 7500, dueDate: "2026-09-24", followUps: 0 },
  { id: "PAY03", projectId: "P02", milestone: "Advance 50%", amount: 1750, dueDate: "2026-08-30", paidOn: "2026-08-30", followUps: 0 },
  { id: "PAY04", projectId: "P02", milestone: "Final 50%", amount: 1750, dueDate: "2026-09-14", followUps: 2 },
  { id: "PAY05", projectId: "P03", milestone: "Advance 50%", amount: 1750, dueDate: "2026-08-22", paidOn: "2026-08-22", followUps: 0 },
  { id: "PAY06", projectId: "P04", milestone: "Advance 50%", amount: 7500, dueDate: "2026-09-15", paidOn: "2026-09-15", followUps: 0 },
  { id: "PAY07", projectId: "P05", milestone: "Advance 50%", amount: 1250, dueDate: "2026-09-08", paidOn: "2026-09-08", followUps: 0 },
  { id: "PAY08", projectId: "P06", milestone: "Advance 50%", amount: 1250, dueDate: "2026-09-18", followUps: 1 },
  { id: "PAY09", projectId: "P07", milestone: "Advance 50%", amount: 3000, dueDate: "2026-09-16", paidOn: "2026-09-16", followUps: 0 },
  { id: "PAY10", projectId: "P08", milestone: "Advance 50%", amount: 7500, dueDate: "2026-08-10", paidOn: "2026-08-10", followUps: 0 },
  { id: "PAY11", projectId: "P08", milestone: "Final 50%", amount: 7500, dueDate: "2026-09-20", followUps: 1 },
  { id: "PAY12", projectId: "P09", milestone: "Advance 50%", amount: 3000, dueDate: "2026-08-05", paidOn: "2026-08-05", followUps: 0 },
  { id: "PAY13", projectId: "P09", milestone: "Final 50%", amount: 3000, dueDate: "2026-09-05", paidOn: "2026-09-04", followUps: 0 },
  { id: "PAY14", projectId: "P10", milestone: "Advance 50%", amount: 7500, dueDate: "2026-09-22", followUps: 0 },
  { id: "PAY15", projectId: "P11", milestone: "Advance 50%", amount: 3000, dueDate: "2026-09-05", paidOn: "2026-09-05", followUps: 0 },
  { id: "PAY16", projectId: "P12", milestone: "Advance 50%", amount: 1250, dueDate: "2026-09-10", paidOn: "2026-09-10", followUps: 0 },
];

export const feedback: Feedback[] = [
  { id: "F01", deliverableId: "D01", projectId: "P01", receivedAt: "2026-09-14T11:20", channel: "WhatsApp", text: "Cleaner symbol, more spacing between mark and wordmark. Saffron tone approved.", classification: "In scope", round: 1, rootCause: "Client preference", status: "Corrected" },
  { id: "F02", deliverableId: "D11", projectId: "P05", receivedAt: "2026-09-19T16:05", channel: "WhatsApp", text: "Can we try a completely different layout — vertical label instead of horizontal?", classification: "Scope change", round: 4, rootCause: "Client preference", status: "Logged" },
  { id: "F03", deliverableId: "D19", projectId: "P11", receivedAt: "2026-09-20T10:30", channel: "Email", text: "Text is hard to read at small size; please increase the wordmark weight.", classification: "In scope", round: 2, rootCause: "Design miss", status: "Assigned" },
  { id: "F04", deliverableId: "D15", projectId: "P08", receivedAt: "2026-09-18T15:00", channel: "WhatsApp", text: "Change secondary colour on page 6 to the darker green used on the cup.", classification: "In scope", round: 1, rootCause: "Client preference", status: "Resubmitted" },
  { id: "F05", deliverableId: "D07", projectId: "P02", receivedAt: "2026-09-12T09:45", channel: "Call", text: "Approved after the ingredient panel fix.", classification: "In scope", round: 2, rootCause: "Design miss", status: "Approved" },
  { id: "F06", deliverableId: "D08", projectId: "P03", receivedAt: "2026-09-17T13:10", channel: "WhatsApp", text: "Make it pop more.", classification: "Unclear", round: 1, status: "Logged" },
];

export const threads: Thread[] = [
  { id: "T01", clientId: "C01", projectId: "P01", channel: "WhatsApp (project)", lastClientMessageAt: "2026-09-21T11:30", subject: "Logo V3 — when can we see it?" },
  { id: "T02", clientId: "C02", projectId: "P02", channel: "WhatsApp (project)", lastClientMessageAt: "2026-09-21T08:10", lastReplyAt: "2026-09-21T09:00", subject: "Final payment — invoice copy" },
  { id: "T03", clientId: "C06", channel: "WhatsApp (enquiry)", lastClientMessageAt: "2026-09-19T17:40", subject: "Do you also print the labels?" },
  { id: "T04", clientId: "C08", projectId: "P08", channel: "Email", lastClientMessageAt: "2026-09-18T15:00", lastReplyAt: "2026-09-18T16:30", subject: "Guidelines page 6 colour" },
  { id: "T05", clientId: "C04", projectId: "P04", channel: "WhatsApp (project)", lastClientMessageAt: "2026-09-17T12:00", subject: "Reference photos of site hoarding" },
  { id: "T06", clientId: "C05", projectId: "P05", channel: "WhatsApp (project)", lastClientMessageAt: "2026-09-19T16:05", subject: "Vertical layout request" },
];

export const complaints: Complaint[] = [
  { id: "CM01", clientId: "C05", projectId: "P05", category: "Revision", summary: "Client unhappy that round 4 is being questioned; says 'we were promised unlimited changes'.", receivedAt: "2026-09-20", status: "Team informed", escalated: true },
  { id: "CM02", clientId: "C02", projectId: "P02", category: "Delay", summary: "Packaging concept was 2 days late against the promised date.", receivedAt: "2026-09-15", status: "Resolved", escalated: false },
  { id: "CM03", clientId: "C03", projectId: "P03", category: "Communication", summary: "No update for 4 days after sending references.", receivedAt: "2026-09-18", status: "Root cause", escalated: false },
];
