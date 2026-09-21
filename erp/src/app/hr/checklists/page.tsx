import { PageHeader, Card, Callout } from "@/components/ui/primitives";
import { Checklist } from "@/components/ui/checklist";

const ONBOARD = [
  "Company introduction & business-model walkthrough on Day 1",
  "Confirm reporting manager",
  "Set up tool access: Drive, Sheets, WhatsApp groups, ERP login",
  "Share the role brief and the relevant QC checklist",
  "Walk through file naming and the 01–08 Drive folder structure",
  "Schedule first-week review date",
  "Schedule first-month review date",
].map((l, i) => ({ id: `on${i}`, label: l }));

const EXIT = [
  "Confirm every active deliverable has a reassigned owner",
  "Team Leader confirms reassignment in the Project Tracker",
  "Coordinate access removal / password recovery (Drive, Sheets, WhatsApp, ERP)",
  "Collect working files into the project folders",
  "Complete final documentation and clearance",
  "Final settlement prepared for Founder approval",
].map((l, i) => ({ id: `ex${i}`, label: l }));

export default function ChecklistsPage() {
  return (
    <>
      <PageHeader title="Onboarding & exit" subtitle="Checklist completion rate is one of HR's two KPIs. Track first-week and first-month review dates." />
      <div className="grid gap-4 xl:grid-cols-2">
        <Card title="New employee — Pearl Dental hire (Logo Designer, starts 28 Sep)" subtitle="Onboarding checklist">
          <Checklist items={ONBOARD} initial={["on0", "on1"]} />
        </Card>
        <Card title="Departing employee — template" subtitle="Exit checklist">
          <Checklist items={EXIT} />
          <Callout tone="amber">Work must have a named new owner before access is removed. An unowned deliverable is a missed deadline waiting to happen.</Callout>
        </Card>
      </div>
    </>
  );
}
