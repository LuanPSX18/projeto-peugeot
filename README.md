# Handoff: Peugeot 2008 Maintenance Checklist App

## Overview

A personal web app for tracking the 2026 maintenance/service round on a **Peugeot 2008 2017 1.6 automatic** with **147,612 km**. The user runs through 6 prioritized maintenance categories (safety → engine → cooling → transmission → suspension → extras), checks items off as they're done at the shop, and records the **actual price paid** and **shop name** for each item. The app is responsive (mobile + desktop) and persists everything locally.

## About the Design Files

The files in this bundle are **design references created in HTML** — a working React-in-the-browser prototype that shows the intended look, behavior, and interaction model. **They are not production code to copy directly.** The task is to recreate these HTML designs in the target codebase's existing environment (React + a build tool, Next.js, React Native, SwiftUI, etc.) using its established patterns and libraries — or, if no environment exists yet, to choose the most appropriate framework and implement the designs there.

The prototype uses Babel-in-the-browser and a single global `window` namespace for data; a real implementation should use proper modules, a real build, and ideally persist data to a backend (or at least IndexedDB) instead of `localStorage` JSON.

## Fidelity

**High-fidelity (hifi).** Final colors, typography, spacing, and interactions are all decided. The developer should recreate the UI pixel-perfectly. The aesthetic is **"garage / instrument cluster"** — dark by default, monospace for numbers and technical labels, amber accent reminiscent of dashboard warning lights, sharp/industrial feeling rather than playful.

## Screens / Views

This is a **single-screen app** with one modal overlay. Layout is a vertical flow inside a max-width 1280px container, padded 28px on desktop and 14px on mobile.

### 1. Top bar (always visible)

- Left: brand mark — a 22×22 circle with 1px amber border, containing a small glowing amber dot (radial gradient bg, 6px solid dot with `box-shadow: 0 0 10px var(--accent)`). To the right of the mark: monospace label `GARAGE OS · v1.0` in `--fg-dim`, 11px, letter-spacing 0.18em, uppercase.
- Right: two icon buttons (34×34, 1px border, 6px radius):
  - Eye / EyeOff toggle → show/hide R$ values
  - Sun / Moon toggle → light/dark theme
- Bottom border: 1px `--line` separator, 18px margin below.

### 2. Instrument cluster (3 panels)

A 3-column grid (`1.4fr 1fr 1fr`, gap 14px). Each panel is a `--bg-elev` card with 1px `--line` border, 10px radius, 18px/20px padding. On ≤900px collapses to 2 columns (first panel spans full width). On ≤520px stacks to 1 column.

Each panel has a **panel-label** at the top: 10px monospace, 0.16em letter-spacing, uppercase, `--fg-faint` color, with a 4px round dot prefix.

**Panel A — "Veículo"**
- H1: car name `"Peugeot 2008"` (22px, weight 600, -0.01em tracking) followed by year `"2017"` in `--fg-dim`.
- Sub-row: 3 monospace 11px chips with amber 6px round-dot prefixes — engine, masked VIN, masked plate.

**Panel B — "Odômetro"** (the hero)
- Big monospace value `147.612` in **amber** (`--accent`), 38px weight 500, with a soft amber glow (`text-shadow: 0 0 22px var(--accent-soft)`, removed in light theme). Tiny `KM` unit label after, 12px, uppercase.
- Below: a 4px-tall progress bar (border, rounded) showing position toward 200K km, filled with amber + amber glow.
- Tick marks underneath: `0   50K   100K   150K   200K`, 9px monospace, `--fg-faint`.

**Panel C — "Progresso geral"**
- Large monospace `{done}` followed by smaller `/{total}` in faint, then `{pct}%` pushed right.
- 6px progress bar with amber fill + glow.
- Footer row: `{remaining} pendentes` left, `{done} concluídos` right, 10px monospace uppercase.

### 3. Alert banner (sticky)

- `position: sticky; top: 8px; z-index: 30`. Backdrop blur 8px.
- Left border: **3px solid `--danger` (red-orange)**. Other borders 1px `--line-strong`.
- Layout: `auto 1fr auto` grid (icon, text, close button).
- Icon: 32×32 circle, danger-tinted background (`oklch(0.68 0.17 25 / 0.12)`), bold monospace `!` in danger color.
- Title: 10px mono uppercase in `--danger` — `"ALERTA — Carro com 147 mil km"`.
- Body: 13px regular text — explains the 3 most-likely items (timing belt, brakes, front suspension) and to ask the shop for an itemized quote by priority.
- Close: 28×28 ghost button. Once dismissed, hidden permanently (persisted in localStorage as `pejo:alertDismissed`).

### 4. Filters

A single horizontal flex row (wraps on mobile), 18px below the alert.

