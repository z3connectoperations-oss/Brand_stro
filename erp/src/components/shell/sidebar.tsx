"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronsUpDown, Check, X } from "lucide-react";
import { useMe } from "@/lib/role-context";
import { navByRole, roleLabels, workspaceLabel } from "@/lib/nav";
import { employees } from "@/data/people";
import { useDb } from "@/lib/use-db";
import { computeAlerts } from "@/lib/rules";
import { Avatar } from "@/components/ui/avatar";
import type { Role } from "@/lib/types";

const ROLE_ORDER: Role[] = ["founder", "creative-head", "crm", "team-leader", "designer", "rnd", "sketch", "hr"];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const { me, setRole } = useMe();
  const pathname = usePathname();
  const [openRoleSwitcher, setOpenRoleSwitcher] = useState(false);
  const groups = navByRole[me.role];
  const { db } = useDb();
  const myAlerts = computeAlerts(db).filter((a) => a.owner === me.role && a.severity !== "info").length;

  const navContent = (
    <>
      <div className="flex-1 overflow-y-auto px-3 pt-4">
        <div className="mb-3 px-2 label-sm">{workspaceLabel[me.role]}</div>
        {groups.map((g) => (
          <div key={g.title} className="mb-5">
            {groups.length > 1 && <div className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">{g.title}</div>}
            <ul className="space-y-0.5">
              {g.items.map((item) => {
                const active = item.href === "/dashboard" ? pathname === "/dashboard" : pathname === item.href || (pathname.startsWith(item.href + "/") && item.href !== "/reviews");
                const activeFix = item.href === "/reviews" ? pathname === "/reviews" : active;
                const badge = item.href === "/alerts" && myAlerts > 0 ? myAlerts : undefined;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => onMobileClose?.()}
                      className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors ${
                        activeFix ? "bg-brand-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <item.icon size={16} className={activeFix ? "text-white" : "text-slate-400"} />
                      <span className="flex-1">{item.label}</span>
                      {badge !== undefined && (
                        <span className={`rounded-full px-1.5 text-[10px] font-semibold ${activeFix ? "bg-white/20 text-white" : "bg-red-50 text-red-600"}`}>{badge}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="relative shrink-0 border-t border-slate-100 p-3">
        <button
          onClick={() => setOpenRoleSwitcher((v) => !v)}
          className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left hover:bg-slate-50 transition-colors"
          aria-haspopup="listbox"
          aria-expanded={openRoleSwitcher}
        >
          <Avatar employee={me} />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-semibold text-slate-900">{me.name}</div>
            <div className="truncate text-[11px] text-slate-500">{me.title}</div>
          </div>
          <ChevronsUpDown size={14} className="text-slate-400 shrink-0" />
        </button>
        {openRoleSwitcher && (
          <div className="absolute bottom-full left-3 right-3 mb-1 max-h-64 overflow-y-auto rounded-lg border border-slate-300 bg-white p-1 shadow-[0_4px_12px_rgba(15,23,42,0.12)] z-50" role="listbox">
            <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Sign in as</div>
            {ROLE_ORDER.map((r) => {
              const person = employees.find((e) => e.role === r)!;
              return (
                <button
                  key={r}
                  role="option"
                  aria-selected={r === me.role}
                  onClick={() => {
                    setRole(r);
                    setOpenRoleSwitcher(false);
                    onMobileClose?.();
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[12px] hover:bg-slate-50"
                >
                  <Avatar employee={person} size="sm" />
                  <span className="flex-1 truncate">
                    <span className="font-medium text-slate-800">{person.name}</span>
                    <span className="text-slate-400"> · {roleLabels[r]}</span>
                  </span>
                  {r === me.role && <Check size={14} className="text-brand-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-[248px] shrink-0 flex-col justify-between border-r border-slate-200 bg-white md:flex">
        <div className="flex h-16 shrink-0 items-center justify-between bg-brand-600 px-4">
          <Image src="/brand-logo.png" alt="Brandstro — Build. Brand. Beyond." width={150} height={43} priority className="h-[42px] w-auto" />
          <span className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-brand-yellow">ERP</span>
        </div>
        {navContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile Slide-Over Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] max-w-[85vw] flex-col justify-between border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full pointer-events-none"
        }`}
        aria-label="Mobile Navigation"
      >
        <div className="flex h-16 shrink-0 items-center justify-between bg-brand-600 px-4">
          <Image src="/brand-logo.png" alt="Brandstro" width={130} height={37} priority className="h-[36px] w-auto" />
          <div className="flex items-center gap-2">
            <span className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-brand-yellow">ERP</span>
            <button
              onClick={onMobileClose}
              className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white"
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        {navContent}
      </aside>
    </>
  );
}
