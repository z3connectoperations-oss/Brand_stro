"use client";

import Link from "next/link";
import Image from "next/image";
import { Bell, Search, Calendar, Menu } from "lucide-react";
import { useMe } from "@/lib/role-context";
import { useDb } from "@/lib/use-db";
import { computeAlerts } from "@/lib/rules";
import { Avatar } from "@/components/ui/avatar";

interface TopbarProps {
  onOpenMobileNav?: () => void;
}

export function Topbar({ onOpenMobileNav }: TopbarProps) {
  const { me } = useMe();
  const { db } = useDb();
  const count = computeAlerts(db).filter((a) => a.owner === me.role && a.severity !== "info").length;

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
      <div className="flex items-center gap-2">
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

        <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
          <Avatar employee={me} size="sm" />
          <span className="hidden text-[12px] font-medium text-slate-700 sm:inline-block max-w-[100px] truncate">
            {me.name.split(" ")[0]}
          </span>
        </div>
      </div>
    </header>
  );
}
