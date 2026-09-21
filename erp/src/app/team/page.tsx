"use client";

import { useState } from "react";
import { PageHeader, Card, Pill, Table, Kpi, KpiGrid, Progress, Callout, Chips } from "@/components/ui/primitives";
import { Avatar } from "@/components/ui/avatar";
import { AssignWorkModal } from "@/components/forms/assign-work";
import { employees, teamNames } from "@/data/people";
import { useMe } from "@/lib/role-context";
import { useDb } from "@/lib/use-db";
import { loadFor, assignedTo, stageTone, projectStage } from "@/lib/selectors";
import { computeReport } from "@/lib/rules";
import { relDays } from "@/lib/format";

export default function TeamPage() {
  const { me } = useMe();
  const { db } = useDb();
  const [team, setTeam] = useState<string>(me.role === "team-leader" ? me.team : "all");
  const [assign, setAssign] = useState<string | null>(null);
  const people = employees.filter((e) => ["designer", "rnd", "sketch"].includes(e.role) && (team === "all" || e.team === team));
  const unassigned = db.deliverables.filter((d) => d.stage === "Awaiting assignment" && (team === "all" || d.team === team));
  const overloaded = people.filter((e) => e.role === "designer" && loadFor(db, e.id).pct >= 100);
  const canAssign = me.role === "team-leader" || me.role === "creative-head";
  const report = computeReport(db);
  const rndQueue = db.projects.filter((p) => ["R&D queue", "R&D in progress"].includes(projectStage(db, p))).length;
  const sketchQueue = db.projects.filter((p) => ["Sketch queue", "Sketching"].includes(projectStage(db, p))).length;
  const capacity = [
    { label: "R&D", people: 1, perDay: "2 briefs", monthly: "~42", used: 16, cap: 24, queue: rndQueue },
    { label: "Sketch", people: 1, perDay: "1 concept set", monthly: "24", used: report.soldBy.logo + report.soldBy.branding, cap: 24, queue: sketchQueue },
    { label: "Logo Team", people: 3, perDay: "1 logo each", monthly: "21 + TL 4", used: db.deliverables.filter((d) => d.team === "logo" && d.version > 0).length, cap: 25, queue: db.deliverables.filter((d) => d.team === "logo" && d.stage === "Awaiting assignment").length },
    { label: "Packaging Team", people: 3, perDay: "1 design each", monthly: "84 days", used: 58, cap: 84, queue: db.deliverables.filter((d) => d.team === "packaging" && d.stage === "Awaiting assignment").length },
  ];

  return (
    <>
      <PageHeader title={me.role === "team-leader" ? "My team" : "Team & workload"} subtitle="Assign based on current load, not convenience or habit. Nobody silently overloaded or idle." />
      {assign && <AssignWorkModal open onClose={() => setAssign(null)} deliverableId={assign} />}
      <KpiGrid cols={4}>
        <Kpi label="Production staff" value={people.length} />
        <Kpi label="Overloaded" value={overloaded.length} hint="Rebalance now" tone="red" />
        <Kpi label="Available" value={people.filter((e) => e.role === "designer" && loadFor(db, e.id).pct < 30).length} hint="Can take new work" tone="green" />
        <Kpi label="Unassigned work" value={unassigned.length} hint="Waiting for a TL" tone="amber" />
      </KpiGrid>

      {me.role !== "team-leader" && (
        <Card title="Capacity plan — September" subtitle="Given today's team, how many projects can realistically start this week?" className="mb-4" padded={false}>
          <Table head={["Function", "Headcount", "Benchmark / day", "Monthly capacity", "Used", "Waiting in queue", "Headroom"]}>
            {capacity.map((c) => (
              <tr key={c.label} className="table-row">
                <td className="font-medium">{c.label}</td><td className="font-mono">{c.people}</td><td>{c.perDay}</td><td>{c.monthly}</td>
                <td><div className="flex items-center gap-2"><Progress value={(c.used / c.cap) * 100} tone={c.used / c.cap > 0.9 ? "red" : c.used / c.cap > 0.7 ? "amber" : "green"} className="w-28" /><span className="font-mono text-[11px]">{c.used}/{c.cap}</span></div></td>
                <td className="font-mono">{c.queue}</td><td className="font-mono">{c.cap - c.used}</td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      <div className="mb-3"><Chips items={[{ key: "all", label: "All" }, { key: "logo", label: "Logo" }, { key: "packaging", label: "Packaging" }, { key: "rnd", label: "R&D" }, { key: "sketch", label: "Sketch" }]} active={team} onChange={setTeam} /></div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2" padded={false} title="Workload by person">
          <Table head={["Person", "Team", "Active", "Load", "Current work"]}>
            {people.map((e) => { const l = loadFor(db, e.id); const mine = assignedTo(db, e.id); const bottleneck = e.role !== "designer"; const q = e.role === "rnd" ? rndQueue : sketchQueue; return (
              <tr key={e.id} className="table-row">
                <td><span className="flex items-center gap-2"><Avatar employee={e} size="sm" /><span><div className="font-medium">{e.name}</div><div className="text-[11px] text-slate-500">{e.title}</div></span></span></td>
                <td className="text-slate-500">{teamNames[e.team]}</td>
                <td className="font-mono">{bottleneck ? q : l.active}</td>
                <td><div className="flex items-center gap-2"><Progress value={bottleneck ? Math.min(100, q * 34) : l.pct} tone={(bottleneck ? q >= 3 : l.pct >= 100) ? "red" : (bottleneck ? q >= 2 : l.pct >= 70) ? "amber" : "green"} className="w-20" /><span className="text-[11px] text-slate-500">{bottleneck ? "Bottleneck" : l.status}</span></div></td>
                <td className="space-x-1">{mine.slice(0, 2).map((d) => <Pill key={d.id} tone={stageTone(d.stage)}>{d.type}</Pill>)}{mine.length > 2 && <span className="text-[11px] text-slate-400">+{mine.length - 2}</span>}</td>
              </tr>); })}
          </Table>
        </Card>
        <div className="space-y-4">
          <Card title="Unassigned deliverables" padded={false}>
            <ul className="divide-y divide-slate-100">
              {unassigned.map((d) => (
                <li key={d.id} className="flex items-center gap-2 px-4 py-2.5 text-[12.5px]">
                  <div className="flex-1"><div className="font-medium">{d.type}</div><div className="text-[11px] text-slate-500">{db.projects.find((p) => p.id === d.projectId)?.name} · {relDays(d.dueDate)}</div></div>
                  {canAssign ? <button className="btn-primary btn-sm" onClick={() => setAssign(d.id)}>Assign</button> : <Pill tone="amber">{teamNames[d.team]}</Pill>}
                </li>
              ))}
              {unassigned.length === 0 && <li className="px-4 py-6 text-center text-slate-500">All assigned.</li>}
            </ul>
          </Card>
          {overloaded.length > 0 && <Callout tone="red" title="Rebalance suggested">{overloaded.map((e) => e.name).join(", ")} above benchmark. Whole team overloaded → escalate to Creative Head.</Callout>}
        </div>
      </div>
    </>
  );
}
