"use client";

import { useState } from "react";
import { PageHeader, Card, Pill, Chips, Kpi, KpiGrid } from "@/components/ui/primitives";
import { Avatar } from "@/components/ui/avatar";
import { useDb } from "@/lib/use-db";
import { byId } from "@/data/people";

export default function AuditPage() {
  const { db } = useDb();
  const [entity, setEntity] = useState("all");
  const entities = Array.from(new Set(db.audit.map((a) => a.entity)));
  const rows = db.audit.filter((a) => entity === "all" || a.entity === entity);
  const today = db.audit.filter((a) => a.at.startsWith("2026-09-21")).length;

  return (
    <>
      <PageHeader title="Activity & audit log" subtitle="Every recorded action, who did it, and what changed. When something slips, the reason is known — not guessed at." />
      <KpiGrid cols={3}>
        <Kpi label="Entries" value={db.audit.length} />
        <Kpi label="Today" value={today} tone="brand" />
        <Kpi label="Actors" value={new Set(db.audit.map((a) => a.actorId)).size} tone="slate" />
      </KpiGrid>
      <div className="mb-3"><Chips items={[{ key: "all", label: "All", count: db.audit.length }, ...entities.map((e) => ({ key: e, label: e, count: db.audit.filter((a) => a.entity === e).length }))]} active={entity} onChange={setEntity} /></div>
      <Card padded={false}>
        <ol className="relative divide-y divide-slate-100">
          {rows.map((a) => {
            const actor = byId(a.actorId);
            const tone = a.action.includes("Payment") ? "green" : a.action.includes("Scope") || a.action.includes("classified") ? "amber" : a.action.includes("created") || a.action.includes("Handoff") ? "brand" : "slate";
            return (
              <li key={a.id} className="flex flex-wrap items-start gap-3 px-4 py-3">
                <span className="w-32 shrink-0 font-mono text-[11px] text-slate-500">{a.at.replace("T", " ")}</span>
                <Avatar employee={actor} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-[13px]">
                    <span className="font-medium text-slate-900">{actor?.name ?? a.actorId}</span>
                    <Pill tone={tone}>{a.action}</Pill>
                    <span className="font-mono text-[11px] text-slate-400">{a.entity} · {a.entityId}</span>
                  </div>
                  <div className="text-[12.5px] text-slate-600">{a.summary}</div>
                  {(a.before || a.after) && (
                    <div className="mt-1 inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[11px]">
                      {a.before && <span className="rounded bg-red-50 px-1 text-red-800 line-through">{a.before}</span>}
                      <span className="text-slate-400">→</span>
                      {a.after && <span className="rounded bg-emerald-50 px-1 font-semibold text-emerald-800">{a.after}</span>}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
          {rows.length === 0 && <li className="px-4 py-8 text-center text-slate-500">No entries.</li>}
        </ol>
      </Card>
    </>
  );
}