- Two groups of pill chips with monospace 10px uppercase labels in front (`Status` and `Prioridade`).
- Chip styling: 1px `--line-strong` border, 99px radius, 6×12 padding, 11px monospace uppercase, `--fg-dim` text. Hover lifts to `--fg`. **Pressed state:** filled with `--accent` (dark theme) or `--fg` (light), with the bg color as text.
- Status chips: `Tudo`, `Pendentes`, `Feitos`.
- Priority chips: `Todas`, then `P1`–`P6` each prefixed with a 6×6 round dot in that priority's accent color.

### 5. Priority cards grid

CSS Grid with `repeat(auto-fill, minmax(360px, 1fr))`, gap 16px. Each card is a column-flex container with:

- **Top accent bar:** 3px tall, full-width, in the priority's accent color.
- **Card head:** 16/18px padding, bottom-bordered. Layout: `auto 1fr`.
  - **Rank badge** 36×36, 1px border, 6px radius. Background is an 8% mix of the priority's accent color. Text: `P1`–`P6`, 14px monospace 600 in the accent color.
  - Right side stack: 10px monospace uppercase tag (e.g. `CRITICAL`, `ENGINE`, `COOLING`) in accent color, then 16px weight-600 title, then 12px `--fg-dim` subtitle (with `text-wrap: pretty`).
- **Per-priority progress bar:** padding 10/18, bottom-bordered. Layout: `{done}/{total}` mono, then a flex-1 3px bar with accent fill, then `{pct}%` mono.
- **Checklist** (`<ul>`, no markers): each item is a 3-column grid `auto 1fr auto`, 12px gap, 10/18 padding, bottom 1px `--line`.
  - **Checkbox:** 18×18 custom (1.5px `--line-strong` border, 4px radius). Checked state: filled with priority accent, with a CSS-rotated 10×6 div as the checkmark (left+bottom borders 2px). Hover: border becomes accent.
  - **Body:** 13px weight-500 name + optional 11px monospace `--fg-dim` note (e.g. `"Substituição completa do kit"`).
  - **Meta column** (right-aligned, monospace):
    - `R$ {price}` (or `—` if unset, in `--fg-faint`) — clickable, opens editor. Hidden as `····` when "show money" is off.
    - 10px `--fg-faint` shop name (truncated with ellipsis, max-width 110px).
  - Done state: `text-decoration: line-through` on name, faded color, subtle accent-tinted background.
  - Double-click anywhere on a row also opens the editor.
- **Card foot:** 10/18 padding, slightly darker bg (`--bg-elev-2`), top-bordered. Left: monospace 10px uppercase `"Estimativa"`. Right: `R$ {low}–{high}` formatted with thousand separators. If money is shown and there's actual spend, append `· gasto R$ {total}` in the accent color.

On ≤480px the grid collapses to 1 column.

### 6. Item editor (modal)

Triggered by clicking the price/dots, double-clicking a row, or "edit" gesture. A fixed full-screen overlay (rgba black 50%, backdrop blur 4px), centered modal:

- 380px max-width, `--bg-elev` background, 1px `--line-strong` border, 10px radius, 20px padding, large drop shadow.
- **Title:** item name (15px weight 600). Below: monospace 11px `--fg-faint` subtitle (the item note or `"Detalhes do serviço"`).
- **Field 1:** `Valor pago (R$)` — text input, `inputMode="decimal"`, accepts comma or dot. Placeholder `"0,00"`.
- **Field 2:** `Oficina / mecânico` — text input. Placeholder `"Ex: Auto Center XYZ"`.
- Field labels: 10px monospace 0.14em uppercase `--fg-faint`.
- Inputs: full-width, `--bg` background, 1px `--line-strong`, 6px radius, 9/11 padding, 13px sans. Focus border becomes `--accent`.
- **Actions** (bottom-right): `Cancelar` ghost button, `Salvar` filled-amber primary. Both 11px monospace uppercase, 0.08em tracking.
- Click on overlay backdrop closes; Save commits and closes.

### 7. Schedule (next services by km)

A section divider 30px below the grid (top 1px `--line` border, 20px padding-top).

- Title: `"Próximas revisões por quilometragem"`, 11px monospace uppercase 0.16em.
- Grid: `repeat(auto-fill, minmax(240px, 1fr))`, gap 10px.
- Each item card: `--bg-elev` bg, 1px border, 10px radius, 12/14 padding, column flex 8px gap.
  - Service name (13px weight-500).
  - Bar row: monospace `{lastKm}` ── 3px progress bar ── monospace `{nextKm}`. Bar fill is colored by status:
    - `ok` (green `oklch(0.7 0.13 150)`) — more than 20% of interval remaining
    - `warn` (amber `--warn`) — under 20% remaining
    - `danger` (red `--danger`) — overdue (negative remaining)
  - Status line: 10px monospace uppercase in matching color: `Faltam 8.388 km` / `Atrasada 2.612 km`.

