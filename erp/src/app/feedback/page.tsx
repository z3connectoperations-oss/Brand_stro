"use client";

import Link from "next/link";
import { PageHeader, Card, Pill, Callout, Empty } from "@/components/ui/primitives";
import { useMe } from "@/lib/role-context";
import { feedback, projectById, deliverables } from "@/data/projects";
import { clientById } from "@/data/clients";
import { productById } from "@/data/people";
import { assignedTo } from "@/lib/selectors";

export default function FeedbackPage() {
  const { me } = useMe();
  const mine = assignedTo(me.id).map((d) => d.id);
  const rows = feedback.filter((f) => mine.includes(f.deliverableId));
  const reviewNotes = [
    { id: "R1", from: "Akhil P. (TL)", when: "20 Sep, 16:40", deliverable: "D01", note: "Wordmark spacing fixed. Please export the mono version at 512px too — checklist item 6." },
    { id: "R2", from: "Shalin M. (TL)", when: "19 Sep, 11:10", deliverable: "D08", note: "Bleed is 2mm; spec says 3mm. Re-run the print-readiness check after correcting." },
  ].filter((r) => mine.includes(r.deliverable));

  return (
    <>
      <PageHeader title="Review feedback" subtitle="Corrections come to you already reviewed by the CRM and assigned by your TL. Apply the fix, then send it back to your TL — even for a small tweak." />
      <div className="grid gap-4 xl:grid-cols-2">
        <Card title="Client corrections assigned to me" padded={false}>
          {rows.length ? (
            <ul className="divide-y divide-slate-100">
              {rows.map((f) => {
                const d = deliverables.find((x) => x.id === f.deliverableId)!;
                const p = projectById(f.projectId)!;
                return (
                  <li key={f.id} className="px-4 py-3">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="text-[13px] font-semibold">{d.type} · {clientById(p.clientId).name}</span>
                      <Pill mono>Round {f.round}/{productById(p.product).includedRevisions}</Pill>
                      <Pill tone={f.classification === "Scope change" ? "red" : f.classification === "Unclear" ? "amber" : "green"}>{f.classification}</Pill>
                      <Pill>{f.status}</Pill>
                    </div>
                    <blockquote className="border-l-2 border-brand-600 pl-3 text-[12.5px] italic text-slate-700">“{f.text}”</blockquote>
                    <div className="mt-2 flex items-center gap-3 text-[11.5px] text-slate-500">
                      <span>{f.receivedAt.replace("T", " ")} · {f.channel}</span>
                      <Link href={`/tasks/${d.id}`} className="font-medium text-brand-700">Open task →</Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : <div className="p-4"><Empty text="No client corrections assigned to you right now." /></div>}
        </Card>
        <div className="space-y-4">
          <Card title="Team Leader review notes" padded={false}>
            {reviewNotes.length ? (
              <ul className="divide-y divide-slate-100">
                {reviewNotes.map((r) => (
                  <li key={r.id} className="px-4 py-3">
                    <div className="flex items-center justify-between text-[12px] text-slate-500"><span className="font-medium text-slate-800">{r.from}</span><span>{r.when}</span></div>
                    <p className="mt-1 text-[12.5px] text-slate-700">{r.note}</p>
                  </li>
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
