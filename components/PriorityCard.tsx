"use client";

import type { CSSProperties } from "react";
import type { ItemsState, Priority, PriorityItem } from "@/lib/types";
import { ACCENT_VAR, fmtKm, fmtMoney } from "@/lib/format";

type CardProps = {
  priority: Priority;
  itemsState: ItemsState;
  showMoney: boolean;
  isAuthed: boolean;
  onToggle: (itemId: string) => void;
  onEdit: (itemId: string) => void;
};

type ItemRowProps = {
  item: PriorityItem;
  done: boolean;
  price: number | null;
  shop: string | null;
  showMoney: boolean;
  isAuthed: boolean;
  onToggle: () => void;
  onEdit: () => void;
};

function CheckRow({
  item,
  done,
  price,
  shop,
  showMoney,
  isAuthed,
  onToggle,
  onEdit,
}: ItemRowProps) {
  return (
    <li className={`check-item ${done ? "done" : ""}`} onDoubleClick={isAuthed ? onEdit : undefined}>
      <button
        className="check-box"
        role="checkbox"
        aria-checked={done}
        onClick={isAuthed ? onToggle : undefined}
        aria-label={done ? "Desmarcar" : "Marcar como feito"}
        disabled={!isAuthed}
        title={!isAuthed ? "Faça login para editar" : undefined}
      />
      <div className="check-body">
        <div className="check-name">{item.name}</div>
        {item.note ? <div className="check-note">{item.note}</div> : null}
      </div>
      <div className="check-meta">
        <button
          type="button"
          className={`check-price ${!price && showMoney ? "empty" : ""}`}
          onClick={isAuthed ? onEdit : undefined}
          disabled={!isAuthed}
          style={{
            background: "transparent",
            border: 0,
            color: "inherit",
            padding: 0,
            cursor: isAuthed ? "pointer" : "default",
            font: "inherit",
          }}
          title={isAuthed ? (showMoney ? "Editar valor / oficina" : "Editar oficina") : undefined}
        >
          {showMoney ? (price ? `R$ ${fmtMoney(price)}` : "—") : "····"}
        </button>
        {shop ? (
          <div className="check-shop" title={shop}>
            {shop}
          </div>
        ) : null}
      </div>
    </li>
  );
}

export function PriorityCard({
  priority,
  itemsState,
  showMoney,
  isAuthed,
  onToggle,
  onEdit,
}: CardProps) {
  const items = priority.items;
  const doneCount = items.filter((it) => itemsState[it.id]?.done).length;
  const totalSpent = items.reduce(
    (sum, it) => sum + (Number(itemsState[it.id]?.price) || 0),
    0,
  );
  const pct = items.length ? Math.round((doneCount / items.length) * 100) : 0;
  const accentColor = ACCENT_VAR[priority.accent];

  const cardStyle = { "--card-accent": accentColor } as CSSProperties;

  return (
    <article
      className={`card ${doneCount === items.length ? "completed" : ""}`}
      style={cardStyle}
    >
      <div className="card-accent-bar" style={{ background: accentColor }} />
      <div className="card-head">
        <div className="card-rank mono">P{priority.rank}</div>
        <div className="card-head-text">
          <div className="card-tag mono">{priority.tag}</div>
          <h2 className="card-title">{priority.title}</h2>
          <div className="card-sub">{priority.subtitle}</div>
        </div>
      </div>
      <div className="card-prog">
        <span className="card-prog-num mono">
          {doneCount}/{items.length}
        </span>
        <div className="card-prog-bar">
          <span style={{ width: `${pct}%` }} />
        </div>
        <span className="mono">{pct}%</span>
      </div>
      <ul className="checklist">
        {items.map((it) => {
          const state = itemsState[it.id];
          return (
            <CheckRow
              key={it.id}
              item={it}
              done={!!state?.done}
              price={state?.price ?? null}
              shop={state?.shop ?? null}
              showMoney={showMoney}
              isAuthed={isAuthed}
              onToggle={() => onToggle(it.id)}
              onEdit={() => onEdit(it.id)}
            />
          );
        })}
      </ul>
      <div className="card-foot">
        <span>Estimativa</span>
        <span className="est-value mono">
          R$ {fmtKm(priority.estimate[0])}–{fmtKm(priority.estimate[1])}
          {showMoney && totalSpent > 0 ? (
            <span style={{ color: "var(--card-accent)", marginLeft: 10 }}>
              · gasto R$ {fmtMoney(totalSpent)}
            </span>
          ) : null}
        </span>
      </div>
    </article>
  );
}
