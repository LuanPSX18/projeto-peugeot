// app.jsx — Peugeot maintenance checklist (garage / instrument cluster aesthetic)
const { useState, useEffect, useMemo, useRef } = React;

// ───────── helpers ─────────
const fmtKm = (n) => n.toLocaleString("pt-BR");
const fmtMoney = (n) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const ACCENT_VAR = {
  danger: "var(--danger)",
  warn: "var(--warn)",
  info: "var(--info)",
  purple: "var(--purple)",
  neutral: "var(--neutral)",
  teal: "var(--teal)",
};

// localStorage hook
function usePersistentState(key, initial) {
  const [v, setV] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
  }, [key, v]);
  return [v, setV];
}

// ───────── icons ─────────
const Icon = {
  Sun: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  ),
  Moon: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  ),
  Eye: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  ),
  EyeOff: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3l18 18M10.6 10.6a2.6 2.6 0 0 0 3.7 3.7M9.5 5.3A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7c1.7 0 3.3-.4 4.6-1" />
    </svg>
  ),
  Close: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  ),
  Edit: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4l6 6L9 21H3v-6L14 4z" />
    </svg>
  ),
};

// ───────── topbar ─────────
function TopBar({ theme, onToggleTheme, showMoney, onToggleMoney }) {
  return (
    <div className="topbar">
      <div className="brand">
        <span className="brand-mark"></span>
        <span>GARAGE&nbsp;OS · v1.0</span>
      </div>
      <div className="topbar-actions">
        <button
          className="icon-btn"
          onClick={onToggleMoney}
          title={showMoney ? "Esconder valores" : "Mostrar valores"}
          aria-label="Toggle money"
        >
          {showMoney ? <Icon.Eye /> : <Icon.EyeOff />}
        </button>
        <button
          className="icon-btn"
          onClick={onToggleTheme}
          title="Alternar tema"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Icon.Sun /> : <Icon.Moon />}
        </button>
      </div>
    </div>
  );
}

// ───────── instrument cluster ─────────
function Cluster({ car, totalDone, totalItems }) {
  const pct = totalItems ? Math.round((totalDone / totalItems) * 100) : 0;
  return (
    <div className="cluster">
      <div className="panel car-panel">
        <div className="panel-label">Veículo</div>
        <h1 className="car-name">{car.model} <span style={{ color: "var(--fg-dim)", fontWeight: 500 }}>{car.year}</span></h1>
        <div className="car-sub">
          <span><i></i>{car.engine}</span>
          <span>VIN&nbsp;····7B2</span>
          <span>PLACA&nbsp;···· 4F92</span>
        </div>
      </div>
      <div className="panel odo">
        <div>
          <div className="panel-label">Odômetro</div>
          <div className="odo-value">
            {fmtKm(car.km)}
            <span className="unit">KM</span>
          </div>
        </div>
        <div>
          <div className="odo-bar">
            <span style={{
              display:"block", height:"100%",
              width: `${Math.min(100, (car.km % 200000) / 2000)}%`,
              background: "var(--accent)",
              boxShadow: "0 0 12px var(--accent-soft)"
            }}></span>
          </div>
          <div className="odo-ticks">
            <span>0</span><span>50K</span><span>100K</span><span>150K</span><span>200K</span>
          </div>
        </div>
      </div>
      <div className="panel prog">
        <div className="panel-label">Progresso geral</div>
        <div className="prog-num">
          <span>{totalDone}</span>
          <span className="total">/{totalItems}</span>
          <span className="pct">{pct}%</span>
        </div>
        <div className="prog-bar">
          <span style={{ width: `${pct}%` }}></span>
        </div>
        <div className="prog-meta">
          <span>{totalItems - totalDone} pendentes</span>
          <span>{totalDone} concluídos</span>
        </div>
      </div>
    </div>
  );
}

