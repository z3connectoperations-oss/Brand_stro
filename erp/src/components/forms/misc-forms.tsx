"use client";

import { useState } from "react";
import { Modal, Field } from "@/components/ui/modal";
import { Callout } from "@/components/ui/primitives";
import { useDb } from "@/lib/use-db";
import { products } from "@/data/people";
import type { Complaint, ProductId } from "@/lib/types";

export function AddLeadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { act } = useDb();
  const [f, setF] = useState({ business: "", contact: "", interest: "logo" as ProductId, source: "Instagram", estValue: 6000, nextAction: "First qualification call", nextActionDate: "2026-09-22" });
  const valid = f.business.trim() && f.contact.trim();
  return (
    <Modal open={open} onClose={onClose} title="Add lead" subtitle="Every active lead must have a logged next step." footer={<><button className="btn-secondary" onClick={onClose}>Cancel</button><button className="btn-primary" disabled={!valid} onClick={() => { act.createLead(f); onClose(); }}>Add lead</button></>}>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Business"><input className="input" value={f.business} onChange={(e) => setF({ ...f, business: e.target.value })} /></Field>
        <Field label="Contact"><input className="input" value={f.contact} onChange={(e) => setF({ ...f, contact: e.target.value })} /></Field>
        <Field label="Interest"><select className="input" value={f.interest} onChange={(e) => { const id = e.target.value as ProductId; setF({ ...f, interest: id, estValue: products.find((p) => p.id === id)!.price }); }}>{products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></Field>
        <Field label="Source"><select className="input" value={f.source} onChange={(e) => setF({ ...f, source: e.target.value })}>{["Instagram", "WhatsApp", "Facebook", "Referral", "Walk-in"].map((s) => <option key={s}>{s}</option>)}</select></Field>
        <Field label="Est. value (₹)"><input type="number" className="input" value={f.estValue} onChange={(e) => setF({ ...f, estValue: Number(e.target.value) })} /></Field>
        <Field label="Next action date"><input type="date" className="input" value={f.nextActionDate} onChange={(e) => setF({ ...f, nextActionDate: e.target.value })} /></Field>
        <Field label="Next action" className="sm:col-span-2"><input className="input" value={f.nextAction} onChange={(e) => setF({ ...f, nextAction: e.target.value })} /></Field>
      </div>
    </Modal>
  );
}

export function LogComplaintModal({ open, onClose, clientId }: { open: boolean; onClose: () => void; clientId?: string }) {
  const { db, act } = useDb();
  const [f, setF] = useState({ clientId: clientId ?? db.clients[0]?.id ?? "", projectId: "", category: "Delay" as Complaint["category"], summary: "", escalated: false });
  const projects = db.projects.filter((p) => p.clientId === f.clientId);
  const valid = f.clientId && f.summary.trim().length > 3;
  return (
    <Modal open={open} onClose={onClose} title="Log complaint" subtitle="Receive → categorise → inform team → root cause → resolve & log" footer={<><button className="btn-secondary" onClick={onClose}>Cancel</button><button className="btn-primary" disabled={!valid} onClick={() => { act.logComplaint({ ...f, projectId: f.projectId || undefined }); onClose(); }}>Log</button></>}>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Client"><select className="input" value={f.clientId} onChange={(e) => setF({ ...f, clientId: e.target.value, projectId: "" })}>{db.clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
        <Field label="Project (optional)"><select className="input" value={f.projectId} onChange={(e) => setF({ ...f, projectId: e.target.value })}><option value="">—</option>{projects.map((p) => <option key={p.id} value={p.id}>{p.code} {p.name}</option>)}</select></Field>
        <Field label="Category" className="sm:col-span-2"><select className="input" value={f.category} onChange={(e) => setF({ ...f, category: e.target.value as Complaint["category"] })}>{["Delay", "Quality", "Communication", "Scope", "Pricing/Payment", "Revision", "Delivery"].map((c) => <option key={c}>{c}</option>)}</select></Field>
        <Field label="Summary" className="sm:col-span-2"><textarea className="input h-20 py-2" value={f.summary} onChange={(e) => setF({ ...f, summary: e.target.value })} /></Field>
        <label className="flex items-center gap-2 text-[13px] sm:col-span-2"><input type="checkbox" checked={f.escalated} onChange={(e) => setF({ ...f, escalated: e.target.checked })} /> Refund, contract dispute or reputational risk — escalate to Founder before responding</label>
      </div>
      {f.escalated && <Callout tone="red">Don&apos;t resolve this yourself first. The Founder responds or authorises the response.</Callout>}
    </Modal>
  );
}
