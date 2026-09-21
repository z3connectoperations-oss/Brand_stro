"use client";

import Link from "next/link";
import { useState } from "react";
import { Send, CheckCircle2, HelpCircle, ShieldAlert, Plus } from "lucide-react";
import { PageHeader, Card, Pill, Table, Kpi, KpiGrid, Chips, Callout } from "@/components/ui/primitives";
import { LogFeedbackModal } from "@/components/forms/log-feedback";
import { useDb } from "@/lib/use-db";
import { useMe } from "@/lib/role-context";
import { productById } from "@/data/people";
import { relDays, inr, hoursAgo } from "@/lib/format";
import type { Feedback } from "@/lib/types";

export default function ApprovalsPage() {
  const { me } = useMe();
  const { db, act } = useDb();
  const isFounder = me.role === "founder";
  const [tab, setTab] = useState(isFounder ? "scope" : "submit");
  const [log, setLog] = useState<string | null>(null);
  const [cause, setCause] = useState<Record<string, Feedback["rootCause"]>>({});
  const ready = db.deliverables.filter((d) => d.stage === "Ready for client");
  const withClient = db.deliverables.filter((d) => d.stage === "With client");
  const toClassify = db.feedback.filter((f) => f.status === "Logged" && f.classification !== "Scope change");
  const scope = db.feedback.filter((f) => f.classification === "Scope change" && f.status === "Logged");
  const approved = db.deliverables.filter((d) => ["Client approved", "Awaiting final payment"].includes(d.stage));
  const client = (id: string) => db.clients.find((c) => c.id === id)?.name;
  const proj = (id: string) => db.projects.find((p) => p.id === id)!;

  return (
    <>
      <PageHeader
        title={isFounder ? "Approvals & scope decisions" : "Approvals & feedback"}
        subtitle={isFounder ? "Pricing and commitment are the Founder's call. Decide each scope-change request with the package details in front of you." : "Submit → acknowledge → log feedback → classify → assign or escalate → resubmit → sign-off."}
        actions={<button className="btn-primary btn-sm" onClick={() => setLog("")}><Plus size={14} /> Log feedback</button>}
      />
      {log !== null && <LogFeedbackModal open onClose={() => setLog(null)} deliverableId={log || undefined} />}
      <KpiGrid cols={5}>
        <Kpi label="Ready to submit" value={ready.length} hint="Same business day" tone="violet" />
        <Kpi label="Waiting on client" value={withClient.length} hint="Follow up at 3 days" tone="amber" />
        <Kpi label="Feedback to classify" value={toClassify.length} hint="In scope / scope change / unclear" tone="brand" />
        <Kpi label="Scope decisions" value={scope.length} hint="Founder decides" tone="red" />
        <Kpi label="Signed off" value={approved.length} hint="Collect final 50%" tone="green" />
      </KpiGrid>
      <div className="mb-3"><Chips items={[{ key: "submit", label: "Submit", count: ready.length }, { key: "client", label: "With client", count: withClient.length }, { key: "classify", label: "Classify feedback", count: toClassify.length }, { key: "scope", label: "Scope changes", count: scope.length }, { key: "signoff", label: "Sign-offs", count: approved.length }]} active={tab} onChange={setTab} /></div>

      {tab === "submit" && (
        <Card padded={false}>
          <Table head={["Deliverable", "Project", "Client", "Version", "TL passed", "Due", ""]}>
            {ready.map((d) => { const p = proj(d.projectId); return (
              <tr key={d.id} className="table-row"><td className="font-medium">{d.type}</td><td>{p.name}</td><td>{client(p.clientId)}</td><td className="font-mono">v{d.version}</td><td><Pill tone="green">Yes</Pill></td><td>{relDays(d.dueDate)}</td>
                <td><button className="btn-primary btn-sm" onClick={() => act.submitToClient(d.id)}><Send size={13} /> Submit & log</button></td></tr>); })}
            {ready.length === 0 && <tr><td colSpan={7} className="py-8 text-center text-slate-500">Nothing ready. Production submits through TL review first.</td></tr>}
          </Table>
        </Card>
      )}

      {tab === "client" && (
        <Card padded={false}>
          <Table head={["Deliverable", "Project", "Client", "Version", "Rounds used", "Due", ""]}>
            {withClient.map((d) => { const p = proj(d.projectId); return (
              <tr key={d.id} className="table-row"><td className="font-medium">{d.type}</td><td>{p.name}</td><td>{client(p.clientId)}</td><td className="font-mono">v{d.version}</td><td className="font-mono">{d.revisionCount}/{productById(p.product).includedRevisions}</td><td>{relDays(d.dueDate)}</td>
                <td className="space-x-1 whitespace-nowrap"><button className="btn-secondary btn-sm" onClick={() => setLog(d.id)}>Log feedback</button><button className="btn-primary btn-sm" onClick={() => act.recordSignOff(d.id)}><CheckCircle2 size={13} /> Record sign-off</button></td></tr>); })}
            {withClient.length === 0 && <tr><td colSpan={7} className="py-8 text-center text-slate-500">Nothing with the client.</td></tr>}
          </Table>
        </Card>
      )}

      {tab === "classify" && (
        <div className="space-y-3">
          <Callout tone="brand" title="Decide this before you agree to anything">Within scope: refining an agreed direction, fixing an error, a round already included. Scope change: a different concept after approval, a new deliverable, rounds beyond the package.</Callout>
          {toClassify.map((f) => { const d = db.deliverables.find((x) => x.id === f.deliverableId)!; const p = proj(f.projectId); const prod = productById(p.product); const over = f.round > prod.includedRevisions; return (
            <Card key={f.id} title={`${d.type} · ${client(p.clientId)}`} subtitle={`${f.receivedAt.replace("T", " ")} via ${f.channel} · round ${f.round} of ${prod.includedRevisions} included · waiting ${hoursAgo(f.receivedAt)}h`}>
              <blockquote className="border-l-2 border-brand-600 pl-3 text-[13px] italic">“{f.text}”</blockquote>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="label-sm">Root cause</span>
                {(["Design miss", "Client preference"] as const).map((rc) => <button key={rc} onClick={() => setCause({ ...cause, [f.id]: rc })} className={`rounded-full border px-2.5 py-0.5 text-[11.5px] font-medium ${cause[f.id] === rc ? "border-brand-600 bg-brand-600 text-white" : "border-slate-200 bg-white text-slate-600"}`}>{rc}</button>)}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button className="btn-secondary btn-sm" onClick={() => act.classifyFeedback(f.id, "Unclear", cause[f.id])}><HelpCircle size={13} /> Unclear — ask client</button>
                <button className="btn-secondary btn-sm border-emerald-200 bg-emerald-50 text-emerald-800" disabled={over} title={over ? "Beyond included rounds — escalate" : ""} onClick={() => act.classifyFeedback(f.id, "In scope", cause[f.id])}><CheckCircle2 size={13} /> In scope — assign to team</button>
                <button className="btn-secondary btn-sm border-red-200 bg-red-50 text-red-700" onClick={() => act.classifyFeedback(f.id, "Scope change", cause[f.id])}><ShieldAlert size={13} /> Scope change — escalate to Founder</button>
              </div>
              {over && <p className="mt-2 text-[12px] font-medium text-red-600">Round {f.round} exceeds the {prod.includedRevisions} included — this is a scope change unless the Founder says otherwise.</p>}
            </Card>); })}
          {toClassify.length === 0 && <Card><p className="text-center text-slate-500">All feedback classified.</p></Card>}
        </div>
      )}

      {tab === "scope" && (
        <div className="space-y-3">
          {scope.map((f) => { const d = db.deliverables.find((x) => x.id === f.deliverableId)!; const p = proj(f.projectId); const prod = productById(p.product); return (
            <Card key={f.id} title={`${client(p.clientId)} — ${d.type}`} subtitle={`${prod.name} · ${inr(p.price)} · ${prod.includedRevisions} rounds included · round ${f.round} requested`}>
              <blockquote className="border-l-2 border-red-500 pl-3 text-[13px] italic">“{f.text}”</blockquote>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-slate-200 p-3"><div className="label-sm">Option A</div><div className="mt-1 text-[13px] font-medium">Approve as paid extra</div><div className="text-[12px] text-slate-500">Quote an additional round at a set price</div></div>
                <div className="rounded-lg border border-slate-200 p-3"><div className="label-sm">Option B</div><div className="mt-1 text-[13px] font-medium">Approve as goodwill</div><div className="text-[12px] text-slate-500">Unpaid; designer still gets tier credit if flagged</div></div>
                <div className="rounded-lg border border-slate-200 p-3"><div className="label-sm">Option C</div><div className="mt-1 text-[13px] font-medium">Decline</div><div className="text-[12px] text-slate-500">CRM communicates decision to client</div></div>
              </div>
              {isFounder ? (
                <div className="mt-3 flex flex-wrap gap-2"><button className="btn-primary btn-sm" onClick={() => act.decideScope(f.id, "paid")}>Approve — paid</button><button className="btn-secondary btn-sm" onClick={() => act.decideScope(f.id, "goodwill")}>Approve — goodwill</button><button className="btn-danger btn-sm" onClick={() => act.decideScope(f.id, "decline")}>Decline</button></div>
              ) : (
                <Callout tone="amber">Escalated to the Founder on {f.receivedAt.slice(0, 10)}. Don&apos;t respond to the client until the decision is logged here. <Link href={`/projects/${p.id}`} className="font-semibold underline">Project</Link></Callout>
              )}
            </Card>); })}
          {scope.length === 0 && <Card><p className="text-center text-slate-500">No scope decisions pending.</p></Card>}
        </div>
      )}

      {tab === "signoff" && (
        <Card padded={false}>
          <Table head={["Deliverable", "Project", "Client", "Stage", "Final 50%", "Next"]}>
            {approved.map((d) => { const p = proj(d.projectId); const fin = db.payments.find((x) => x.projectId === p.id && x.milestone === "Final 50%"); return (
              <tr key={d.id} className="table-row"><td className="font-medium">{d.type}</td><td>{p.name}</td><td>{client(p.clientId)}</td><td><Pill tone="green">{d.stage}</Pill></td>
                <td>{p.finalPaid ? <Pill tone="green">Paid</Pill> : <Pill tone="amber">Pending</Pill>}</td>
                <td>{p.finalPaid ? "Release final files" : fin ? <button className="btn-primary btn-sm" onClick={() => act.recordPayment(fin.id)}>Record final payment</button> : "—"}</td></tr>); })}
            {approved.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-slate-500">No sign-offs yet.</td></tr>}
          </Table>
        </Card>
      )}
    </>
  );
}
