"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHeader, Pill, Chips, Callout, PriorityPill } from "@/components/ui/primitives";
import { Avatar } from "@/components/ui/avatar";
import { deliverables, projectById } from "@/data/projects";
import { clientById } from "@/data/clients";
import { byId, teamNames } from "@/data/people";
import { useMe } from "@/lib/role-context";
import { relDays, daysLeft } from "@/lib/format";
import type { Stage, TeamId } from "@/lib/types";

const COLUMNS: { title: string; stages: Stage[]; tone: string }[] = [
  { title: "Before design", stages: ["Awaiting advance", "Discovery", "Brief ready", "R&D queue", "R&D in progress", "Sketch queue", "Sketching"], tone: "bg-slate-400" },
  { title: "Awaiting assignment", stages: ["Awaiting assignment"], tone: "bg-amber-500" },
  { title: "In design", stages: ["In design", "In correction"], tone: "bg-brand-600" },
  { title: "TL review", stages: ["TL review"], tone: "bg-violet-500" },
  { title: "With client", stages: ["Ready for client", "With client", "Feedback received", "Scope change pending"], tone: "bg-amber-500" },
  { title: "Approved / closing", stages: ["Client approved", "Awaiting final payment", "Final files delivered"], tone: "bg-emerald-500" },
];

export default function BoardPage() {
  const { me } = useMe();
  const [team, setTeam] = useState<string>(me.role === "team-leader" ? me.team : "all");
  const rows = deliverables.filter((d) => d.stage !== "Closed" && (team === "all" || d.team === team));

  return (
    <>
      <PageHeader title="Production board" subtitle="Who has this right now? Every deliverable, by stage. Moving to 'With client' requires a TL QC pass; final files require the final 50%." />
      <div className="mb-3">
        <Chips items={[{ key: "all", label: "All teams" }, { key: "logo", label: "Logo Team" }, { key: "packaging", label: "Packaging Team" }]} active={team} onChange={setTeam} />
      </div>
      <Callout tone="brand" title="Gated stages">TL review is non-negotiable. Corrections re-enter TL review before going back to the CRM.</Callout>
      <div className="mt-4 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        {COLUMNS.map((col) => {
          const items = rows.filter((d) => col.stages.includes(d.stage));
          return (
            <div key={col.title} className="flex min-h-[300px] flex-col rounded-xl border border-slate-200 bg-slate-100/60 p-2">
              <div className="mb-2 flex items-center gap-2 px-1">
                <span className={`h-2 w-2 rounded-full ${col.tone}`} />
                <span className="text-[12px] font-semibold text-slate-800">{col.title}</span>
                <span className="ml-auto font-mono text-[11px] text-slate-500">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map((d) => {
                  const p = projectById(d.projectId)!;
                  const late = daysLeft(d.dueDate) < 0;
                  return (
                    <Link key={d.id} href={`/tasks/${d.id}`} className="card block p-3 hover:border-brand-300">
                      <div className="mb-1 flex items-center justify-between">
                        <PriorityPill p={p.priority} />
                        <span className="text-[10px] font-medium text-slate-400">{teamNames[d.team as TeamId]}</span>
                      </div>
                      <div className="text-[13px] font-semibold text-slate-900">{d.type}</div>
                      <div className="text-[11.5px] text-slate-500">{clientById(p.clientId).name}</div>
                      <div className="mt-2 flex items-center justify-between">
                        <Pill tone={d.stage === "Scope change pending" ? "red" : "slate"}>{d.stage}</Pill>
                        <Avatar employee={byId(d.assigneeId)} size="sm" />
                      </div>
                      <div className={`mt-2 text-[11px] ${late ? "font-semibold text-red-600" : "text-slate-500"}`}>{relDays(d.dueDate)} · {d.version ? `v${d.version}` : "no version"} · {d.revisionCount} rounds</div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
