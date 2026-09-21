"use client";

import Link from "next/link";
import { PageHeader, Kpi, KpiGrid, Card, Pill, Progress, Table } from "@/components/ui/primitives";
import { Avatar } from "@/components/ui/avatar";
import { employees, teamNames } from "@/data/people";
import { useDb } from "@/lib/use-db";
import { computeAlerts, computeReport } from "@/lib/rules";
import { activeProjects, overdueProjects, loadFor, teamMembers, stageTone, stageIdx } from "@/lib/selectors";

export function CreativeHeadDashboard() {
  const { db } = useDb();
  const report = computeReport(db);
  const inReview = db.deliverables.filter((d) => d.stage === "TL review").length;
  const inRevision = db.deliverables.filter((d) => d.stage === "In correction").length;
  const unassigned = db.deliverables.filter((d) => d.stage === "Awaiting assignment").length;
  const escalations = computeAlerts(db).filter((a) => a.owner === "creative-head");
  const versioned = db.deliverables.filter((d) => d.version > 0);
  const firstPass = versioned.length ? Math.round((versioned.filter((d) => d.internalReworkCount === 0).length / versioned.length) * 100) : 0;
  const deadlineRisk = db.deliverables.filter((d) => stageIdx(d.stage) < stageIdx("Client approved") && d.dueDate <= "2026-09-23");
  const rc = report.designMiss + report.pref || 1;

  return (
    <>
      <PageHeader title="Creative department" subtitle="One number per team, every week — and the handoffs between them." badge={<Pill tone="brand">Week 39</Pill>} />
      <KpiGrid>
        <Kpi label="Active projects" value={activeProjects(db).length} hint="In studio" href="/projects" />
        <Kpi label="Overdue" value={overdueProjects(db).length} hint="Client-facing" tone="red" href="/projects" />
        <Kpi label="In TL review" value={inReview} hint="Awaiting first-level QC" tone="violet" href="/review" />
        <Kpi label="In correction" value={inRevision} hint="Client revision rounds" tone="amber" href="/revisions" />
        <Kpi label="Unassigned" value={unassigned} hint="Waiting for a TL to assign" tone="slate" href="/team" />
        <Kpi label="First-review pass" value={`${firstPass}%`} hint="Approved without rework" tone="green" href="/reports" />
      </KpiGrid>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card title="Escalations to you" subtitle="Level 2 — cross-team or repeated, computed from the rules" padded={false} className="xl:col-span-2">
          <ul className="divide-y divide-slate-100">
            {escalations.map((a) => (
              <li key={a.id} className="flex items-start gap-3 px-4 py-3">
                <Pill tone={a.severity === "critical" ? "red" : a.severity === "warning" ? "amber" : "slate"}>{a.kind}</Pill>
                <div className="flex-1"><div className="text-[13px] font-medium">{a.text}</div><div className="text-[12px] text-slate-500">{a.detail}</div></div>
                <Link href={a.href} className="btn-secondary btn-sm">Open</Link>
              </li>
            ))}
            {escalations.length === 0 && <li className="px-4 py-6 text-center text-slate-500">Nothing escalated.</li>}
          </ul>
        </Card>
        <Card title="Revision root causes" subtitle="Fix the thinking vs. fix the brief-gathering">
          <div className="space-y-3">
            <div><div className="mb-1 flex justify-between text-[12.5px]"><span>Genuine design miss</span><span className="font-mono">{report.designMiss}</span></div><Progress value={(report.designMiss / rc) * 100} tone="red" /></div>
            <div><div className="mb-1 flex justify-between text-[12.5px]"><span>Subjective client preference</span><span className="font-mono">{report.pref}</span></div><Progress value={(report.pref / rc) * 100} tone="amber" /></div>
            <p className="text-[12px] text-slate-500">Preference-driven rounds point at discovery quality, not the design team. Raise in the weekly CRM sync.</p>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 2xl:grid-cols-2">
        <Card title="Team capacity" subtitle="Benchmark: 1 deliverable per designer per day" padded={false}>
          <Table head={["Team", "Designer", "Active", "Load"]}>
            {(["logo", "packaging"] as const).flatMap((t) => teamMembers(t).map((e) => { const l = loadFor(db, e.id); return (
              <tr key={e.id} className="table-row">
                <td className="text-slate-500">{teamNames[t]}</td>
                <td><span className="flex items-center gap-2"><Avatar employee={e} size="sm" />{e.name}</span></td>
                <td className="font-mono">{l.active}</td>
                <td><div className="flex items-center gap-2"><Progress value={l.pct} tone={l.pct >= 100 ? "red" : l.pct >= 70 ? "amber" : "green"} className="w-24" /><span className="text-[11px] text-slate-500">{l.status}</span></div></td>
              </tr>); }))}
            {["E05", "E06"].map((id) => { const e = employees.find((x) => x.id === id)!; return (
              <tr key={id} className="table-row">
                <td className="text-slate-500">{teamNames[e.team]}</td>
                <td><span className="flex items-center gap-2"><Avatar employee={e} size="sm" />{e.name}</span></td>
                <td className="font-mono">{db.projects.filter((p) => db.deliverables.some((d) => d.projectId === p.id && (id === "E05" ? ["R&D queue", "R&D in progress"] : ["Sketch queue", "Sketching"]).includes(d.stage))).length}</td>
                <td><span className="text-[11px] text-slate-500">Bottleneck role — 1 person</span></td>
              </tr>); })}
          </Table>
        </Card>
        <Card title="Deadline risk (next 48h)" subtitle="Deliverables not yet approved by the client" padded={false}>
          <Table head={["Deliverable", "Project", "Stage", "Due"]}>
            {deadlineRisk.map((d) => (
              <tr key={d.id} className="table-row">
                <td className="font-medium">{d.type}</td>
                <td><Link href={`/projects/${d.projectId}`} className="hover:text-brand-700">{db.projects.find((p) => p.id === d.projectId)?.name}</Link></td>
                <td><Pill tone={stageTone(d.stage)}>{d.stage}</Pill></td>
                <td className="tnum">{d.dueDate}</td>
              </tr>
            ))}
          </Table>
        </Card>
      </div>
    </>
  );
}
