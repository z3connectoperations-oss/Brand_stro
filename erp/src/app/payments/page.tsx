"use client";

import Link from "next/link";
import { PageHeader, Card, Pill, Table, Kpi, KpiGrid, Callout } from "@/components/ui/primitives";
import { useDb } from "@/lib/use-db";
import { useMe } from "@/lib/role-context";
import { inr, relDays, daysLeft } from "@/lib/format";

export default function PaymentsPage() {
  const { db, act } = useDb();
  const { me } = useMe();
  const open = db.payments.filter((p) => !p.paidOn).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const overdue = open.filter((p) => daysLeft(p.dueDate) < 0);
  const escalate = overdue.filter((p) => p.followUps >= 1);
  const received = db.payments.filter((p) => p.paidOn && p.paidOn.startsWith("2026-09")).reduce((s, p) => s + p.amount, 0);
  const canRecord = me.role === "crm" || me.role === "founder" || me.role === "hr";
  const proj = (id: string) => db.projects.find((p) => p.id === id)!;
  const client = (id: string) => db.clients.find((c) => c.id === id)?.name;

  return (
    <>
      <PageHeader title="Payments & collections" subtitle="50% advance before work starts; final 50% before files are released. One follow-up cycle, then escalate to the Founder." />
      <KpiGrid cols={5}>
        <Kpi label="Outstanding" value={inr(open.reduce((s, p) => s + p.amount, 0), true)} hint={`${open.length} invoices`} tone="amber" />
        <Kpi label="Overdue" value={inr(overdue.reduce((s, p) => s + p.amount, 0), true)} hint={`${overdue.length} invoices`} tone="red" />
        <Kpi label="Escalate to Founder" value={escalate.length} hint="Unresolved after 1 cycle" tone="violet" />
        <Kpi label="Received this month" value={inr(received, true)} tone="green" />
        <Kpi label="Blocked deliveries" value={open.filter((p) => p.milestone === "Final 50%" && proj(p.projectId).createdOn && db.deliverables.some((d) => d.projectId === p.projectId && d.stage === "Awaiting final payment")).length} hint="Files held until paid" tone="slate" />
      </KpiGrid>
      <Callout tone="brand" title="Release gate">Final files stay locked in the ERP until the final 50% is recorded here. Advance unpaid = the project cannot enter the R&D queue.</Callout>
      <Card className="mt-4" padded={false} title="Open invoices">
        <Table head={["Client", "Project", "Milestone", "Amount", "Due", "Status", "Follow-ups", ""]}>
          {open.map((p) => { const pr = proj(p.projectId); const od = daysLeft(p.dueDate) < 0; return (
            <tr key={p.id} className="table-row">
              <td className="font-medium">{client(pr.clientId)}</td>
              <td><Link href={`/projects/${pr.id}`} className="hover:text-brand-700">{pr.name}</Link></td>
              <td>{p.milestone}</td>
              <td className="font-mono font-semibold">{inr(p.amount)}</td>
              <td className={od ? "font-semibold text-red-600" : ""}>{relDays(p.dueDate)}</td>
              <td>{od ? (p.followUps >= 1 ? <Pill tone="red">Escalate</Pill> : <Pill tone="amber">Overdue</Pill>) : <Pill>Due</Pill>}</td>
              <td className="font-mono">{p.followUps}</td>
              <td className="space-x-1 whitespace-nowrap"><button className="btn-secondary btn-sm" onClick={() => act.sendReminder(p.id)}>Send reminder</button>{canRecord && <button className="btn-primary btn-sm" onClick={() => act.recordPayment(p.id)}>Record payment</button>}</td>
            </tr>); })}
          {open.length === 0 && <tr><td colSpan={8} className="py-8 text-center text-slate-500">Nothing outstanding.</td></tr>}
        </Table>
      </Card>
      <Card className="mt-4" padded={false} title="Received">
        <Table head={["Client", "Project", "Milestone", "Amount", "Paid on"]}>
          {db.payments.filter((p) => p.paidOn).sort((a, b) => b.paidOn!.localeCompare(a.paidOn!)).map((p) => { const pr = proj(p.projectId); return (
            <tr key={p.id} className="table-row"><td>{client(pr.clientId)}</td><td>{pr.name}</td><td>{p.milestone}</td><td className="font-mono">{inr(p.amount)}</td><td className="font-mono">{p.paidOn}</td></tr>); })}
        </Table>
      </Card>
    </>
  );
}
