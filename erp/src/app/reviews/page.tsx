"use client";

import { useState } from "react";
import { PageHeader, Card, Pill, Table, Callout, Chips } from "@/components/ui/primitives";
import { Avatar } from "@/components/ui/avatar";
import { byId } from "@/data/people";

const QUESTIONS = [
  ["Output", "What did your team finish this week, and what's still open?"],
  ["Quality", "What needed rework, and why?"],
  ["Deadlines", "What's at risk in the next seven days?"],
  ["Client blockers", "What's waiting on a client response or approval?"],
  ["Discipline & morale", "Anything you're worried about with a specific person?"],
  ["Bottlenecks", "Where did work sit idle, and why?"],
  ["Resourcing", "Do you have enough people for what's coming next week?"],
  ["Improvement action", "What's one thing you'll do differently next week?"],
];

const ACTIONS = [
  { action: "Add bleed/safe-area pre-flight template to Packaging checklist", owner: "E11", deadline: "2026-09-26", review: "2026-10-03", status: "Open" },
  { action: "Rebalance Rasith's queue; move Custom Packaging to Ayesha", owner: "E11", deadline: "2026-09-22", review: "2026-09-26", status: "Done" },
  { action: "Flag R&D → Sketch handoff acknowledgement rule to Fathima and Gautam", owner: "E02", deadline: "2026-09-22", review: "2026-09-29", status: "Open" },
  { action: "Coach Akhil on flagging deadline risk 3 days early (leadership, not output)", owner: "E02", deadline: "2026-09-25", review: "2026-10-02", status: "Open" },
];

export default function WeeklyReviewPage() {
  const [tl, setTl] = useState("E07");
  const leader = byId(tl)!;
  return (
    <>
      <PageHeader title="Weekly Team Leader review" subtitle="30–45 minutes. Review, don't rescue: look at the numbers with them and let them propose the fix first." badge={<Pill tone="brand">Week 39 · 21–26 Sep</Pill>} />
      <div className="mb-3"><Chips items={[{ key: "E07", label: "Akhil P. — Logo" }, { key: "E11", label: "Shalin M. — Packaging" }]} active={tl} onChange={setTl} /></div>
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2" title={`${leader.name} — ${leader.title}`} subtitle="Eight questions, every leader, every week" actions={<Avatar employee={leader} />}>
          <div className="space-y-4">
            {QUESTIONS.map(([area, q]) => (
              <label key={area} className="block">
                <span className="label-sm">{area}</span>
                <span className="block text-[13px] font-medium text-slate-800">{q}</span>
                <textarea className="input mt-1 h-16 py-2" placeholder="Their answer, in their words…" />
              </label>
            ))}
          </div>
          <div className="mt-4 flex gap-2"><button className="btn-primary">Save review</button><button className="btn-secondary">Save & create action items</button></div>
        </Card>
        <div className="space-y-4">
          <Card title="This week's numbers" subtitle={tl === "E07" ? "Logo Team" : "Packaging Team"}>
            <Table head={["Metric", "Value"]} className="[&_table]:min-w-0">
              {(tl === "E07" ? [["On-time delivery", "78%"], ["First-review pass", "67%"], ["Client rounds / project", "1.6"], ["Throughput / designer / day", "0.9"]] : [["On-time delivery", "71%"], ["First-review pass", "60%"], ["Print-readiness pass", "75%"], ["Throughput / designer / day", "1.0"]]).map(([k, v]) => (
                <tr key={k} className="table-row"><td className="text-slate-600">{k}</td><td className="text-right font-mono font-semibold">{v}</td></tr>
              ))}
            </Table>
          </Card>
          <Callout tone="brand" title="Coach the leadership, not the output">“Your team missed the deadline” is a team problem. “You didn&apos;t flag the risk three days earlier” is a leadership problem — coach that one.</Callout>
        </div>
      </div>
      <Card className="mt-4" title="Action items" subtitle="A meeting without an action item was a conversation, not a decision" padded={false}>
        <Table head={["Action", "Owner", "Deadline", "Review date", "Status"]}>
          {ACTIONS.map((a) => (
            <tr key={a.action} className="table-row">
              <td>{a.action}</td>
              <td><span className="flex items-center gap-1.5"><Avatar employee={byId(a.owner)} size="sm" />{byId(a.owner)?.name}</span></td>
              <td className="font-mono">{a.deadline}</td><td className="font-mono">{a.review}</td>
              <td><Pill tone={a.status === "Done" ? "green" : "amber"}>{a.status}</Pill></td>
            </tr>
          ))}
        </Table>
      </Card>
    </>
  );
}
