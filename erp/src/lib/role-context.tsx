"use client";

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import type { Employee, Role } from "@/lib/types";
import { employees } from "@/data/people";

/** The signed-in person. There is no backend yet, so the role is chosen in the sidebar and kept in localStorage. */
interface RoleState {
  me: Employee;
  setRole: (role: Role) => void;
}

const RoleContext = createContext<RoleState | null>(null);
const STORAGE_KEY = "brandstro.role";
const DEFAULT_ROLE: Role = "founder";
const listeners = new Set<() => void>();

function isRole(v: string | null): v is Role {
  return !!v && employees.some((e) => e.role === v);
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function getSnapshot(): Role {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return isRole(v) ? v : DEFAULT_ROLE;
  } catch {
    return DEFAULT_ROLE; // private mode or blocked storage
  }
}

function getServerSnapshot(): Role {
  return DEFAULT_ROLE;
}

function writeRole(role: Role) {
  try {
    window.localStorage.setItem(STORAGE_KEY, role);
  } catch {
    /* ignore: state still updates for this tab via listeners */
  }
  listeners.forEach((l) => l());
}

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const role = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // `?as=crm` switches the signed-in role from the URL (demo links, screenshots).
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("as");
    if (isRole(wanted) && wanted !== getSnapshot()) writeRole(wanted);
  }, []);
  const value = useMemo<RoleState>(() => ({ me: employees.find((e) => e.role === role) ?? employees[0], setRole: writeRole }), [role]);
  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useMe(): RoleState {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useMe must be used inside RoleProvider");
  return ctx;
}
