"use client";

import Link from "next/link";
import { useState } from "react";
import { Phone, MessageCircle, CalendarPlus, Check } from "lucide-react";
import { PageHeader, Card, Pill, Facts, Table, Progress, Callout, Empty } from "@/components/ui/primitives";
import { Checklist } from "@/components/ui/checklist";
import { CreateProjectModal } from "@/components/forms/create-project";
import { LogComplaintModal } from "@/components/forms/misc-forms";
import { useDb } from "@/lib/use-db";
import { productById } from "@/data/people";
import { projectStage, stageTone, projectProgress, slaState } from "@/lib/selectors";
import { inr, relDays } from "@/lib/format";

export function ClientDetail({ id }: { id: string }) {
  const { db, act } = useDb();
  const [modal, setModal] = useState<"project" | "complaint" | null>(null);
  const client = db.clients.find((c) => c.id === id);
  if (!client) return <Empty text="Client not found." />;
  const ps = db.projects.filter((p) => p.clientId === client.id);
  const pays = db.payments.filter((p) => ps.some((x) => x.id === p.projectId));
  const fb = db.feedback.filter((f) => ps.some((x) => x.id === f.projectId));
  const cms = db.complaints.filter((c) => c.clientId === client.id);
  const th = db.threads.filter((t) => t.clientId === client.id);
  const obDone = client.onboarding.filter((s) => s.done).length;
  const obItems = client.onboarding.map((s, i) => ({ id: `ob${i}`, label: s.step }));

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Clients", href: "/clients" }, { label: client.name }]}
        title={client.name}
        subtitle={`${client.industry} · ${client.contact} · ${client.phone} · ${client.email}`}
        badge={<>{client.tier === "Important" && <Pill tone="amber">Important</Pill>}<Pill tone="green">Active</Pill></>}
        actions={<><button className="btn-secondary btn-sm"><Phone size={13} /> Call</button><button className="btn-secondary btn-sm"><MessageCircle size={13} /> WhatsApp</button><button className="btn-secondary btn-sm"><CalendarPlus size={13} /> Schedule meeting</button><button className="btn-secondary btn-sm" onClick={() => setModal("complaint")}>Log complaint</button><button className="btn-primary btn-sm" onClick={() => setModal("project")}>+ Project</button></>}
      />
      <CreateProjectModal open={modal === "project"} onClose={() => setModal(null)} clientId={client.id} />
      <LogComplaintModal open={modal === "complaint"} onClose={() => setModal(null)} clientId={client.id} />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <Card title="Projects" padded={false}>
            <Table head={["Project", "Product", "Stage", "Progress", "Deadline", "Payment"]}>
              {ps.map((p) => { const st = projectStage(db, p); return (
                <tr key={p.id} className="table-row">
                  <td><Link href={`/projects/${p.id}`} className="font-medium hover:text-brand-700">{p.name}</Link><div className="font-mono text-[11px] text-slate-400">{p.code}</div></td>
                  <td>{productById(p.product).name}</td>
                  <td><Pill tone={stageTone(st)}>{st}</Pill></td>
                  <td><Progress value={projectProgress(db, p)} className="w-20" /></td>
                  <td>{relDays(p.clientDeadline)}</td>
                  <td>{p.finalPaid ? <Pill tone="green">Paid</Pill> : p.advancePaid ? <Pill tone="amber">Advance only</Pill> : <Pill tone="red">Unpaid</Pill>}</td>
                </tr>); })}
              {ps.length === 0 && <tr><td colSpan={6} className="py-6 text-center text-slate-500">No projects yet.</td></tr>}
            </Table>
          </Card>
          <Card title="Feedback log" subtitle="Fast WhatsApp clarifications must also be logged here" padded={false}>
            {fb.length ? (
              <Table head={["Received", "Project", "Feedback", "Round", "Class", "Status"]}>
                {fb.map((f) => (
                  <tr key={f.id} className="table-row">
                    <td className="font-mono text-slate-500">{f.receivedAt.replace("T", " ")}</td>
                    <td>{ps.find((p) => p.id === f.projectId)?.code}</td>
                    <td className="max-w-[280px] text-slate-700">{f.text}</td>
                    <td className="font-mono">{f.round}</td>
                    <td><Pill tone={f.classification === "Scope change" ? "red" : f.classification === "Unclear" ? "amber" : "green"}>{f.classification}</Pill></td>
                    <td><Pill>{f.status}</Pill></td>
                  </tr>
                ))}
              </Table>
            ) : <div className="p-4"><Empty text="No feedback logged yet." /></div>}
          </Card>
          <Card title="Complaints" padded={false}>
            {cms.length ? (
              <Table head={["Date", "Category", "Summary", "Status", "Escalated", ""]}>
                {cms.map((c) => (
                  <tr key={c.id} className="table-row">
                    <td className="font-mono text-slate-500">{c.receivedAt}</td>
                    <td><Pill tone="amber">{c.category}</Pill></td>
                    <td className="text-slate-700">{c.summary}</td>
                    <td><Pill tone={c.status === "Resolved" ? "green" : "slate"}>{c.status}</Pill></td>
                    <td>{c.escalated ? <Pill tone="red">Founder</Pill> : "—"}</td>
                    <td>{c.status !== "Resolved" && <button className="btn-secondary btn-sm" onClick={() => act.advanceComplaint(c.id)}>Next step</button>}</td>
                  </tr>
                ))}
              </Table>
            ) : <div className="p-4"><Empty text="No complaints. Keep it that way." /></div>}
          </Card>
        </div>
        <div className="space-y-4">
          <Card title="Onboarding checklist" subtitle={`${obDone} of 7 complete`}>
            <Checklist items={obItems} initial={client.onboarding.filter((s) => s.done).map((_, i) => `ob${i}`)} />
            {obDone < 7 && <Callout tone="amber">Hand the completed Project Brief to R&D only once every step above is done.</Callout>}
            {ps.some((p) => projectStage(db, p) === "Discovery" && !p.brief) && <Link href="/discovery" className="btn-primary btn-sm mt-3">Run discovery call →</Link>}
          </Card>
          <Card title="Billing">
            <Facts cols={2} items={[{ label: "Contract value", value: inr(ps.reduce((s, p) => s + p.price, 0)) }, { label: "Received", value: inr(pays.filter((p) => p.paidOn).reduce((s, p) => s + p.amount, 0)) }, { label: "Outstanding", value: inr(pays.filter((p) => !p.paidOn).reduce((s, p) => s + p.amount, 0)) }, { label: "Client since", value: client.since }]} />
          </Card>
          <Card title="Open threads">
            <ul className="space-y-2">
              {th.map((t) => { const s = slaState(t); return (
                <li key={t.id} className="flex items-start justify-between gap-2 text-[12.5px]">
                  <div><div className="font-medium">{t.subject}</div><div className="text-[11px] text-slate-500">{t.channel}</div></div>
                  {s.state === "Answered" ? <Pill tone="green"><Check size={11} className="mr-0.5 inline" />Answered</Pill> : <button className="btn-secondary btn-sm" onClick={() => act.replyThread(t.id)}>Reply ({s.hours}h)</button>}
                </li>); })}
              {th.length === 0 && <li className="text-slate-500">No open threads.</li>}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
