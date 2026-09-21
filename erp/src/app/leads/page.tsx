"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader, Kpi, KpiGrid, Card, Pill, Table, Chips, Callout } from "@/components/ui/primitives";
import { AddLeadModal } from "@/components/forms/misc-forms";
import { useDb } from "@/lib/use-db";
import { productById } from "@/data/people";
import { computeReport } from "@/lib/rules";
import { inr, relDays, daysLeft } from "@/lib/format";
import type { LeadStatus } from "@/lib/types";

const STAGES: LeadStatus[] = ["New", "Contacted", "Requirement", "Proposal", "Negotiation", "Won", "Lost"];
const tone = (s: LeadStatus) => (s === "Won" ? "green" : s === "Lost" ? "slate" : s === "Negotiation" || s === "Proposal" ? "brand" : "amber");

export default function LeadsPage() {
  const { db, act } = useDb();
  const [stage, setStage] = useState("all");
  const [add, setAdd] = useState(false);
  const leads = db.leads;
  const open = leads.filter((l) => l.status !== "Won" && l.status !== "Lost");
  const overdueAction = open.filter((l) => daysLeft(l.nextActionDate) < 0);
  const pipeline = open.reduce((s, l) => s + l.estValue, 0);
  const rows = leads.filter((l) => stage === "all" || l.status === stage);
  const sketch = computeReport(db).soldBy;
  const next = (s: LeadStatus): LeadStatus | null => (s === "Won" || s === "Lost" ? null : STAGES[STAGES.indexOf(s) + 1]);

  return (
    <>
      <PageHeader title="Leads" subtitle="Founder-owned. Every active lead must have a logged next step; won leads hand over to the CRM with package, price and promises." actions={<button className="btn-primary btn-sm" onClick={() => setAdd(true)}><Plus size={14} /> Add lead</button>} />
      <AddLeadModal open={add} onClose={() => setAdd(false)} />
      <KpiGrid cols={5}>
        <Kpi label="Open leads" value={open.length} hint="In pipeline" />
        <Kpi label="Pipeline value" value={inr(pipeline, true)} hint="Estimated" tone="green" />
        <Kpi label="Next action overdue" value={overdueAction.length} hint="Log a next step" tone="red" />
        <Kpi label="Won this month" value={leads.filter((l) => l.status === "Won").length} hint="Ready for CRM handover" tone="violet" />
        <Kpi label="Capacity check" value={`${sketch.logo + sketch.branding} / 24`} hint="Sketch slots used this month" tone="amber" />
      </KpiGrid>
      <Callout tone="amber" title="Pace intake to capacity">30 clients onboarded against 6–8 completed is a capacity-planning problem, not a motivation problem. The sketch ceiling is 24 logo/branding projects a month.</Callout>
      <div className="mt-4 mb-3"><Chips items={[{ key: "all", label: "All", count: leads.length }, ...STAGES.map((s) => ({ key: s, label: s, count: leads.filter((l) => l.status === s).length }))]} active={stage} onChange={setStage} /></div>
      <Card padded={false}>
        <Table head={["Lead", "Interest", "Source", "Stage", "Est. value", "Next action", "When", ""]}>
          {rows.map((l) => {
            const late = daysLeft(l.nextActionDate) < 0 && l.status !== "Won" && l.status !== "Lost";
            const n = next(l.status);
            return (
              <tr key={l.id} className="table-row">
                <td><Link href={`/leads/${l.id}`} className="font-medium text-slate-900 hover:text-brand-700">{l.business}</Link><div className="text-[11px] text-slate-500">{l.contact}</div></td>
                <td>{productById(l.interest).name}</td>
                <td className="text-slate-500">{l.source}</td>
                <td><Pill tone={tone(l.status)}>{l.status}</Pill></td>
                <td className="font-mono">{inr(l.estValue)}</td>
                <td className="text-slate-700">{l.nextAction}</td>
                <td className={late ? "font-semibold text-red-600" : ""}>{relDays(l.nextActionDate)}</td>
                <td className="space-x-1 whitespace-nowrap">
                  {n && n !== "Lost" && <button className="btn-secondary btn-sm" onClick={() => act.setLeadStatus(l.id, n)}>→ {n}</button>}
                  {l.status === "Won" && <Link href={`/leads/${l.id}`} className="btn-primary btn-sm">Hand over</Link>}
                </td>
              </tr>
            );
          })}
        </Table>
      </Card>
    </>
  );
}
