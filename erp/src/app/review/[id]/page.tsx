import { deliverables } from "@/data/projects";
import { ReviewWork } from "./review-work";

export function generateStaticParams() {
  return deliverables.map((d) => ({ id: d.id }));
}

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ReviewWork id={id} />;
}
