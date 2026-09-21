import Link from "next/link";
import { PageHeader, Kpi, KpiGrid, Card, Pill, Table, Progress, Callout } from "@/components/ui/primitives";
import { Avatar } from "@/components/ui/avatar";
import type { Employee } from "@/lib/types";
import { teamNames, byId } from "@/data/people";
import { projectById } from "@/data/projects";
import { teamDeliverables, teamMembers, loadFor, stageTone } from "@/lib/selectors";
import { relDays } from "@/lib/format";

export function TeamLeaderDashboard({ me }: { me: Employee }) {
  const ds = teamDeliverables(me.team);
  const review = ds.filter((d) => d.stage === "TL review");
  const unassigned = ds.filter((d) => d.stage === "Awaiting assignment");
  const members = teamMembers(me.team);
  const teamTarget = me.team === "logo" ? { done: 15, target: 21 } : { done: 20, target: 33 };

  return (
    <>
      <PageHeader title={`${teamNames[me.team]} — ${me.name.split(" ")[0]}`} subtitle="Assign by load, review every piece, flag blockers immediately." badge={<Pill tone="brand">{members.length} designers</Pill>} />
      <KpiGrid cols={5}>
        <Kpi label="Awaiting my review" value={review.length} hint="Non-negotiable checkpoint" tone="violet" href="/review" />
        <Kpi label="Unassigned" value={unassigned.length} hint="Assign by current load" tone="amber" href="/team" />
        <Kpi label="In design" value={ds.filter((d) => d.stage === "In design").length} hint="Active" href="/board" />
        <Kpi label="In correction" value={ds.filter((d) => d.stage === "In correction").length} hint="Client rounds" tone="amber" href="/board" />
        <Kpi label="Team target" value={`${teamTarget.done}/${teamTarget.target}`} hint="70% of your bonus" tone="green" href="/incentives" />
      </KpiGrid>

      {unassigned.length > 0 && (
        <Callout tone="amber" title={`${unassigned.length} deliverables waiting for assignment`}>
          For a Branding Package, plan the non-logo set (guidelines, visiting card, letterhead, t-shirt, packaging) as one coordinated job, not scattered pickups.
        </Callout>
      )}

      <div className="mt-4 grid gap-4 2xl:grid-cols-2">
        <Card title="Work awaiting review" subtitle="Nothing goes to Creative Head / CRM without your sign-off" padded={false} actions={<Link href="/review" className="text-[12.5px] font-medium text-brand-700">Open queue →</Link>}>
          <Table head={["Deliverable", "Designer", "Version", "Due", ""]}>
            {review.map((d) => (
              <tr key={d.id} className="table-row">
                <td>
                  <div className="font-medium">{d.type}</div>
                  <div className="text-[11px] text-slate-500">{projectById(d.projectId)?.name}</div>
                </td>
                <td><span className="flex items-center gap-2"><Avatar employee={byId(d.assigneeId)} size="sm" />{byId(d.assigneeId)?.name}</span></td>
                <td className="font-mono">v{d.version}</td>
                <td>{relDays(d.dueDate)}</td>
                <td><Link href={`/review/${d.id}`} className="btn-primary btn-sm">Review</Link></td>
              </tr>
            ))}
            {review.length === 0 && <tr><td colSpan={5} className="py-6 text-center text-slate-500">Nothing waiting. Go check load balance.</td></tr>}
          </Table>
        </Card>
        <Card title="Designer load" subtitle="Benchmark 1 per day · don't let one queue grow while another sits idle" padded={false}>
          <Table head={["Designer", "Active", "Stages", "Load"]}>
            {members.map((e) => {
              const l = loadFor(e.id);
              const mine = ds.filter((d) => d.assigneeId === e.id);
              return (
                <tr key={e.id} className="table-row">
                  <td><span className="flex items-center gap-2"><Avatar employee={e} size="sm" />{e.name}</span></td>
                  <td className="font-mono">{l.active}</td>
                  <td className="space-x-1">{mine.slice(0, 3).map((d) => <Pill key={d.id} tone={stageTone(d.stage)}>{d.stage}</Pill>)}</td>
                  <td><div className="flex items-center gap-2"><Progress value={l.pct} tone={l.pct >= 100 ? "red" : l.pct >= 70 ? "amber" : "green"} className="w-20" /><span className="text-[11px] text-slate-500">{l.status}</span></div></td>
                </tr>
              );
            })}
          </Table>
        </Card>
      </div>
    </>
  );
}
