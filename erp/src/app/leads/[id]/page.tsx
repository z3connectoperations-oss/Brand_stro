import { leads } from "@/data/clients";
import { LeadDetail } from "./lead-detail";

export function generateStaticParams() {
  return leads.map((l) => ({ id: l.id }));
}

export default async function LeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LeadDetail id={id} />;
}
