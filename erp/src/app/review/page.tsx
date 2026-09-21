"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHeader, Card, Pill, Table, Kpi, KpiGrid, Chips, Callout } from "@/components/ui/primitives";
import { Avatar } from "@/components/ui/avatar";
import { useMe } from "@/lib/role-context";
import { deliverables, projectById } from "@/data/projects";
import { clientById } from "@/data/clients";
import { byId, teamNames } from "@/data/people";
import { relDays, daysLeft } from "@/lib/format";
import { stageTone } from "@/lib/selectors";

export default function ReviewQueuePage() {
  const { me } = useMe();
  const [filter, setFilter] = useState("pending");
  const scoped = me.role === "team-leader" ? deliverables.filter((d) => d.team === me.team) : deliverables;
  const pending = scoped.filter((d) => d.stage === "TL review");
  const readyClient = scoped.filter((d) => d.stage === "Ready for client");
  const rows = filter === "pending" ? pending : filter === "ready" ? readyClient : scoped.filter((d) => d.internalReworkCount > 0);
  const isHead = me.role === "creative-head";

  return (
    <>
      <PageHeader
        title={isHead ? "Creative review" : "Review queue"}
        subtitle={isHead ? "The 7-point checkpoint before client presentation: strategy, concept, design, brand fit, distinctiveness, application, technical." : "Review submitted work before it moves to the Creative Head / CRM. No piece skips this, regardless of deadline pressure."}
      />
      <KpiGrid cols={4}>
        <Kpi label="Pending review" value={pending.length} tone="violet" />
        <Kpi label="Due today" value={pending.filter((d) => daysLeft(d.dueDate) <= 0).length} hint="SLA at risk" tone="red" />
        <Kpi label="Ready for client" value={readyClient.length} hint="Passed QC, with CRM" tone="green" />
        <Kpi label="Returned for rework" value={scoped.filter((d) => d.internalReworkCount > 0).length} hint="This month" tone="amber" />
      </KpiGrid>
      {!isHead && <Callout tone="brand" title="Non-negotiable">Nothing goes to the Creative Head or CRM without your sign-off. If the same quality issue recurs on the same designer 2+ times, escalate to the Creative Head.</Callout>}
      <div className="my-3">
        <Chips items={[{ key: "pending", label: "Pending review", count: pending.length }, { key: "ready", label: "Ready for client", count: readyClient.length }, { key: "rework", label: "Had rework" }]} active={filter} onChange={setFilter} />
      </div>
      <Card padded={false}>
        <Table head={["Deliverable", "Project", "Team", "Designer", "Version", "Client rounds", "Rework", "Due", ""]}>
          {rows.map((d) => {
            const p = projectById(d.projectId)!;
            return (
              <tr key={d.id} className="table-row">
                <td><div className="font-medium">{d.type}</div><Pill tone={stageTone(d.stage)}>{d.stage}</Pill></td>
                <td>{p.name}<div className="text-[11px] text-slate-500">{clientById(p.clientId).name}</div></td>
                <td className="text-slate-500">{teamNames[d.team]}</td>
                <td><span className="flex items-center gap-1.5"><Avatar employee={byId(d.assigneeId)} size="sm" />{byId(d.assigneeId)?.name}</span></td>
                <td className="font-mono">v{d.version}</td>
                <td className="font-mono">{d.revisionCount}</td>
                <td className="font-mono">{d.internalReworkCount}</td>
                <td className={daysLeft(d.dueDate) < 0 ? "font-semibold text-red-600" : ""}>{relDays(d.dueDate)}</td>
                <td><Link href={`/review/${d.id}`} className="btn-primary btn-sm">Review</Link></td>
              </tr>
            );
          })}
          {rows.length === 0 && <tr><td colSpan={9} className="py-8 text-center text-slate-500">Nothing here.</td></tr>}
        </Table>
      </Card>
    </>
  );
}
