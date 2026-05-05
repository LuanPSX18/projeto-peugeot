"use client";

import type { Priority } from "@/lib/types";
import { ACCENT_VAR } from "@/lib/format";

export type StatusFilter = "all" | "pending" | "done";
export type PriorityFilter = "all" | string;

type Props = {
  status: StatusFilter;
  setStatus: (s: StatusFilter) => void;
  priorityFilter: PriorityFilter;
  setPriorityFilter: (p: PriorityFilter) => void;
  priorities: Priority[];
};

const STATUS_OPTIONS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "Tudo" },
  { id: "pending", label: "Pendentes" },
  { id: "done", label: "Feitos" },
];

export function Filters({
  status,
  setStatus,
  priorityFilter,
  setPriorityFilter,
  priorities,
}: Props) {
  return (
    <div className="filters">
      <span className="filters-label">Status</span>
      <div className="chips" role="group">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s.id}
            className="chip"
            aria-pressed={status === s.id}
            onClick={() => setStatus(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <span className="filters-label" style={{ marginLeft: 8 }}>Prioridade</span>
      <div className="chips" role="group">
        <button
          className="chip"
          aria-pressed={priorityFilter === "all"}
          onClick={() => setPriorityFilter("all")}
        >
          Todas
        </button>
        {priorities.map((p) => (
          <button
            key={p.id}
            className="chip"
            aria-pressed={priorityFilter === p.id}
            onClick={() => setPriorityFilter(p.id)}
          >
            <i style={{ background: ACCENT_VAR[p.accent] }} />
            P{p.rank}
          </button>
        ))}
      </div>
    </div>
  );
}
