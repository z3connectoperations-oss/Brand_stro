"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronsUpDown, Check } from "lucide-react";
import { useMe } from "@/lib/role-context";
import { navByRole, roleLabels, workspaceLabel } from "@/lib/nav";
import { employees } from "@/data/people";
import { alerts } from "@/data/ops";
import { Avatar } from "@/components/ui/avatar";
import type { Role } from "@/lib/types";

const ROLE_ORDER: Role[] = ["founder", "creative-head", "crm", "team-leader", "designer", "rnd", "sketch", "hr"];

export function Sidebar() {
  const { me, setRole } = useMe();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const groups = navByRole[me.role];
  const myAlerts = alerts.filter((a) => a.owner === me.role).length;

  return (
    <aside className="hidden w-[248px] shrink-0 flex-col justify-between border-r border-slate-200 bg-white md:flex">
      <div>
        <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-900 text-base font-bold text-amber-400 ring-2 ring-brand-700/20">B</div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[15px] font-bold tracking-tight text-slate-900">BRANDSTRO</span>
              <span className="rounded border border-brand-200/60 bg-brand-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-brand-700">ERP</span>
            </div>
            <span className="text-[10px] font-medium text-slate-400">Agency Operating System</span>
          </div>
        </div>

        <div className="px-3 pt-4">
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
                        className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors ${
                          activeFix ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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
      </div>

      <div className="relative border-t border-slate-100 p-3">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left hover:bg-slate-50"
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <Avatar employee={me} />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-semibold text-slate-900">{me.name}</div>
            <div className="truncate text-[11px] text-slate-500">{me.title}</div>
          </div>
          <ChevronsUpDown size={14} className="text-slate-400" />
        </button>
        {open && (
          <div className="absolute bottom-full left-3 right-3 mb-1 rounded-lg border border-slate-300 bg-white p-1 shadow-[0_4px_6px_-1px_rgba(15,23,42,0.08),0_2px_4px_-2px_rgba(15,23,42,0.04)]" role="listbox">
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
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[12px] hover:bg-slate-50"
                >
                  <Avatar employee={person} size="sm" />
                  <span className="flex-1">
                    <span className="font-medium text-slate-800">{person.name}</span>
                    <span className="text-slate-400"> · {roleLabels[r]}</span>
                  </span>
                  {r === me.role && <Check size={14} className="text-brand-600" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
