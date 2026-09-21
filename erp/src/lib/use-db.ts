"use client";

import { useSyncExternalStore } from "react";
import { getDb, getServerDb, subscribe, actions, resetDb, type Db } from "@/lib/store";
import { useMe } from "@/lib/role-context";

type Actions = typeof actions;
/** Every action takes the acting employee first; this binds it to the signed-in role. */
type Bound = { [K in keyof Actions]: Actions[K] extends (actorId: string, ...rest: infer R) => infer T ? (...rest: R) => T : never };

export function useDb(): { db: Db; act: Bound; reset: () => void } {
  const db = useSyncExternalStore(subscribe, getDb, getServerDb);
  const { me } = useMe();
  const act = Object.fromEntries(
    (Object.keys(actions) as (keyof Actions)[]).map((k) => [k, (...rest: unknown[]) => (actions[k] as (...a: unknown[]) => unknown)(me.id, ...rest)]),
  ) as Bound;
  return { db, act, reset: resetDb };
}
