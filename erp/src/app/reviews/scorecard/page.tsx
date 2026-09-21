"use client";

import { useState } from "react";
import { PageHeader, Card, Pill, Callout } from "@/components/ui/primitives";

const CATEGORIES = ["Overall team performance", "Team Leader development", "Productivity", "Quality", "Deadline management", "Problem solving", "Employee development", "Communication", "Discipline & culture", "Process improvement", "Cross-team coordination", "Leadership pipeline", "Strategic thinking"];
const INITIAL = [3, 2, 3, 3, 2, 3, 2, 4, 3, 3, 2, 2, 3];

export default function ScorecardPage() {
  const [scores, setScores] = useState<number[]>(INITIAL);
  const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  return (
    <>
      <PageHeader title="Leader's monthly scorecard" subtitle="Thirteen categories, rated 1–5 with the Founder. A conversation, not a report card." badge={<Pill tone="brand">September 2026 · avg {avg}</Pill>} />
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2" padded={false}>
          <ul className="divide-y divide-slate-100">
            {CATEGORIES.map((c, i) => (
              <li key={c} className="flex flex-wrap items-center gap-3 px-4 py-2.5">
                <span className="w-8 font-mono text-[11px] text-slate-400">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 text-[13px] font-medium">{c}</span>
                <div className="flex gap-1" role="radiogroup" aria-label={c}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} role="radio" aria-checked={scores[i] === n} onClick={() => setScores(scores.map((s, j) => (j === i ? n : s)))} className={`h-8 w-8 rounded-md border text-[12px] font-semibold ${scores[i] === n ? (n <= 2 ? "border-red-500 bg-red-500 text-white" : n === 3 ? "border-amber-500 bg-amber-500 text-white" : "border-emerald-600 bg-emerald-600 text-white") : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}>{n}</button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          <div className="flex gap-2 border-t border-slate-100 px-4 py-3"><button className="btn-primary">Save with Founder notes</button><button className="btn-secondary">Export for monthly review</button></div>
        </Card>
        <div className="space-y-4">
          <Card title="Scale"><ul className="space-y-1 text-[12.5px]"><li><b>1</b> — needs urgent attention</li><li><b>3</b> — meeting the bar</li><li><b>5</b> — a model other leaders should learn from</li></ul></Card>
          <Card title="Monthly self-check">
            <ul className="space-y-1.5 text-[12.5px] text-slate-700">
              <li>• Is the department measurably stronger than last month?</li>
              <li>• Are my Team Leaders more independent, or more reliant on me?</li>
              <li>• Is quality improving? Is productivity?</li>
              <li>• Are problems reducing, or just changing shape?</li>
              <li>• Is the team ready for the next stage of growth?</li>
            </ul>
          </Card>
          <Callout tone="brand" title="Bring problems halfway solved">Problem + Analysis + Options + Recommendation. Not just “Packaging is behind again.”</Callout>
        </div>
      </div>
    </>
  );
}
