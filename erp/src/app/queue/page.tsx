"use client";

import { useMe } from "@/lib/role-context";
import { QueueDashboard } from "@/components/dashboards/queue";

/** The queue page and the R&D / Sketch dashboard are the same view: the queue is the job. */
export default function QueuePage() {
  const { me } = useMe();
  return <QueueDashboard me={me} />;
}
