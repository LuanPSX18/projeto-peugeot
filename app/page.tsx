"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { AlertBanner } from "@/components/AlertBanner";
import { Cluster } from "@/components/Cluster";
import { Filters } from "@/components/Filters";
import type { PriorityFilter, StatusFilter } from "@/components/Filters";
import { HistoryLog } from "@/components/HistoryLog";
import { ItemEditor } from "@/components/ItemEditor";
import { PriorityCard } from "@/components/PriorityCard";
import { Schedule } from "@/components/Schedule";
import { KmEditor } from "@/components/KmEditor";
import { Toast } from "@/components/Toast";
import { TopBar } from "@/components/TopBar";
import { Totals } from "@/components/Totals";

import { ALERT_TEXT, CAR_INFO, NEXT_SERVICES, PRIORITIES } from "@/lib/data";
import type { ItemsState, MaintenanceLog } from "@/lib/types";
import { usePersistentState } from "@/lib/usePersistentState";

type Theme = "dark" | "light";

export default function Home() {
  const [theme, setTheme] = usePersistentState<Theme>("pejo:theme", "dark");
  const [showMoney, setShowMoney] = usePersistentState<boolean>("pejo:showMoney", true);

  const [itemsState, setItemsState] = useState<ItemsState>({});
  const [alertDismissed, setAlertDismissed] = useState<boolean>(false);
  const [serverKm, setServerKm] = useState<number | null>(null);
  const [maintenanceLog, setMaintenanceLog] = useState<MaintenanceLog[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [status, setStatus] = useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [editing, setEditing] = useState<{ priorityId: string; itemId: string } | null>(null);
  const [editingKm, setEditingKm] = useState(false);

  const [savingCount, setSavingCount] = useState(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = (msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMsg(msg);
    toastTimerRef.current = setTimeout(() => setToastMsg(null), 4000);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [itemsRes, carRes, logRes] = await Promise.all([
          fetch("/api/items"),
          fetch("/api/car"),
          fetch("/api/maintenance"),
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
        if (logRes.ok) {
          const log = (await logRes.json()) as MaintenanceLog[];
          setMaintenanceLog(log);
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

  const derivedServices = useMemo(() => {
    return NEXT_SERVICES.map((s) => {
      if (!s.linkedItemIds?.length) return s;
      const relevant = maintenanceLog
        .filter((e) => s.linkedItemIds!.includes(e.item_id))
        .sort((a, b) => b.km_at - a.km_at);
      if (relevant.length === 0) return s;
      return { ...s, lastKm: relevant[0].km_at };
    });
  }, [maintenanceLog]);

  const postMaintenance = (entry: Omit<MaintenanceLog, "id" | "done_at">) => {
    fetch("/api/maintenance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    })
      .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
      .then((created: MaintenanceLog) => {
        setMaintenanceLog((prev) => [created, ...prev]);
      })
      .catch(() => {
        showToast("Falha ao registrar no histórico");
      });
  };

  const putItem = (
    id: string,
    patch: { done?: boolean; price?: number | null; shop?: string | null },
    onError?: () => void,
  ) => {
    setSavingCount((c) => c + 1);
    fetch("/api/items", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    })
      .then((res) => { if (!res.ok) throw new Error(); })
      .catch(() => {
        onError?.();
        showToast("Falha ao salvar — tente de novo");
      })
      .finally(() => setSavingCount((c) => c - 1));
  };

  const toggleItem = (id: string) => {
    setItemsState((prev) => {
      const current = prev[id] ?? { done: false, price: null, shop: null };
      const next = { ...current, done: !current.done };
      if (next.done) {
        const item = allItems.find((it) => it.id === id);
        postMaintenance({
          item_id: id,
          item_name: item?.name ?? id,
          km_at: serverKm ?? CAR_INFO.km,
          price: current.price,
          shop: current.shop,
        });
      }
      putItem(id, { done: next.done }, () => {
        setItemsState((s) => ({ ...s, [id]: current }));
      });
      return { ...prev, [id]: next };
    });
  };

  const putCar = (
    patch: { km?: number; alertDismissed?: boolean },
    onError?: () => void,
  ) => {
    setSavingCount((c) => c + 1);
    fetch("/api/car", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    })
      .then((res) => { if (!res.ok) throw new Error(); })
      .catch(() => {
        onError?.();
        showToast("Falha ao salvar — tente de novo");
      })
      .finally(() => setSavingCount((c) => c - 1));
  };

  const dismissAlert = () => {
    setAlertDismissed(true);
    putCar({ alertDismissed: true }, () => setAlertDismissed(false));
  };

  const handleSaveKm = (km: number) => {
    const prev = serverKm;
    setServerKm(km);
    putCar({ km }, () => setServerKm(prev));
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
        saving={savingCount > 0}
      />

      <Cluster car={car} totalDone={totalDone} totalItems={totalItems} onEditKm={() => setEditingKm(true)} />

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

      <Schedule services={derivedServices} currentKm={car.km} />

      <Totals priorities={PRIORITIES} itemsState={itemsState} showMoney={showMoney} />

      <HistoryLog entries={maintenanceLog} showMoney={showMoney} />

      <ItemEditor
        open={!!editing}
        item={editingItem}
        state={editingState}
        onClose={() => setEditing(null)}
        onSave={({ price, shop }) => {
          if (!editing) return;
          const itemId = editing.itemId;
          const snapshot = itemsState[itemId];
          setItemsState((prev) => {
            const current = prev[itemId] ?? { done: false, price: null, shop: null };
            return { ...prev, [itemId]: { ...current, price, shop } };
          });
          putItem(itemId, { price, shop }, () => {
            setItemsState((s) => ({
              ...s,
              [itemId]: snapshot ?? { done: !!s[itemId]?.done, price: null, shop: null },
            }));
          });
          setEditing(null);
        }}
      />
      <KmEditor
        open={editingKm}
        currentKm={car.km}
        onClose={() => setEditingKm(false)}
        onSave={handleSaveKm}
      />

      {toastMsg && (
        <Toast message={toastMsg} onClose={() => setToastMsg(null)} />
      )}
    </div>
  );
}