// ───────── alert banner ─────────
function AlertBanner({ alert, onDismiss }) {
  return (
    <div className="alert" role="alert">
      <div className="alert-icon">!</div>
      <div className="alert-text">
        <div className="alert-title">{alert.title}</div>
        <div className="alert-body">{alert.body}</div>
      </div>
      <button className="alert-close" onClick={onDismiss} aria-label="Dispensar">
        <Icon.Close />
      </button>
    </div>
  );
}

// ───────── filters ─────────
function Filters({ status, setStatus, priorityFilter, setPriorityFilter, priorities }) {
  return (
    <div className="filters">
      <span className="filters-label">Status</span>
      <div className="chips" role="group">
        {[
          { id: "all", label: "Tudo" },
          { id: "pending", label: "Pendentes" },
          { id: "done", label: "Feitos" },
        ].map((s) => (
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
            <i style={{ background: ACCENT_VAR[p.accent] }}></i>
            P{p.rank}
          </button>
        ))}
      </div>
    </div>
  );
}

// ───────── single check item ─────────
function CheckItem({ item, state, accent, showMoney, onToggle, onEdit }) {
  const done = state?.done;
  const price = state?.price;
  const shop = state?.shop;
  return (
    <li className={`check-item ${done ? "done" : ""}`} onDoubleClick={onEdit}>
      <button
        className="check-box"
        role="checkbox"
        aria-checked={!!done}
        onClick={onToggle}
        aria-label={done ? "Desmarcar" : "Marcar como feito"}
      ></button>
      <div className="check-body">
        <div className="check-name">{item.name}</div>
        {item.note ? <div className="check-note">{item.note}</div> : null}
      </div>
      <div className="check-meta">
        {showMoney ? (
          <button
            className={`check-price ${!price ? "empty" : ""}`}
            onClick={onEdit}
            style={{ background: "transparent", border: 0, color: "inherit", padding: 0, cursor: "pointer", font: "inherit" }}
            title="Editar valor / oficina"
          >
            {price ? `R$ ${fmtMoney(price)}` : "—"}
          </button>
        ) : (
          <button
            className="check-price empty"
            onClick={onEdit}
            style={{ background: "transparent", border: 0, color: "inherit", padding: 0, cursor: "pointer", font: "inherit" }}
            title="Editar oficina"
          >
            ····
          </button>
        )}
        {shop ? <div className="check-shop" title={shop}>{shop}</div> : null}
      </div>
    </li>
  );
}

