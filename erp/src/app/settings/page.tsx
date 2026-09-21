"use client";

import { PageHeader, Card, Table, Callout, Pill } from "@/components/ui/primitives";
import { useDb } from "@/lib/use-db";
import { products } from "@/data/people";
import { inr } from "@/lib/format";

const RATES = [
  ["R&D concept", "18", "24", "₹350", "₹175", "₹0"],
  ["Logo (designer)", "4", "7", "₹1,650", "₹825", "₹0*"],
  ["Branding collateral set", "1", "5", "₹700", "₹350", "₹0"],
  ["Standalone label", "1", "4", "₹450", "₹225", "₹0"],
  ["Standalone packaging", "1", "2", "₹900", "₹450", "₹0"],
  ["Logo TL personal", "2", "4", "₹750", "—", "—"],
];
const TIERS = [
  ["Sketch Artist — % sketches with no rework", "≥90% ₹5,000 · 75–89% ₹3,000 · 60–74% ₹1,500 · below 60% ₹0"],
  ["HR — team members hitting own target", "11–12 ₹5,000 · 9–10 ₹3,000 · 7–8 ₹1,500 · below 7 ₹0"],
  ["CRM — clean close + 50/50 paid on time", "₹240 per project · target 42 of ~47"],
  ["Team Leaders — team 70% / personal 30%", "Team component max ₹3,500 · personal max ₹1,500"],
];

export default function SettingsPage() {
  const { db, reset } = useDb();
  return (
    <>
      <PageHeader title="Settings & configuration" subtitle="Products, revision limits, incentive rates, SLAs and the work calendar. Nothing here is hard-coded in the workflow." actions={<button className="btn-danger btn-sm" onClick={() => { if (window.confirm("Reset all demo data to the seed state? Your changes in this browser will be lost.")) reset(); }}>Reset demo data ({db.audit.length} audit entries)</button>} />
      <div className="grid gap-4 xl:grid-cols-2">
        <Card title="Products & packages" padded={false} actions={<button className="btn-secondary btn-sm">Edit</button>}>
          <Table head={["Product", "Price", "Monthly target", "Included revisions", "Route", "Deliverables"]}>
            {products.map((p) => (
              <tr key={p.id} className="table-row"><td className="font-medium">{p.name}</td><td className="font-mono">{inr(p.price)}</td><td className="font-mono">{p.monthlyTarget}</td><td className="font-mono">{p.includedRevisions}</td><td>{p.usesSketch ? "R&D → Sketch → Logo" : "R&D → Packaging"}</td><td className="text-slate-600">{p.deliverables.join(", ")}</td></tr>
            ))}
          </Table>
          <div className="px-4 py-3"><Callout tone="amber" title="Confirm with the Founder">Included revision rounds and the price for additional labels/packs (&quot;1st&quot; pricing) are not stated in the source documents — these values are placeholders.</Callout></div>
        </Card>
        <Card title="Incentive rate table" subtitle="Per unit beyond baseline, by client-revision tier" padded={false}>
          <Table head={["Work type", "Baseline", "Target", "0–1 rev", "2–3 rev", "4+ rev"]}>
            {RATES.map((r) => <tr key={r[0]} className="table-row">{r.map((c, i) => <td key={i} className={i ? "font-mono" : "font-medium"}>{c}</td>)}</tr>)}
          </Table>
          <p className="px-4 py-2 text-[11.5px] text-slate-500">* unless flagged as a client scope change.</p>
          <ul className="divide-y divide-slate-100 border-t border-slate-100">
            {TIERS.map(([k, v]) => <li key={k} className="px-4 py-2.5 text-[12.5px]"><div className="font-medium">{k}</div><div className="text-slate-600">{v}</div></li>)}
          </ul>
        </Card>
        <Card title="Response-time SLAs">
          <ul className="space-y-2 text-[12.5px]">
            {[["WhatsApp — active project", "4 business hours"], ["WhatsApp — enquiry", "1 business day"], ["Email", "1 business day"], ["Submission acknowledgement", "Same business day"], ["Stalled thread / pending approval", "Flag after 3 days"], ["Payment follow-up before Founder escalation", "1 cycle"]].map(([k, v]) => (
              <li key={k} className="flex justify-between"><span className="text-slate-600">{k}</span><Pill mono>{v}</Pill></li>
            ))}
          </ul>
          <p className="mt-3 text-[11.5px] text-slate-500">Business hours not defined in the source documents — assumed 09:30–18:30.</p>
        </Card>
        <Card title="Work calendar & queue rules">
          <ul className="space-y-2 text-[12.5px]">
            <li className="flex justify-between"><span className="text-slate-600">Working days</span><span className="font-medium">Mon–Sat; 2nd & 4th Saturdays off; all Sundays off</span></li>
            <li className="flex justify-between"><span className="text-slate-600">Planned leave notice</span><span className="font-medium">≥ 1 day</span></li>
            <li className="flex justify-between"><span className="text-slate-600">P1 concurrency</span><span className="font-medium">One active P1 per queue</span></li>
            <li className="flex justify-between"><span className="text-slate-600">Queue order</span><span className="font-medium">P1 → P2 FIFO by payment date → P3</span></li>
            <li className="flex justify-between"><span className="text-slate-600">Throughput benchmarks</span><span className="font-medium">R&D 2/day · Sketch 1/day · Designer 1/day</span></li>
            <li className="flex justify-between"><span className="text-slate-600">Repeat-issue threshold</span><span className="font-medium">Same designer 2+ → CH · team 3+ → system gap</span></li>
          </ul>
        </Card>
      </div>
    </>
  );
}
