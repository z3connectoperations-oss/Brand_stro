import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader, Kpi, KpiGrid, Card, Pill, Table, Progress } from "@/components/ui/primitives";
import { clients } from "@/data/clients";
import { projects, payments } from "@/data/projects";
import { isActive } from "@/lib/selectors";
import { inr } from "@/lib/format";

export default function ClientsPage() {
  const rows = clients.map((c) => {
    const ps = projects.filter((p) => p.clientId === c.id);
    const active = ps.filter(isActive).length;
    const due = payments.filter((p) => ps.some((x) => x.id === p.projectId) && !p.paidOn).reduce((s, p) => s + p.amount, 0);
    const ob = c.onboarding.filter((s) => s.done).length;
    return { c, ps, active, due, ob };
  });
  return (
    <>
      <PageHeader title="Client database" subtitle="Every client, their onboarding status, active projects and balance. Contact info shared on WhatsApp must also be logged here." actions={<button className="btn-primary btn-sm"><Plus size={14} /> Add client</button>} />
      <KpiGrid cols={4}>
        <Kpi label="Clients" value={clients.length} hint="On record" />
        <Kpi label="With active projects" value={rows.filter((r) => r.active > 0).length} hint="In production" tone="brand" />
        <Kpi label="Onboarding incomplete" value={rows.filter((r) => r.ob < 7).length} hint="Checklist open" tone="amber" />
        <Kpi label="Outstanding" value={inr(rows.reduce((s, r) => s + r.due, 0), true)} hint="Across all clients" tone="red" />
      </KpiGrid>
      <Card padded={false}>
        <Table head={["Client", "Industry", "Contact", "Tier", "Projects", "Onboarding", "Outstanding", "Since", ""]}>
          {rows.map(({ c, ps, active, due, ob }) => (
            <tr key={c.id} className="table-row">
              <td>
                <Link href={`/clients/${c.id}`} className="font-medium text-slate-900 hover:text-brand-700">{c.name}</Link>
                <div className="font-mono text-[11px] text-slate-400">{c.code}</div>
              </td>
              <td className="text-slate-600">{c.industry}</td>
              <td>
                <div>{c.contact}</div>
                <div className="font-mono text-[11px] text-slate-500">{c.phone}</div>
              </td>
              <td>{c.tier === "Important" ? <Pill tone="amber">Important</Pill> : <Pill>Standard</Pill>}</td>
              <td className="font-mono">{active} active · {ps.length} total</td>
              <td>
                <div className="flex items-center gap-2"><Progress value={(ob / 7) * 100} tone={ob === 7 ? "green" : "amber"} className="w-16" /><span className="font-mono text-[11px] text-slate-500">{ob}/7</span></div>
              </td>
              <td className={`font-mono ${due ? "text-amber-700" : "text-slate-400"}`}>{due ? inr(due) : "—"}</td>
              <td className="font-mono text-slate-500">{c.since}</td>
              <td><Link href={`/clients/${c.id}`} className="btn-secondary btn-sm">Open</Link></td>
            </tr>
          ))}
        </Table>
      </Card>
    </>
  );
}
