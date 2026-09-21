"use client";

import Link from "next/link";
import { useState } from "react";
import { Send, CheckCircle2, HelpCircle, ShieldAlert } from "lucide-react";
import { PageHeader, Card, Pill, Table, Kpi, KpiGrid, Chips, Callout } from "@/components/ui/primitives";
import { deliverables, feedback, projectById } from "@/data/projects";
import { clientById } from "@/data/clients";
import { productById } from "@/data/people";
import { useMe } from "@/lib/role-context";
import { relDays, inr } from "@/lib/format";

export default function ApprovalsPage() {
  const { me } = useMe();
  const isFounder = me.role === "founder";
  const [tab, setTab] = useState(isFounder ? "scope" : "submit");
  const ready = deliverables.filter((d) => d.stage === "Ready for client");
  const withClient = deliverables.filter((d) => d.stage === "With client");
  const toClassify = feedback.filter((f) => f.status === "Logged");
  const scope = feedback.filter((f) => f.classification === "Scope change");
  const approved = deliverables.filter((d) => d.stage === "Client approved");

  return (
    <>
      <PageHeader
        title={isFounder ? "Approvals & scope decisions" : "Approvals & feedback"}
        subtitle={isFounder ? "Pricing and commitment are the Founder's call. Decide each scope-change request with the package details in front of you." : "Submit → acknowledge → log feedback → classify → assign or escalate → resubmit → sign-off."}
      />
      <KpiGrid cols={5}>
        <Kpi label="Ready to submit" value={ready.length} hint="Same business day" tone="violet" />
        <Kpi label="Waiting on client" value={withClient.length} hint="Follow up at 3 days" tone="amber" />
        <Kpi label="Feedback to classify" value={toClassify.length} hint="In scope / scope change / unclear" tone="brand" />
        <Kpi label="Scope decisions" value={scope.length} hint="Founder decides" tone="red" />
        <Kpi label="Signed off" value={approved.length} hint="Collect final 50%" tone="green" />
      </KpiGrid>
      <div className="mb-3">
        <Chips items={[{ key: "submit", label: "Submit", count: ready.length }, { key: "client", label: "With client", count: withClient.length }, { key: "classify", label: "Classify feedback", count: toClassify.length }, { key: "scope", label: "Scope changes", count: scope.length }, { key: "signoff", label: "Sign-offs", count: approved.length }]} active={tab} onChange={setTab} />
      </div>

      {tab === "submit" && (
        <Card padded={false}>
          <Table head={["Deliverable", "Project", "Client", "Version", "TL passed", "Due", ""]}>
            {ready.map((d) => { const p = projectById(d.projectId)!; return (
              <tr key={d.id} className="table-row">
                <td className="font-medium">{d.type}</td><td>{p.name}</td><td>{clientById(p.clientId).name}</td><td className="font-mono">v{d.version}</td><td><Pill tone="green">Yes</Pill></td><td>{relDays(d.dueDate)}</td>
                <td><button className="btn-primary btn-sm"><Send size={13} /> Submit & log</button></td>
              </tr>); })}
            {ready.length === 0 && <tr><td colSpan={7} className="py-8 text-center text-slate-500">Nothing ready. Production submits through TL review first.</td></tr>}
          </Table>
        </Card>
      )}

      {tab === "client" && (
        <Card padded={false}>
          <Table head={["Deliverable", "Project", "Client", "Sent", "Waiting", "Next", ""]}>
            {withClient.map((d) => { const p = projectById(d.projectId)!; return (
              <tr key={d.id} className="table-row">
                <td className="font-medium">{d.type}</td><td>{p.name}</td><td>{clientById(p.clientId).name}</td><td className="font-mono">2026-09-18</td><td className="font-mono">3 days</td><td><Pill tone="amber">Send update (3+ day rule)</Pill></td>
                <td className="space-x-1"><button className="btn-secondary btn-sm">Nudge</button><button className="btn-primary btn-sm"><CheckCircle2 size={13} /> Record sign-off</button></td>
              </tr>); })}
          </Table>
        </Card>
      )}

      {tab === "classify" && (
        <div className="space-y-3">
          <Callout tone="brand" title="Decide this before you agree to anything">Within scope: refining an agreed direction, fixing an error, a round already included. Scope change: a different concept after approval, a new deliverable, rounds beyond the package.</Callout>
          {toClassify.map((f) => { const d = deliverables.find((x) => x.id === f.deliverableId)!; const p = projectById(f.projectId)!; const prod = productById(p.product); return (
            <Card key={f.id} title={`${d.type} · ${clientById(p.clientId).name}`} subtitle={`${f.receivedAt.replace("T", " ")} via ${f.channel} · round ${f.round} of ${prod.includedRevisions} included`}>
              <blockquote className="border-l-2 border-brand-600 pl-3 text-[13px] italic">“{f.text}”</blockquote>
              <div className="mt-3 flex flex-wrap gap-2">
                <button className="btn-secondary btn-sm"><HelpCircle size={13} /> Unclear — ask client</button>
                <button className="btn-secondary btn-sm border-emerald-200 bg-emerald-50 text-emerald-800"><CheckCircle2 size={13} /> In scope — assign to TL</button>
                <button className="btn-secondary btn-sm border-red-200 bg-red-50 text-red-700"><ShieldAlert size={13} /> Scope change — escalate to Founder</button>
              </div>
              {f.round > prod.includedRevisions && <p className="mt-2 text-[12px] font-medium text-red-600">Round {f.round} exceeds the {prod.includedRevisions} included — this is a scope change unless the Founder says otherwise.</p>}
            </Card>); })}
          {toClassify.length === 0 && <Card><p className="text-center text-slate-500">All feedback classified.</p></Card>}
        </div>
      )}

      {tab === "scope" && (
        <div className="space-y-3">
          {scope.map((f) => { const d = deliverables.find((x) => x.id === f.deliverableId)!; const p = projectById(f.projectId)!; const prod = productById(p.product); return (
            <Card key={f.id} title={`${clientById(p.clientId).name} — ${d.type}`} subtitle={`${prod.name} · ${inr(p.price)} · ${prod.includedRevisions} rounds included · round ${f.round} requested`}>
              <blockquote className="border-l-2 border-red-500 pl-3 text-[13px] italic">“{f.text}”</blockquote>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-slate-200 p-3"><div className="label-sm">Option A</div><div className="mt-1 text-[13px] font-medium">Approve as paid extra</div><div className="text-[12px] text-slate-500">Quote an additional round at a set price</div></div>
                <div className="rounded-lg border border-slate-200 p-3"><div className="label-sm">Option B</div><div className="mt-1 text-[13px] font-medium">Approve as goodwill</div><div className="text-[12px] text-slate-500">Unpaid; designer still gets tier credit if flagged</div></div>
                <div className="rounded-lg border border-slate-200 p-3"><div className="label-sm">Option C</div><div className="mt-1 text-[13px] font-medium">Decline</div><div className="text-[12px] text-slate-500">CRM communicates decision to client</div></div>
              </div>
              {isFounder ? (
                <div className="mt-3 flex flex-wrap gap-2"><button className="btn-primary btn-sm">Approve — paid</button><button className="btn-secondary btn-sm">Approve — goodwill</button><button className="btn-danger btn-sm">Decline</button></div>
              ) : (
                <Callout tone="amber">Escalated to the Founder on {f.receivedAt.slice(0, 10)}. Don&apos;t respond to the client until the decision is logged here. <Link href={`/projects/${p.id}`} className="font-semibold underline">Project</Link></Callout>
              )}
            </Card>); })}
        </div>
      )}

      {tab === "signoff" && (
        <Card padded={false}>
          <Table head={["Deliverable", "Project", "Client", "Approved", "Final 50%", "Next"]}>
            {approved.map((d) => { const p = projectById(d.projectId)!; return (
              <tr key={d.id} className="table-row">
                <td className="font-medium">{d.type}</td><td>{p.name}</td><td>{clientById(p.clientId).name}</td><td><Pill tone="green">Signed off</Pill></td>
                <td>{p.finalPaid ? <Pill tone="green">Paid</Pill> : <Pill tone="amber">Pending</Pill>}</td>
                <td>{p.finalPaid ? "Release final files" : <Link href="/payments" className="text-brand-700">Collect final payment →</Link>}</td>
              </tr>); })}
          </Table>
        </Card>
      )}
    </>
  );
}
