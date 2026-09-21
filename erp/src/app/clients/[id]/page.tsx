import { clients } from "@/data/clients";
import { ClientDetail } from "./client-detail";

export function generateStaticParams() {
  return clients.map((c) => ({ id: c.id }));
}

export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ClientDetail id={id} />;
}
