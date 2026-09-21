import { notFound } from "next/navigation";
import { deliverables } from "@/data/projects";
import { ReviewWork } from "./review-work";

export function generateStaticParams() {
  return deliverables.map((d) => ({ id: d.id }));
}

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const d = deliverables.find((x) => x.id === id);
  if (!d) notFound();
  return <ReviewWork id={d.id} />;
}
