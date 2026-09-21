import Link from "next/link";
import { PageHeader, Kpi, KpiGrid, Card, Pill, Progress, Table } from "@/components/ui/primitives";
import { Avatar } from "@/components/ui/avatar";
import { deliverables, feedback } from "@/data/projects";
import { alerts } from "@/data/ops";
import { employees, teamNames } from "@/data/people";
import { activeProjects, overdueProjects, loadFor, teamMembers, stageTone } from "@/lib/selectors";
import { projectById } from "@/data/projects";

export function CreativeHeadDashboard() {
  const inReview = deliverables.filter((d) => d.stage === "TL review").length;
  const inRevision = deliverables.filter((d) => d.stage === "In correction").length;
  const unassigned = deliverables.filter((d) => d.stage === "Awaiting assignment").length;
  const escalations = alerts.filter((a) => a.owner === "creative-head");
  const firstPass = Math.round((deliverables.filter((d) => d.version > 0 && d.internalReworkCount === 0).length / deliverables.filter((d) => d.version > 0).length) * 100);
  const designMiss = feedback.filter((f) => f.rootCause === "Design miss").length;
  const pref = feedback.filter((f) => f.rootCause === "Client preference").length;
  const deadlineRisk = deliverables.filter((d) => d.stage !== "Closed" && d.stage !== "Client approved" && new Date(d.dueDate) <= new Date("2026-09-23"));

  return (
    <>
      <PageHeader title="Creative department" subtitle="One number per team, every week — and the handoffs between them." badge={<Pill tone="brand">Week 39</Pill>} />
      <KpiGrid>
        <Kpi label="Active projects" value={activeProjects().length} hint="In studio" href="/projects" />
        <Kpi label="Overdue" value={overdueProjects().length} hint="Client-facing" tone="red" href="/projects" />
        <Kpi label="In TL review" value={inReview} hint="Awaiting first-level QC" tone="violet" href="/review" />
        <Kpi label="In correction" value={inRevision} hint="Client revision rounds" tone="amber" href="/board" />
        <Kpi label="Unassigned" value={unassigned} hint="Waiting for a TL to assign" tone="slate" href="/board" />
        <Kpi label="First-review pass" value={`${firstPass}%`} hint="Approved without rework" tone="green" href="/reports" />
      </KpiGrid>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card title="Escalations to you" subtitle="Level 2 — cross-team or repeated" padded={false} className="xl:col-span-2">
          <ul className="divide-y divide-slate-100">
            {escalations.map((a) => (
              <li key={a.id} className="flex items-start gap-3 px-4 py-3">
                <Pill tone={a.severity === "critical" ? "red" : a.severity === "warning" ? "amber" : "slate"}>{a.kind}</Pill>
                <div className="flex-1">
                  <div className="text-[13px] font-medium">{a.text}</div>
                  <div className="text-[12px] text-slate-500">{a.detail}</div>
                </div>
                <Link href={a.href} className="btn-secondary btn-sm">Open</Link>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Revision root causes" subtitle="Fix the thinking vs. fix the brief-gathering">
          <div className="space-y-3">
            <div>
              <div className="mb-1 flex justify-between text-[12.5px]"><span>Genuine design miss</span><span className="font-mono">{designMiss}</span></div>
              <Progress value={(designMiss / (designMiss + pref)) * 100} tone="red" />
            </div>
            <div>
              <div className="mb-1 flex justify-between text-[12.5px]"><span>Subjective client preference</span><span className="font-mono">{pref}</span></div>
              <Progress value={(pref / (designMiss + pref)) * 100} tone="amber" />
            </div>
            <p className="text-[12px] text-slate-500">Preference-driven rounds point at discovery quality, not the design team. Raise in the weekly CRM sync.</p>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 2xl:grid-cols-2">
        <Card title="Team capacity" subtitle="Benchmark: 1 deliverable per designer per day" padded={false}>
          <Table head={["Team", "Designer", "Active", "Load"]}>
            {(["logo", "packaging"] as const).flatMap((t) =>
              teamMembers(t).map((e) => {
                const l = loadFor(e.id);
                return (
                  <tr key={e.id} className="table-row">
                    <td className="text-slate-500">{teamNames[t]}</td>
                    <td><span className="flex items-center gap-2"><Avatar employee={e} size="sm" />{e.name}</span></td>
                    <td className="font-mono">{l.active}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Progress value={l.pct} tone={l.pct >= 100 ? "red" : l.pct >= 70 ? "amber" : "green"} className="w-24" />
                        <span className="text-[11px] text-slate-500">{l.status}</span>
                      </div>
                    </td>
                  </tr>
                );
              }),
            )}
            {["E05", "E06"].map((id) => {
              const e = employees.find((x) => x.id === id)!;
              return (
                <tr key={id} className="table-row">
                  <td className="text-slate-500">{teamNames[e.team]}</td>
                  <td><span className="flex items-center gap-2"><Avatar employee={e} size="sm" />{e.name}</span></td>
                  <td className="font-mono">{id === "E05" ? 2 : 1}</td>
                  <td><span className="text-[11px] text-slate-500">Bottleneck role — 1 person</span></td>
                </tr>
              );
            })}
          </Table>
        </Card>
        <Card title="Deadline risk (next 48h)" subtitle="Deliverables whose stage hasn't advanced" padded={false}>
          <Table head={["Deliverable", "Project", "Stage", "Due"]}>
            {deadlineRisk.map((d) => (
              <tr key={d.id} className="table-row">
                <td className="font-medium">{d.type}</td>
                <td><Link href={`/projects/${d.projectId}`} className="hover:text-brand-700">{projectById(d.projectId)?.name}</Link></td>
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
