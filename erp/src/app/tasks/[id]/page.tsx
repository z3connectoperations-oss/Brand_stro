import { notFound } from "next/navigation";
import { deliverables } from "@/data/projects";
import { TaskDetail } from "./task-detail";

export function generateStaticParams() {
  return deliverables.map((d) => ({ id: d.id }));
}

export default async function TaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const d = deliverables.find((x) => x.id === id);
  if (!d) notFound();
  return <TaskDetail id={d.id} />;
}
