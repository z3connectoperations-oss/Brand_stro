"use client";

import Link from "next/link";
import { PageHeader, Card, Pill, Callout, Empty } from "@/components/ui/primitives";
import { useMe } from "@/lib/role-context";
import { useDb } from "@/lib/use-db";
import { productById } from "@/data/people";
import { assignedTo } from "@/lib/selectors";

export default function FeedbackPage() {
  const { me } = useMe();
  const { db } = useDb();
  const mine = assignedTo(db, me.id).map((d) => d.id);
  const rows = db.feedback.filter((f) => mine.includes(f.deliverableId) && f.status !== "Approved");
  const reviewNotes = db.audit.filter((a) => a.action === "Sent back for rework" && mine.includes(a.entityId));

  return (
    <>
      <PageHeader title="Review feedback" subtitle="Corrections come to you already reviewed by the CRM and assigned by your TL. Apply the fix, then send it back to your TL — even for a small tweak." />
      <div className="grid gap-4 xl:grid-cols-2">
        <Card title="Client corrections on my work" padded={false}>
          {rows.length ? (
            <ul className="divide-y divide-slate-100">
              {rows.map((f) => { const d = db.deliverables.find((x) => x.id === f.deliverableId)!; const p = db.projects.find((x) => x.id === f.projectId)!; return (
                <li key={f.id} className="px-4 py-3">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="text-[13px] font-semibold">{d.type} · {db.clients.find((c) => c.id === p.clientId)?.name}</span>
                    <Pill mono>Round {f.round}/{productById(p.product).includedRevisions}</Pill>
                    <Pill tone={f.classification === "Scope change" ? "red" : f.classification === "Unclear" ? "amber" : "green"}>{f.classification}</Pill>
                    <Pill>{f.status}</Pill>
                  </div>
                  <blockquote className="border-l-2 border-brand-600 pl-3 text-[12.5px] italic text-slate-700">“{f.text}”</blockquote>
                  <div className="mt-2 flex items-center gap-3 text-[11.5px] text-slate-500"><span>{f.receivedAt.replace("T", " ")} · {f.channel}</span><Link href={`/tasks/${d.id}`} className="font-medium text-brand-700">Open task →</Link></div>
                </li>); })}
            </ul>
          ) : <div className="p-4"><Empty text="No client corrections assigned to you right now." /></div>}
        </Card>
        <div className="space-y-4">
          <Card title="Team Leader review notes" padded={false}>
            {reviewNotes.length ? (
              <ul className="divide-y divide-slate-100">
                {reviewNotes.map((r) => (
                  <li key={r.id} className="px-4 py-3"><div className="flex items-center justify-between text-[12px] text-slate-500"><span className="font-medium text-slate-800">{r.actorId === "E07" ? "Akhil P. (TL)" : "Shalin M. (TL)"}</span><span className="font-mono">{r.at.replace("T", " ")}</span></div><p className="mt-1 text-[12.5px] text-slate-700">{r.summary}</p></li>
                ))}
              </ul>
            ) : <div className="p-4"><Empty text="No open review notes." /></div>}
          </Card>
          <Callout tone="amber" title="Correction or new direction?">If a “correction” actually asks for a different concept or layout direction, tell your TL <b>before</b> you start. That&apos;s a scope question, not yours to resolve.</Callout>
        </div>
      </div>
    </>
  );
}
