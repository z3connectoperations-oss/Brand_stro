"use client";

import { useState } from "react";
import { PageHeader, Card, Pill, Table, Kpi, KpiGrid, Callout } from "@/components/ui/primitives";
import { LogComplaintModal } from "@/components/forms/misc-forms";
import { useDb } from "@/lib/use-db";

const STEPS = ["Received", "Categorised", "Team informed", "Root cause", "Resolved"];

export default function ComplaintsPage() {
  const { db, act } = useDb();
  const [log, setLog] = useState(false);
  const counts = db.complaints.reduce<Record<string, number>>((m, c) => ({ ...m, [c.category]: (m[c.category] ?? 0) + 1 }), {});
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  return (
    <>
      <PageHeader title="Client complaints" subtitle="You're the first responder: receive → categorise → inform team → root cause → resolve & log." actions={<button className="btn-primary btn-sm" onClick={() => setLog(true)}>Log complaint</button>} />
      <LogComplaintModal open={log} onClose={() => setLog(false)} />
      <KpiGrid cols={4}>
        <Kpi label="Open" value={db.complaints.filter((c) => c.status !== "Resolved").length} tone="amber" />
        <Kpi label="Escalated to Founder" value={db.complaints.filter((c) => c.escalated).length} hint="Refund / contract / reputation" tone="red" />
        <Kpi label="Resolved this month" value={db.complaints.filter((c) => c.status === "Resolved").length} tone="green" />
        <Kpi label="Top category" value={top} hint="Feeds monthly review" tone="slate" />
      </KpiGrid>
      <Callout tone="red" title="Escalate before responding">Refund, contract dispute or reputational risk → Founder first. A client threatening to cancel is a Founder call, not yours.</Callout>
      <Card className="mt-4" padded={false}>
        <Table head={["Client", "Project", "Category", "Summary", "Received", "Progress", "Escalated", ""]}>
          {db.complaints.map((c) => (
            <tr key={c.id} className="table-row">
              <td className="font-medium">{db.clients.find((x) => x.id === c.clientId)?.name}</td>
              <td className="font-mono text-slate-500">{c.projectId ? db.projects.find((p) => p.id === c.projectId)?.code : "—"}</td>
              <td><Pill tone="amber">{c.category}</Pill></td>
              <td className="max-w-[320px]">{c.summary}</td>
              <td className="font-mono">{c.receivedAt}</td>
              <td><ol className="flex gap-1">{STEPS.map((s, i) => <li key={s} title={s} className={`h-1.5 w-6 rounded-full ${i <= STEPS.indexOf(c.status) ? (c.status === "Resolved" ? "bg-emerald-500" : "bg-brand-600") : "bg-slate-200"}`} />)}</ol><div className="mt-1 text-[11px] text-slate-500">{c.status}</div></td>
              <td>{c.escalated ? <Pill tone="red">Founder</Pill> : "—"}</td>
              <td>{c.status !== "Resolved" && <button className="btn-secondary btn-sm" onClick={() => act.advanceComplaint(c.id)}>→ {STEPS[STEPS.indexOf(c.status) + 1]}</button>}</td>
            </tr>
          ))}
        </Table>
      </Card>
      <p className="mt-3 text-[12px] text-slate-500">Categories: Delay · Quality · Communication · Scope · Pricing/Payment · Revision · Delivery.</p>
    </>
  );
}
