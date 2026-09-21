"use client";

import { PageHeader, Card, Table, Kpi, KpiGrid, Progress, Callout } from "@/components/ui/primitives";
import { products } from "@/data/people";
import { useDb } from "@/lib/use-db";
import { computeReport } from "@/lib/rules";
import { inr } from "@/lib/format";

export default function ReportsPage() {
  const { db } = useDb();
  const r = computeReport(db);
  const rc = r.designMiss + r.pref || 1;
  const firstPct = r.presented ? Math.round((r.firstDraft / r.presented) * 100) : 0;
  const sections = [["Production", r.production], ["Logo / Identity", r.logo], ["Packaging", r.packaging], ["R&D", r.rnd], ["People", r.people]] as const;

  return (
    <>
      <PageHeader title="Reports — September 2026" subtitle="The branding-agency dashboard from Handbook §30, computed from the live data: one number per team, tracked every week." />
      <KpiGrid cols={5}>
        <Kpi label="Revenue MTD" value={inr(r.revenue, true)} hint={`${Math.round((r.revenue / r.target) * 100)}% of ${inr(r.target, true)}`} tone="brand" />
        <Kpi label="Engagements" value={`${r.engagements} / 47`} hint="Projects created this month" />
        <Kpi label="First-draft approvals" value={`${firstPct}%`} hint={`${r.firstDraft} of ${r.presented} presented`} tone="green" />
        <Kpi label="Avg rounds / deliverable" value={r.avgRounds.toFixed(1)} hint="Packages include 2–3" tone="amber" />
        <Kpi label="Projected margin" value={`${r.margin}%`} hint="Required band 40–50%" tone={r.margin >= 40 ? "green" : "red"} />
      </KpiGrid>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card title="Sales mix vs plan" subtitle="The mix is built around 24 sketch slots">
          <ul className="space-y-3">
            {products.map((p) => (
              <li key={p.id}><div className="mb-1 flex justify-between text-[12.5px]"><span>{p.name}</span><span className="font-mono">{r.soldBy[p.id]}/{p.monthlyTarget} · {inr(p.price * r.soldBy[p.id], true)}</span></div><Progress value={(r.soldBy[p.id] / p.monthlyTarget) * 100} /></li>
            ))}
          </ul>
        </Card>
        <Card title="Revision distribution" subtitle="Where first-presentation quality is weak, specifically">
          <ul className="space-y-2">
            {["0 rounds (approved first draft)", "1 round", "2 rounds", "3 rounds", "4+ rounds"].map((l, i) => (
              <li key={l}><div className="mb-1 flex justify-between text-[12.5px]"><span>{l}</span><span className="font-mono">{r.dist[i]}</span></div><Progress value={r.presented ? (r.dist[i] / r.presented) * 100 : 0} tone={i >= 3 ? "red" : i === 0 ? "green" : "brand"} /></li>
            ))}
          </ul>
        </Card>
        <Card title="Revision root cause" subtitle="Genuine design miss vs. subjective preference">
          <div className="mb-1 flex justify-between text-[12.5px]"><span>Design miss → fix the thinking</span><span className="font-mono">{r.designMiss}</span></div>
          <Progress value={(r.designMiss / rc) * 100} tone="red" className="mb-3" />
          <div className="mb-1 flex justify-between text-[12.5px]"><span>Client preference → fix the brief-gathering</span><span className="font-mono">{r.pref}</span></div>
          <Progress value={(r.pref / rc) * 100} tone="amber" className="mb-3" />
          <Callout tone="amber">The ₹15,000 package selling with informally unlimited rounds is a margin problem: 5 rounds eat time priced for 2.</Callout>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {sections.map(([title, rows]) => (
          <Card key={title} title={title} padded={false}>
            <Table head={["Metric", "Value"]} className="[&_table]:min-w-0">
              {rows.map(([k, v]) => <tr key={k} className="table-row"><td className="text-slate-600">{k}</td><td className="text-right font-mono font-semibold">{v}</td></tr>)}
            </Table>
          </Card>
        ))}
      </div>

      <Card className="mt-4" title="Company economics at full target (Incentive Plan)" padded={false}>
        <Table head={["Line item", "Amount"]}>
          {[["Revenue — 8 logo, 16 branding, 15 label, 8 packaging", "₹3,53,500"], ["Fixed payroll", "− ₹1,26,000"], ["Bonus payout, everyone at target", "− ₹61,900"], ["Rent, software, electricity, misc.", "− ₹17,000"], ["Company profit", "₹1,48,600 (~42%)"]].map(([k, v], i) => (
            <tr key={k} className={`table-row ${i === 4 ? "font-semibold" : ""}`}><td>{k}</td><td className="text-right font-mono">{v}</td></tr>
          ))}
        </Table>
      </Card>
    </>
  );
}
