import Link from "next/link";
import { PageHeader, Card, Pill, Table, Kpi, KpiGrid, Callout } from "@/components/ui/primitives";
import { payments, projectById } from "@/data/projects";
import { clientById } from "@/data/clients";
import { inr, relDays, daysLeft } from "@/lib/format";

export default function PaymentsPage() {
  const open = payments.filter((p) => !p.paidOn).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const overdue = open.filter((p) => daysLeft(p.dueDate) < 0);
  const escalate = overdue.filter((p) => p.followUps >= 1);
  const received = payments.filter((p) => p.paidOn).reduce((s, p) => s + p.amount, 0);

  return (
    <>
      <PageHeader title="Payments & collections" subtitle="50% advance before work starts; final 50% before files are released. One follow-up cycle, then escalate to the Founder." />
      <KpiGrid cols={5}>
        <Kpi label="Outstanding" value={inr(open.reduce((s, p) => s + p.amount, 0), true)} hint={`${open.length} invoices`} tone="amber" />
        <Kpi label="Overdue" value={inr(overdue.reduce((s, p) => s + p.amount, 0), true)} hint={`${overdue.length} invoices`} tone="red" />
        <Kpi label="Escalate to Founder" value={escalate.length} hint="Unresolved after 1 cycle" tone="violet" />
        <Kpi label="Received this month" value={inr(received, true)} tone="green" />
        <Kpi label="Blocked deliveries" value={open.filter((p) => p.milestone === "Final 50%").length} hint="Files held until paid" tone="slate" />
      </KpiGrid>
      <Callout tone="brand" title="Release gate">Final files stay locked in the ERP until the final 50% is recorded here. Advance unpaid = the project cannot enter the R&D queue.</Callout>
      <Card className="mt-4" padded={false} title="Open invoices">
        <Table head={["Client", "Project", "Milestone", "Amount", "Due", "Status", "Follow-ups", ""]}>
          {open.map((p) => {
            const proj = projectById(p.projectId)!;
            const od = daysLeft(p.dueDate) < 0;
            return (
              <tr key={p.id} className="table-row">
                <td className="font-medium">{clientById(proj.clientId).name}</td>
                <td><Link href={`/projects/${proj.id}`} className="hover:text-brand-700">{proj.name}</Link></td>
                <td>{p.milestone}</td>
                <td className="font-mono font-semibold">{inr(p.amount)}</td>
                <td className={od ? "font-semibold text-red-600" : ""}>{relDays(p.dueDate)}</td>
                <td>{od ? (p.followUps >= 1 ? <Pill tone="red">Escalate</Pill> : <Pill tone="amber">Overdue</Pill>) : <Pill>Due</Pill>}</td>
                <td className="font-mono">{p.followUps}</td>
                <td className="space-x-1"><button className="btn-secondary btn-sm">Send reminder</button><button className="btn-primary btn-sm">Record payment</button></td>
              </tr>
            );
          })}
        </Table>
      </Card>
      <Card className="mt-4" padded={false} title="Received">
        <Table head={["Client", "Project", "Milestone", "Amount", "Paid on"]}>
          {payments.filter((p) => p.paidOn).map((p) => { const proj = projectById(p.projectId)!; return (
            <tr key={p.id} className="table-row"><td>{clientById(proj.clientId).name}</td><td>{proj.name}</td><td>{p.milestone}</td><td className="font-mono">{inr(p.amount)}</td><td className="font-mono">{p.paidOn}</td></tr>); })}
        </Table>
      </Card>
    </>
  );
}
