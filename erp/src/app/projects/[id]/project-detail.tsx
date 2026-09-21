"use client";

import Link from "next/link";
import { useState } from "react";
import { FolderOpen, Lock, Unlock } from "lucide-react";
import { PageHeader, Card, Pill, Facts, Table, Progress, Callout, PriorityPill, Empty } from "@/components/ui/primitives";
import { Avatar } from "@/components/ui/avatar";
import { AssignWorkModal } from "@/components/forms/assign-work";
import { LogFeedbackModal } from "@/components/forms/log-feedback";
import { useDb } from "@/lib/use-db";
import { useMe } from "@/lib/role-context";
import { byId, productById, teamNames } from "@/data/people";
import { projectStage, stageTone, projectProgress, STAGE_ORDER, stageIdx } from "@/lib/selectors";
import { inr, relDays } from "@/lib/format";

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

export function ProjectDetail({ id }: { id: string }) {
  const { db, act } = useDb();
  const { me } = useMe();
  const [assign, setAssign] = useState<string | null>(null);
  const [feedbackFor, setFeedbackFor] = useState<string | null>(null);
  const p = db.projects.find((x) => x.id === id);
  if (!p) return <Empty text="Project not found." />;
  const client = db.clients.find((c) => c.id === p.clientId)!;
  const product = productById(p.product);
  const ds = db.deliverables.filter((d) => d.projectId === p.id);
  const st = projectStage(db, p);
  const pays = db.payments.filter((x) => x.projectId === p.id);
  const fb = db.feedback.filter((f) => f.projectId === p.id);
  const handoffs = db.handoffs.filter((h) => h.projectId === p.id);
  const currentMilestone = MILESTONES.findIndex((m) => m.stages.includes(st));
  const maxRounds = Math.max(0, ...ds.map((d) => d.revisionCount));
  const canRelease = p.finalPaid && ds.every((d) => stageIdx(d.stage) >= stageIdx("Client approved"));
  const canManage = ["founder", "crm", "creative-head", "team-leader"].includes(me.role);
  const clientCode = client.name.replace(/\s+/g, "");
  const scopePending = fb.find((f) => f.classification === "Scope change" && f.status === "Logged");

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Projects", href: "/projects" }, { label: p.code }]}
        title={p.name}
        subtitle={`${client.name} · ${product.name} · ${inr(p.price)} · created ${p.createdOn}`}
        badge={<><PriorityPill p={p.priority} /><Pill tone={stageTone(st)}>{st}</Pill></>}
        actions={<>
          <button className="btn-secondary btn-sm"><FolderOpen size={13} /> Open Drive folder</button>
          {(me.role === "crm" || me.role === "founder") && ds.some((d) => ["With client", "Feedback received", "Client approved"].includes(d.stage)) && <button className="btn-secondary btn-sm" onClick={() => setFeedbackFor(ds.find((d) => d.stage === "With client")?.id ?? ds[0].id)}>Log feedback</button>}
          <button className="btn-primary btn-sm" disabled={!canRelease} title={canRelease ? "" : "Blocked until every deliverable is approved and the final 50% is recorded"}>{canRelease ? <Unlock size={13} /> : <Lock size={13} />} Release final files</button>
        </>}
      />
      {assign && <AssignWorkModal open onClose={() => setAssign(null)} deliverableId={assign} />}
      {feedbackFor && <LogFeedbackModal open onClose={() => setFeedbackFor(null)} deliverableId={feedbackFor} />}

      <Card className="mb-4">
        <ol className="flex flex-wrap gap-2">
          {MILESTONES.map((m, i) => {
            const done = i < currentMilestone;
            const cur = i === currentMilestone;
            const skipped = m.label === "Sketch" && p.route !== "with-sketch";
            return (
              <li key={m.label} className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[12px] ${cur ? "border-brand-600 bg-brand-600 text-white" : done ? "border-emerald-200 bg-emerald-50 text-emerald-800" : skipped ? "border-dashed border-slate-200 text-slate-400" : "border-slate-200 bg-white text-slate-500"}`}>
                <span className="font-mono text-[10px] opacity-70">{i + 1}</span>{m.label}{skipped && <span className="text-[10px]">(skipped)</span>}
              </li>
            );
          })}
        </ol>
        <div className="mt-3 flex items-center gap-3">
          <Progress value={projectProgress(db, p)} className="flex-1" />
          <span className="font-mono text-[11px] text-slate-500">{projectProgress(db, p)}% · stage {stageIdx(st) + 1}/{STAGE_ORDER.length}</span>
        </div>
      </Card>

      {scopePending && <div className="mb-4"><Callout tone="red" title="Scope change pending">Round {scopePending.round} requested: “{scopePending.text}”. Never agree on the spot — the Founder decides pricing and commitment. <Link href="/approvals" className="font-semibold underline">Open approvals</Link>.</Callout></div>}
      {!p.advancePaid && <div className="mb-4"><Callout tone="amber" title="Advance not received">The project cannot enter the R&D queue until the 50% advance is recorded. {(me.role === "crm" || me.role === "founder") && <button className="ml-2 btn-primary btn-sm" onClick={() => { const adv = pays.find((x) => x.milestone === "Advance 50%"); if (adv) act.recordPayment(adv.id); }}>Record advance now</button>}</Callout></div>}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <Card title="Deliverables" subtitle="The project is only as far as its slowest piece" padded={false}>
            <Table head={["Deliverable", "Team", "Assignee", "Stage", "Version", "Rounds", "Rework", "Due", ""]}>
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
                  <td className="whitespace-nowrap space-x-1">
                    {canManage && d.stage === "Awaiting assignment" && <button className="btn-primary btn-sm" onClick={() => setAssign(d.id)}>Assign</button>}
                    {canManage && d.stage === "In design" && d.assigneeId && me.role !== "crm" && <button className="btn-secondary btn-sm" onClick={() => setAssign(d.id)}>Reassign</button>}
                    {d.stage === "TL review" && me.role !== "crm" && <Link href={`/review/${d.id}`} className="btn-primary btn-sm">Review</Link>}
                    {d.stage === "Ready for client" && (me.role === "crm" || me.role === "founder") && <button className="btn-primary btn-sm" onClick={() => act.submitToClient(d.id)}>Submit to client</button>}
                    {d.stage === "With client" && (me.role === "crm" || me.role === "founder") && <><button className="btn-secondary btn-sm" onClick={() => setFeedbackFor(d.id)}>Feedback</button><button className="btn-primary btn-sm" onClick={() => act.recordSignOff(d.id)}>Sign-off</button></>}
                    {(!canManage || !["Awaiting assignment", "TL review", "Ready for client", "With client"].includes(d.stage)) && <Link href={`/tasks/${d.id}`} className="btn-secondary btn-sm">Open</Link>}
                  </td>
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

          {handoffs.length > 0 && (
            <Card title="Handoffs" subtitle="An unacknowledged handoff is treated as not yet started" padded={false}>
              <Table head={["From", "To", "Deliverables", "Sent", "Acknowledged"]}>
                {handoffs.map((h) => (
                  <tr key={h.id} className="table-row">
                    <td>{byId(h.fromId)?.name}</td><td>{byId(h.toId)?.name}</td><td className="font-mono">{h.deliverableIds.length}</td><td className="font-mono">{h.sentAt.replace("T", " ")}</td>
                    <td>{h.acknowledgedAt ? <Pill tone="green">{h.acknowledgedAt.replace("T", " ")}</Pill> : <Pill tone="amber">Pending</Pill>}</td>
                  </tr>
                ))}
              </Table>
            </Card>
          )}

          {p.brief && (
            <Card title="Discovery brief" subtitle={`Completed ${p.brief.completedOn}`}>
              <Facts cols={2} items={[{ label: "Brand in one sentence", value: p.brief.brandInOneSentence || <Pill tone="amber">CLIENT INPUT REQUIRED</Pill> }, { label: "Target audience", value: p.brief.targetAudience || <Pill tone="amber">CLIENT INPUT REQUIRED</Pill> }, { label: "Positioning", value: p.brief.positioning || <Pill tone="amber">CLIENT INPUT REQUIRED</Pill> }, { label: "Competitors", value: p.brief.competitors || <Pill tone="amber">CLIENT INPUT REQUIRED</Pill> }, { label: "Communicate / avoid", value: p.brief.communicateAndAvoid || <Pill tone="amber">CLIENT INPUT REQUIRED</Pill> }, { label: "Expects to see first", value: p.brief.expectsToSeeFirst || <Pill tone="amber">CLIENT INPUT REQUIRED</Pill> }]} />
              <Link href={`/discovery/${p.id}`} className="mt-3 inline-block text-[12.5px] font-medium text-brand-700">Full brief →</Link>
            </Card>
          )}
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
                  <div className="text-right"><div className="font-mono font-semibold">{inr(x.amount)}</div>{x.paidOn ? <Pill tone="green">Paid {x.paidOn}</Pill> : (me.role === "crm" || me.role === "founder") ? <button className="btn-primary btn-sm mt-1" onClick={() => act.recordPayment(x.id)}>Record</button> : <Pill tone="amber">Pending</Pill>}</div>
                </li>
              ))}
            </ul>
            {!p.finalPaid && <p className="mt-2 text-[11.5px] text-slate-500">Final files stay locked until the remaining 50% is recorded.</p>}
          </Card>
          <Card title="Revision quota">
            <div className="mb-1 flex justify-between text-[12.5px]"><span>Max rounds used on any deliverable</span><span className="font-mono">{maxRounds} / {product.includedRevisions}</span></div>
            <Progress value={(maxRounds / product.includedRevisions) * 100} tone={maxRounds >= product.includedRevisions ? "red" : "brand"} />
            <p className="mt-2 text-[11.5px] text-slate-500">Beyond the included count, further rounds are a scope change and need Founder approval.{p.scopeFlag ? ` Latest: ${p.scopeFlag}.` : ""}</p>
          </Card>
          <Card title="Files">
            <p className="font-mono text-[11px] text-slate-600">Drive / {clientCode} / 01_Brief · 02_R&D · … · 08_Final Files</p>
            <p className="mt-2 text-[11.5px] text-slate-500">Naming: <code className="font-mono">{clientCode}_{ds[0]?.type.replace(/\s+/g, "") ?? "Logo"}_v{ds[0]?.version || 1}_2026-09-21</code></p>
          </Card>
        </div>
      </div>
    </>
  );
}
