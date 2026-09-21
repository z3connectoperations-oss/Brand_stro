import Link from "next/link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";

/* ---------- Page header ---------- */
export function PageHeader({ title, subtitle, crumbs, actions, badge }: { title: string; subtitle?: string; crumbs?: { label: string; href?: string }[]; actions?: ReactNode; badge?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        {crumbs && (
          <nav className="mb-1 flex items-center gap-1 text-[12px] text-slate-500">
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1">
                {c.href ? <Link href={c.href} className="hover:text-slate-800">{c.label}</Link> : <span className="text-slate-800">{c.label}</span>}
                {i < crumbs.length - 1 && <ChevronRight size={12} />}
              </span>
            ))}
          </nav>
        )}
        <div className="flex items-center gap-2.5">
          <h1 className="text-[22px] font-bold tracking-tight text-slate-900">{title}</h1>
          {badge}
        </div>
        {subtitle && <p className="mt-0.5 text-[13px] text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/* ---------- KPI strip ---------- */
export type Tone = "brand" | "red" | "amber" | "green" | "slate" | "violet";
const dot: Record<Tone, string> = { brand: "bg-brand-600", red: "bg-red-500", amber: "bg-amber-500", green: "bg-emerald-500", slate: "bg-slate-400", violet: "bg-violet-500" };

export function Kpi({ label, value, hint, tone = "brand", href }: { label: string; value: ReactNode; hint?: string; tone?: Tone; href?: string }) {
  const body = (
    <div className="card flex h-full flex-col justify-between p-4">
      <div className="flex items-center justify-between">
        <span className="label-sm">{label}</span>
        <span className={`h-2 w-2 rounded-full ${dot[tone]}`} />
      </div>
      <div className="mt-2 text-[24px] font-bold tracking-tight text-slate-900 tnum">{value}</div>
      {hint && <div className="mt-0.5 text-[12px] text-slate-500">{hint}</div>}
    </div>
  );
  return href ? <Link href={href} className="block hover:-translate-y-px">{body}</Link> : body;
}

export function KpiGrid({ children, cols = 6 }: { children: ReactNode; cols?: number }) {
  const cls = { 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5", 6: "lg:grid-cols-6" }[cols] ?? "lg:grid-cols-6";
  return <div className={`mb-5 grid grid-cols-2 gap-3 md:grid-cols-3 ${cls}`}>{children}</div>;
}

/* ---------- Pills ---------- */
const pillTone: Record<Tone, string> = {
  brand: "bg-brand-50 text-brand-700 border-brand-200/60",
  red: "bg-red-50 text-red-700 border-red-200/60",
  amber: "bg-amber-50 text-amber-700 border-amber-200/60",
  green: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  slate: "bg-slate-100 text-slate-600 border-slate-200",
  violet: "bg-violet-50 text-violet-700 border-violet-200/60",
};
export function Pill({ children, tone = "slate", mono = false }: { children: ReactNode; tone?: Tone; mono?: boolean }) {
  return <span className={`inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-semibold ${mono ? "font-mono" : ""} ${pillTone[tone]}`}>{children}</span>;
}

export function PriorityPill({ p }: { p: "P1" | "P2" | "P3" }) {
  return <Pill tone={p === "P1" ? "red" : p === "P2" ? "brand" : "slate"} mono>{p}</Pill>;
}

/* ---------- Card & section ---------- */
export function Card({ title, subtitle, actions, children, className = "", icon: Icon, padded = true }: { title?: string; subtitle?: string; actions?: ReactNode; children: ReactNode; className?: string; icon?: LucideIcon; padded?: boolean }) {
  return (
    <section className={`card ${className}`}>
      {title && (
        <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <div className="flex items-center gap-2">
            {Icon && <Icon size={15} className="text-brand-600" />}
            <div>
              <h2 className="text-[14px] font-semibold text-slate-900">{title}</h2>
              {subtitle && <p className="text-[12px] text-slate-500">{subtitle}</p>}
            </div>
          </div>
          {actions}
        </header>
      )}
      <div className={padded ? "p-4" : ""}>{children}</div>
    </section>
  );
}

/* ---------- Callout ---------- */
export function Callout({ tone = "brand", title, children }: { tone?: Tone; title?: string; children: ReactNode }) {
  const t: Record<Tone, string> = {
    brand: "border-brand-200 bg-brand-50 text-brand-900",
    red: "border-red-200 bg-red-50 text-red-900",
    amber: "border-amber-200 bg-amber-50 text-amber-900",
    green: "border-emerald-200 bg-emerald-50 text-emerald-900",
    slate: "border-slate-200 bg-slate-50 text-slate-800",
    violet: "border-violet-200 bg-violet-50 text-violet-900",
  };
  return (
    <div className={`rounded-lg border px-3.5 py-2.5 text-[12.5px] ${t[tone]}`}>
      {title && <div className="font-semibold">{title}</div>}
      <div className={title ? "mt-0.5 opacity-90" : ""}>{children}</div>
    </div>
  );
}

/* ---------- Progress ---------- */
export function Progress({ value, tone = "brand", className = "" }: { value: number; tone?: Tone; className?: string }) {
  const bar: Record<Tone, string> = { brand: "bg-brand-600", red: "bg-red-500", amber: "bg-amber-500", green: "bg-emerald-500", slate: "bg-slate-400", violet: "bg-violet-500" };
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-slate-100 ${className}`} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className={`h-full rounded-full ${bar[tone]}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

/* ---------- Definition list ---------- */
export function Facts({ items, cols = 4 }: { items: { label: string; value: ReactNode }[]; cols?: number }) {
  const cls = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4", 5: "sm:grid-cols-5", 6: "sm:grid-cols-6" }[cols] ?? "sm:grid-cols-4";
  return (
    <dl className={`grid grid-cols-2 gap-x-4 gap-y-3 ${cls}`}>
      {items.map((it) => (
        <div key={it.label}>
          <dt className="label-sm">{it.label}</dt>
          <dd className="mt-0.5 text-[13px] font-medium text-slate-900">{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ---------- Empty ---------- */
export function Empty({ text }: { text: string }) {
  return <div className="rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center text-[12.5px] text-slate-500">{text}</div>;
}

/* ---------- Table ---------- */
export function Table({ head, children, className = "" }: { head: ReactNode[]; children: ReactNode; className?: string }) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full min-w-[640px] border-collapse text-[12.5px]">
        <thead className="table-head">
          <tr>
            {head.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

/* ---------- Toolbar chips ---------- */
export function Chips({ items, active, onChange }: { items: { key: string; label: string; count?: number }[]; active: string; onChange: (k: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((it) => (
        <button
          key={it.key}
          onClick={() => onChange(it.key)}
          className={`rounded-full border px-3 py-1 text-[12px] font-medium transition-colors ${
            active === it.key ? "border-brand-600 bg-brand-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
          }`}
        >
          {it.label}
          {it.count !== undefined && <span className={`ml-1 ${active === it.key ? "text-white/80" : "text-slate-400"}`}>{it.count}</span>}
        </button>
      ))}
    </div>
  );
}
