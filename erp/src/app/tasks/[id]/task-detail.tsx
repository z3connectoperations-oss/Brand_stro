"use client";

import Link from "next/link";
import { useState } from "react";
import { Upload, Send, Flag, FileText } from "lucide-react";
import { PageHeader, Card, Pill, Facts, Callout, PriorityPill, Progress, Empty } from "@/components/ui/primitives";
import { Avatar } from "@/components/ui/avatar";
import { Checklist } from "@/components/ui/checklist";
import { useDb } from "@/lib/use-db";
import { useMe } from "@/lib/role-context";
import { byId, productById } from "@/data/people";
import { logoQc, packagingQc } from "@/data/ops";
import { stageTone } from "@/lib/selectors";
import { relDays } from "@/lib/format";

export function TaskDetail({ id }: { id: string }) {
  const { db, act } = useDb();
  const { me } = useMe();
  const [selfChecked, setSelfChecked] = useState(false);
  const d = db.deliverables.find((x) => x.id === id);
  if (!d) return <Empty text="Task not found." />;
  const p = db.projects.find((x) => x.id === d.projectId)!;
  const client = db.clients.find((c) => c.id === p.clientId)!;
  const product = productById(p.product);
  const assignee = byId(d.assigneeId);
  const tl = byId(d.team === "logo" ? "E07" : "E11");
  const qc = d.team === "logo" ? logoQc : packagingQc;
  const fb = db.feedback.filter((f) => f.deliverableId === d.id);
  const clientCode = client.name.replace(/\s+/g, "").replace(/[^A-Za-z0-9]/g, "");
  const nextName = `${clientCode}_${d.type.replace(/\s+/g, "")}_v${d.version + 1}_2026-09-21`;
  const versions = Array.from({ length: d.version }, (_, i) => `${clientCode}_${d.type.replace(/\s+/g, "")}_v${i + 1}_2026-09-${String(10 + i * 3).padStart(2, "0")}`);
  const canSubmit = (d.stage === "In design" || d.stage === "In correction") && (me.id === d.assigneeId || me.role === "team-leader" || me.role === "creative-head");

  return (
    <>
      <PageHeader
        crumbs={[{ label: "My tasks", href: "/tasks" }, { label: p.code, href: `/projects/${p.id}` }, { label: d.type }]}
        title={`${d.type} — ${client.name}`}
        subtitle={`${p.name} · ${product.name}`}
        badge={<><PriorityPill p={p.priority} /><Pill tone={stageTone(d.stage)}>{d.stage}</Pill></>}
        actions={<>
          <button className="btn-secondary btn-sm"><Flag size={13} /> Flag scope question to TL</button>
          <button className="btn-secondary btn-sm"><Upload size={13} /> Upload v{d.version + 1}</button>
          {canSubmit && <button className="btn-primary btn-sm" disabled={!selfChecked} title={selfChecked ? "" : "Complete the self-check first"} onClick={() => act.submitToTl(d.id)}><Send size={13} /> Submit v{d.version + 1} to {tl?.name.split(" ")[0]}</button>}
        </>}
      />
      {d.stage === "TL review" && <div className="mb-4"><Callout tone="violet" title="With your Team Leader">v{d.version} is in first-level review. You&apos;ll get it back as “Ready for client” or with rework notes.</Callout></div>}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          {fb.filter((f) => f.status !== "Approved").map((f) => (
            <Card key={f.id} title={`Correction round ${f.round} — ${f.status === "Assigned" ? `assigned by ${tl?.name}` : "logged by CRM, not yet classified"}`} subtitle={`Received ${f.receivedAt.replace("T", " ")} via ${f.channel}`}>
              <blockquote className="border-l-2 border-brand-600 pl-3 text-[13px] italic text-slate-700">“{f.text}”</blockquote>
              <div className="mt-3 flex flex-wrap gap-2">
                <Pill tone={f.classification === "Scope change" ? "red" : f.classification === "Unclear" ? "amber" : "green"}>{f.classification}</Pill>
                {f.rootCause && <Pill>{f.rootCause}</Pill>}
                <Pill mono>Round {f.round} of {product.includedRevisions}</Pill>
              </div>
              {f.classification === "Scope change" && <Callout tone="red" title="Don't start yet">This asks for a different direction, not a refinement. That&apos;s a scope question for your TL and the Founder, not yours to resolve.</Callout>}
              {f.classification === "Unclear" && <Callout tone="amber">The CRM is clarifying this with the client. Don&apos;t guess your way through it.</Callout>}
            </Card>
          ))}

          <Card title="Brief & direction">
            <Facts cols={2} items={[{ label: "Research brief", value: <Link href={`/queue/${p.id}`} className="text-brand-700">Drive / 02_R&D / {clientCode}_Brief.pdf</Link> }, { label: d.team === "logo" ? "Sketch concept" : "Brand direction", value: d.team === "logo" ? "Concept 3 (combination mark) — approved by TL" : "Approved identity: saffron + forest green" }, { label: "Must-haves", value: p.brief?.communicateAndAvoid || "Scalable, works in black & white, warm palette" }, { label: "Must-avoids", value: "Clip-art leaves, more than 2 typefaces" }]} />
          </Card>

          <Card title="Versions" subtitle="Never overwrite. Working files stay in your folder; only the TL-approved final goes to 08_Final Files." padded={false}>
            <ul className="divide-y divide-slate-100">
              {versions.map((v, i) => (
                <li key={v} className="flex items-center gap-3 px-4 py-2.5 text-[12.5px]"><FileText size={14} className="text-slate-400" /><code className="flex-1 font-mono text-[11.5px]">{v}</code>{i === versions.length - 1 ? <Pill tone="brand">Current</Pill> : <Pill>Superseded</Pill>}</li>
              ))}
              <li className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 text-[12.5px]"><Upload size={14} className="text-brand-600" /><code className="flex-1 font-mono text-[11.5px] text-slate-500">{nextName}</code><span className="text-[11px] text-slate-500">next upload name</span></li>
            </ul>
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Self-check before you submit" subtitle={d.team === "logo" ? "Logo QC checklist" : "Print-readiness checklist"}>
            <Checklist items={qc} onAllChecked={setSelfChecked} />
            <p className="mt-3 text-[11.5px] text-slate-500">{d.team === "logo" ? "Catching an issue yourself before your TL does is the fastest way to build trust." : "A dimension, bleed or information error caught by you is free. The same error after a client approves it for print is not."}</p>
          </Card>
          <Card title="Status">
            <Facts cols={2} items={[{ label: "Assignee", value: <span className="flex items-center gap-1.5"><Avatar employee={assignee} size="sm" />{assignee?.name ?? "Unassigned"}</span> }, { label: "Team Leader", value: tl?.name }, { label: "Due", value: relDays(d.dueDate) }, { label: "Version", value: d.version ? `v${d.version}` : "—" }]} />
            <div className="mt-3">
              <div className="mb-1 flex justify-between text-[12px]"><span>Client rounds used</span><span className="font-mono">{d.revisionCount}/{product.includedRevisions}</span></div>
              <Progress value={(d.revisionCount / product.includedRevisions) * 100} tone={d.revisionCount >= product.includedRevisions ? "red" : "brand"} />
            </div>
            <Callout tone="slate">Missing your deadline? Tell your TL early, not at the deadline. Talking to the client: not unless the CRM or Founder authorises it.</Callout>
          </Card>
        </div>
      </div>
    </>
  );
}
