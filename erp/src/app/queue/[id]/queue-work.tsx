"use client";

import { useState } from "react";
import { Send, Save, Flag } from "lucide-react";
import { PageHeader, Card, Pill, Facts, Callout, PriorityPill, Progress } from "@/components/ui/primitives";
import { Checklist } from "@/components/ui/checklist";
import { projectById } from "@/data/projects";
import { clientById } from "@/data/clients";
import { productById } from "@/data/people";
import { researchBriefSections, sketchQc } from "@/data/ops";
import { useMe } from "@/lib/role-context";
import { relDays } from "@/lib/format";

/** R&D sees the 6-section research brief; the Sketch Artist sees the 3–5 concept submission. */
export function QueueWork({ projectId }: { projectId: string }) {
  const { me } = useMe();
  const p = projectById(projectId)!;
  const client = clientById(p.clientId);
  const product = productById(p.product);
  const isRnd = me.role !== "sketch";
  const [sections, setSections] = useState<string[]>(Array(researchBriefSections.length).fill(""));
  const [concepts, setConcepts] = useState<{ title: string; rationale: string }[]>([
    { title: "Wordmark", rationale: "" },
    { title: "Symbol", rationale: "" },
    { title: "Combination mark", rationale: "" },
  ]);
  const filled = sections.filter((s) => s.trim()).length;
  const conceptsOk = concepts.length >= 3 && concepts.length <= 5 && concepts.every((c) => c.title.trim() && c.rationale.trim());
  const nextOwner = product.usesSketch ? "Sketch Artist (Gautam V.)" : "Packaging Team Leader (Shalin M.)";

  return (
    <>
      <PageHeader
        crumbs={[{ label: isRnd ? "Research queue" : "Sketch queue", href: "/queue" }, { label: p.code }]}
        title={isRnd ? `Research brief — ${client.name}` : `Concept set — ${client.name}`}
        subtitle={`${p.name} · ${product.name} · deadline ${relDays(p.clientDeadline)}`}
        badge={<><PriorityPill p={p.priority} /><Pill tone="brand">{isRnd ? "R&D in progress" : "Sketching"}</Pill></>}
        actions={<><button className="btn-secondary btn-sm"><Save size={13} /> Save draft</button><button className="btn-secondary btn-sm"><Flag size={13} /> Flag unclear brief to CRM</button></>}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          {isRnd ? (
            <Card title="Structured research brief" subtitle="Every project, every time. A brief that hits every box is worth more than a longer, scattered one.">
              <div className="space-y-4">
                {researchBriefSections.map((label, i) => (
                  <label key={label} className="block">
                    <span className="label-sm">{i + 1}. {label}</span>
                    <textarea className="input mt-1 h-20 py-2" value={sections[i]} onChange={(e) => setSections(sections.map((s, j) => (j === i ? e.target.value : s)))} placeholder={i === 2 ? "3–5 competitor or category examples with what works / doesn't" : ""} />
                  </label>
                ))}
              </div>
            </Card>
          ) : (
            <Card title="Sketch concepts" subtitle="3–5 genuinely different directions — a wordmark vs. a symbol vs. a combination mark, not variations of one idea." actions={concepts.length < 5 && <button className="btn-secondary btn-sm" onClick={() => setConcepts([...concepts, { title: "", rationale: "" }])}>+ Concept</button>}>
              <div className="space-y-3">
                {concepts.map((c, i) => (
                  <div key={i} className="grid gap-2 rounded-lg border border-slate-200 p-3 sm:grid-cols-[160px_1fr]">
                    <div>
                      <span className="label-sm">Concept {i + 1}</span>
                      <input className="input mt-1" value={c.title} onChange={(e) => setConcepts(concepts.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} placeholder="Direction" />
                    </div>
                    <div>
                      <span className="label-sm">One-line rationale</span>
                      <input className="input mt-1" value={c.rationale} onChange={(e) => setConcepts(concepts.map((x, j) => (j === i ? { ...x, rationale: e.target.value } : x)))} placeholder="Why this direction fits the brief" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Checklist title="Self-check before you submit" items={sketchQc} />
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card title="Project brief from CRM">
            <Facts cols={1} items={[{ label: "Client", value: `${client.name} · ${client.industry}` }, { label: "Package", value: product.name }, { label: "Contact", value: client.contact }, { label: "Must-haves / must-avoids", value: "Warm, natural palette; avoid clip-art leaf motifs (from discovery call)" }, { label: "References", value: "Drive / 01_Brief / references (6 files)" }]} />
            <Callout tone="amber">If anything here is unclear, flag it back to the CRM before researching on an assumption.</Callout>
          </Card>
          <Card title="Handoff">
            {isRnd ? (
              <>
                <div className="mb-1 flex justify-between text-[12.5px]"><span>Sections complete</span><span className="font-mono">{filled}/{researchBriefSections.length}</span></div>
                <Progress value={(filled / researchBriefSections.length) * 100} tone={filled === researchBriefSections.length ? "green" : "brand"} />
              </>
            ) : (
              <div className="text-[12.5px]">{concepts.length} concepts · {conceptsOk ? <Pill tone="green">Ready</Pill> : <Pill tone="amber">Fill every title and rationale</Pill>}</div>
            )}
            <ol className="mt-3 space-y-1.5 text-[12px] text-slate-600">
              <li>1. Mark complete in the Project Tracker</li>
              <li>2. Tag next owner: <b>{isRnd ? nextOwner : "Logo Team Leader (Akhil P.)"}</b></li>
              <li>3. Save to Drive / {isRnd ? "02_R&D" : "03_Sketch"}</li>
              <li>4. Wait for acknowledgement — unacknowledged = not started</li>
            </ol>
            <button className="btn-primary mt-4 w-full justify-center" disabled={isRnd ? filled < researchBriefSections.length : !conceptsOk}>
              <Send size={14} /> {isRnd ? "Complete & hand off" : "Submit to Logo Team Leader"}
            </button>
          </Card>
        </div>
      </div>
    </>
  );
}
