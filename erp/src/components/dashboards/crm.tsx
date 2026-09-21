import Link from "next/link";
import { PageHeader, Kpi, KpiGrid, Card, Pill, Table, Callout } from "@/components/ui/primitives";
import { threads, deliverables, complaints, projectById } from "@/data/projects";
import { clientById, clients } from "@/data/clients";
import { slaState, outstanding, overduePayments, openFeedback } from "@/lib/selectors";
import { inr, relDays } from "@/lib/format";

export function CrmDashboard() {
  const states = threads.map((t) => ({ t, s: slaState(t) }));
  const breached = states.filter((x) => x.s.state === "Breached" || x.s.state === "Stalled 3+ days");
  const readyForClient = deliverables.filter((d) => d.stage === "Ready for client");
  const withClient = deliverables.filter((d) => d.stage === "With client");
  const onboardingOpen = clients.filter((c) => c.onboarding.some((s) => !s.done));

  return (
    <>
      <PageHeader title="Good morning, Arun" subtitle="You are the single bridge between the client and the production team." badge={<Pill tone={breached.length ? "red" : "green"}>{breached.length ? `${breached.length} SLA issues` : "SLAs met"}</Pill>} />
      <KpiGrid>
        <Kpi label="Threads over SLA" value={breached.length} hint="4h project · 1 day enquiry" tone="red" href="/follow-ups" />
        <Kpi label="To submit today" value={readyForClient.length} hint="Ready from production" tone="violet" href="/approvals" />
        <Kpi label="Waiting on client" value={withClient.length} hint="Approval pending" tone="amber" href="/approvals" />
        <Kpi label="Feedback to route" value={openFeedback().length} hint="Classify before assigning" tone="brand" href="/approvals" />
        <Kpi label="Collections due" value={inr(outstanding().reduce((s, p) => s + p.amount, 0), true)} hint={`${overduePayments().length} overdue`} tone="amber" href="/payments" />
        <Kpi label="Onboarding open" value={onboardingOpen.length} hint="Checklist incomplete" tone="slate" href="/clients" />
      </KpiGrid>

      <Callout tone="brand" title="The rule everyone else follows because of you">
        Designers, R&D and the Sketch Artist do not talk to clients directly. If it isn&apos;t logged here, it&apos;s treated as if it never happened — for scope, deadlines and approvals alike.
      </Callout>

      <div className="mt-4 grid gap-4 2xl:grid-cols-2">
        <Card title="Open client threads" subtitle="Respond within SLA, then log it" padded={false} actions={<Link href="/follow-ups" className="text-[12.5px] font-medium text-brand-700">All →</Link>}>
          <Table head={["Client", "Subject", "Channel", "Waiting", "SLA"]}>
            {states
              .filter((x) => x.s.state !== "Answered")
              .sort((a, b) => b.s.hours - a.s.hours)
              .map(({ t, s }) => (
                <tr key={t.id} className="table-row">
                  <td><Link href={`/clients/${t.clientId}`} className="font-medium hover:text-brand-700">{clientById(t.clientId).name}</Link></td>
                  <td className="text-slate-600">{t.subject}</td>
                  <td className="text-slate-500">{t.channel}</td>
                  <td className="font-mono">{s.hours}h</td>
                  <td><Pill tone={s.state === "Within SLA" ? "green" : "red"}>{s.state}</Pill></td>
                </tr>
              ))}
          </Table>
        </Card>
        <Card title="Complaints (first responder)" subtitle="Refund, contract or reputation → Founder first" padded={false} actions={<Link href="/complaints" className="text-[12.5px] font-medium text-brand-700">All →</Link>}>
          <Table head={["Client", "Category", "Summary", "Status"]}>
            {complaints.map((c) => (
              <tr key={c.id} className="table-row">
                <td className="font-medium">{clientById(c.clientId).name}</td>
                <td><Pill tone={c.escalated ? "red" : "amber"}>{c.category}</Pill></td>
                <td className="max-w-[260px] text-slate-600">{c.summary}</td>
                <td><Pill tone={c.status === "Resolved" ? "green" : "slate"}>{c.status}</Pill></td>
              </tr>
            ))}
          </Table>
        </Card>
      </div>

      <Card title="Approvals & submissions in flight" className="mt-4" padded={false}>
        <Table head={["Deliverable", "Project", "Stage", "Version", "Rounds used", "Due"]}>
          {[...readyForClient, ...withClient, ...deliverables.filter((d) => d.stage === "Scope change pending")].map((d) => {
            const p = projectById(d.projectId)!;
            return (
              <tr key={d.id} className="table-row">
                <td className="font-medium">{d.type}</td>
                <td><Link href={`/projects/${p.id}`} className="hover:text-brand-700">{p.name}</Link></td>
                <td><Pill tone={d.stage === "Scope change pending" ? "red" : d.stage === "With client" ? "amber" : "violet"}>{d.stage}</Pill></td>
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
