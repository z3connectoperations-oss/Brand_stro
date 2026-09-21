"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Flag } from "lucide-react";
import { PageHeader, Card, Pill, Facts, Callout, PriorityPill, Progress, Empty } from "@/components/ui/primitives";
import { useDb } from "@/lib/use-db";
import { productById } from "@/data/people";
import { projectStage, stageTone } from "@/lib/selectors";
import { relDays, inr } from "@/lib/format";
import type { DiscoveryBrief } from "@/lib/types";

const QUESTIONS: { key: keyof Omit<DiscoveryBrief, "completedOn">; label: string; hint: string }[] = [
  { key: "brandInOneSentence", label: "What is the brand, in one sentence?", hint: "Their words, not yours." },
  { key: "targetAudience", label: "Who is the target audience?", hint: "Age, place, what they buy today." },
  { key: "positioning", label: "What is the positioning?", hint: "Premium / value / local / modern…" },
  { key: "businessObjective", label: "What is the business objective?", hint: "Launch, rebrand, new shelf presence, investor deck…" },
  { key: "communicateAndAvoid", label: "What should the brand communicate — and avoid?", hint: "Must-haves and must-avoids." },
  { key: "competitors", label: "Who are the competitors?", hint: "3–5 names for R&D to study." },
  { key: "deliverablesAndDeadline", label: "What are the exact deliverables and deadline?", hint: "Confirm against the package sold." },
  { key: "expectsToSeeFirst", label: "What does the client expect to see first?", hint: "Sketches? One direction? A 5-page mockup?" },
  { key: "referencesAndConstraints", label: "Any reference direction or strategic constraint?", hint: "Logos they love/hate, print sizes, existing assets." },
];

const empty = (): DiscoveryBrief => ({ brandInOneSentence: "", targetAudience: "", positioning: "", businessObjective: "", communicateAndAvoid: "", competitors: "", deliverablesAndDeadline: "", expectsToSeeFirst: "", referencesAndConstraints: "" });

export function DiscoveryCall({ projectId }: { projectId: string }) {
  const { db, act } = useDb();
  const router = useRouter();
  const p = db.projects.find((x) => x.id === projectId);
  const [form, setForm] = useState<DiscoveryBrief>(p?.brief ?? empty());
  if (!p) return <Empty text="Project not found." />;
  const client = db.clients.find((c) => c.id === p.clientId)!;
  const product = productById(p.product);
  const st = projectStage(db, p);
  const answered = QUESTIONS.filter((q) => form[q.key].trim()).length;
  const flagged = QUESTIONS.length - answered;
  const done = !!p.brief?.completedOn;
  const canComplete = !done && (st === "Discovery" || st === "Awaiting advance" || st === "Brief ready") && answered >= 5;

  const complete = () => {
    act.completeDiscovery(p.id, form);
    router.push(`/projects/${p.id}`);
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Discovery calls", href: "/discovery" }, { label: p.code }]}
        title={`Discovery call — ${client.name}`}
        subtitle={`${p.name} · ${product.name} · ${inr(p.price)} · deadline ${relDays(p.clientDeadline)}`}
        badge={<><PriorityPill p={p.priority} /><Pill tone={stageTone(st)}>{st}</Pill>{done && <Pill tone="green">Brief completed {p.brief?.completedOn}</Pill>}</>}
        actions={!done && <button className="btn-primary btn-sm" disabled={!canComplete} onClick={complete} title={canComplete ? "" : "Answer at least 5 questions; flag the rest"}><Send size={13} /> Complete & hand brief to R&D</button>}
      />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Card title="Briefing checklist" subtitle="An assumed answer that turns out wrong is exactly what produces a revision round that didn't need to happen.">
          <div className="space-y-4">
            {QUESTIONS.map((q, i) => {
              const v = form[q.key];
              return (
                <div key={q.key}>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-slate-800">{i + 1}. {q.label}</span>
                    {!v.trim() && <Pill tone="amber" mono><Flag size={10} className="mr-1 inline" />CLIENT INPUT REQUIRED</Pill>}
                  </div>
                  <textarea className="input mt-1 h-16 py-2" value={v} disabled={done} placeholder={q.hint} onChange={(e) => setForm({ ...form, [q.key]: e.target.value })} />
                </div>
              );
            })}
          </div>
        </Card>
        <div className="space-y-4">
          <Card title="Progress">
            <div className="mb-1 flex justify-between text-[12.5px]"><span>Answered</span><span className="font-mono">{answered}/{QUESTIONS.length}</span></div>
            <Progress value={(answered / QUESTIONS.length) * 100} tone={answered === QUESTIONS.length ? "green" : "brand"} />
            {flagged > 0 && <p className="mt-2 text-[12px] text-amber-700">{flagged} item(s) will be handed to R&D flagged <b>[CLIENT INPUT REQUIRED]</b> so nothing is assumed.</p>}
            {!p.advancePaid && <Callout tone="amber" title="Advance not received">You can run the call now, but the brief waits at “Brief ready” and won&apos;t enter the R&D queue until the 50% advance is recorded.</Callout>}
          </Card>
          <Card title="From the sales handover">
            <Facts cols={1} items={[{ label: "Package sold", value: `${product.name} — ${inr(p.price)}` }, { label: "Included revisions", value: product.includedRevisions }, { label: "Deliverables", value: product.deliverables.join(", ") }, { label: "Contact", value: `${client.contact} · ${client.phone}` }, { label: "Route", value: p.route === "with-sketch" ? "R&D → Sketch → Logo" : "R&D → Design" }]} />
          </Card>
          <Card title="After the call">
            <ol className="space-y-1.5 text-[12.5px] text-slate-700">
              <li>1. Collect logos, photos and references into Drive / 01_Brief</li>
              <li>2. Log meeting notes here (not only in WhatsApp)</li>
              <li>3. Hand the Project Brief to R&D with its priority</li>
              <li>4. R&D flags anything unclear back to you before researching</li>
            </ol>
          </Card>
        </div>
      </div>
    </>
  );
}
