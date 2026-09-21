"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { QcItem } from "@/lib/types";
import { Progress } from "./primitives";

/** Interactive checklist. State lives in the component only (no backend yet). */
export function Checklist({ items, initial = [], title, onAllChecked }: { items: QcItem[]; initial?: string[]; title?: string; onAllChecked?: (all: boolean) => void }) {
  const [done, setDone] = useState<Set<string>>(new Set(initial));
  const toggle = (id: string) => {
    const next = new Set(done);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setDone(next);
    onAllChecked?.(next.size === items.length);
  };
  const pct = Math.round((done.size / items.length) * 100);
  return (
    <div>
      {title && (
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[13px] font-semibold text-slate-900">{title}</span>
          <span className="font-mono text-[11px] text-slate-500">
            {done.size}/{items.length} · {pct}%
          </span>
        </div>
      )}
      <Progress value={pct} tone={pct === 100 ? "green" : "brand"} className="mb-3" />
      <ul className="space-y-1.5">
        {items.map((it) => {
          const checked = done.has(it.id);
          return (
            <li key={it.id}>
              <label className="flex cursor-pointer items-start gap-2.5 rounded-md px-2 py-1.5 hover:bg-slate-50">
                <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggle(it.id)} />
                <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${checked ? "border-brand-600 bg-brand-600" : "border-slate-300 bg-white"}`}>
                  {checked && <Check size={11} className="text-white" strokeWidth={3} />}
                </span>
                <span className={`text-[12.5px] ${checked ? "text-slate-400 line-through" : "text-slate-800"}`}>{it.label}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