### 8. Totals (bottom)

3-column grid (1 column on mobile), 30px above. Each is a `--bg-elev` card 14/18 padding:

1. **Estimativa total** — sum of all priority lows–highs, e.g. `R$ 2.300 – 8.000`.
2. **Já gasto** — sum of `price` across all items, in amber. Hidden when money toggle is off.
3. **Itens restantes** — count of unchecked items / total count.

Numbers all 22px monospace weight 500, prefixed by 12px `--fg-faint` `R$` glyph.

### 9. Tweaks panel (toolbar-toggleable)

When the host activates edit mode, a floating panel appears with:
- **Aparência** section: theme radio (`dark` / `light`), money toggle.
- **Dados** section: "Resetar checklist" button (with confirm dialog) — wipes `pejo:items` localStorage.

Implemented via the host protocol — listens for `__activate_edit_mode` / `__deactivate_edit_mode`, posts `__edit_mode_available` on mount, persists tweak values via `__edit_mode_set_keys`. In a real codebase this is debug-only; the user-facing controls are the top-bar icon buttons.

## Interactions & Behavior

- **Toggle item done:** click checkbox → flip `done` boolean, update card progress + global progress, recompute filters.
- **Edit item:** click price OR double-click row → open editor → save writes `price` (number or null) and `shop` (string).
- **Filter changes:** instantly hide rows; cards with zero matching items disappear from the grid. If all are filtered out, show monospace placeholder card: `// nenhum item para os filtros atuais`.
- **Theme toggle:** writes `data-theme` attribute on `<html>`, swaps CSS variables. Persisted.
- **Money toggle:** swaps R$ values for `····` and hides the "Já gasto" totals card. Persisted.
- **Alert dismiss:** removes the banner. Persisted (won't return on reload).
- **Tweaks reset:** confirm() dialog → wipes all checklist state.
- **Transitions:** all progress bars use `width 0.3s ease`. Hover/check transitions 0.12–0.2s. No flashy animations — feeling should stay technical/instrumental.

## State Management

Local React state (`useState`), nothing global beyond persistent localStorage keys:

```ts
type ItemState = { done?: boolean; price?: number | null; shop?: string };
type ItemsState = Record<string /* itemId */, ItemState>;

// localStorage keys
"pejo:theme"           // "dark" | "light"
"pejo:showMoney"       // boolean
"pejo:items"           // ItemsState
"pejo:alertDismissed"  // boolean
```

Component-local (not persisted): `status` filter, `priorityFilter`, `editing` (which item is being edited), `tweaksOpen`.

For a real implementation, replace `localStorage` JSON with an IndexedDB wrapper (e.g. Dexie) or a small backend (Supabase / Firebase) so the data syncs across devices. The data shape is intentionally trivial.

## Design Tokens

### Colors — dark theme (default)

| Token | Value |
|---|---|
| `--bg` | `#0c0d0e` |
| `--bg-elev` | `#131517` |
| `--bg-elev-2` | `#181a1d` |
| `--line` | `rgba(255,255,255,0.07)` |
| `--line-strong` | `rgba(255,255,255,0.14)` |
| `--fg` | `#ececea` |
| `--fg-dim` | `#a0a09c` |
| `--fg-faint` | `#62625e` |
| `--accent` (amber) | `oklch(0.78 0.15 75)` |
| `--accent-soft` | `oklch(0.78 0.15 75 / 0.12)` |
| `--accent-line` | `oklch(0.78 0.15 75 / 0.45)` |

### Colors — light theme

| Token | Value |
|---|---|
| `--bg` | `#f4f3ee` |
| `--bg-elev` | `#faf9f5` |
| `--bg-elev-2` | `#ffffff` |
| `--line` | `rgba(0,0,0,0.08)` |
| `--line-strong` | `rgba(0,0,0,0.16)` |
| `--fg` | `#15161a` |
| `--fg-dim` | `#58585a` |
| `--fg-faint` | `#95948f` |
| `--accent` | `oklch(0.62 0.15 60)` (deeper amber for contrast) |

### Priority accent colors (theme-independent)

| Priority | Token | Value |
|---|---|---|
| P1 Segurança | `--danger` | `oklch(0.68 0.17 25)` |
| P2 Motor | `--warn` | `oklch(0.78 0.15 75)` (same as amber accent) |
| P3 Arrefecimento | `--info` | `oklch(0.72 0.13 230)` |
| P4 Câmbio | `--purple` | `oklch(0.7 0.13 305)` |
| P5 Suspensão | `--neutral` | `oklch(0.72 0.02 240)` |
| P6 Extras | `--teal` | `oklch(0.74 0.1 195)` |
| Schedule "ok" | (inline) | `oklch(0.7 0.13 150)` |

### Typography

- **Sans:** Inter (Google Fonts, weights 400/500/600/700) — UI text
- **Mono:** JetBrains Mono (Google Fonts, weights 400/500/600) — numbers, labels, technical text. Always set `font-feature-settings: "tnum" 1;` for tabular numerals.
- Body: 14px / line-height 1.5

Type scale used:
| Use | Size | Weight | Tracking |
|---|---|---|---|
| Hero (odo, progress) | 38px mono | 500 | -0.01em |
| Totals values | 22px mono | 500 | -0.01em |
| Car name h1 | 22px sans | 600 | -0.01em |
| Card title | 16px sans | 600 | -0.005em |
| Body | 13–14px sans | 400/500 | 0 |
| Notes | 11px mono | 400 | 0.02em |
| Panel label | 10px mono | 400 | 0.16em UPPERCASE |
| Card tag | 10px mono | 400 | 0.16em UPPERCASE |
| Chip text | 11px mono | 400 | 0.06em UPPERCASE |
| Tick marks | 9px mono | 400 | 0.08em |

### Spacing / radii / lines

- Base spacing in multiples of 4. Common: 6, 8, 10, 12, 14, 16, 18, 20, 28.
- `--radius`: 6px (small chrome — chips, inputs, icon buttons)
- `--radius-lg`: 10px (cards, panels, modals)
- Hairlines 1px (occasionally 0.5px in tweaks panel)
- Top accent bar on cards: 3px solid
- Progress bars: 3px (per-card, per-schedule), 4px (odo), 6px (global progress)

### Effects

- Dark-theme body bg has two soft radial gradients (top-right white, bottom-left amber) for depth.
- Amber numbers in dark theme have a `text-shadow: 0 0 22px var(--accent-soft)` glow.
- Modal overlay: `rgba(0,0,0,0.5)` + `backdrop-filter: blur(4px)`.
- Sticky alert: `backdrop-filter: blur(8px)`.

## Assets

- **No images.** All icons are inline SVG components (Sun, Moon, Eye, EyeOff, Close, Edit), 24×24 viewBox, 1.5–1.8 stroke, currentColor.
- **Fonts:** Inter + JetBrains Mono via Google Fonts CDN. Self-host in production.
- **Brand mark:** the small amber-glow circle is pure CSS, no asset.

## Data Model

Static data lives in `data.js`. The full shape:

```ts
type Priority = {
  id: string;          // "p1"…"p6"
  rank: number;        // 1..6
  title: string;
  subtitle: string;
  tag: string;         // monospace UPPERCASE label
  accent: "danger"|"warn"|"info"|"purple"|"neutral"|"teal";
  estimate: [number, number];   // R$ low–high
  items: { id: string; name: string; note: string }[];
};

type ScheduleEntry = {
  label: string;
  every: number;       // km between services
  lastKm: number;      // odometer reading at last service
};

type CarInfo = {
  model: string;
  year: string;
  engine: string;
  km: number;
};
```

The current dataset (Peugeot 2008 2017 1.6 auto, 147,612 km) is in `data.js` — copy it verbatim or move it to a JSON file.

## Files in this Bundle

| File | Purpose |
|---|---|
| `Revisao Peugeot.html` | Entry point. Loads fonts, React, Babel, data + scripts. |
| `app.jsx` | Full React app (single file): icons, components, state, persistence, tweaks integration. ~500 lines. |
| `data.js` | Static dataset — `window.CAR_INFO`, `window.PRIORITIES`, `window.NEXT_SERVICES`, `window.ALERT_TEXT`. |
| `styles.css` | All styling. CSS custom properties at top, `[data-theme="light"]` override block, then components in order: shell → topbar → cluster → alert → filters → grid/cards → editor → schedule → totals. |
| `tweaks-panel.jsx` | Reusable Tweaks panel + `useTweaks` hook + form-control helpers. |

## Suggested Implementation Path

1. Set up your target framework (Next.js / Vite + React / React Native — whichever fits the codebase).
2. Port the design tokens to your style system (CSS modules, Tailwind config, styled-components theme, etc.).
3. Recreate components in this order: shell → top bar → cluster → cards → editor → schedule → totals → filters → alert.
4. Replace `localStorage` JSON with proper persistence (IndexedDB, or backend).
5. The Tweaks panel can be dropped — it's a Claude-host-specific affordance, not user-facing.
6. The masked plate/VIN in the cluster panel are placeholders; wire to real values when known.
7. Consider adding: PDF export of the checklist (to print and bring to the shop), date-stamping each completed item, photo attachment for receipts, and km-based push notifications for the schedule items.
