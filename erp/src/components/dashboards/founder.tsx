"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { PageHeader, Kpi, KpiGrid, Card, Pill, Table, Progress } from "@/components/ui/primitives";
import { CreateProjectModal } from "@/components/forms/create-project";
import { AddLeadModal } from "@/components/forms/misc-forms";
import { products } from "@/data/people";
import { useDb } from "@/lib/use-db";
import { computeAlerts, computeReport } from "@/lib/rules";
import { activeProjects, overdueProjects, overduePayments, outstanding, projectStage, stageTone, isAtRisk, isOverdue } from "@/lib/selectors";
import { inr } from "@/lib/format";

export function FounderDashboard() {
  const { db } = useDb();
  const [modal, setModal] = useState<"project" | "lead" | null>(null);
  const active = activeProjects(db);
  const overdue = overdueProjects(db);
  const alerts = computeAlerts(db);
  const report = computeReport(db);
  const pendingApprovals = alerts.filter((a) => a.kind === "Scope change").length;
  const outstandingAmt = outstanding(db).reduce((s, p) => s + p.amount, 0);
  const newLeads = db.leads.filter((l) => l.status === "New" || l.status === "Contacted").length;
  const urgent = alerts.filter((a) => a.severity !== "info");
  const sold = report.soldBy;
  const sketchUsed = sold.logo + sold.branding;

  return (
    <>
      <PageHeader
        title="Good morning, Zameel"
        subtitle="What needs your attention today across active projects, sales and the team."
        badge={<Pill tone={urgent.length > 5 ? "amber" : "green"}>{urgent.length} urgent</Pill>}
        actions={<><button className="btn-secondary btn-sm" onClick={() => setModal("lead")}>+ Lead</button><button className="btn-primary btn-sm" onClick={() => setModal("project")}>+ Project</button></>}
      />
      <CreateProjectModal open={modal === "project"} onClose={() => setModal(null)} />
      <AddLeadModal open={modal === "lead"} onClose={() => setModal(null)} />
      <KpiGrid>
        <Kpi label="Active projects" value={active.length} hint={`${db.projects.filter((p) => isAtRisk(db, p)).length} due within 2 days`} href="/projects" />
        <Kpi label="Overdue" value={overdue.length} hint="Past client deadline" tone="red" href="/projects" />
        <Kpi label="Pending collections" value={inr(outstandingAmt, true)} hint={`${overduePayments(db).length} overdue invoices`} tone="amber" href="/payments" />
        <Kpi label="New leads" value={newLeads} hint={`${db.leads.filter((l) => l.status !== "Won" && l.status !== "Lost").length} open in pipeline`} tone="green" href="/leads" />
        <Kpi label="Scope decisions" value={pendingApprovals} hint="Waiting on you" tone="violet" href="/approvals" />
        <Kpi label="Revenue MTD" value={inr(report.revenue, true)} hint={`of ${inr(report.target, true)} target`} tone="brand" href="/reports" />
      </KpiGrid>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card title="Needs your attention" subtitle={`${urgent.length} items requiring Founder decision or escalation — computed from the rules`} icon={AlertTriangle} className="xl:col-span-2" padded={false}>
          <ul className="divide-y divide-slate-100">
            {urgent.slice(0, 9).map((a) => (
              <li key={a.id} className="flex items-start gap-3 px-4 py-3">
                <Pill tone={a.severity === "critical" ? "red" : "amber"}>{a.kind}</Pill>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium text-slate-900">{a.text}</div>
                  <div className="text-[12px] text-slate-500">{a.detail}</div>
                </div>
                <Link href={a.href} className="btn-secondary btn-sm shrink-0">Open</Link>
              </li>
            ))}
            {urgent.length > 9 && <li className="px-4 py-2 text-[12px] text-slate-500"><Link href="/alerts" className="font-medium text-brand-700">{urgent.length - 9} more →</Link></li>}
          </ul>
        </Card>

        <Card title="Sales vs monthly target" subtitle="47 engagements / ₹3,53,500 per the incentive plan">
          <ul className="space-y-3">
            {products.map((p) => (
              <li key={p.id}>
                <div className="mb-1 flex items-center justify-between text-[12.5px]">
                  <span className="font-medium text-slate-800">{p.name}</span>
                  <span className="font-mono text-slate-500">{sold[p.id]}/{p.monthlyTarget} · {inr(p.price * sold[p.id], true)}</span>
                </div>
                <Progress value={(sold[p.id] / p.monthlyTarget) * 100} tone={sold[p.id] / p.monthlyTarget >= 0.6 ? "green" : "amber"} />
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-[12.5px]">
            <span className="text-slate-600">Sketch capacity used</span>
            <span className="font-mono font-semibold">{sketchUsed} / 24</span>
          </div>
          <Link href="/leads" className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-medium text-brand-700">Open pipeline <ArrowRight size={13} /></Link>
        </Card>
      </div>

      <Card title="Project health" subtitle="Live status across Logo and Packaging" className="mt-4" padded={false} actions={<Link href="/projects" className="text-[12.5px] font-medium text-brand-700">All projects →</Link>}>
        <Table head={["Project", "Client", "Stage", "Priority", "Deadline", "Payment"]}>
          {active.slice(0, 8).map((p) => {
            const st = projectStage(db, p);
            return (
              <tr key={p.id} className="table-row">
                <td><Link href={`/projects/${p.id}`} className="font-medium text-slate-900 hover:text-brand-700">{p.name}</Link><div className="font-mono text-[11px] text-slate-400">{p.code}</div></td>
                <td>{db.clients.find((c) => c.id === p.clientId)?.name}</td>
                <td><Pill tone={stageTone(st)}>{st}</Pill></td>
                <td><Pill tone={p.priority === "P1" ? "red" : "slate"} mono>{p.priority}</Pill></td>
                <td className={`tnum ${isOverdue(db, p) ? "font-semibold text-red-600" : ""}`}>{p.clientDeadline}</td>
                <td>{p.finalPaid ? <Pill tone="green">Paid</Pill> : p.advancePaid ? <Pill tone="amber">50% advance</Pill> : <Pill tone="red">Unpaid</Pill>}</td>
              </tr>
            );
          })}
        </Table>
      </Card>
    </>
  );
}
