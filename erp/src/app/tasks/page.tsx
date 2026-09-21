"use client";

import Link from "next/link";
import { PageHeader, Card, Pill, Table, Kpi, KpiGrid } from "@/components/ui/primitives";
import { useMe } from "@/lib/role-context";
import { useDb } from "@/lib/use-db";
import { assignedTo, stageTone } from "@/lib/selectors";
import { relDays, daysLeft } from "@/lib/format";

export default function TasksPage() {
  const { me } = useMe();
  const { db } = useDb();
  const mine = assignedTo(db, me.id);
  const order = ["In correction", "In design", "TL review", "Ready for client", "With client"];
  const sorted = [...mine].sort((a, b) => order.indexOf(a.stage) - order.indexOf(b.stage) || a.dueDate.localeCompare(b.dueDate));

  return (
    <>
      <PageHeader title="My tasks" subtitle="Receive → develop → self-check → submit to TL → apply feedback → mockup → corrections → finalise." />
      <KpiGrid cols={4}>
        <Kpi label="Active" value={mine.length} />
        <Kpi label="Overdue" value={mine.filter((d) => daysLeft(d.dueDate) < 0 && d.stage !== "Client approved").length} tone="red" />
        <Kpi label="Corrections" value={mine.filter((d) => d.stage === "In correction").length} tone="amber" />
        <Kpi label="Awaiting TL" value={mine.filter((d) => d.stage === "TL review").length} tone="violet" />
      </KpiGrid>
      <Card padded={false}>
        <Table head={["Deliverable", "Project", "Client", "Stage", "Version", "Client rounds", "Due", ""]}>
          {sorted.map((d) => { const p = db.projects.find((x) => x.id === d.projectId)!; return (
            <tr key={d.id} className="table-row">
              <td className="font-medium">{d.type}</td>
              <td>{p.name}<div className="font-mono text-[11px] text-slate-400">{p.code}</div></td>
              <td>{db.clients.find((c) => c.id === p.clientId)?.name}</td>
              <td><Pill tone={stageTone(d.stage)}>{d.stage}</Pill></td>
              <td className="font-mono">{d.version ? `v${d.version}` : "—"}</td>
              <td className="font-mono">{d.revisionCount}</td>
              <td className={daysLeft(d.dueDate) < 0 ? "font-semibold text-red-600" : ""}>{relDays(d.dueDate)}</td>
              <td><Link href={`/tasks/${d.id}`} className="btn-primary btn-sm">Open</Link></td>
            </tr>); })}
          {sorted.length === 0 && <tr><td colSpan={8} className="py-8 text-center text-slate-500">No tasks assigned to you. Ask your Team Leader.</td></tr>}
        </Table>
      </Card>
    </>
  );
}