// ───────── priority card ─────────
function PriorityCard({ priority, itemsState, showMoney, onToggle, onEdit }) {
  const items = priority.items;
  const doneCount = items.filter((it) => itemsState[it.id]?.done).length;
  const totalSpent = items.reduce((sum, it) => sum + (Number(itemsState[it.id]?.price) || 0), 0);
  const pct = items.length ? Math.round((doneCount / items.length) * 100) : 0;
  const accentColor = ACCENT_VAR[priority.accent];

  return (
    <article
      className={`card ${doneCount === items.length ? "completed" : ""}`}
      style={{ "--card-accent": accentColor }}
    >
      <div className="card-accent-bar" style={{ background: accentColor }}></div>
      <div className="card-head">
        <div className="card-rank mono">P{priority.rank}</div>
        <div className="card-head-text">
          <div className="card-tag mono">{priority.tag}</div>
          <h2 className="card-title">{priority.title}</h2>
          <div className="card-sub">{priority.subtitle}</div>
        </div>
      </div>
      <div className="card-prog">
        <span className="card-prog-num mono">{doneCount}/{items.length}</span>
        <div className="card-prog-bar"><span style={{ width: `${pct}%` }}></span></div>
        <span className="mono">{pct}%</span>
      </div>
      <ul className="checklist">
        {items.map((it) => (
          <CheckItem
            key={it.id}
            item={it}
            state={itemsState[it.id]}
            accent={accentColor}
            showMoney={showMoney}
            onToggle={() => onToggle(it.id)}
            onEdit={() => onEdit(it.id)}
          />
        ))}
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

// ───────── editor popover ─────────
function ItemEditor({ open, item, state, onClose, onSave }) {
  const [price, setPrice] = useState("");
  const [shop, setShop] = useState("");
  const priceRef = useRef(null);

  useEffect(() => {
    if (open) {
      setPrice(state?.price ? String(state.price) : "");
      setShop(state?.shop || "");
      setTimeout(() => priceRef.current?.focus(), 50);
    }
  }, [open, state]);

  if (!open) return null;
  const handleSave = () => {
    const cleanPrice = price === "" ? null : Number(price.replace(",", "."));
    onSave({ price: Number.isFinite(cleanPrice) ? cleanPrice : null, shop: shop.trim() });
  };

  return (
    <div className="editor-overlay" onClick={onClose}>
      <div className="editor" onClick={(e) => e.stopPropagation()}>
        <h3>{item.name}</h3>
        <div className="editor-sub">{item.note || "Detalhes do serviço"}</div>
        <div className="field">
          <label>Valor pago (R$)</label>
          <input
            ref={priceRef}
            type="text"
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0,00"
          />
        </div>
        <div className="field">
          <label>Oficina / mecânico</label>
          <input
            type="text"
            value={shop}
            onChange={(e) => setShop(e.target.value)}
            placeholder="Ex: Auto Center XYZ"
          />
        </div>
        <div className="editor-actions">
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn primary" onClick={handleSave}>Salvar</button>
        </div>
      </div>
    </div>
  );
}

// ───────── schedule (próximas revisões) ─────────
function Schedule({ services, currentKm }) {
  return (
    <section className="schedule">
      <h3 className="schedule-title">Próximas revisões por quilometragem</h3>
      <div className="schedule-grid">
        {services.map((s, i) => {
          const nextAt = s.lastKm + s.every;
          const remaining = nextAt - currentKm;
          const usedPct = Math.min(100, Math.max(0, ((currentKm - s.lastKm) / s.every) * 100));
          let level = "ok";
          if (remaining < 0) level = "danger";
          else if (remaining < s.every * 0.2) level = "warn";
          const status = level === "danger"
            ? `Atrasada ${fmtKm(Math.abs(remaining))} km`
            : level === "warn"
              ? `Faltam ${fmtKm(remaining)} km`
              : `Faltam ${fmtKm(remaining)} km`;
          return (
            <div className="sched-item" key={i}>
              <div className="sched-name">{s.label}</div>
              <div className="sched-bar-wrap">
                <span className="mono">{fmtKm(s.lastKm)}</span>
                <div className="sched-bar"><span className={level} style={{ width: `${usedPct}%` }}></span></div>
                <span className="mono">{fmtKm(nextAt)}</span>
              </div>
              <div className={`sched-status ${level}`}>{status}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ───────── totals ─────────
function Totals({ priorities, itemsState, showMoney }) {
  const allItems = priorities.flatMap((p) => p.items);
  const totalSpent = allItems.reduce((s, it) => s + (Number(itemsState[it.id]?.price) || 0), 0);
  const estLow = priorities.reduce((s, p) => s + p.estimate[0], 0);
  const estHigh = priorities.reduce((s, p) => s + p.estimate[1], 0);
  const remainingItems = allItems.filter((it) => !itemsState[it.id]?.done).length;

  return (
    <div className="totals">
      <div className="total-card">
        <div className="total-label">Estimativa total</div>
        <div className="total-value mono">
          <span className="currency">R$</span>{fmtKm(estLow)} – {fmtKm(estHigh)}
        </div>
      </div>
      {showMoney && (
        <div className="total-card">
          <div className="total-label">Já gasto</div>
          <div className="total-value mono" style={{ color: "var(--accent)" }}>
            <span className="currency">R$</span>{fmtMoney(totalSpent)}
          </div>
        </div>
      )}
      <div className="total-card">
        <div className="total-label">Itens restantes</div>
        <div className="total-value mono">{remainingItems}<span style={{ color: "var(--fg-faint)", fontSize: 12, marginLeft: 6 }}>/ {allItems.length}</span></div>
      </div>
    </div>
  );
}

// ───────── App ─────────
function App() {
  const [theme, setTheme] = usePersistentState("pejo:theme", "dark");
  const [showMoney, setShowMoney] = usePersistentState("pejo:showMoney", true);
  const [itemsState, setItemsState] = usePersistentState("pejo:items", {});
  const [alertDismissed, setAlertDismissed] = usePersistentState("pejo:alertDismissed", false);
  const [status, setStatus] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // host protocol for tweaks toggle
  useEffect(() => {
    const handler = (e) => {
      if (!e.data || typeof e.data !== "object") return;
      if (e.data.type === "__activate_edit_mode") setTweaksOpen(true);
      if (e.data.type === "__deactivate_edit_mode") setTweaksOpen(false);
    };
    window.addEventListener("message", handler);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", handler);
  }, []);
  const [tweaksOpen, setTweaksOpen] = useState(false);

  const priorities = window.PRIORITIES;

  const allItems = useMemo(() => priorities.flatMap((p) => p.items), [priorities]);
  const totalDone = allItems.filter((it) => itemsState[it.id]?.done).length;
  const totalItems = allItems.length;

  const toggleItem = (id) => {
    setItemsState((s) => ({ ...s, [id]: { ...(s[id] || {}), done: !s[id]?.done } }));
  };

  const editItem = (priorityId, itemId) => {
    setEditing({ priorityId, itemId });
  };
  const editingItem = editing
    ? priorities.find((p) => p.id === editing.priorityId)?.items.find((it) => it.id === editing.itemId)
    : null;

  const visiblePriorities = useMemo(() => {
    return priorities
      .filter((p) => priorityFilter === "all" || p.id === priorityFilter)
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
  }, [priorities, priorityFilter, status, itemsState]);

  return (
    <div className="app">
      <TopBar
        theme={theme}
        onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
        showMoney={showMoney}
        onToggleMoney={() => setShowMoney(!showMoney)}
      />

      <Cluster car={window.CAR_INFO} totalDone={totalDone} totalItems={totalItems} />

      {!alertDismissed && (
        <AlertBanner alert={window.ALERT_TEXT} onDismiss={() => setAlertDismissed(true)} />
      )}

      <Filters
        status={status} setStatus={setStatus}
        priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter}
        priorities={priorities}
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
          <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--fg-faint)", fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", border: "1px dashed var(--line-strong)", borderRadius: "var(--radius-lg)" }}>
            // nenhum item para os filtros atuais
          </div>
        )}
      </div>

      <Schedule services={window.NEXT_SERVICES} currentKm={window.CAR_INFO.km} />

      <Totals priorities={priorities} itemsState={itemsState} showMoney={showMoney} />

      <ItemEditor
        open={!!editing}
        item={editingItem || { name: "", note: "" }}
        state={editing ? itemsState[editing.itemId] : null}
        onClose={() => setEditing(null)}
        onSave={(data) => {
          setItemsState((s) => ({
            ...s,
            [editing.itemId]: { ...(s[editing.itemId] || {}), ...data },
          }));
          setEditing(null);
        }}
      />

      {tweaksOpen && (
        <TweaksPanel>
          <TweakSection label="Aparência" />
          <TweakRadio
            label="Tema"
            value={theme}
            options={["dark", "light"]}
            onChange={(v) => setTheme(v)}
          />
          <TweakToggle
            label="Mostrar valores R$"
            value={showMoney}
            onChange={(v) => setShowMoney(v)}
          />
          <TweakSection label="Dados" />
          <TweakButton
            label="Resetar checklist"
            onClick={() => {
              if (confirm("Apagar todos os itens marcados e valores?")) {
                setItemsState({});
              }
            }}
          />
        </TweaksPanel>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
