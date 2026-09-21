import Link from "next/link";
import { PageHeader, Kpi, KpiGrid, Card, Pill, Table, Callout, PriorityPill } from "@/components/ui/primitives";
import type { Employee } from "@/lib/types";
import { projects, deliverables } from "@/data/projects";
import { clientById } from "@/data/clients";
import { projectStage } from "@/lib/selectors";
import { relDays } from "@/lib/format";

/** Shared dashboard for the two single-person bottleneck roles: R&D and the Sketch Artist. */
export function QueueDashboard({ me }: { me: Employee }) {
  const isRnd = me.role === "rnd";
  const queueStages = isRnd ? ["R&D queue", "R&D in progress", "Brief ready"] : ["Sketch queue", "Sketching"];
  const queue = projects
    .filter((p) => queueStages.includes(projectStage(p)))
    .sort((a, b) => a.priority.localeCompare(b.priority) || (a.paymentConfirmedOn ?? "").localeCompare(b.paymentConfirmedOn ?? ""));
  const p1 = queue.filter((p) => p.priority === "P1").length;
  const benchmark = isRnd ? "2 briefs / day" : "1 concept set / day";
  const monthDone = isRnd ? 16 : 19;
  const monthTarget = 24;

  return (
    <>
      <PageHeader
        title={isRnd ? "Research queue" : "Sketch queue"}
        subtitle={isRnd ? "Every project starts with you. Work the queue in priority order; flag overload early." : "3–5 distinct directions per logo — not variations of one idea."}
        badge={<Pill tone="amber">Bottleneck role · protect your time</Pill>}
      />
      <KpiGrid cols={5}>
        <Kpi label="In my queue" value={queue.length} hint={`Benchmark ${benchmark}`} href="/queue" />
        <Kpi label="P1 urgent" value={p1} hint="Only one P1 at a time" tone="red" />
        <Kpi label="Delivered this month" value={`${monthDone}/${monthTarget}`} hint={isRnd ? "Baseline 18 · target 24" : "Full capacity 24"} tone="green" href="/incentives" />
        <Kpi label="Unacknowledged handoffs" value={isRnd ? 1 : 0} hint="Treated as not started" tone="amber" />
        <Kpi label={isRnd ? "Briefs needing rework" : "Sets sent back"} value={isRnd ? 1 : 2} hint="Reviewed weekly" tone="slate" />
      </KpiGrid>

      <Callout tone="brand" title="Priority rules">
        <b>P1</b> Founder / Creative Head approved, jumps the queue, only one active at a time · <b>P2</b> paid projects in the order payment was confirmed (FIFO) · <b>P3</b> work-ahead only when no P1/P2 is ready.
      </Callout>

      <Card title="Today's queue" className="mt-4" padded={false} actions={<Link href="/queue" className="text-[12.5px] font-medium text-brand-700">Open queue →</Link>}>
        <Table head={["#", "Priority", "Project", "Client", "Product", "Paid on", "Deadline", ""]}>
          {queue.map((p, i) => (
            <tr key={p.id} className="table-row">
              <td className="font-mono text-slate-400">{i + 1}</td>
              <td><PriorityPill p={p.priority} /></td>
              <td className="font-medium">{p.name}</td>
              <td>{clientById(p.clientId).name}</td>
              <td className="capitalize text-slate-600">{p.product}</td>
              <td className="font-mono">{p.paymentConfirmedOn ?? "—"}</td>
              <td>{relDays(p.clientDeadline)}</td>
              <td><Link href={`/queue/${p.id}`} className="btn-primary btn-sm">{isRnd ? "Open brief" : "Open concepts"}</Link></td>
            </tr>
          ))}
          {queue.length === 0 && <tr><td colSpan={8} className="py-6 text-center text-slate-500">Queue empty — pick up a P3 work-ahead project.</td></tr>}
        </Table>
      </Card>

      {!isRnd && (
        <Card title="Recently handed off" className="mt-4" padded={false}>
          <Table head={["Project", "Concepts", "Logo Team status", "Rework?"]}>
            {deliverables.filter((d) => d.type === "Logo" && d.version > 0).slice(0, 4).map((d) => (
              <tr key={d.id} className="table-row">
                <td className="font-medium">{projects.find((p) => p.id === d.projectId)?.name}</td>
                <td className="font-mono">4</td>
                <td><Pill tone="brand">{d.stage}</Pill></td>
                <td>{d.internalReworkCount ? <Pill tone="amber">Direction adjusted</Pill> : <Pill tone="green">Clean</Pill>}</td>
              </tr>
            ))}
          </Table>
        </Card>
      )}
    </>
  );
}
