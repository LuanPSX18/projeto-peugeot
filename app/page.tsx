"use client";

import { useEffect, useMemo, useState } from "react";

import { AlertBanner } from "@/components/AlertBanner";
import { Cluster } from "@/components/Cluster";
import { Filters } from "@/components/Filters";
import type { PriorityFilter, StatusFilter } from "@/components/Filters";
import { ItemEditor } from "@/components/ItemEditor";
import { PriorityCard } from "@/components/PriorityCard";
import { Schedule } from "@/components/Schedule";
import { TopBar } from "@/components/TopBar";
import { Totals } from "@/components/Totals";

import { ALERT_TEXT, CAR_INFO, NEXT_SERVICES, PRIORITIES } from "@/lib/data";
import type { ItemsState } from "@/lib/types";
import { usePersistentState } from "@/lib/usePersistentState";

type Theme = "dark" | "light";

export default function Home() {
  const [theme, setTheme] = usePersistentState<Theme>("pejo:theme", "dark");
  const [showMoney, setShowMoney] = usePersistentState<boolean>("pejo:showMoney", true);

  const [itemsState, setItemsState] = useState<ItemsState>({});
  const [alertDismissed, setAlertDismissed] = useState<boolean>(false);
  const [serverKm, setServerKm] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  const [status, setStatus] = useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [editing, setEditing] = useState<{ priorityId: string; itemId: string } | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [itemsRes, carRes] = await Promise.all([
          fetch("/api/items"),
          fetch("/api/car"),
        ]);
        if (cancelled) return;
        if (itemsRes.ok) {
          const items = (await itemsRes.json()) as ItemsState;
          setItemsState(items);
        }
        if (carRes.ok) {
          const car = (await carRes.json()) as { km: number; alertDismissed: boolean };
          setAlertDismissed(!!car.alertDismissed);
          if (typeof car.km === "number") setServerKm(car.km);
        }
      } catch {
        // ignore — keep defaults
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const car = useMemo(
    () => ({ ...CAR_INFO, km: serverKm ?? CAR_INFO.km }),
    [serverKm],
  );

  const allItems = useMemo(() => PRIORITIES.flatMap((p) => p.items), []);
  const totalDone = allItems.filter((it) => itemsState[it.id]?.done).length;
  const totalItems = allItems.length;

  const putItem = (id: string, patch: { done?: boolean; price?: number | null; shop?: string | null }) => {
    fetch("/api/items", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    }).catch(() => {
      // ignore — optimistic UI keeps the change locally
    });
  };

  const toggleItem = (id: string) => {
    setItemsState((prev) => {
      const current = prev[id] ?? { done: false, price: null, shop: null };
      const next = { ...current, done: !current.done };
      putItem(id, { done: next.done });
      return { ...prev, [id]: next };
    });
  };

  const dismissAlert = () => {
    setAlertDismissed(true);
    fetch("/api/car", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alertDismissed: true }),
    }).catch(() => {});
  };

  const editItem = (priorityId: string, itemId: string) => {
    setEditing({ priorityId, itemId });
  };

  const editingItem = editing
    ? PRIORITIES.find((p) => p.id === editing.priorityId)?.items.find(
        (it) => it.id === editing.itemId,
      ) ?? null
    : null;

  const editingState = editing ? itemsState[editing.itemId] : undefined;

  const visiblePriorities = useMemo(() => {
    return PRIORITIES.filter(
      (p) => priorityFilter === "all" || p.id === priorityFilter,
    )
      .map((p) => {
        const items = p.items.filter((it) => {
          const done = !!itemsState[it.id]?.done;
          if (status === "done") return done;
          if (status === "pending") return !done;
          return true;
        });
        return { ...p, items };
      })
      .filter((p) => p.items.length > 0);
  }, [priorityFilter, status, itemsState]);

  return (
    <div className="app">
      <TopBar
        theme={theme}
        onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
        showMoney={showMoney}
        onToggleMoney={() => setShowMoney(!showMoney)}
      />

      <Cluster car={car} totalDone={totalDone} totalItems={totalItems} />

      {loaded && !alertDismissed && (
        <AlertBanner alert={ALERT_TEXT} onDismiss={dismissAlert} />
      )}

      <Filters
        status={status}
        setStatus={setStatus}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        priorities={PRIORITIES}
      />

      <div className="grid">
        {visiblePriorities.map((p) => (
          <PriorityCard
            key={p.id}
            priority={p}
            itemsState={itemsState}
            showMoney={showMoney}
            onToggle={toggleItem}
            onEdit={(itemId) => editItem(p.id, itemId)}
          />
        ))}
        {visiblePriorities.length === 0 && (
          <div
            style={{
              padding: "40px 20px",
              textAlign: "center",
              color: "var(--fg-faint)",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              border: "1px dashed var(--line-strong)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            // nenhum item para os filtros atuais
          </div>
        )}
      </div>

      <Schedule services={NEXT_SERVICES} currentKm={car.km} />

      <Totals priorities={PRIORITIES} itemsState={itemsState} showMoney={showMoney} />

      <ItemEditor
        open={!!editing}
        item={editingItem}
        state={editingState}
        onClose={() => setEditing(null)}
        onSave={({ price, shop }) => {
          if (!editing) return;
          const itemId = editing.itemId;
          setItemsState((prev) => {
            const current = prev[itemId] ?? { done: false, price: null, shop: null };
            return {
              ...prev,
              [itemId]: { ...current, price, shop },
            };
          });
          putItem(itemId, { price, shop });
          setEditing(null);
        }}
      />
    </div>
  );
}
