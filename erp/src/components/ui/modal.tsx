"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
      onMouseDown={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
        className={`w-full ${
          wide ? "max-w-3xl" : "max-w-lg"
        } rounded-xl border border-slate-200 bg-white shadow-2xl my-auto overflow-hidden flex flex-col max-h-[90vh]`}
      >
        <header className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-5 sm:py-3.5 shrink-0 bg-white">
          <div className="min-w-0 flex-1">
            <h2 className="text-[15px] font-semibold text-slate-900 truncate">{title}</h2>
            {subtitle && <p className="text-[12px] text-slate-500 leading-tight mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors shrink-0"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-5 sm:py-4">{children}</div>
        {footer && (
          <footer className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 px-4 py-3 sm:px-5 sm:py-3 bg-slate-50 shrink-0">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}

export function Field({
  label,
  children,
  hint,
  className = "",
}: {
  label: string;
  children: ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="label-sm">{label}</span>
      <div className="mt-1">{children}</div>
      {hint && <span className="mt-1 block text-[11.5px] text-slate-500">{hint}</span>}
    </label>
  );
}
