"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHeader, Card, Pill, Chips, Kpi, KpiGrid, Callout } from "@/components/ui/primitives";
import { useDb } from "@/lib/use-db";
import { computeAlerts } from "@/lib/rules";
import { roleLabels } from "@/lib/nav";
import { useMe } from "@/lib/role-context";

export default function AlertsPage() {
  const { me } = useMe();
  const { db } = useDb();
  const alerts = computeAlerts(db);
  const canSeeAll = me.role === "founder" || me.role === "creative-head";
  const [who, setWho] = useState(canSeeAll ? "all" : "mine");
  const rows = alerts.filter((a) => who === "all" || a.owner === me.role);

  return (
    <>
      <PageHeader title={me.role === "creative-head" ? "Escalations" : "Alerts & exceptions"} subtitle="Rule-driven, not opinion-driven. Each alert is computed live from the data and names the rule it comes from and who owns the next step." />
      <KpiGrid cols={3}>
        <Kpi label="Critical" value={rows.filter((a) => a.severity === "critical").length} tone="red" />
        <Kpi label="Warnings" value={rows.filter((a) => a.severity === "warning").length} tone="amber" />
        <Kpi label="Info" value={rows.filter((a) => a.severity === "info").length} tone="slate" />
      </KpiGrid>
      {canSeeAll && <div className="mb-3"><Chips items={[{ key: "all", label: "Everyone", count: alerts.length }, { key: "mine", label: "Owned by me", count: alerts.filter((a) => a.owner === me.role).length }]} active={who} onChange={setWho} /></div>}
      <Card padded={false}>
        <ul className="divide-y divide-slate-100">
          {rows.map((a) => (
            <li key={a.id} className="flex flex-wrap items-start gap-3 px-4 py-3">
              <Pill tone={a.severity === "critical" ? "red" : a.severity === "warning" ? "amber" : "slate"}>{a.kind}</Pill>
              <div className="min-w-0 flex-1"><div className="text-[13px] font-medium">{a.text}</div><div className="text-[12px] text-slate-500">{a.detail}</div></div>
              <div className="text-right text-[11px] text-slate-500">{roleLabels[a.owner]}<br /><span className="font-mono">{a.at.replace("T", " ")}</span></div>
              <Link href={a.href} className="btn-secondary btn-sm">Open</Link>
            </li>
          ))}
          {rows.length === 0 && <li className="px-4 py-8 text-center text-slate-500">Nothing to flag. Alerts clear themselves as the underlying data changes.</li>}
        </ul>
      </Card>
      <div className="mt-4"><Callout tone="slate" title="Rules in force">Overdue deadlines · scope change awaiting Founder · SLA 4h / 1 day · stalled 3+ days · payment overdue (escalate after 1 follow-up) · unacknowledged handoffs · designer above 1/day benchmark · unclear feedback · repeat QC issue (same designer 2+, team 3+) · unassigned work · brief ready but advance unpaid · unapproved absence.</Callout></div>
    </>
  );
}
