import Link from "next/link";
import { PageHeader, Kpi, KpiGrid, Card, Pill, Table, Callout, Progress } from "@/components/ui/primitives";
import type { Employee } from "@/lib/types";
import { projectById, feedback } from "@/data/projects";
import { incentiveLines, lineBonus } from "@/data/ops";
import { assignedTo, stageTone } from "@/lib/selectors";
import { relDays, inr } from "@/lib/format";

export function DesignerDashboard({ me }: { me: Employee }) {
  const mine = assignedTo(me.id);
  const myFeedback = feedback.filter((f) => mine.some((d) => d.id === f.deliverableId) && f.status !== "Approved");
  const lines = incentiveLines.filter((l) => l.employeeId === me.id);
  const bonus = lines.reduce((s, l) => s + lineBonus(l), 0);
  const done = lines.reduce((s, l) => s + l.done, 0);
  const target = lines.reduce((s, l) => s + l.target, 0);
  const naming = me.team === "logo" ? "ClientName_Logo_v2_2026-09-21" : "ClientName_DeliverableType_v2_2026-09-21";

  return (
    <>
      <PageHeader title={`My work — ${me.name}`} subtitle={me.title} badge={<Pill tone="brand">{mine.length} active</Pill>} />
      <KpiGrid cols={5}>
        <Kpi label="My tasks" value={mine.length} hint="Assigned by your TL" href="/tasks" />
        <Kpi label="Due today / overdue" value={mine.filter((d) => relDays(d.dueDate) === "Today" || d.dueDate < "2026-09-21").length} hint="Tell your TL early, not at the deadline" tone="red" href="/tasks" />
        <Kpi label="In TL review" value={mine.filter((d) => d.stage === "TL review").length} hint="Waiting for sign-off" tone="violet" href="/tasks" />
        <Kpi label="Corrections" value={myFeedback.length} hint="Reviewed by CRM, assigned by TL" tone="amber" href="/feedback" />
        <Kpi label="Month progress" value={`${done}/${target}`} hint={`Bonus so far ${inr(bonus)}`} tone="green" href="/incentives" />
      </KpiGrid>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card title="My tasks" padded={false} className="xl:col-span-2" actions={<Link href="/tasks" className="text-[12.5px] font-medium text-brand-700">All →</Link>}>
          <Table head={["Deliverable", "Project", "Stage", "Version", "Due", ""]}>
            {mine.map((d) => (
              <tr key={d.id} className="table-row">
                <td className="font-medium">{d.type}</td>
                <td className="text-slate-600">{projectById(d.projectId)?.name}</td>
                <td><Pill tone={stageTone(d.stage)}>{d.stage}</Pill></td>
                <td className="font-mono">v{d.version}</td>
                <td className={d.dueDate < "2026-09-21" ? "font-semibold text-red-600" : ""}>{relDays(d.dueDate)}</td>
                <td><Link href={`/tasks/${d.id}`} className="btn-secondary btn-sm">Open</Link></td>
              </tr>
            ))}
          </Table>
        </Card>
        <div className="space-y-4">
          <Card title="Self-check before you submit">
            <p className="text-[12.5px] text-slate-600">Catching an issue yourself before your Team Leader does is the fastest way to build trust and speed up your own review turnaround.</p>
            <div className="mt-3 rounded-lg bg-slate-50 p-3">
              <div className="label-sm mb-1">File naming</div>
              <code className="font-mono text-[11.5px] text-slate-800">{naming}</code>
              <p className="mt-1 text-[11.5px] text-slate-500">Never overwrite — increment v1, v2, v3. Only TL-approved finals go to 08_Final Files.</p>
            </div>
          </Card>
          <Card title="My month">
            {lines.map((l) => (
              <div key={l.workType} className="mb-3">
                <div className="mb-1 flex justify-between text-[12.5px]"><span>{l.workType}</span><span className="font-mono">{l.done}/{l.target} · baseline {l.baseline}</span></div>
                <Progress value={(l.done / l.target) * 100} tone={l.done >= l.baseline ? "green" : "amber"} />
              </div>
            ))}
            <Callout tone="green">Beyond baseline, clean work (0–1 revisions) pays the full rate; 2–3 pays half; 4+ pays nothing.</Callout>
          </Card>
        </div>
      </div>
    </>
  );
}
