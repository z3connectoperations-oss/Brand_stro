import Link from "next/link";
import { PageHeader, Kpi, KpiGrid, Card, Pill, Table, Callout } from "@/components/ui/primitives";
import { Avatar } from "@/components/ui/avatar";
import { attendanceToday, leaves, specialIncentives } from "@/data/ops";
import { byId, employees } from "@/data/people";

export function HrDashboard() {
  const present = attendanceToday.filter((a) => a.status === "Present" || a.status === "Late").length;
  const late = attendanceToday.filter((a) => a.status === "Late").length;
  const unapproved = attendanceToday.filter((a) => a.status === "Unapproved absence").length;
  const onLeave = attendanceToday.filter((a) => a.status === "Leave").length;
  const pendingLeave = leaves.filter((l) => l.status !== "Logged");
  const onTarget = specialIncentives.find((s) => s.employeeId === "E04");

  return (
    <>
      <PageHeader title="People & admin" subtitle="Log attendance daily. Flag unapproved absences the same day, not at week's end." badge={<Pill tone="slate">Mon 21 Sep · working day</Pill>} />
      <KpiGrid cols={5}>
        <Kpi label="Present today" value={`${present}/12`} hint={`${onLeave} on approved leave`} tone="green" href="/hr/attendance" />
        <Kpi label="Late arrivals" value={late} hint="Logged with reason" tone="amber" href="/hr/attendance" />
        <Kpi label="Unapproved absence" value={unapproved} hint="Flag today" tone="red" href="/hr/attendance" />
        <Kpi label="Leave requests" value={pendingLeave.length} hint="Awaiting TL / logging" tone="brand" href="/hr/leave" />
        <Kpi label="Team on target" value={onTarget?.metric.split(" ").slice(0, 3).join(" ")} hint="Your bonus metric" tone="violet" href="/incentives" />
      </KpiGrid>

      {unapproved > 0 && (
        <Callout tone="red" title="Same-day rule">
          {attendanceToday.filter((a) => a.status === "Unapproved absence").map((a) => byId(a.employeeId)?.name).join(", ")} — no message received. Flag to the Team Leader now; inform the Founder if it recurs.
        </Callout>
      )}

      <div className="mt-4 grid gap-4 2xl:grid-cols-2">
        <Card title="Today's attendance" padded={false} actions={<Link href="/hr/attendance" className="text-[12.5px] font-medium text-brand-700">Full sheet →</Link>}>
          <Table head={["Employee", "Team", "Status", "In", "Note"]}>
            {attendanceToday.map((a) => {
              const e = byId(a.employeeId)!;
              const tone = a.status === "Present" ? "green" : a.status === "Late" ? "amber" : a.status === "Leave" ? "slate" : "red";
              return (
                <tr key={a.employeeId} className="table-row">
                  <td><span className="flex items-center gap-2"><Avatar employee={e} size="sm" />{e.name}</span></td>
                  <td className="capitalize text-slate-500">{e.team}</td>
                  <td><Pill tone={tone}>{a.status}</Pill></td>
                  <td className="font-mono">{a.inTime ?? "—"}</td>
                  <td className="text-slate-500">{a.note ?? ""}</td>
                </tr>
              );
            })}
          </Table>
        </Card>
        <div className="space-y-4">
          <Card title="Leave & coverage gaps" padded={false} actions={<Link href="/hr/leave" className="text-[12.5px] font-medium text-brand-700">Manage →</Link>}>
            <Table head={["Employee", "Dates", "Status", "Coverage gap"]}>
              {leaves.map((l) => (
                <tr key={l.id} className="table-row">
                  <td className="font-medium">{byId(l.employeeId)?.name}</td>
                  <td className="font-mono">{l.from}{l.to !== l.from ? ` → ${l.to}` : ""}</td>
                  <td><Pill tone={l.status === "Logged" ? "green" : l.status === "Requested" ? "amber" : "brand"}>{l.status}</Pill></td>
                  <td className="text-slate-600">{l.coverageGap ?? "—"}</td>
                </tr>
              ))}
            </Table>
          </Card>
          <Card title="Working week">
            <p className="text-[12.5px] text-slate-600">Monday to Saturday, with the <b>2nd and 4th Saturdays</b> and <b>all Sundays</b> off. Planned leave needs at least 1 day&apos;s notice; same-day only for genuine emergencies.</p>
            <p className="mt-2 text-[12px] text-slate-500">{employees.length - 2} employees on record · records reviewed monthly.</p>
          </Card>
        </div>
      </div>
    </>
  );
}
