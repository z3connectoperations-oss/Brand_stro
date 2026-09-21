"use client";

import { useState } from "react";
import { Modal, Field } from "@/components/ui/modal";
import { Callout, Progress } from "@/components/ui/primitives";
import { Avatar } from "@/components/ui/avatar";
import { useDb } from "@/lib/use-db";
import { loadFor, teamMembers } from "@/lib/selectors";
import { relDays } from "@/lib/format";

export function AssignWorkModal({ open, onClose, deliverableId }: { open: boolean; onClose: () => void; deliverableId: string }) {
  const { db, act } = useDb();
  const d = db.deliverables.find((x) => x.id === deliverableId);
  const members = d ? teamMembers(d.team).map((e) => ({ e, l: loadFor(db, e.id) })).sort((a, b) => a.l.active - b.l.active) : [];
  const [pick, setPick] = useState(members[0]?.e.id ?? "");
  if (!d) return null;
  const p = db.projects.find((x) => x.id === d.projectId);
  const chosen = members.find((m) => m.e.id === pick);

  return (
    <Modal open={open} onClose={onClose} title={`Assign — ${d.type}`} subtitle={`${p?.name} · due ${relDays(d.dueDate)}`} footer={<><button className="btn-secondary" onClick={onClose}>Cancel</button><button className="btn-primary" disabled={!pick} onClick={() => { act.assignDeliverable(deliverableId, pick); onClose(); }}>Assign</button></>}>
      <Field label="Designer (sorted by current load)">
        <ul className="space-y-1.5">
          {members.map(({ e, l }) => (
            <li key={e.id}>
              <label className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 ${pick === e.id ? "border-brand-600 bg-brand-50" : "border-slate-200 hover:bg-slate-50"}`}>
                <input type="radio" name="assignee" className="sr-only" checked={pick === e.id} onChange={() => setPick(e.id)} />
                <Avatar employee={e} size="sm" />
                <span className="flex-1 text-[13px] font-medium">{e.name}</span>
                <Progress value={l.pct} tone={l.pct >= 100 ? "red" : l.pct >= 70 ? "amber" : "green"} className="w-24" />
                <span className="w-20 text-right text-[11px] text-slate-500">{l.active} active · {l.status}</span>
              </label>
            </li>
          ))}
        </ul>
      </Field>
      {chosen && chosen.l.pct >= 100 && <Callout tone="red" title="Overloaded">{chosen.e.name} is already above the 1/day benchmark. Assign by load, not habit.</Callout>}
      {d.type !== "Logo" && d.type !== "Label" && d.type !== "Packaging" && <Callout tone="slate">Branding-package collateral: plan the whole non-logo set as one coordinated job.</Callout>}
    </Modal>
  );
}
