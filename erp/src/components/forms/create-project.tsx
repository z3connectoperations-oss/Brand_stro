"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal, Field } from "@/components/ui/modal";
import { Callout } from "@/components/ui/primitives";
import { useDb } from "@/lib/use-db";
import { products, productById } from "@/data/people";
import { inr } from "@/lib/format";
import type { Priority, ProductId, Project } from "@/lib/types";

export function CreateProjectModal({ open, onClose, clientId }: { open: boolean; onClose: () => void; clientId?: string }) {
  const { db, act } = useDb();
  const router = useRouter();
  const [form, setForm] = useState({ clientId: clientId ?? db.clients[0]?.id ?? "", name: "", product: "branding" as ProductId, price: 15000, priority: "P2" as Priority, clientDeadline: "2026-10-05", route: "with-sketch" as Project["route"], advancePaid: false });
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm({ ...form, [k]: v });
  const product = productById(form.product);
  const sketchUsed = db.projects.filter((p) => p.createdOn.startsWith("2026-09") && productById(p.product).usesSketch).length;
  const valid = form.name.trim() && form.clientId && form.price > 0 && form.clientDeadline;

  const submit = () => {
    if (!valid) return;
    const id = act.createProject(form);
    onClose();
    router.push(`/projects/${id}`);
  };

  return (
    <Modal open={open} onClose={onClose} title="Create project" subtitle="Deliverables are created from the package template. The project enters the R&D queue only once the advance is recorded." footer={<><button className="btn-secondary" onClick={onClose}>Cancel</button><button className="btn-primary" disabled={!valid} onClick={submit}>Create project</button></>}>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Client" className="sm:col-span-2">
          <select className="input" value={form.clientId} onChange={(e) => set("clientId", e.target.value)}>
            {db.clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Project name" className="sm:col-span-2"><input className="input" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Pearl Dental — Logo" /></Field>
        <Field label="Package">
          <select className="input" value={form.product} onChange={(e) => { const id = e.target.value as ProductId; const p = productById(id); setForm({ ...form, product: id, price: p.price, route: p.usesSketch ? "with-sketch" : "direct" }); }}>
            {products.map((p) => <option key={p.id} value={p.id}>{p.name} — {inr(p.price)}</option>)}
          </select>
        </Field>
        <Field label="Agreed price (₹)" hint="Discounts are the Founder's call"><input type="number" className="input" value={form.price} onChange={(e) => set("price", Number(e.target.value))} /></Field>
        <Field label="Priority" hint="P1 needs Founder / Creative Head approval; one active at a time">
          <select className="input" value={form.priority} onChange={(e) => set("priority", e.target.value as Priority)}><option>P1</option><option>P2</option><option>P3</option></select>
        </Field>
        <Field label="Client deadline"><input type="date" className="input" value={form.clientDeadline} onChange={(e) => set("clientDeadline", e.target.value)} /></Field>
        <Field label="Route" className="sm:col-span-2">
          <select className="input" value={form.route} onChange={(e) => set("route", e.target.value as Project["route"])}>
            <option value="with-sketch">R&D → Sketch Artist → Logo Team</option>
            <option value="direct">R&D → Design team (sketch skipped)</option>
            <option value="designer-originated">Designer-originated concept</option>
          </select>
        </Field>
        <label className="flex items-center gap-2 text-[13px] sm:col-span-2"><input type="checkbox" checked={form.advancePaid} onChange={(e) => set("advancePaid", e.target.checked)} /> 50% advance ({inr(Math.round(form.price / 2))}) already received</label>
      </div>
      <div className="mt-3 space-y-2">
        <Callout tone="slate">Creates {product.deliverables.length} deliverable(s): {product.deliverables.join(", ")}. {product.includedRevisions} revision rounds included.</Callout>
        {product.usesSketch && <Callout tone={sketchUsed >= 24 ? "red" : "amber"} title="Capacity check">{sketchUsed} of 24 sketch slots used this month. {sketchUsed >= 20 ? "Set the deadline with the queue in mind." : "Room in the sketch queue."}</Callout>}
      </div>
    </Modal>
  );
}
