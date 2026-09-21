"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHeader, Kpi, KpiGrid, Card, Pill, Table, Progress, Callout } from "@/components/ui/primitives";
import { Avatar } from "@/components/ui/avatar";
import { AssignWorkModal } from "@/components/forms/assign-work";
import type { Employee } from "@/lib/types";
import { teamNames, byId } from "@/data/people";
import { useDb } from "@/lib/use-db";
import { teamDeliverables, teamMembers, loadFor, stageTone, pendingHandoffs } from "@/lib/selectors";
import { relDays } from "@/lib/format";

export function TeamLeaderDashboard({ me }: { me: Employee }) {
  const { db, act } = useDb();
  const [assign, setAssign] = useState<string | null>(null);
  const ds = teamDeliverables(db, me.team);
  const review = ds.filter((d) => d.stage === "TL review");
  const unassigned = ds.filter((d) => d.stage === "Awaiting assignment");
  const members = teamMembers(me.team);
  const handoffs = pendingHandoffs(db, me.id);
  const teamTarget = me.team === "logo" ? { done: 15, target: 21 } : { done: 20, target: 33 };
  const project = (id: string) => db.projects.find((p) => p.id === id);

  return (
    <>
      <PageHeader title={`${teamNames[me.team]} — ${me.name.split(" ")[0]}`} subtitle="Assign by load, review every piece, flag blockers immediately." badge={<Pill tone="brand">{members.length} designers</Pill>} />
      {assign && <AssignWorkModal open onClose={() => setAssign(null)} deliverableId={assign} />}
      <KpiGrid cols={5}>
        <Kpi label="Awaiting my review" value={review.length} hint="Non-negotiable checkpoint" tone="violet" href="/review" />
        <Kpi label="Unassigned" value={unassigned.length} hint="Assign by current load" tone="amber" href="/team" />
        <Kpi label="In design" value={ds.filter((d) => d.stage === "In design").length} hint="Active" href="/board" />
        <Kpi label="In correction" value={ds.filter((d) => d.stage === "In correction").length} hint="Client rounds" tone="amber" href="/revisions" />
        <Kpi label="Team target" value={`${teamTarget.done}/${teamTarget.target}`} hint="70% of your bonus" tone="green" href="/incentives" />
      </KpiGrid>

      {handoffs.map((h) => (
        <div key={h.id} className="mb-3">
          <Callout tone="amber" title={`Handoff waiting for your acknowledgement — ${project(h.projectId)?.name}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span>{h.deliverableIds.length} deliverable(s) from {byId(h.fromId)?.name} · sent {h.sentAt.replace("T", " ")} · “{h.note}” · unacknowledged = not started</span>
              <button className="btn-primary btn-sm" onClick={() => act.acknowledgeHandoff(h.id)}>Acknowledge pickup</button>
            </div>
          </Callout>
        </div>
      ))}

      <div className="grid gap-4 2xl:grid-cols-2">
        <Card title="Work awaiting review" subtitle="Nothing goes to Creative Head / CRM without your sign-off" padded={false} actions={<Link href="/review" className="text-[12.5px] font-medium text-brand-700">Open queue →</Link>}>
          <Table head={["Deliverable", "Designer", "Version", "Due", ""]}>
            {review.map((d) => (
              <tr key={d.id} className="table-row">
                <td><div className="font-medium">{d.type}</div><div className="text-[11px] text-slate-500">{project(d.projectId)?.name}</div></td>
                <td><span className="flex items-center gap-2"><Avatar employee={byId(d.assigneeId)} size="sm" />{byId(d.assigneeId)?.name}</span></td>
                <td className="font-mono">v{d.version}</td>
                <td>{relDays(d.dueDate)}</td>
                <td><Link href={`/review/${d.id}`} className="btn-primary btn-sm">Review</Link></td>
              </tr>
            ))}
            {review.length === 0 && <tr><td colSpan={5} className="py-6 text-center text-slate-500">Nothing waiting. Go check load balance.</td></tr>}
          </Table>
        </Card>
        <Card title="Unassigned — assign by load" subtitle="For a Branding Package, plan the non-logo set as one coordinated job" padded={false}>
          <Table head={["Deliverable", "Project", "Due", ""]}>
            {unassigned.map((d) => (
              <tr key={d.id} className="table-row">
                <td className="font-medium">{d.type}</td>
                <td className="text-slate-600">{project(d.projectId)?.name}</td>
                <td>{relDays(d.dueDate)}</td>
                <td><button className="btn-primary btn-sm" onClick={() => setAssign(d.id)}>Assign</button></td>
              </tr>
            ))}
            {unassigned.length === 0 && <tr><td colSpan={4} className="py-6 text-center text-slate-500">Everything is assigned.</td></tr>}
          </Table>
        </Card>
      </div>

      <Card title="Designer load" subtitle="Benchmark 1 per day · don't let one queue grow while another sits idle" padded={false} className="mt-4">
        <Table head={["Designer", "Active", "Current work", "Load"]}>
          {members.map((e) => { const l = loadFor(db, e.id); const mine = ds.filter((d) => d.assigneeId === e.id); return (
            <tr key={e.id} className="table-row">
              <td><span className="flex items-center gap-2"><Avatar employee={e} size="sm" />{e.name}</span></td>
              <td className="font-mono">{l.active}</td>
              <td className="space-x-1">{mine.slice(0, 3).map((d) => <Pill key={d.id} tone={stageTone(d.stage)}>{d.type} · {d.stage}</Pill>)}</td>
              <td><div className="flex items-center gap-2"><Progress value={l.pct} tone={l.pct >= 100 ? "red" : l.pct >= 70 ? "amber" : "green"} className="w-20" /><span className="text-[11px] text-slate-500">{l.status}</span></div></td>
            </tr>); })}
        </Table>
      </Card>
    </>
  );
}
