import { PageHeader, Card, Pill, Table, Kpi, KpiGrid } from "@/components/ui/primitives";
import { Avatar } from "@/components/ui/avatar";
import { employees, byId, teamNames } from "@/data/people";
import { roleLabels } from "@/lib/nav";
import { inr } from "@/lib/format";

export default function EmployeesPage() {
  const payroll = employees.reduce((s, e) => s + e.baseSalary, 0);
  return (
    <>
      <PageHeader title="Employees" subtitle="Records, reporting lines and documentation status. Keep documentation current for the monthly review." actions={<button className="btn-primary btn-sm">Add employee</button>} />
      <KpiGrid cols={4}>
        <Kpi label="Headcount" value={employees.length} hint="incl. Founder & Creative Head" />
        <Kpi label="On incentive plan" value={employees.filter((e) => e.baseSalary > 0).length} hint="12 per the plan" tone="brand" />
        <Kpi label="Fixed payroll" value={inr(payroll)} hint="Plan: ₹1,26,000" tone="violet" />
        <Kpi label="Docs incomplete" value={2} hint="Follow up this week" tone="amber" />
      </KpiGrid>
      <Card padded={false}>
        <Table head={["Employee", "Role", "Team", "Reports to", "Base salary", "Target earning", "Documents"]}>
          {employees.map((e) => (
            <tr key={e.id} className="table-row">
              <td><span className="flex items-center gap-2"><Avatar employee={e} size="sm" /><span><div className="font-medium">{e.name}</div><div className="text-[11px] text-slate-500">{e.title}</div></span></span></td>
              <td>{roleLabels[e.role]}</td>
              <td className="text-slate-600">{teamNames[e.team]}</td>
              <td>{byId(e.reportsTo)?.name ?? "—"}</td>
              <td className="font-mono">{e.baseSalary ? inr(e.baseSalary) : <span className="text-slate-400">not stated</span>}</td>
              <td className="font-mono">{e.targetEarning ? inr(e.targetEarning) : <span className="text-slate-400">—</span>}</td>
              <td>{["E10", "E14"].includes(e.id) ? <Pill tone="amber">Incomplete</Pill> : <Pill tone="green">Complete</Pill>}</td>
            </tr>
          ))}
        </Table>
      </Card>
    </>
  );
}
