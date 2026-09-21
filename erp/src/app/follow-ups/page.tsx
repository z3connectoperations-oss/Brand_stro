"use client";

import Link from "next/link";
import { PageHeader, Card, Pill, Table, Kpi, KpiGrid, Callout } from "@/components/ui/primitives";
import { useDb } from "@/lib/use-db";
import { slaState } from "@/lib/selectors";

const SLA = [["WhatsApp — active client project", "Within 4 business hours"], ["WhatsApp — general enquiry", "Within 1 business day"], ["Email", "Within 1 business day"], ["Submission acknowledgement", "Same business day as receipt from production"]];

export default function FollowUpsPage() {
  const { db, act } = useDb();
  const rows = db.threads.map((t) => ({ t, s: slaState(t) })).sort((a, b) => b.s.hours - a.s.hours);
  const breached = rows.filter((r) => r.s.state === "Breached").length;
  const stalled = rows.filter((r) => r.s.state === "Stalled 3+ days").length;
  const answered = rows.filter((r) => r.s.state === "Answered" || r.s.state === "Within SLA").length;
  const adherence = rows.length ? Math.round((answered / rows.length) * 100) : 100;

  return (
    <>
      <PageHeader title="Follow-ups & SLAs" subtitle="Know these cold. Every reply is also logged — the sheet is the record, WhatsApp is just the channel." />
      <KpiGrid cols={4}>
        <Kpi label="Open threads" value={rows.filter((r) => r.s.state !== "Answered").length} />
        <Kpi label="Over SLA" value={breached} tone="red" />
        <Kpi label="Stalled 3+ days" value={stalled} hint="Send an update, flag to Creative Head" tone="amber" />
        <Kpi label="SLA adherence" value={`${adherence}%`} hint="Threads answered or within SLA" tone={adherence >= 80 ? "green" : "amber"} />
      </KpiGrid>
      <div className="grid gap-4 xl:grid-cols-3">
        <Card padded={false} className="xl:col-span-2" title="Threads">
          <Table head={["Client", "Project", "Channel", "Subject", "Waiting", "SLA", ""]}>
            {rows.map(({ t, s }) => (
              <tr key={t.id} className="table-row">
                <td><Link href={`/clients/${t.clientId}`} className="font-medium hover:text-brand-700">{db.clients.find((c) => c.id === t.clientId)?.name}</Link></td>
                <td className="font-mono text-slate-500">{t.projectId ? db.projects.find((p) => p.id === t.projectId)?.code : "—"}</td>
                <td className="text-slate-600">{t.channel}</td>
                <td>{t.subject}</td>
                <td className="font-mono">{s.state === "Answered" ? "—" : `${s.hours}h`}</td>
                <td><Pill tone={s.state === "Answered" ? "green" : s.state === "Within SLA" ? "brand" : "red"}>{s.state}</Pill></td>
                <td>{s.state !== "Answered" && <button className="btn-primary btn-sm" onClick={() => act.replyThread(t.id)}>Reply & log</button>}</td>
              </tr>
            ))}
          </Table>
        </Card>
        <div className="space-y-4">
          <Card title="Response-time SLAs"><ul className="divide-y divide-slate-100">{SLA.map(([k, v]) => <li key={k} className="flex justify-between gap-3 py-2 text-[12.5px]"><span className="text-slate-600">{k}</span><span className="text-right font-medium">{v}</span></li>)}</ul></Card>
          <Callout tone="brand" title="Must be logged, not just messaged">Client contact info → Client Database · quick clarifications → feedback log · any status or deadline change → Project Tracker.</Callout>
        </div>
      </div>
    </>
  );
}
