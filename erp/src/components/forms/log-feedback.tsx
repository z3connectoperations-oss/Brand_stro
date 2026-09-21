"use client";

import { useState } from "react";
import { Modal, Field } from "@/components/ui/modal";
import { Callout } from "@/components/ui/primitives";
import { useDb } from "@/lib/use-db";
import { productById } from "@/data/people";
import type { Feedback } from "@/lib/types";

export function LogFeedbackModal({ open, onClose, deliverableId }: { open: boolean; onClose: () => void; deliverableId?: string }) {
  const { db, act } = useDb();
  const candidates = db.deliverables.filter((d) => ["With client", "Feedback received", "Client approved"].includes(d.stage));
  const [form, setForm] = useState({ deliverableId: deliverableId ?? candidates[0]?.id ?? "", channel: "WhatsApp" as Feedback["channel"], text: "" });
  const d = db.deliverables.find((x) => x.id === form.deliverableId);
  const p = d && db.projects.find((x) => x.id === d.projectId);
  const prod = p && productById(p.product);
  const nextRound = (d?.revisionCount ?? 0) + 1;
  const valid = form.deliverableId && form.text.trim().length > 3;

  return (
    <Modal open={open} onClose={onClose} title="Log client feedback" subtitle="Document it first. Classify it next. Never agree to a scope change on the spot." footer={<><button className="btn-secondary" onClick={onClose}>Cancel</button><button className="btn-primary" disabled={!valid} onClick={() => { act.logFeedback(form); onClose(); }}>Log feedback</button></>}>
      <div className="grid gap-3">
        <Field label="Deliverable">
          <select className="input" value={form.deliverableId} onChange={(e) => setForm({ ...form, deliverableId: e.target.value })}>
            {candidates.map((x) => { const pr = db.projects.find((y) => y.id === x.projectId); return <option key={x.id} value={x.id}>{pr?.name} — {x.type} v{x.version}</option>; })}
          </select>
        </Field>
        <Field label="Channel"><select className="input" value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value as Feedback["channel"] })}><option>WhatsApp</option><option>Email</option><option>Call</option></select></Field>
        <Field label="What the client said (verbatim where possible)"><textarea className="input h-24 py-2" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} /></Field>
        {prod && <Callout tone={nextRound > prod.includedRevisions ? "red" : "slate"}>This will be round <b>{nextRound}</b> of {prod.includedRevisions} included{nextRound > prod.includedRevisions ? " — beyond the package. Classify as scope change unless the Founder says otherwise." : "."}</Callout>}
      </div>
    </Modal>
  );
}
