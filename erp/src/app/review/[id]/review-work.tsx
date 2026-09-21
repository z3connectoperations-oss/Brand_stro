"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Undo2, ArrowUpRight } from "lucide-react";
import { PageHeader, Card, Pill, Facts, Callout, PriorityPill, Empty } from "@/components/ui/primitives";
import { Avatar } from "@/components/ui/avatar";
import { Checklist } from "@/components/ui/checklist";
import { useDb } from "@/lib/use-db";
import { useMe } from "@/lib/role-context";
import { byId, productById } from "@/data/people";
import { logoQc, packagingQc, creativeReview } from "@/data/ops";
import { stageTone } from "@/lib/selectors";
import { relDays } from "@/lib/format";

export function ReviewWork({ id }: { id: string }) {
  const { me } = useMe();
  const { db, act } = useDb();
  const router = useRouter();
  const [allOk, setAllOk] = useState(false);
  const [note, setNote] = useState("");
  const d = db.deliverables.find((x) => x.id === id);
  if (!d) return <Empty text="Deliverable not found." />;
  const p = db.projects.find((x) => x.id === d.projectId)!;
  const client = db.clients.find((c) => c.id === p.clientId)!;
  const product = productById(p.product);
  const designer = byId(d.assigneeId);
  const isHead = me.role === "creative-head";
  const items = isHead ? creativeReview : d.team === "logo" ? logoQc : packagingQc;
  const clientCode = client.name.replace(/\s+/g, "");
  const file = `${clientCode}_${d.type.replace(/\s+/g, "")}_v${d.version}_2026-09-21`;
  const repeat = d.internalReworkCount >= 1;
  const reviewable = d.stage === "TL review";

  const decide = (decision: "pass" | "rework") => {
    act.reviewDecision(d.id, decision, note);
    router.push("/review");
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Review queue", href: "/review" }, { label: d.type }]}
        title={`${d.type} v${d.version} — ${client.name}`}
        subtitle={`${p.name} · submitted by ${designer?.name ?? "—"} · due ${relDays(d.dueDate)}`}
        badge={<><PriorityPill p={p.priority} /><Pill tone={stageTone(d.stage)}>{d.stage}</Pill></>}
      />
      {!reviewable && <div className="mb-4"><Callout tone="slate">This deliverable is not in TL review right now (stage: {d.stage}). The checklist is shown for reference.</Callout></div>}
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <Card title="Artboard preview" subtitle={file} padded={false}>
            <div className="flex h-72 items-center justify-center bg-[radial-gradient(circle_at_center,_#f1f5f9,_#e2e8f0)]">
              <div className="rounded-xl border border-slate-200 bg-white px-10 py-8 text-center shadow-sm">
                <div className="mx-auto mb-3 h-12 w-12 rounded-full border-4 border-orange-500 bg-emerald-700" />
                <div className="text-[18px] font-bold tracking-[0.3em] text-slate-900">{client.name.split(" ")[0].toUpperCase()}</div>
                <div className="mt-1 text-[10px] tracking-[0.2em] text-slate-500">{d.type.toUpperCase()} · V{d.version}</div>
              </div>
            </div>
          </Card>
          <Card title={isHead ? "7-point creative review" : d.team === "logo" ? "Logo QC checklist" : "Packaging QC / print-readiness checklist"} subtitle="Tick each item deliberately — not just glance and approve">
            <Checklist items={items} onAllChecked={setAllOk} />
            <label className="mt-4 block"><span className="label-sm">Review notes to designer</span><textarea className="input mt-1 h-20 py-2" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Specific, recent, observable: what to change and why." /></label>
          </Card>
        </div>
        <div className="space-y-4">
          <Card title="Decision">
            <div className="grid gap-2">
              <button onClick={() => decide("pass")} disabled={!allOk || !reviewable} className="btn justify-center border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100" title={allOk ? "" : "All checklist items must pass"}><CheckCircle2 size={14} /> Approve → Ready for client</button>
              <button onClick={() => decide("rework")} disabled={!reviewable || (!note.trim() && !allOk)} className="btn justify-center border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100" title={note.trim() ? "" : "Write a note so the designer knows what to fix"}><Undo2 size={14} /> Send back for rework</button>
              {!isHead && <button className="btn-secondary justify-center"><ArrowUpRight size={14} /> Flag to Creative Head (scope / new direction)</button>}
            </div>
            <p className="mt-2 text-[11.5px] text-slate-500">Approve logs a first-review pass and moves ownership to the CRM. Rework returns it to the designer and counts against first-review pass rate.</p>
          </Card>
          <Card title="Context">
            <Facts cols={2} items={[{ label: "Designer", value: <span className="flex items-center gap-1.5"><Avatar employee={designer} size="sm" />{designer?.name}</span> }, { label: "Product", value: product.name }, { label: "Client rounds", value: `${d.revisionCount} / ${product.includedRevisions}` }, { label: "Prior rework", value: d.internalReworkCount }]} />
            {repeat && <Callout tone="amber" title="Pattern check">Already reworked once. Recurring on the same designer 2+ times → escalate to Creative Head.</Callout>}
          </Card>
          <Card title="What good looks like">
            <ul className="space-y-1.5 text-[12px] text-slate-600">
              <li>• Is there a real idea, or just decoration?</li><li>• Would it stand out next to five competitors?</li><li>• Does it hold up as a favicon and a shopfront sign?</li><li>• Would I put it in the portfolio <i>and</i> does it help this client&apos;s business?</li>
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
