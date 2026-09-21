import { PageHeader, Card, Pill, Table, Kpi, KpiGrid, Callout } from "@/components/ui/primitives";
import { Avatar } from "@/components/ui/avatar";
import { attendanceToday } from "@/data/ops";
import { byId, teamNames } from "@/data/people";

const MONTH = [
  ["E03", 16, 1, 0, 0], ["E04", 17, 0, 0, 0], ["E05", 16, 1, 0, 0], ["E06", 15, 2, 0, 0], ["E07", 17, 0, 0, 0], ["E08", 16, 1, 0, 0],
  ["E09", 14, 0, 2, 0], ["E10", 13, 3, 0, 1], ["E11", 17, 0, 0, 0], ["E12", 16, 0, 1, 0], ["E13", 17, 0, 0, 0], ["E14", 14, 1, 0, 2],
] as const;

export default function AttendancePage() {
  return (
    <>
      <PageHeader title="Attendance" subtitle="Logged daily. Late arrivals and early departures carry a reason; patterns go to the Founder monthly." actions={<button className="btn-primary btn-sm">Log today</button>} />
      <KpiGrid cols={4}>
        <Kpi label="Present" value={attendanceToday.filter((a) => a.status === "Present" || a.status === "Late").length} tone="green" />
        <Kpi label="Late" value={attendanceToday.filter((a) => a.status === "Late").length} tone="amber" />
        <Kpi label="On leave" value={attendanceToday.filter((a) => a.status === "Leave").length} tone="slate" />
        <Kpi label="Unapproved" value={attendanceToday.filter((a) => a.status === "Unapproved absence").length} hint="Flag same day" tone="red" />
      </KpiGrid>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card title="Today — Mon 21 Sep" padded={false}>
          <Table head={["Employee", "Team", "Status", "In", "Reason / note", ""]}>
            {attendanceToday.map((a) => { const e = byId(a.employeeId)!; const tone = a.status === "Present" ? "green" : a.status === "Late" ? "amber" : a.status === "Leave" ? "slate" : "red"; return (
              <tr key={a.employeeId} className="table-row">
                <td><span className="flex items-center gap-2"><Avatar employee={e} size="sm" />{e.name}</span></td>
                <td className="text-slate-500">{teamNames[e.team]}</td>
                <td><Pill tone={tone}>{a.status}</Pill></td>
                <td className="font-mono">{a.inTime ?? "—"}</td>
                <td className="text-slate-600">{a.note ?? ""}</td>
                <td><button className="btn-secondary btn-sm">Correct</button></td>
              </tr>); })}
          </Table>
        </Card>
        <div className="space-y-4">
          <Card title="September to date (17 working days)" padded={false}>
            <Table head={["Employee", "Present", "Late", "Leave", "Unapproved", "Pattern"]}>
              {MONTH.map(([id, p, l, lv, u]) => { const e = byId(id)!; return (
                <tr key={id} className="table-row">
                  <td className="font-medium">{e.name}</td><td className="font-mono">{p}</td><td className="font-mono">{l}</td><td className="font-mono">{lv}</td><td className="font-mono">{u}</td>
                  <td>{l >= 3 || u >= 2 ? <Pill tone="red">Escalate to Founder</Pill> : l >= 2 || u >= 1 ? <Pill tone="amber">Watch</Pill> : <Pill tone="green">OK</Pill>}</td>
                </tr>); })}
            </Table>
          </Card>
          <Callout tone="brand" title="Discipline — how far you go alone">First instance: note it. A repeating pattern: escalate. You never issue a warning without the Founder being aware first.</Callout>
        </div>
      </div>
    </>
  );
}
