"use client";

import Link from "next/link";
import Image from "next/image";
import { Bell, Search, Calendar } from "lucide-react";
import { useMe } from "@/lib/role-context";
import { useDb } from "@/lib/use-db";
import { computeAlerts } from "@/lib/rules";
import { Avatar } from "@/components/ui/avatar";

export function Topbar() {
  const { me } = useMe();
  const { db } = useDb();
  const count = computeAlerts(db).filter((a) => a.owner === me.role && a.severity !== "info").length;
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 md:px-6">
      <div className="flex items-center gap-2 md:hidden">
        <Image src="/brand-mark.png" alt="Brandstro" width={28} height={28} className="h-7 w-7 rounded-md" />
        <span className="text-sm font-bold text-brand-600">Brandstro</span>
      </div>
      <div className="relative ml-auto hidden w-80 md:block">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input className="input pl-8" placeholder="Search clients, projects, leads…" aria-label="Search" />
      </div>
      <div className="hidden items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-[12px] text-slate-600 md:flex">
        <Calendar size={13} className="text-slate-400" /> Mon, 21 Sep 2026
      </div>
      <Link href="/alerts" className="relative rounded-md p-2 text-slate-500 hover:bg-slate-100" aria-label="Alerts">
        <Bell size={16} />
        {count > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">{count}</span>}
      </Link>
      <Avatar employee={me} size="sm" />
    </header>
  );
}
