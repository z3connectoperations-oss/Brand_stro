/** Domain types derived from the Brandstro Master Operating Guide, Chapter 12. */

export type Role =
  | "founder"
  | "creative-head"
  | "crm"
  | "team-leader"
  | "designer"
  | "rnd"
  | "sketch"
  | "hr";

export type TeamId = "logo" | "packaging" | "rnd" | "sketch" | "crm" | "hr" | "leadership";

export interface Employee {
  id: string;
  name: string;
  initials: string;
  role: Role;
  title: string;
  team: TeamId;
  reportsTo?: string;
  baseSalary: number;
  targetEarning: number;
  color: string;
}

export type ProductId = "logo" | "branding" | "label" | "packaging";

export interface Product {
  id: ProductId;
  name: string;
  price: number;
  monthlyTarget: number;
  includedRevisions: number;
  deliverables: DeliverableType[];
  usesSketch: boolean;
}

export type DeliverableType =
  | "Logo"
  | "Brand Guidelines"
  | "Visiting Card"
  | "Letterhead"
  | "T-Shirt"
  | "Custom Packaging"
  | "Label"
  | "Packaging";

export type Stage =
  | "Awaiting advance"
  | "Discovery"
  | "Brief ready"
  | "R&D queue"
  | "R&D in progress"
  | "Sketch queue"
  | "Sketching"
  | "Awaiting assignment"
  | "In design"
  | "TL review"
  | "Ready for client"
  | "With client"
  | "Feedback received"
  | "In correction"
  | "Scope change pending"
  | "Client approved"
  | "Awaiting final payment"
  | "Final files delivered"
  | "Closed";

export type Priority = "P1" | "P2" | "P3";

export interface Deliverable {
  id: string;
  projectId: string;
  type: DeliverableType;
  team: TeamId;
  assigneeId?: string;
  stage: Stage;
  version: number;
  revisionCount: number;
  internalReworkCount: number;
  dueDate: string;
}

/** Output of the CRM discovery call (Handbook §27 briefing checklist). Missing answers are flagged [CLIENT INPUT REQUIRED]. */
export interface DiscoveryBrief {
  brandInOneSentence: string;
  targetAudience: string;
  positioning: string;
  businessObjective: string;
  communicateAndAvoid: string;
  competitors: string;
  deliverablesAndDeadline: string;
  expectsToSeeFirst: string;
  referencesAndConstraints: string;
  completedOn?: string;
}

export interface Project {
  id: string;
  code: string;
  name: string;
  clientId: string;
  product: ProductId;
  price: number;
  priority: Priority;
  route: "with-sketch" | "direct" | "designer-originated";
  paymentConfirmedOn?: string;
  clientDeadline: string;
  currentOwnerId: string;
  crmOwnerId: string;
  advancePaid: boolean;
  finalPaid: boolean;
  createdOn: string;
  scopeFlag?: string;
  brief?: DiscoveryBrief;
}

/** Moving ownership to the next stage. Unacknowledged = not yet started. */
export interface Handoff {
  id: string;
  projectId: string;
  deliverableIds: string[];
  fromId: string;
  toId: string;
  note: string;
  sentAt: string;
  acknowledgedAt?: string;
}

export interface AuditEntry {
  id: string;
  at: string;
  actorId: string;
  action: string;
  entity: string;
  entityId: string;
  summary: string;
  before?: string;
  after?: string;
}

export interface Client {
  id: string;
  code: string;
  name: string;
  industry: string;
  contact: string;
  phone: string;
  email: string;
  since: string;
  tier: "Standard" | "Important";
  onboarding: { step: string; done: boolean }[];
}

export type LeadStatus = "New" | "Contacted" | "Requirement" | "Proposal" | "Negotiation" | "Won" | "Lost";

export interface Lead {
  id: string;
  business: string;
  contact: string;
  interest: ProductId;
  source: string;
  status: LeadStatus;
  estValue: number;
  nextAction: string;
  nextActionDate: string;
  lastContact: string;
  ownerId: string;
}

export interface Payment {
  id: string;
  projectId: string;
  milestone: "Advance 50%" | "Final 50%";
  amount: number;
  dueDate: string;
  paidOn?: string;
  followUps: number;
}

export type FeedbackClass = "In scope" | "Scope change" | "Unclear";

export interface Feedback {
  id: string;
  deliverableId: string;
  projectId: string;
  receivedAt: string;
  channel: "WhatsApp" | "Email" | "Call";
  text: string;
  classification: FeedbackClass;
  round: number;
  rootCause?: "Design miss" | "Client preference";
  status: "Logged" | "Assigned" | "Corrected" | "Resubmitted" | "Approved";
}

export interface Complaint {
  id: string;
  clientId: string;
  projectId?: string;
  category: "Delay" | "Quality" | "Communication" | "Scope" | "Pricing/Payment" | "Revision" | "Delivery";
  summary: string;
  receivedAt: string;
  status: "Received" | "Categorised" | "Team informed" | "Root cause" | "Resolved";
  escalated: boolean;
}

export interface Thread {
  id: string;
  clientId: string;
  projectId?: string;
  channel: "WhatsApp (project)" | "WhatsApp (enquiry)" | "Email";
  lastClientMessageAt: string;
  lastReplyAt?: string;
  subject: string;
}

export interface Attendance {
  employeeId: string;
  date: string;
  status: "Present" | "Late" | "Absent" | "Leave" | "Unapproved absence";
  inTime?: string;
  note?: string;
}

export interface Leave {
  id: string;
  employeeId: string;
  from: string;
  to: string;
  type: "Planned" | "Emergency";
  status: "Requested" | "TL acknowledged" | "Logged";
  coverageGap?: string;
}

export interface Alert {
  id: string;
  severity: "critical" | "warning" | "info";
  kind: string;
  text: string;
  detail: string;
  owner: Role;
  href: string;
  at: string;
}

export interface QcItem {
  id: string;
  label: string;
}

export interface IncentiveLine {
  employeeId: string;
  workType: string;
  baseline: number;
  target: number;
  done: number;
  clean: number;
  partial: number;
  heavy: number;
  rateClean: number;
  ratePartial: number;
}
