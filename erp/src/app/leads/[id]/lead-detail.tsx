"use client";

import { useState } from "react";
import { PageHeader, Card, Pill, Facts, Callout, Empty } from "@/components/ui/primitives";
import { CreateProjectModal } from "@/components/forms/create-project";
import { useDb } from "@/lib/use-db";
import { productById, products } from "@/data/people";
import { computeReport } from "@/lib/rules";
import { projectStage } from "@/lib/selectors";
import { inr } from "@/lib/format";

export function LeadDetail({ id }: { id: string }) {
  const { db, act } = useDb();
  const [create, setCreate] = useState(false);
  const lead = db.leads.find((l) => l.id === id);
  if (!lead) return <Empty text="Lead not found." />;
  const product = productById(lead.interest);
  const sketch = computeReport(db).soldBy;
  const rndQueue = db.projects.filter((p) => ["R&D queue", "R&D in progress"].includes(projectStage(db, p))).length;
  const existingClient = db.clients.find((c) => c.name.toLowerCase().startsWith(lead.business.toLowerCase().split(" ")[0]));

  return (
    <>
      <PageHeader crumbs={[{ label: "Leads", href: "/leads" }, { label: lead.business }]} title={lead.business} subtitle={`${lead.contact} · via ${lead.source}`} badge={<Pill tone={lead.status === "Won" ? "green" : lead.status === "Lost" ? "slate" : "brand"}>{lead.status}</Pill>}
        actions={<>
          {lead.status !== "Won" && lead.status !== "Lost" && <><button className="btn-secondary btn-sm" onClick={() => act.setLeadStatus(lead.id, "Lost")}>Mark lost</button><button className="btn-primary btn-sm" onClick={() => act.setLeadStatus(lead.id, "Won", "Handover to CRM")}>Mark won</button></>}
          {lead.status === "Won" && <button className="btn-primary btn-sm" onClick={() => setCreate(true)}>Create project (handover)</button>}
        </>} />
      <CreateProjectModal open={create} onClose={() => setCreate(false)} clientId={existingClient?.id} />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <Card title="Lead facts">
            <Facts items={[{ label: "Interest", value: product.name }, { label: "Est. value", value: inr(lead.estValue) }, { label: "Next action", value: lead.nextAction }, { label: "Action date", value: lead.nextActionDate }, { label: "Last contact", value: lead.lastContact }, { label: "Owner", value: "Zameel (Founder)" }]} cols={3} />
          </Card>
          <Card title="Sales handover notes" subtitle="What the CRM will read on Day 1 of onboarding: package sold, price, any promises made.">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block"><span className="label-sm">Package sold</span><select className="input mt-1" defaultValue={lead.interest}>{products.map((p) => <option key={p.id} value={p.id}>{p.name} — {inr(p.price)}</option>)}</select></label>
              <label className="block"><span className="label-sm">Agreed price</span><input className="input mt-1" defaultValue={inr(product.price)} /></label>
              <label className="block sm:col-span-2"><span className="label-sm">Promises made to the client</span><textarea className="input mt-1 h-20 py-2" placeholder="e.g. 2 revision rounds included, first draft within 7 days…" /></label>
            </div>
            <Callout tone="amber" title="Scope starts here">Anything promised here is what the CRM will hold the team to. A promise not written here is a scope change later.</Callout>
            {lead.status === "Won" && !existingClient && <Callout tone="slate">No matching client record yet. The project form lets you pick an existing client; add {lead.business} in Clients first if it&apos;s new.</Callout>}
          </Card>
        </div>
        <div className="space-y-4">
          <Card title="Package detail">
            <Facts cols={2} items={[{ label: "Price", value: inr(product.price) }, { label: "Included revisions", value: product.includedRevisions }, { label: "Deliverables", value: product.deliverables.join(", ") }, { label: "Route", value: product.usesSketch ? "R&D → Sketch → Logo" : "R&D → Packaging" }]} />
          </Card>
          <Card title="Capacity before you promise a date">
            <ul className="space-y-2 text-[12.5px]">
              <li className="flex justify-between"><span>Sketch slots left this month</span><span className="font-mono font-semibold">{24 - sketch.logo - sketch.branding} / 24</span></li>
              <li className="flex justify-between"><span>R&D queue length</span><span className="font-mono font-semibold">{rndQueue} projects</span></li>
              <li className="flex justify-between"><span>Unassigned deliverables</span><span className="font-mono font-semibold">{db.deliverables.filter((d) => d.stage === "Awaiting assignment").length}</span></li>
            </ul>
            <p className="mt-3 text-[12px] text-slate-500">Realistic start: R&D pick-up ~{Math.ceil(rndQueue / 2)} working day(s) after the advance is received.</p>
          </Card>
        </div>
      </div>
    </>
  );
}
