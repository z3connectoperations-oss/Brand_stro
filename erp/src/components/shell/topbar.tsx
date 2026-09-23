"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Bell, Search, Calendar, Menu, ChevronsUpDown, Check } from "lucide-react";
import { useMe } from "@/lib/role-context";
import { useDb } from "@/lib/use-db";
import { computeAlerts } from "@/lib/rules";
import { Avatar } from "@/components/ui/avatar";
import { employees } from "@/data/people";
import { roleLabels } from "@/lib/nav";
import type { Role } from "@/lib/types";

const ROLE_ORDER: Role[] = ["founder", "creative-head", "crm", "team-leader", "designer", "rnd", "sketch", "hr"];

interface TopbarProps {
  onOpenMobileNav?: () => void;
}

export function Topbar({ onOpenMobileNav }: TopbarProps) {
  const { me, setRole } = useMe();
  const { db } = useDb();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const count = computeAlerts(db).filter((a) => a.owner === me.role && a.severity !== "info").length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setRoleMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 sm:px-4 md:px-6">
      {/* Mobile Menu & Brand */}
      <div className="flex items-center gap-2 md:hidden">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 active:bg-slate-200"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-1.5">
          <Image src="/brand-mark.png" alt="Brandstro" width={24} height={24} className="h-6 w-6 rounded" />
          <span className="text-[13px] font-bold tracking-tight text-brand-600">Brandstro</span>
        </div>
      </div>

      {/* Search Input on Desktop */}
      <div className="relative hidden w-80 md:block">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input className="input pl-8" placeholder="Search clients, projects, leads…" aria-label="Search" />
      </div>

      {/* Right side items */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-[12px] text-slate-600 lg:flex">
          <Calendar size={13} className="text-slate-400" /> Mon, 21 Sep 2026
        </div>

        <Link
          href="/alerts"
          className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 transition-colors"
          aria-label="Alerts"
        >
          <Bell size={18} />
          {count > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-xs">
              {count}
            </span>
          )}
        </Link>

        {/* Quick Role Switcher Dropdown in Topbar */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setRoleMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-2.5 py-1.5 text-left hover:bg-slate-100 transition-colors"
            aria-label="Switch Role"
            aria-expanded={roleMenuOpen}
          >
            <Avatar employee={me} size="sm" />
            <div className="hidden sm:block text-left">
              <div className="text-[12px] font-semibold text-slate-900 leading-tight truncate max-w-[120px]">
                {me.name}
              </div>
              <div className="text-[10px] text-slate-500 leading-tight truncate max-w-[120px]">
                {roleLabels[me.role]}
              </div>
            </div>
            <ChevronsUpDown size={14} className="text-slate-400 shrink-0 ml-0.5" />
          </button>

          {roleMenuOpen && (
            <div
              className="absolute right-0 mt-1.5 w-60 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-50 animate-in fade-in slide-in-from-top-2"
              role="listbox"
            >
              <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                Switch Role / Workspace
              </div>
              <div className="max-h-80 overflow-y-auto space-y-0.5">
                {ROLE_ORDER.map((r) => {
                  const person = employees.find((e) => e.role === r)!;
                  const isCurrent = r === me.role;
                  return (
                    <button
                      key={r}
                      role="option"
                      aria-selected={isCurrent}
                      onClick={() => {
                        setRole(r);
                        setRoleMenuOpen(false);
                      }}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12px] transition-colors ${
                        isCurrent
                          ? "bg-brand-50 text-brand-900 font-medium"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <Avatar employee={person} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900 truncate">{person.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{roleLabels[r]}</div>
                      </div>
                      {isCurrent && <Check size={15} className="text-brand-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
