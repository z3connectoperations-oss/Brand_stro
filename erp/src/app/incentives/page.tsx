"use client";

import { PageHeader, Card, Pill, Table, Kpi, KpiGrid, Progress, Callout } from "@/components/ui/primitives";
import { Avatar } from "@/components/ui/avatar";
import { employees, byId } from "@/data/people";
import { incentiveLines, lineBonus, specialIncentives } from "@/data/ops";
import { useMe } from "@/lib/role-context";
import { inr } from "@/lib/format";

function bonusFor(id: string) {
  return incentiveLines.filter((l) => l.employeeId === id).reduce((s, l) => s + lineBonus(l), 0) + (specialIncentives.find((s) => s.employeeId === id)?.bonus ?? 0);
}

export default function IncentivesPage() {
  const { me } = useMe();
  const scope = me.role === "founder" || me.role === "hr" || me.role === "creative-head" ? "all" : me.role === "team-leader" ? "team" : "me";
  const people = employees.filter((e) => e.baseSalary > 0 && (scope === "all" || (scope === "team" && (e.team === me.team || e.id === me.id)) || (scope === "me" && e.id === me.id)));
  const totalBonus = people.reduce((s, e) => s + bonusFor(e.id), 0);
  const onTarget = people.filter((e) => { const ls = incentiveLines.filter((l) => l.employeeId === e.id); const sp = specialIncentives.find((s) => s.employeeId === e.id); return ls.length ? ls.every((l) => l.done >= l.baseline) : (sp?.pct ?? 0) >= 75; }).length;

  return (
    <>
      <PageHeader
        title={scope === "me" ? "My earnings" : scope === "team" ? "Team incentives" : "Performance incentives — September 2026"}
        subtitle="Base salary is never reduced. Bonus is earned per unit beyond your own baseline, at the full rate for clean work (0–1 client revisions), half for 2–3, nothing for 4+."
        badge={<Pill tone="amber">Month-to-date · projected</Pill>}
      />
      <KpiGrid cols={4}>
        <Kpi label="People" value={people.length} />
        <Kpi label="On or above baseline" value={`${onTarget}/${people.length}`} hint="HR bonus metric: 11 of 12" tone="green" />
        <Kpi label="Bonus accrued" value={inr(totalBonus)} hint="Computed from completions" tone="brand" />
        <Kpi label="Payroll + bonus" value={inr(people.reduce((s, e) => s + e.baseSalary, 0) + totalBonus, true)} hint={scope === "all" ? "Full-target plan: ₹1,26,000 + ₹61,900" : "Base + bonus"} tone="violet" />
      </KpiGrid>

      <div className="space-y-4">
        {people.map((e) => {
          const lines = incentiveLines.filter((l) => l.employeeId === e.id);
          const sp = specialIncentives.find((s) => s.employeeId === e.id);
          const bonus = bonusFor(e.id);
          return (
            <Card key={e.id} padded={false}>
              <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3">
                <Avatar employee={e} />
                <div className="flex-1"><div className="text-[13px] font-semibold">{e.name}</div><div className="text-[11.5px] text-slate-500">{e.title}</div></div>
                <div className="grid grid-cols-3 gap-4 text-right">
                  <div><div className="label-sm">Base</div><div className="font-mono font-semibold">{inr(e.baseSalary)}</div></div>
                  <div><div className="label-sm">Bonus MTD</div><div className="font-mono font-semibold text-emerald-700">{inr(bonus)}</div></div>
                  <div><div className="label-sm">Target</div><div className="font-mono text-slate-500">{inr(e.targetEarning)}</div></div>
                </div>
              </div>
              {lines.length > 0 && (
                <Table head={["Work type", "Baseline", "Target", "Done", "Progress", "Clean (full)", "2–3 rev (half)", "4+ (nil)", "Bonus"]}>
                  {lines.map((l) => (
                    <tr key={l.workType} className="table-row">
                      <td className="font-medium">{l.workType}</td><td className="font-mono">{l.baseline}</td><td className="font-mono">{l.target}</td><td className="font-mono">{l.done}</td>
                      <td><Progress value={(l.done / l.target) * 100} tone={l.done >= l.target ? "green" : l.done >= l.baseline ? "brand" : "amber"} className="w-24" /></td>
                      <td className="font-mono">{l.clean} × {inr(l.rateClean)}</td><td className="font-mono">{l.partial} × {inr(l.ratePartial)}</td><td className="font-mono">{l.heavy}</td>
                      <td className="font-mono font-semibold">{inr(lineBonus(l))}</td>
                    </tr>
                  ))}
                </Table>
              )}
              {sp && (
                <div className="grid gap-3 px-4 py-3 sm:grid-cols-[1fr_auto]">
                  <div><div className="text-[12.5px] font-medium">{sp.label}</div><div className="text-[12px] text-slate-500">{sp.metric}</div><Progress value={sp.pct} tone={sp.pct >= 90 ? "green" : sp.pct >= 75 ? "brand" : "amber"} className="mt-2 w-64" /></div>
                  <div className="text-right"><Pill tone="brand">{sp.tier}</Pill></div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {scope === "all" && (
        <Callout tone="brand" title="Month-end procedure">TLs log each completion with revision count → CRM confirms 50% + 50% → tally each person vs own baseline/target and tier → TLs: team 70% and personal 30% separately → pay base + bonus in the same payroll cycle. {byId("E04")?.name} prepares; Founder approves.</Callout>
      )}
    </>
  );
}
