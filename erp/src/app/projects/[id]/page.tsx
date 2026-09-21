import Link from "next/link";
import { notFound } from "next/navigation";
import { FolderOpen, Lock } from "lucide-react";
import { PageHeader, Card, Pill, Facts, Table, Progress, Callout, PriorityPill } from "@/components/ui/primitives";
import { Avatar } from "@/components/ui/avatar";
import { projects, deliverablesFor, payments, feedback } from "@/data/projects";
import { clientById } from "@/data/clients";
import { byId, productById, teamNames } from "@/data/people";
import { projectStage, stageTone, projectProgress, STAGE_ORDER } from "@/lib/selectors";
import { inr, relDays } from "@/lib/format";

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

const MILESTONES: { label: string; stages: string[] }[] = [
  { label: "Advance", stages: ["Awaiting advance"] },
  { label: "Brief", stages: ["Discovery", "Brief ready"] },
  { label: "R&D", stages: ["R&D queue", "R&D in progress"] },
  { label: "Sketch", stages: ["Sketch queue", "Sketching"] },
  { label: "Design", stages: ["Awaiting assignment", "In design"] },
  { label: "TL review", stages: ["TL review"] },
  { label: "Client", stages: ["Ready for client", "With client", "Feedback received", "In correction", "Scope change pending"] },
  { label: "Sign-off", stages: ["Client approved"] },
  { label: "Final pay", stages: ["Awaiting final payment"] },
  { label: "Delivered", stages: ["Final files delivered", "Closed"] },
];

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = projects.find((x) => x.id === id);
  if (!p) notFound();
  const client = clientById(p.clientId);
  const product = productById(p.product);
  const ds = deliverablesFor(p.id);
  const st = projectStage(p);
  const pays = payments.filter((x) => x.projectId === p.id);
  const fb = feedback.filter((f) => f.projectId === p.id);
  const stageIdx = STAGE_ORDER.indexOf(st);
  const currentMilestone = MILESTONES.findIndex((m) => m.stages.includes(st));
  const maxRounds = Math.max(0, ...ds.map((d) => d.revisionCount));
  const canRelease = p.finalPaid;
  const folder = `Drive / ${client.name.replace(/\s+/g, "")} / 01_Brief · 02_R&D · … · 08_Final Files`;

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Projects", href: "/projects" }, { label: p.code }]}
        title={p.name}
        subtitle={`${client.name} · ${product.name} · ${inr(p.price)} · created ${p.createdOn}`}
        badge={<><PriorityPill p={p.priority} /><Pill tone={stageTone(st)}>{st}</Pill></>}
        actions={<><button className="btn-secondary btn-sm"><FolderOpen size={13} /> Open Drive folder</button><button className="btn-primary btn-sm" disabled={!canRelease} title={canRelease ? "" : "Blocked until final 50% is recorded"}><Lock size={13} /> Release final files</button></>}
      />

      <Card className="mb-4">
        <ol className="flex flex-wrap gap-2">
          {MILESTONES.map((m, i) => {
            const done = i < currentMilestone;
            const cur = i === currentMilestone;
            const skipped = m.label === "Sketch" && p.route !== "with-sketch";
            return (
              <li key={m.label} className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[12px] ${cur ? "border-brand-600 bg-brand-600 text-white" : done ? "border-emerald-200 bg-emerald-50 text-emerald-800" : skipped ? "border-dashed border-slate-200 text-slate-400" : "border-slate-200 bg-white text-slate-500"}`}>
                <span className="font-mono text-[10px] opacity-70">{i + 1}</span>
                {m.label}
                {skipped && <span className="text-[10px]">(skipped)</span>}
              </li>
            );
          })}
        </ol>
        <div className="mt-3 flex items-center gap-3">
          <Progress value={projectProgress(p)} className="flex-1" />
          <span className="font-mono text-[11px] text-slate-500">{projectProgress(p)}% · stage {stageIdx + 1}/{STAGE_ORDER.length}</span>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <Card title="Deliverables" subtitle="The project is only as far as its slowest piece" padded={false}>
            <Table head={["Deliverable", "Team", "Assignee", "Stage", "Version", "Client rounds", "Rework", "Due", ""]}>
              {ds.map((d) => (
                <tr key={d.id} className="table-row">
                  <td className="font-medium">{d.type}</td>
                  <td className="text-slate-500">{teamNames[d.team]}</td>
                  <td>{d.assigneeId ? <span className="flex items-center gap-1.5"><Avatar employee={byId(d.assigneeId)} size="sm" />{byId(d.assigneeId)?.name}</span> : <span className="text-slate-400">Unassigned</span>}</td>
                  <td><Pill tone={stageTone(d.stage)}>{d.stage}</Pill></td>
                  <td className="font-mono">{d.version ? `v${d.version}` : "—"}</td>
                  <td className={`font-mono ${d.revisionCount > product.includedRevisions ? "font-semibold text-red-600" : ""}`}>{d.revisionCount}/{product.includedRevisions}</td>
                  <td className="font-mono">{d.internalReworkCount}</td>
                  <td>{relDays(d.dueDate)}</td>
                  <td><Link href={`/tasks/${d.id}`} className="btn-secondary btn-sm">Open</Link></td>
                </tr>
              ))}
            </Table>
          </Card>

          <Card title="Feedback & revision log" padded={false}>
            {fb.length ? (
              <Table head={["Received", "Deliverable", "Channel", "Feedback", "Round", "Class", "Status"]}>
                {fb.map((f) => (
                  <tr key={f.id} className="table-row">
                    <td className="font-mono text-slate-500">{f.receivedAt.replace("T", " ")}</td>
                    <td>{ds.find((d) => d.id === f.deliverableId)?.type}</td>
                    <td className="text-slate-500">{f.channel}</td>
                    <td className="max-w-[260px]">{f.text}</td>
                    <td className="font-mono">{f.round}</td>
                    <td><Pill tone={f.classification === "Scope change" ? "red" : f.classification === "Unclear" ? "amber" : "green"}>{f.classification}</Pill></td>
                    <td><Pill>{f.status}</Pill></td>
                  </tr>
                ))}
              </Table>
            ) : <p className="p-4 text-[12.5px] text-slate-500">No client feedback yet.</p>}
          </Card>

          {p.scopeFlag && <Callout tone="red" title="Scope change pending">{p.scopeFlag}. Never agree on the spot — the Founder decides pricing and commitment. <Link href="/approvals" className="font-semibold underline">Open approvals</Link>.</Callout>}
        </div>

        <div className="space-y-4">
          <Card title="Ownership">
            <Facts cols={2} items={[{ label: "Owner now", value: byId(p.currentOwnerId)?.name }, { label: "CRM", value: byId(p.crmOwnerId)?.name }, { label: "Route", value: p.route === "with-sketch" ? "R&D → Sketch → Design" : p.route === "direct" ? "R&D → Design" : "Designer-originated" }, { label: "Deadline", value: relDays(p.clientDeadline) }]} />
          </Card>
          <Card title="Payments">
            <ul className="space-y-2">
              {pays.map((x) => (
                <li key={x.id} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-[12.5px]">
                  <div><div className="font-medium">{x.milestone}</div><div className="text-[11px] text-slate-500">Due {x.dueDate}{x.followUps ? ` · ${x.followUps} follow-up(s)` : ""}</div></div>
                  <div className="text-right"><div className="font-mono font-semibold">{inr(x.amount)}</div>{x.paidOn ? <Pill tone="green">Paid {x.paidOn}</Pill> : <Pill tone="amber">Pending</Pill>}</div>
                </li>
              ))}
            </ul>
            {!canRelease && <p className="mt-2 text-[11.5px] text-slate-500">Final files stay locked until the remaining 50% is recorded.</p>}
          </Card>
          <Card title="Revision quota">
            <div className="mb-1 flex justify-between text-[12.5px]"><span>Max rounds used on any deliverable</span><span className="font-mono">{maxRounds} / {product.includedRevisions}</span></div>
            <Progress value={(maxRounds / product.includedRevisions) * 100} tone={maxRounds >= product.includedRevisions ? "red" : "brand"} />
            <p className="mt-2 text-[11.5px] text-slate-500">Beyond the included count, further rounds are a scope change and need Founder approval.</p>
          </Card>
          <Card title="Files">
            <p className="font-mono text-[11px] text-slate-600">{folder}</p>
            <p className="mt-2 text-[11.5px] text-slate-500">Naming: <code className="font-mono">{client.name.replace(/\s+/g, "")}_{ds[0]?.type.replace(/\s+/g, "") ?? "Logo"}_v{ds[0]?.version || 1}_2026-09-21</code></p>
          </Card>
        </div>
      </div>
    </>
  );
}
