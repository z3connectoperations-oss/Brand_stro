import { PageHeader, Card, Table, Kpi, KpiGrid, Progress, Callout } from "@/components/ui/primitives";
import { products } from "@/data/people";
import { deliverables, feedback } from "@/data/projects";
import { inr } from "@/lib/format";

const sold: Record<string, number> = { logo: 5, branding: 9, label: 8, packaging: 4 };

const DASH = [
  { area: "Production", rows: [["Projects received (MTD)", "26"], ["Completed", "9"], ["In progress", "12"], ["Pending advance", "2"], ["Delayed", "3"]] },
  { area: "Logo / Identity", rows: [["Concepts completed", "15"], ["First-presentation approval", "40%"], ["Avg revision rounds", "1.6"], ["Turnaround (brief → client)", "6.2 days"]] },
  { area: "Packaging", rows: [["Deliverables completed", "20"], ["Avg revision rounds", "1.4"], ["Turnaround", "4.8 days"], ["Print errors caught at TL review", "5"]] },
  { area: "R&D", rows: [["Briefs delivered", "16"], ["Briefs needing rework", "1"], ["Avg turnaround", "1.3 days"], ["Support requests", "4"]] },
  { area: "People", rows: [["Attendance accuracy", "98%"], ["Late instances", "7"], ["Training actions open", "3"], ["Leadership pipeline candidates", "2"]] },
];

export default function ReportsPage() {
  const revenue = products.reduce((s, p) => s + p.price * sold[p.id], 0);
  const target = products.reduce((s, p) => s + p.price * p.monthlyTarget, 0);
  const rounds = deliverables.filter((d) => d.version > 0);
  const dist = [0, 1, 2, 3, 4].map((n) => rounds.filter((d) => (n === 4 ? d.revisionCount >= 4 : d.revisionCount === n)).length);
  const designMiss = feedback.filter((f) => f.rootCause === "Design miss").length;
  const pref = feedback.filter((f) => f.rootCause === "Client preference").length;

  return (
    <>
      <PageHeader title="Reports — September 2026" subtitle="The branding-agency dashboard from Handbook §30: one number per team, tracked every week, that you actually look at." />
      <KpiGrid cols={5}>
        <Kpi label="Revenue MTD" value={inr(revenue, true)} hint={`${Math.round((revenue / target) * 100)}% of ${inr(target, true)}`} tone="brand" />
        <Kpi label="Engagements" value={`${Object.values(sold).reduce((a, b) => a + b, 0)} / 47`} hint="Sold vs target" />
        <Kpi label="First-draft approvals" value="40%" hint="Approved on first presentation" tone="green" />
        <Kpi label="Avg rounds / project" value="1.5" hint="Packages include 2–3" tone="amber" />
        <Kpi label="Projected margin" value="41%" hint="Required band 40–50%" tone="violet" />
      </KpiGrid>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card title="Sales mix vs plan" subtitle="The mix is built around 24 sketch slots">
          <ul className="space-y-3">
            {products.map((p) => (
              <li key={p.id}>
                <div className="mb-1 flex justify-between text-[12.5px]"><span>{p.name}</span><span className="font-mono">{sold[p.id]}/{p.monthlyTarget} · {inr(p.price * sold[p.id], true)}</span></div>
                <Progress value={(sold[p.id] / p.monthlyTarget) * 100} />
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Revision distribution" subtitle="Where first-presentation quality is weak, specifically">
          <ul className="space-y-2">
            {["0 rounds (approved first draft)", "1 round", "2 rounds", "3 rounds", "4+ rounds"].map((l, i) => (
              <li key={l}>
                <div className="mb-1 flex justify-between text-[12.5px]"><span>{l}</span><span className="font-mono">{dist[i]}</span></div>
                <Progress value={(dist[i] / rounds.length) * 100} tone={i >= 3 ? "red" : i === 0 ? "green" : "brand"} />
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Revision root cause" subtitle="Genuine design miss vs. subjective preference">
          <div className="mb-1 flex justify-between text-[12.5px]"><span>Design miss → fix the thinking</span><span className="font-mono">{designMiss}</span></div>
          <Progress value={(designMiss / (designMiss + pref)) * 100} tone="red" className="mb-3" />
          <div className="mb-1 flex justify-between text-[12.5px]"><span>Client preference → fix the brief-gathering</span><span className="font-mono">{pref}</span></div>
          <Progress value={(pref / (designMiss + pref)) * 100} tone="amber" className="mb-3" />
          <Callout tone="amber">The ₹15,000 package selling with informally unlimited rounds is a margin problem: 5 rounds eat time priced for 2.</Callout>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {DASH.map((d) => (
          <Card key={d.area} title={d.area} padded={false}>
            <Table head={["Metric", "Value"]} className="[&_table]:min-w-0">
              {d.rows.map(([k, v]) => <tr key={k} className="table-row"><td className="text-slate-600">{k}</td><td className="text-right font-mono font-semibold">{v}</td></tr>)}
            </Table>
          </Card>
        ))}
      </div>

      <Card className="mt-4" title="Company economics at full target (Incentive Plan)" padded={false}>
        <Table head={["Line item", "Amount"]}>
          {[["Revenue — 8 logo, 16 branding, 15 label, 8 packaging", "₹3,53,500"], ["Fixed payroll", "− ₹1,26,000"], ["Bonus payout, everyone at target", "− ₹61,900"], ["Rent, software, electricity, misc.", "− ₹17,000"], ["Company profit", "₹1,48,600 (~42%)"]].map(([k, v], i) => (
            <tr key={k} className={`table-row ${i === 4 ? "font-semibold" : ""}`}><td>{k}</td><td className="text-right font-mono">{v}</td></tr>
          ))}
        </Table>
      </Card>
    </>
  );
}
