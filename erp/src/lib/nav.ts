import type { Role } from "@/lib/types";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard, Users, Building2, FolderKanban, KanbanSquare, Wallet, UsersRound, Coins,
  BadgeCheck, Bell, BarChart3, Settings, ClipboardCheck, MessageSquareWarning, Clock3,
  ListChecks, PenTool, FlaskConical, CalendarCheck, CalendarDays, UserCog, ListTodo, MessageSquareText, Briefcase,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}
export interface NavGroup {
  title: string;
  items: NavItem[];
}

const dash = (label = "Dashboard"): NavItem => ({ label, href: "/dashboard", icon: LayoutDashboard });

export const navByRole: Record<Role, NavGroup[]> = {
  founder: [
    { title: "Main", items: [dash("Command Center"), { label: "Leads", href: "/leads", icon: Briefcase }, { label: "Clients", href: "/clients", icon: Building2 }, { label: "Projects", href: "/projects", icon: FolderKanban }, { label: "Production Board", href: "/board", icon: KanbanSquare }, { label: "Payments", href: "/payments", icon: Wallet }] },
    { title: "Management", items: [{ label: "Approvals & Scope", href: "/approvals", icon: BadgeCheck }, { label: "Team & Workload", href: "/team", icon: UsersRound }, { label: "Incentives", href: "/incentives", icon: Coins }, { label: "Alerts", href: "/alerts", icon: Bell }, { label: "Reports", href: "/reports", icon: BarChart3 }, { label: "Settings", href: "/settings", icon: Settings }] },
  ],
  "creative-head": [
    { title: "Creative", items: [dash(), { label: "Production Board", href: "/board", icon: KanbanSquare }, { label: "Projects", href: "/projects", icon: FolderKanban }, { label: "Team Workload", href: "/team", icon: UsersRound }, { label: "Review Queue", href: "/review", icon: ClipboardCheck }, { label: "Escalations", href: "/alerts", icon: Bell }] },
    { title: "Leadership", items: [{ label: "Weekly TL Review", href: "/reviews", icon: ListChecks }, { label: "Monthly Scorecard", href: "/reviews/scorecard", icon: BarChart3 }, { label: "Reports", href: "/reports", icon: BarChart3 }] },
  ],
  crm: [
    { title: "CRM Workspace", items: [dash(), { label: "Clients", href: "/clients", icon: Building2 }, { label: "Projects", href: "/projects", icon: FolderKanban }, { label: "Follow-ups & SLAs", href: "/follow-ups", icon: Clock3 }, { label: "Approvals & Feedback", href: "/approvals", icon: BadgeCheck }, { label: "Collections", href: "/payments", icon: Wallet }, { label: "Complaints", href: "/complaints", icon: MessageSquareWarning }] },
  ],
  "team-leader": [
    { title: "Team", items: [dash(), { label: "My Team", href: "/team", icon: UsersRound }, { label: "Team Projects", href: "/projects", icon: FolderKanban }, { label: "Production Board", href: "/board", icon: KanbanSquare }, { label: "Review Queue", href: "/review", icon: ClipboardCheck }, { label: "Team Incentives", href: "/incentives", icon: Coins }] },
  ],
  designer: [
    { title: "My Work", items: [dash("My Dashboard"), { label: "My Tasks", href: "/tasks", icon: ListTodo }, { label: "Review Feedback", href: "/feedback", icon: MessageSquareText }, { label: "My Earnings", href: "/incentives", icon: Coins }] },
  ],
  rnd: [
    { title: "My Work", items: [dash("My Dashboard"), { label: "Research Queue", href: "/queue", icon: FlaskConical }, { label: "My Earnings", href: "/incentives", icon: Coins }] },
  ],
  sketch: [
    { title: "My Work", items: [dash("My Dashboard"), { label: "Sketch Queue", href: "/queue", icon: PenTool }, { label: "My Earnings", href: "/incentives", icon: Coins }] },
  ],
  hr: [
    { title: "People", items: [dash(), { label: "Attendance", href: "/hr/attendance", icon: CalendarCheck }, { label: "Leave", href: "/hr/leave", icon: CalendarDays }, { label: "Employees", href: "/hr/employees", icon: UserCog }, { label: "Onboarding & Exit", href: "/hr/checklists", icon: ListChecks }, { label: "Incentive Tally", href: "/incentives", icon: Coins }] },
  ],
};

export const roleLabels: Record<Role, string> = {
  founder: "Founder",
  "creative-head": "Creative Head",
  crm: "Client Relationship Manager",
  "team-leader": "Team Leader",
  designer: "Designer",
  rnd: "R&D",
  sketch: "Sketch Artist",
  hr: "HR / Admin",
};

export const workspaceLabel: Record<Role, string> = {
  founder: "Founder Command Center",
  "creative-head": "Creative Department",
  crm: "CRM Workspace",
  "team-leader": "Team Leader Workspace",
  designer: "Designer Workspace",
  rnd: "R&D Workspace",
  sketch: "Sketch Workspace",
  hr: "HR / Admin Workspace",
};

export { Users };
