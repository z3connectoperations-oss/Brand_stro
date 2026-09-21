import { deliverables } from "@/data/projects";
import { TaskDetail } from "./task-detail";

export function generateStaticParams() {
  return deliverables.map((d) => ({ id: d.id }));
}

export default async function TaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TaskDetail id={id} />;
}
