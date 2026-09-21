import { projects } from "@/data/projects";
import { DiscoveryCall } from "./discovery-call";

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export default async function DiscoveryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DiscoveryCall projectId={id} />;
}
