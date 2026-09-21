"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHeader, Card, Pill, Table, Kpi, KpiGrid, Chips, Callout, Progress } from "@/components/ui/primitives";
import { Avatar } from "@/components/ui/avatar";
import { useDb } from "@/lib/use-db";
import { useMe } from "@/lib/role-context";
import { byId, productById, teamNames } from "@/data/people";
import { stageTone } from "@/lib/selectors";
import { relDays, daysLeft } from "@/lib/format";
import type { Stage } from "@/lib/types";

const REVISION_STAGES: Stage[] = ["Feedback received", "In correction", "Scope change pending"];

export default function RevisionQueuePage() {
  const { db } = useDb();
  const { me } = useMe();
  const [filter, setFilter] = useState("all");
  const scoped = db.deliverables.filter((d) => REVISION_STAGES.includes(d.stage) && (me.role !== "team-leader" || d.team === me.team));
  const rows = scoped.filter((d) => filter === "all" || d.stage === filter);
  const over = scoped.filter((d) => d.revisionCount > productById(db.projects.find((p) => p.id === d.projectId)!.product).includedRevisions);
  const rounds = db.deliverables.filter((d) => d.revisionCount > 0);
  const avg = rounds.length ? (rounds.reduce((s, d) => s + d.revisionCount, 0) / rounds.length).toFixed(1) : "0";

  return (
    <>
      <PageHeader title="Revision queue" subtitle="Every deliverable in a client revision loop, with rounds used against the package. The goal is not fewer revisions — it's stronger thinking before the work reaches the client." />
      <KpiGrid cols={5}>
        <Kpi label="In revision loop" value={scoped.length} />
        <Kpi label="Feedback to classify" value={scoped.filter((d) => d.stage === "Feedback received").length} hint="CRM decides scope first" tone="brand" href="/approvals" />
        <Kpi label="Being corrected" value={scoped.filter((d) => d.stage === "In correction").length} hint="Re-enters TL review" tone="amber" />
        <Kpi label="Over included rounds" value={over.length} hint="Scope change territory" tone="red" />
        <Kpi label="Avg rounds (revised work)" value={avg} hint="Packages include 2–3" tone="slate" href="/reports" />
      </KpiGrid>
      <Callout tone="brand" title="Distinguish these two, every time">Genuine design problem → the brief&apos;s objective wasn&apos;t met; fix the thinking. Subjective preference → the work is solid but not to this client&apos;s taste; fix the brief-gathering, not the design team.</Callout>
      <div className="my-3"><Chips items={[{ key: "all", label: "All", count: scoped.length }, ...REVISION_STAGES.map((s) => ({ key: s, label: s, count: scoped.filter((d) => d.stage === s).length }))]} active={filter} onChange={setFilter} /></div>
      <Card padded={false}>
        <Table head={["Deliverable", "Project", "Team / designer", "Stage", "Rounds used", "Latest feedback", "Root cause", "Due", ""]}>
          {rows.map((d) => {
            const p = db.projects.find((x) => x.id === d.projectId)!;
            const prod = productById(p.product);
            const fb = db.feedback.filter((f) => f.deliverableId === d.id).sort((a, b) => b.round - a.round)[0];
            const overQ = d.revisionCount >= prod.includedRevisions;
            return (
              <tr key={d.id} className="table-row">
                <td className="font-medium">{d.type}<div className="font-mono text-[11px] text-slate-400">v{d.version}</div></td>
                <td><Link href={`/projects/${p.id}`} className="hover:text-brand-700">{p.name}</Link><div className="text-[11px] text-slate-500">{db.clients.find((c) => c.id === p.clientId)?.name}</div></td>
                <td><span className="flex items-center gap-1.5"><Avatar employee={byId(d.assigneeId)} size="sm" /><span>{byId(d.assigneeId)?.name ?? "Unassigned"}<div className="text-[11px] text-slate-500">{teamNames[d.team]}</div></span></span></td>
                <td><Pill tone={stageTone(d.stage)}>{d.stage}</Pill></td>
                <td><div className="flex items-center gap-2"><Progress value={(d.revisionCount / prod.includedRevisions) * 100} tone={overQ ? "red" : "brand"} className="w-16" /><span className={`font-mono text-[11px] ${overQ ? "font-semibold text-red-600" : ""}`}>{d.revisionCount}/{prod.includedRevisions}</span></div></td>
                <td className="max-w-[240px] text-slate-600">{fb ? <>“{fb.text}” <Pill tone={fb.classification === "Scope change" ? "red" : fb.classification === "Unclear" ? "amber" : "green"}>{fb.classification}</Pill></> : "—"}</td>
                <td>{fb?.rootCause ? <Pill tone={fb.rootCause === "Design miss" ? "red" : "amber"}>{fb.rootCause}</Pill> : <span className="text-slate-400">—</span>}</td>
                <td className={daysLeft(d.dueDate) < 0 ? "font-semibold text-red-600" : ""}>{relDays(d.dueDate)}</td>
                <td className="space-x-1">
                  {d.stage === "Feedback received" && <Link href="/approvals" className="btn-primary btn-sm">Classify</Link>}
                  {d.stage === "Scope change pending" && <Link href="/approvals" className="btn-danger btn-sm">Founder decision</Link>}
                  {d.stage === "In correction" && <Link href={`/tasks/${d.id}`} className="btn-secondary btn-sm">Open task</Link>}
                </td>
              </tr>
            );
          })}
          {rows.length === 0 && <tr><td colSpan={9} className="py-8 text-center text-slate-500">Nothing in the revision loop.</td></tr>}
        </Table>
      </Card>
    </>
  );
}
