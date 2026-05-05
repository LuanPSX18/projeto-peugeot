export const fmtKm = (n: number): string => n.toLocaleString("pt-BR");

export const fmtMoney = (n: number): string =>
  n.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

import type { AccentTone } from "./types";

export const ACCENT_VAR: Record<AccentTone, string> = {
  danger: "var(--danger)",
  warn: "var(--warn)",
  info: "var(--info)",
  purple: "var(--purple)",
  neutral: "var(--neutral)",
  teal: "var(--teal)",
};
