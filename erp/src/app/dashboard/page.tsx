"use client";

import { useMe } from "@/lib/role-context";
import { FounderDashboard } from "@/components/dashboards/founder";
import { CreativeHeadDashboard } from "@/components/dashboards/creative-head";
import { CrmDashboard } from "@/components/dashboards/crm";
import { TeamLeaderDashboard } from "@/components/dashboards/team-leader";
import { DesignerDashboard } from "@/components/dashboards/designer";
import { QueueDashboard } from "@/components/dashboards/queue";
import { HrDashboard } from "@/components/dashboards/hr";

export default function DashboardPage() {
  const { me } = useMe();
  switch (me.role) {
    case "founder":
      return <FounderDashboard />;
    case "creative-head":
      return <CreativeHeadDashboard />;
    case "crm":
      return <CrmDashboard />;
    case "team-leader":
      return <TeamLeaderDashboard me={me} />;
    case "designer":
      return <DesignerDashboard me={me} />;
    case "rnd":
    case "sketch":
      return <QueueDashboard me={me} />;
    case "hr":
      return <HrDashboard />;
  }
}
