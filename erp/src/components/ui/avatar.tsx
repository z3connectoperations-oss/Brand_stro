import type { Employee } from "@/lib/types";

export function Avatar({ employee, size = "md" }: { employee?: Employee; size?: "sm" | "md" | "lg" }) {
  const dim = size === "sm" ? "h-6 w-6 text-[10px]" : size === "lg" ? "h-10 w-10 text-sm" : "h-8 w-8 text-[11px]";
  if (!employee) return <div className={`${dim} rounded-full border border-dashed border-slate-300 bg-slate-50`} title="Unassigned" />;
  return (
    <div className={`${dim} ${employee.color} flex shrink-0 items-center justify-center rounded-full font-semibold text-white ring-1 ring-white`} title={employee.name}>
      {employee.initials}
    </div>
  );
}

export function AvatarStack({ employees, max = 3 }: { employees: (Employee | undefined)[]; max?: number }) {
  const shown = employees.filter(Boolean).slice(0, max) as Employee[];
  const extra = employees.filter(Boolean).length - shown.length;
  return (
    <div className="flex -space-x-1.5">
      {shown.map((e) => (
        <Avatar key={e.id} employee={e} size="sm" />
      ))}
      {extra > 0 && <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-[10px] font-semibold text-slate-600 ring-1 ring-white">+{extra}</div>}
    </div>
  );
}
