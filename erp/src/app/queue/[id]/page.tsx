import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { QueueWork } from "./queue-work";

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export default async function QueueItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = projects.find((x) => x.id === id);
  if (!p) notFound();
  return <QueueWork projectId={p.id} />;
}
