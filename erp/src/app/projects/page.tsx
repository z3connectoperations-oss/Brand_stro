"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader, Kpi, KpiGrid, Card, Pill, Table, Chips, Progress, PriorityPill } from "@/components/ui/primitives";
import { Avatar } from "@/components/ui/avatar";
import { projects } from "@/data/projects";
import { clientById } from "@/data/clients";
import { byId, productById } from "@/data/people";
import { useMe } from "@/lib/role-context";
import { projectStage, stageTone, projectProgress, isOverdue, isAtRisk, isActive, teamDeliverables } from "@/lib/selectors";
import { relDays } from "@/lib/format";

export default function ProjectsPage() {
  const { me } = useMe();
  const [filter, setFilter] = useState("active");
  const scoped = me.role === "team-leader" ? projects.filter((p) => teamDeliverables(me.team).some((d) => d.projectId === p.id)) : projects;
  const rows = scoped.filter((p) => {
    if (filter === "active") return isActive(p);
    if (filter === "overdue") return isOverdue(p);
    if (filter === "risk") return isAtRisk(p);
    if (filter === "client") return ["With client", "Feedback received", "Scope change pending"].includes(projectStage(p));
    if (filter === "blocked") return !p.advancePaid || projectStage(p) === "Awaiting final payment";
    return true;
  });

  return (
    <>
      <PageHeader
        title={me.role === "team-leader" ? "Team projects" : "Projects"}
        subtitle="Project status is derived from its slowest deliverable. Click through for the deliverable-level view."
        actions={me.role === "founder" || me.role === "crm" ? <button className="btn-primary btn-sm"><Plus size={14} /> Create project</button> : undefined}
      />
      <KpiGrid cols={5}>
        <Kpi label="Active" value={scoped.filter(isActive).length} hint="In production" />
        <Kpi label="Overdue" value={scoped.filter(isOverdue).length} hint="Past client deadline" tone="red" />
        <Kpi label="At risk" value={scoped.filter(isAtRisk).length} hint="Due within 2 days" tone="amber" />
        <Kpi label="With client" value={scoped.filter((p) => ["With client", "Feedback received"].includes(projectStage(p))).length} hint="Awaiting feedback" tone="violet" />
        <Kpi label="Payment blocked" value={scoped.filter((p) => !p.advancePaid).length} hint="No advance yet — cannot enter R&D queue" tone="slate" />
      </KpiGrid>
      <div className="mb-3">
        <Chips
          items={[{ key: "active", label: "Active" }, { key: "overdue", label: "Overdue" }, { key: "risk", label: "At risk" }, { key: "client", label: "With client" }, { key: "blocked", label: "Payment blocked" }, { key: "all", label: "All", count: scoped.length }]}
          active={filter}
          onChange={setFilter}
        />
      </div>
      <Card padded={false}>
        <Table head={["Project", "Client", "Product", "Priority", "Stage", "Progress", "Owner now", "Deadline", "Payment"]}>
          {rows.map((p) => {
            const st = projectStage(p);
            const od = isOverdue(p);
            return (
              <tr key={p.id} className="table-row">
                <td><Link href={`/projects/${p.id}`} className="font-medium text-slate-900 hover:text-brand-700">{p.name}</Link><div className="font-mono text-[11px] text-slate-400">{p.code}</div></td>
                <td>{clientById(p.clientId).name}</td>
                <td className="text-slate-600">{productById(p.product).name}</td>
                <td><PriorityPill p={p.priority} /></td>
                <td><Pill tone={stageTone(st)}>{st}</Pill></td>
                <td><div className="flex items-center gap-2"><Progress value={projectProgress(p)} className="w-16" /><span className="font-mono text-[11px] text-slate-500">{projectProgress(p)}%</span></div></td>
                <td><span className="flex items-center gap-1.5"><Avatar employee={byId(p.currentOwnerId)} size="sm" />{byId(p.currentOwnerId)?.name}</span></td>
                <td className={od ? "font-semibold text-red-600" : isAtRisk(p) ? "font-semibold text-amber-600" : ""}>{relDays(p.clientDeadline)}</td>
                <td>{p.finalPaid ? <Pill tone="green">Paid</Pill> : p.advancePaid ? <Pill tone="amber">50%</Pill> : <Pill tone="red">Unpaid</Pill>}</td>
              </tr>
            );
          })}
          {rows.length === 0 && <tr><td colSpan={9} className="py-8 text-center text-slate-500">Nothing here.</td></tr>}
        </Table>
      </Card>
    </>
  );
}
