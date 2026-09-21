import { PageHeader, Card, Pill, Table, Kpi, KpiGrid, Callout } from "@/components/ui/primitives";
import { complaints, projectById } from "@/data/projects";
import { clientById } from "@/data/clients";

const STEPS = ["Received", "Categorised", "Team informed", "Root cause", "Resolved"];

export default function ComplaintsPage() {
  return (
    <>
      <PageHeader title="Client complaints" subtitle="You're the first responder: receive → categorise → inform team → root cause → resolve & log." actions={<button className="btn-primary btn-sm">Log complaint</button>} />
      <KpiGrid cols={4}>
        <Kpi label="Open" value={complaints.filter((c) => c.status !== "Resolved").length} tone="amber" />
        <Kpi label="Escalated to Founder" value={complaints.filter((c) => c.escalated).length} hint="Refund / contract / reputation" tone="red" />
        <Kpi label="Resolved this month" value={complaints.filter((c) => c.status === "Resolved").length} tone="green" />
        <Kpi label="Top category" value="Revision" hint="Feeds monthly review" tone="slate" />
      </KpiGrid>
      <Callout tone="red" title="Escalate before responding">Refund, contract dispute or reputational risk → Founder first. A client threatening to cancel is a Founder call, not yours.</Callout>
      <Card className="mt-4" padded={false}>
        <Table head={["Client", "Project", "Category", "Summary", "Received", "Progress", "Escalated"]}>
          {complaints.map((c) => (
            <tr key={c.id} className="table-row">
              <td className="font-medium">{clientById(c.clientId).name}</td>
              <td className="font-mono text-slate-500">{c.projectId ? projectById(c.projectId)?.code : "—"}</td>
              <td><Pill tone="amber">{c.category}</Pill></td>
              <td className="max-w-[320px]">{c.summary}</td>
              <td className="font-mono">{c.receivedAt}</td>
              <td>
                <ol className="flex gap-1">
                  {STEPS.map((s, i) => <li key={s} title={s} className={`h-1.5 w-6 rounded-full ${i <= STEPS.indexOf(c.status) ? (c.status === "Resolved" ? "bg-emerald-500" : "bg-brand-600") : "bg-slate-200"}`} />)}
                </ol>
                <div className="mt-1 text-[11px] text-slate-500">{c.status}</div>
              </td>
              <td>{c.escalated ? <Pill tone="red">Founder</Pill> : "—"}</td>
            </tr>
          ))}
        </Table>
      </Card>
      <p className="mt-3 text-[12px] text-slate-500">Categories: Delay · Quality · Communication · Scope · Pricing/Payment · Revision · Delivery.</p>
    </>
  );
}
