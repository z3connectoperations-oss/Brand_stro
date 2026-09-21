"use client";

import Link from "next/link";
import { PageHeader, Card, Pill, Table, Kpi, KpiGrid, Callout, PriorityPill } from "@/components/ui/primitives";
import { useDb } from "@/lib/use-db";
import { productById } from "@/data/people";
import { projectStage, stageTone } from "@/lib/selectors";
import { relDays } from "@/lib/format";

export default function DiscoveryListPage() {
  const { db } = useDb();
  const rows = db.projects.map((p) => ({ p, st: projectStage(db, p) })).filter(({ st, p }) => ["Awaiting advance", "Discovery", "Brief ready"].includes(st) || p.brief);
  const todo = rows.filter(({ st }) => st === "Discovery" || st === "Awaiting advance");
  const missing = rows.filter(({ p }) => p.brief && Object.values(p.brief).some((v) => v === "")).length;

  return (
    <>
      <PageHeader title="Discovery calls" subtitle="Garbage brief → confused thinking → weak creative output → excessive revisions. Ask every question on the list; flag what the client can't answer instead of assuming." />
      <KpiGrid cols={4}>
        <Kpi label="Calls to run" value={todo.length} hint="Projects in Discovery" tone="brand" />
        <Kpi label="Waiting on advance" value={rows.filter(({ st }) => st === "Awaiting advance").length} hint="Can run the call, can't hand to R&D" tone="amber" />
        <Kpi label="Briefs with gaps" value={missing} hint="[CLIENT INPUT REQUIRED] flags open" tone="red" />
        <Kpi label="Briefs completed" value={rows.filter(({ p }) => p.brief?.completedOn).length} tone="green" />
      </KpiGrid>
      <Callout tone="brand" title="What the call must capture (Handbook §27)">Brand in one sentence · target audience · positioning · business objective · what to communicate and avoid · competitors · exact deliverables and deadline · what the client expects to see first · references and constraints.</Callout>
      <Card className="mt-4" padded={false}>
        <Table head={["Project", "Client", "Package", "Priority", "Stage", "Brief", "Deadline", ""]}>
          {rows.map(({ p, st }) => {
            const c = db.clients.find((x) => x.id === p.clientId);
            const gaps = p.brief ? Object.values(p.brief).filter((v) => v === "").length : null;
            return (
              <tr key={p.id} className="table-row">
                <td><Link href={`/projects/${p.id}`} className="font-medium hover:text-brand-700">{p.name}</Link><div className="font-mono text-[11px] text-slate-400">{p.code}</div></td>
                <td>{c?.name}</td>
                <td className="text-slate-600">{productById(p.product).name}</td>
                <td><PriorityPill p={p.priority} /></td>
                <td><Pill tone={stageTone(st)}>{st}</Pill></td>
                <td>{p.brief ? (gaps ? <Pill tone="amber">{gaps} input(s) required</Pill> : <Pill tone="green">Complete</Pill>) : <Pill>Not started</Pill>}</td>
                <td>{relDays(p.clientDeadline)}</td>
                <td><Link href={`/discovery/${p.id}`} className={p.brief ? "btn-secondary btn-sm" : "btn-primary btn-sm"}>{p.brief ? "View brief" : "Run call"}</Link></td>
              </tr>
            );
          })}
          {rows.length === 0 && <tr><td colSpan={8} className="py-8 text-center text-slate-500">No projects in discovery.</td></tr>}
        </Table>
      </Card>
    </>
  );
}
