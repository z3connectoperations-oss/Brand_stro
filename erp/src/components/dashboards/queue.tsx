"use client";

import Link from "next/link";
import { PageHeader, Kpi, KpiGrid, Card, Pill, Table, Callout, PriorityPill } from "@/components/ui/primitives";
import type { Employee } from "@/lib/types";
import { byId } from "@/data/people";
import { useDb } from "@/lib/use-db";
import { projectStage, pendingHandoffs } from "@/lib/selectors";
import { relDays } from "@/lib/format";

/** Shared dashboard for the two single-person bottleneck roles: R&D and the Sketch Artist. */
export function QueueDashboard({ me }: { me: Employee }) {
  const { db, act } = useDb();
  const isRnd = me.role === "rnd";
  const queueStages = isRnd ? ["R&D queue", "R&D in progress"] : ["Sketch queue", "Sketching"];
  const queue = db.projects
    .map((p) => ({ p, st: projectStage(db, p) }))
    .filter(({ st }) => queueStages.includes(st))
    .sort((a, b) => a.p.priority.localeCompare(b.p.priority) || (a.p.paymentConfirmedOn ?? "").localeCompare(b.p.paymentConfirmedOn ?? ""));
  const p1 = queue.filter(({ p }) => p.priority === "P1").length;
  const myHandoffs = pendingHandoffs(db, me.id);
  const sentByMe = db.handoffs.filter((h) => h.fromId === me.id && !h.acknowledgedAt);
  const benchmark = isRnd ? "2 briefs / day" : "1 concept set / day";
  const monthDone = isRnd ? 16 : 19;

  return (
    <>
      <PageHeader
        title={isRnd ? "Research queue" : "Sketch queue"}
        subtitle={isRnd ? "Every project starts with you. Work the queue in priority order; flag overload early." : "3–5 distinct directions per logo — not variations of one idea."}
        badge={<Pill tone="amber">Bottleneck role · protect your time</Pill>}
      />
      <KpiGrid cols={5}>
        <Kpi label="In my queue" value={queue.length} hint={`Benchmark ${benchmark}`} />
        <Kpi label="P1 urgent" value={p1} hint="Only one P1 at a time" tone={p1 > 1 ? "red" : "slate"} />
        <Kpi label="Delivered this month" value={`${monthDone}/24`} hint={isRnd ? "Baseline 18 · target 24" : "Full capacity 24"} tone="green" href="/incentives" />
        <Kpi label="Handoffs to acknowledge" value={myHandoffs.length} hint="Treated as not started until you do" tone="amber" />
        <Kpi label="My handoffs unacknowledged" value={sentByMe.length} hint="Confirm the next owner picked it up" tone="slate" />
      </KpiGrid>

      {myHandoffs.map((h) => (
        <div key={h.id} className="mb-3">
          <Callout tone="amber" title={`Handoff from ${byId(h.fromId)?.name} — ${db.projects.find((p) => p.id === h.projectId)?.name}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span>Sent {h.sentAt.replace("T", " ")} · “{h.note}”</span>
              <button className="btn-primary btn-sm" onClick={() => act.acknowledgeHandoff(h.id)}>Acknowledge pickup</button>
            </div>
          </Callout>
        </div>
      ))}
      {p1 > 1 && <div className="mb-3"><Callout tone="red" title="Two P1 projects active">Only one P1 may be active at a time. Ask the Creative Head which one holds.</Callout></div>}

      <Callout tone="brand" title="Priority rules"><b>P1</b> Founder / Creative Head approved, jumps the queue, only one active at a time · <b>P2</b> paid projects in the order payment was confirmed (FIFO) · <b>P3</b> work-ahead only when no P1/P2 is ready.</Callout>

      <Card title="Today's queue" className="mt-4" padded={false}>
        <Table head={["#", "Priority", "Project", "Client", "Product", "Paid on", "Status", "Deadline", ""]}>
          {queue.map(({ p, st }, i) => (
            <tr key={p.id} className="table-row">
              <td className="font-mono text-slate-400">{i + 1}</td>
              <td><PriorityPill p={p.priority} /></td>
              <td className="font-medium">{p.name}</td>
              <td>{db.clients.find((c) => c.id === p.clientId)?.name}</td>
              <td className="capitalize text-slate-600">{p.product}</td>
              <td className="font-mono">{p.paymentConfirmedOn ?? "—"}</td>
              <td><Pill tone={st.endsWith("queue") ? "slate" : "brand"}>{st}</Pill></td>
              <td>{relDays(p.clientDeadline)}</td>
              <td>
                {isRnd && st === "R&D queue" ? <button className="btn-secondary btn-sm" onClick={() => act.startResearch(p.id)}>Start</button> : <Link href={`/queue/${p.id}`} className="btn-primary btn-sm">{isRnd ? "Open brief" : "Open concepts"}</Link>}
              </td>
            </tr>
          ))}
          {queue.length === 0 && <tr><td colSpan={9} className="py-6 text-center text-slate-500">Queue empty — pick up a P3 work-ahead project.</td></tr>}
        </Table>
      </Card>

      {sentByMe.length > 0 && (
        <Card title="Waiting for the next owner to acknowledge" className="mt-4" padded={false}>
          <Table head={["Project", "To", "Sent", "Note"]}>
            {sentByMe.map((h) => (
              <tr key={h.id} className="table-row"><td className="font-medium">{db.projects.find((p) => p.id === h.projectId)?.name}</td><td>{byId(h.toId)?.name}</td><td className="font-mono">{h.sentAt.replace("T", " ")}</td><td className="text-slate-600">{h.note}</td></tr>
            ))}
          </Table>
        </Card>
      )}
    </>
  );
}
