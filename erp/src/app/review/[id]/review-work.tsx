"use client";

import { useState } from "react";
import { CheckCircle2, Undo2, ArrowUpRight } from "lucide-react";
import { PageHeader, Card, Pill, Facts, Callout, PriorityPill } from "@/components/ui/primitives";
import { Avatar } from "@/components/ui/avatar";
import { Checklist } from "@/components/ui/checklist";
import { deliverables, projectById } from "@/data/projects";
import { clientById } from "@/data/clients";
import { byId, productById } from "@/data/people";
import { logoQc, packagingQc, creativeReview } from "@/data/ops";
import { useMe } from "@/lib/role-context";
import { stageTone } from "@/lib/selectors";
import { relDays } from "@/lib/format";

export function ReviewWork({ id }: { id: string }) {
  const { me } = useMe();
  const d = deliverables.find((x) => x.id === id)!;
  const p = projectById(d.projectId)!;
  const client = clientById(p.clientId);
  const product = productById(p.product);
  const designer = byId(d.assigneeId);
  const isHead = me.role === "creative-head";
  const items = isHead ? creativeReview : d.team === "logo" ? logoQc : packagingQc;
  const [allOk, setAllOk] = useState(false);
  const [decision, setDecision] = useState<"pass" | "rework" | null>(null);
  const clientCode = client.name.replace(/\s+/g, "");
  const file = `${clientCode}_${d.type.replace(/\s+/g, "")}_v${d.version}_2026-09-21`;
  const repeat = d.internalReworkCount >= 1;

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Review queue", href: "/review" }, { label: d.type }]}
        title={`${d.type} v${d.version} — ${client.name}`}
        subtitle={`${p.name} · submitted by ${designer?.name ?? "—"} · due ${relDays(d.dueDate)}`}
        badge={<><PriorityPill p={p.priority} /><Pill tone={stageTone(d.stage)}>{d.stage}</Pill></>}
      />
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
            <label className="mt-4 block">
              <span className="label-sm">Review notes to designer</span>
              <textarea className="input mt-1 h-20 py-2" placeholder="Specific, recent, observable: what to change and why." />
            </label>
          </Card>
        </div>
        <div className="space-y-4">
          <Card title="Decision">
            <div className="grid gap-2">
              <button onClick={() => setDecision("pass")} disabled={!allOk} className={`btn justify-center ${decision === "pass" ? "border-emerald-600 bg-emerald-600 text-white" : "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"}`} title={allOk ? "" : "All checklist items must pass"}>
                <CheckCircle2 size={14} /> Approve → {isHead ? "CRM presents to client" : "Ready for client"}
              </button>
              <button onClick={() => setDecision("rework")} className={`btn justify-center ${decision === "rework" ? "border-amber-600 bg-amber-600 text-white" : "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"}`}>
                <Undo2 size={14} /> Send back for rework
              </button>
              {!isHead && <button className="btn-secondary justify-center"><ArrowUpRight size={14} /> Flag to Creative Head (scope / new direction)</button>}
            </div>
            {decision === "pass" && <Callout tone="green">Logged as first-review pass. Owner moves to CRM for submission.</Callout>}
            {decision === "rework" && <Callout tone="amber">Rework count becomes {d.internalReworkCount + 1}. {repeat ? "This is a repeat on the same designer — escalate to the Creative Head if it happens again." : ""}</Callout>}
          </Card>
          <Card title="Context">
            <Facts cols={2} items={[{ label: "Designer", value: <span className="flex items-center gap-1.5"><Avatar employee={designer} size="sm" />{designer?.name}</span> }, { label: "Product", value: product.name }, { label: "Client rounds", value: `${d.revisionCount} / ${product.includedRevisions}` }, { label: "Prior rework", value: d.internalReworkCount }]} />
            {repeat && <Callout tone="amber" title="Pattern check">Already reworked once. Recurring on the same designer 2+ times → escalate to Creative Head.</Callout>}
          </Card>
          <Card title="What good looks like">
            <ul className="space-y-1.5 text-[12px] text-slate-600">
              <li>• Is there a real idea, or just decoration?</li>
              <li>• Would it stand out next to five competitors?</li>
              <li>• Does it hold up as a favicon and a shopfront sign?</li>
              <li>• Would I put it in the portfolio <i>and</i> does it help this client&apos;s business?</li>
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
