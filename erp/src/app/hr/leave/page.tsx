import { PageHeader, Card, Pill, Table, Kpi, KpiGrid, Callout } from "@/components/ui/primitives";
import { Avatar } from "@/components/ui/avatar";
import { leaves, leaveBalances } from "@/data/ops";
import { byId, employees } from "@/data/people";

const STEPS = ["Requested", "TL acknowledged", "Logged"];

export default function LeavePage() {
  return (
    <>
      <PageHeader title="Leave management" subtitle="Employee requests (≥1 day notice) → TL checks project impact and approves → HR logs and updates balance → HR flags any coverage gap to the TL." actions={<button className="btn-primary btn-sm">Record leave</button>} />
      <KpiGrid cols={4}>
        <Kpi label="Requests open" value={leaves.filter((l) => l.status !== "Logged").length} tone="amber" />
        <Kpi label="Coverage gaps" value={leaves.filter((l) => l.coverageGap).length} hint="Inform the TL, don't resolve it yourself" tone="red" />
        <Kpi label="On leave today" value={1} tone="slate" />
        <Kpi label="Next holiday" value="27 Sep" hint="4th Saturday" tone="green" />
      </KpiGrid>
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2" title="Requests" padded={false}>
          <Table head={["Employee", "Dates", "Type", "Progress", "Coverage gap", ""]}>
            {leaves.map((l) => (
              <tr key={l.id} className="table-row">
                <td><span className="flex items-center gap-2"><Avatar employee={byId(l.employeeId)} size="sm" />{byId(l.employeeId)?.name}</span></td>
                <td className="font-mono">{l.from}{l.to !== l.from ? ` → ${l.to}` : ""}</td>
                <td><Pill tone={l.type === "Emergency" ? "red" : "slate"}>{l.type}</Pill></td>
                <td><ol className="flex gap-1">{STEPS.map((s, i) => <li key={s} title={s} className={`h-1.5 w-8 rounded-full ${i <= STEPS.indexOf(l.status) ? "bg-brand-600" : "bg-slate-200"}`} />)}</ol><div className="mt-1 text-[11px] text-slate-500">{l.status}</div></td>
                <td className="text-slate-600">{l.coverageGap ? <span className="text-red-700">{l.coverageGap}</span> : "—"}</td>
                <td>{l.status === "TL acknowledged" && <button className="btn-primary btn-sm">Log & update balance</button>}{l.coverageGap && l.status === "Logged" && <button className="btn-secondary btn-sm">Flag to TL</button>}</td>
              </tr>
            ))}
          </Table>
        </Card>
        <div className="space-y-4">
          <Card title="Leave balances" padded={false}>
            <Table head={["Employee", "Days left"]} className="[&_table]:min-w-0">
              {employees.filter((e) => leaveBalances[e.id] !== undefined).map((e) => <tr key={e.id} className="table-row"><td>{e.name}</td><td className="text-right font-mono">{leaveBalances[e.id]}</td></tr>)}
            </Table>
          </Card>
          <Callout tone="amber" title="Bottleneck roles">R&D and the Sketch Artist have no backup. Leave for either pauses the whole logo pipeline — flag to the Creative Head, not just the TL.</Callout>
        </div>
      </div>
    </>
  );
}
