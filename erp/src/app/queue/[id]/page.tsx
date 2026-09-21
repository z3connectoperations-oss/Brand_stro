import { projects } from "@/data/projects";
import { QueueWork } from "./queue-work";

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export default async function QueueItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <QueueWork projectId={id} />;
}
