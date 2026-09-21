"use client";

import { useState } from "react";
import { PageHeader, Card, Pill, Table, Kpi, KpiGrid, Progress, Callout, Chips } from "@/components/ui/primitives";
import { Avatar } from "@/components/ui/avatar";
import { employees, teamNames } from "@/data/people";
import { deliverables, projectById } from "@/data/projects";
import { useMe } from "@/lib/role-context";
import { loadFor, assignedTo, stageTone } from "@/lib/selectors";
import { relDays } from "@/lib/format";
import type { TeamId } from "@/lib/types";

const CAPACITY: { team: TeamId; label: string; people: number; perDay: string; monthly: string; used: number; cap: number }[] = [
  { team: "rnd", label: "R&D", people: 1, perDay: "2 briefs", monthly: "~42", used: 16, cap: 24 },
  { team: "sketch", label: "Sketch", people: 1, perDay: "1 concept set", monthly: "24", used: 19, cap: 24 },
  { team: "logo", label: "Logo Team", people: 3, perDay: "1 logo each", monthly: "21 + TL 4", used: 15, cap: 25 },
  { team: "packaging", label: "Packaging Team", people: 3, perDay: "1 design each", monthly: "84 days", used: 58, cap: 84 },
];

export default function TeamPage() {
  const { me } = useMe();
  const [team, setTeam] = useState<string>(me.role === "team-leader" ? me.team : "all");
  const people = employees.filter((e) => ["designer", "rnd", "sketch"].includes(e.role) && (team === "all" || e.team === team));
  const unassigned = deliverables.filter((d) => d.stage === "Awaiting assignment" && (team === "all" || d.team === team));
  const overloaded = people.filter((e) => loadFor(e.id).pct >= 100);

  return (
    <>
      <PageHeader title={me.role === "team-leader" ? "My team" : "Team & workload"} subtitle="Assign based on current load, not convenience or habit. Nobody silently overloaded or idle." />
      <KpiGrid cols={4}>
        <Kpi label="Production staff" value={people.length} />
        <Kpi label="Overloaded" value={overloaded.length} hint="Rebalance now" tone="red" />
        <Kpi label="Available" value={people.filter((e) => loadFor(e.id).pct < 30).length} hint="Can take new work" tone="green" />
        <Kpi label="Unassigned work" value={unassigned.length} hint="Waiting for a TL" tone="amber" />
      </KpiGrid>

      {me.role !== "team-leader" && (
        <Card title="Capacity plan — September" subtitle="Given today's team, how many projects can realistically start this week?" className="mb-4" padded={false}>
          <Table head={["Function", "Headcount", "Benchmark / day", "Monthly capacity", "Used", "Headroom"]}>
            {CAPACITY.map((c) => (
              <tr key={c.team} className="table-row">
                <td className="font-medium">{c.label}</td><td className="font-mono">{c.people}</td><td>{c.perDay}</td><td>{c.monthly}</td>
                <td><div className="flex items-center gap-2"><Progress value={(c.used / c.cap) * 100} tone={c.used / c.cap > 0.9 ? "red" : c.used / c.cap > 0.7 ? "amber" : "green"} className="w-28" /><span className="font-mono text-[11px]">{c.used}/{c.cap}</span></div></td>
                <td className="font-mono">{c.cap - c.used}</td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      <div className="mb-3">
        <Chips items={[{ key: "all", label: "All" }, { key: "logo", label: "Logo" }, { key: "packaging", label: "Packaging" }, { key: "rnd", label: "R&D" }, { key: "sketch", label: "Sketch" }]} active={team} onChange={setTeam} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2" padded={false} title="Workload by person">
          <Table head={["Person", "Team", "Active", "Load", "Current work", ""]}>
            {people.map((e) => {
              const l = loadFor(e.id);
              const mine = assignedTo(e.id);
              return (
                <tr key={e.id} className="table-row">
                  <td><span className="flex items-center gap-2"><Avatar employee={e} size="sm" /><span><div className="font-medium">{e.name}</div><div className="text-[11px] text-slate-500">{e.title}</div></span></span></td>
                  <td className="text-slate-500">{teamNames[e.team]}</td>
                  <td className="font-mono">{e.role === "designer" ? l.active : e.role === "rnd" ? 2 : 1}</td>
                  <td><div className="flex items-center gap-2"><Progress value={e.role === "designer" ? l.pct : 80} tone={l.pct >= 100 ? "red" : l.pct >= 70 ? "amber" : "green"} className="w-20" /><span className="text-[11px] text-slate-500">{e.role === "designer" ? l.status : "Bottleneck"}</span></div></td>
                  <td className="space-x-1">{mine.slice(0, 2).map((d) => <Pill key={d.id} tone={stageTone(d.stage)}>{d.type}</Pill>)}{mine.length > 2 && <span className="text-[11px] text-slate-400">+{mine.length - 2}</span>}</td>
                  <td>{l.pct >= 100 && <button className="btn-secondary btn-sm">Rebalance</button>}</td>
                </tr>
              );
            })}
          </Table>
        </Card>
        <div className="space-y-4">
          <Card title="Unassigned deliverables" padded={false}>
            <ul className="divide-y divide-slate-100">
              {unassigned.map((d) => (
                <li key={d.id} className="flex items-center gap-2 px-4 py-2.5 text-[12.5px]">
                  <div className="flex-1"><div className="font-medium">{d.type}</div><div className="text-[11px] text-slate-500">{projectById(d.projectId)?.name} · {relDays(d.dueDate)}</div></div>
                  <select className="input h-8 w-32 text-[12px]" defaultValue="" aria-label="Assign to">
                    <option value="" disabled>Assign to…</option>
                    {employees.filter((e) => e.role === "designer" && e.team === d.team).map((e) => <option key={e.id}>{e.name} ({loadFor(e.id).status})</option>)}
                  </select>
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
