"use client";

import Link from "next/link";
import { PageHeader, Kpi, KpiGrid, Card, Pill, Table, Callout } from "@/components/ui/primitives";
import { useDb } from "@/lib/use-db";
import { slaState, outstanding, overduePayments, openFeedback } from "@/lib/selectors";
import { inr, relDays } from "@/lib/format";

export function CrmDashboard() {
  const { db, act } = useDb();
  const states = db.threads.map((t) => ({ t, s: slaState(t) }));
  const breached = states.filter((x) => x.s.state === "Breached" || x.s.state === "Stalled 3+ days");
  const readyForClient = db.deliverables.filter((d) => d.stage === "Ready for client");
  const withClient = db.deliverables.filter((d) => d.stage === "With client");
  const discovery = db.projects.filter((p) => db.deliverables.some((d) => d.projectId === p.id && d.stage === "Discovery") && !p.brief);
  const client = (id: string) => db.clients.find((c) => c.id === id)?.name;

  return (
    <>
      <PageHeader title="Good morning, Arun" subtitle="You are the single bridge between the client and the production team." badge={<Pill tone={breached.length ? "red" : "green"}>{breached.length ? `${breached.length} SLA issues` : "SLAs met"}</Pill>} />
      <KpiGrid>
        <Kpi label="Threads over SLA" value={breached.length} hint="4h project · 1 day enquiry" tone="red" href="/follow-ups" />
        <Kpi label="To submit today" value={readyForClient.length} hint="Ready from production" tone="violet" href="/approvals" />
        <Kpi label="Waiting on client" value={withClient.length} hint="Approval pending" tone="amber" href="/approvals" />
        <Kpi label="Feedback to route" value={openFeedback(db).filter((f) => f.status === "Logged").length} hint="Classify before assigning" tone="brand" href="/approvals" />
        <Kpi label="Collections due" value={inr(outstanding(db).reduce((s, p) => s + p.amount, 0), true)} hint={`${overduePayments(db).length} overdue`} tone="amber" href="/payments" />
        <Kpi label="Discovery calls" value={discovery.length} hint="Projects waiting for a brief" tone="slate" href="/discovery" />
      </KpiGrid>

      <Callout tone="brand" title="The rule everyone else follows because of you">Designers, R&D and the Sketch Artist do not talk to clients directly. If it isn&apos;t logged here, it&apos;s treated as if it never happened — for scope, deadlines and approvals alike.</Callout>

      <div className="mt-4 grid gap-4 2xl:grid-cols-2">
        <Card title="Open client threads" subtitle="Respond within SLA, then log it" padded={false} actions={<Link href="/follow-ups" className="text-[12.5px] font-medium text-brand-700">All →</Link>}>
          <Table head={["Client", "Subject", "Waiting", "SLA", ""]}>
            {states.filter((x) => x.s.state !== "Answered").sort((a, b) => b.s.hours - a.s.hours).map(({ t, s }) => (
              <tr key={t.id} className="table-row">
                <td><Link href={`/clients/${t.clientId}`} className="font-medium hover:text-brand-700">{client(t.clientId)}</Link><div className="text-[11px] text-slate-500">{t.channel}</div></td>
                <td className="text-slate-600">{t.subject}</td>
                <td className="font-mono">{s.hours}h</td>
                <td><Pill tone={s.state === "Within SLA" ? "green" : "red"}>{s.state}</Pill></td>
                <td><button className="btn-primary btn-sm" onClick={() => act.replyThread(t.id)}>Reply & log</button></td>
              </tr>
            ))}
            {states.every((x) => x.s.state === "Answered") && <tr><td colSpan={5} className="py-6 text-center text-slate-500">All threads answered.</td></tr>}
          </Table>
        </Card>
        <Card title="Complaints (first responder)" subtitle="Refund, contract or reputation → Founder first" padded={false} actions={<Link href="/complaints" className="text-[12.5px] font-medium text-brand-700">All →</Link>}>
          <Table head={["Client", "Category", "Summary", "Status"]}>
            {db.complaints.map((c) => (
              <tr key={c.id} className="table-row">
                <td className="font-medium">{client(c.clientId)}</td>
                <td><Pill tone={c.escalated ? "red" : "amber"}>{c.category}</Pill></td>
                <td className="max-w-[260px] text-slate-600">{c.summary}</td>
                <td><Pill tone={c.status === "Resolved" ? "green" : "slate"}>{c.status}</Pill></td>
              </tr>
            ))}
          </Table>
        </Card>
      </div>

      <Card title="Approvals & submissions in flight" className="mt-4" padded={false} actions={<Link href="/approvals" className="text-[12.5px] font-medium text-brand-700">Open approvals →</Link>}>
        <Table head={["Deliverable", "Project", "Stage", "Version", "Rounds used", "Due"]}>
          {[...readyForClient, ...withClient, ...db.deliverables.filter((d) => ["Feedback received", "Scope change pending"].includes(d.stage))].map((d) => {
            const p = db.projects.find((x) => x.id === d.projectId)!;
            return (
              <tr key={d.id} className="table-row">
                <td className="font-medium">{d.type}</td>
                <td><Link href={`/projects/${p.id}`} className="hover:text-brand-700">{p.name}</Link></td>
                <td><Pill tone={d.stage === "Scope change pending" ? "red" : d.stage === "With client" ? "amber" : d.stage === "Feedback received" ? "brand" : "violet"}>{d.stage}</Pill></td>
                <td className="font-mono">v{d.version}</td>
                <td className="font-mono">{d.revisionCount}</td>
                <td>{relDays(d.dueDate)}</td>
              </tr>
            );
          })}
        </Table>
      </Card>
    </>
  );
}
