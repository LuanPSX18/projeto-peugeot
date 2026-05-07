"use client";

import { EyeIcon, EyeOffIcon, MoonIcon, SunIcon } from "./Icons";

type Theme = "dark" | "light";

type Props = {
  theme: Theme;
  onToggleTheme: () => void;
  showMoney: boolean;
  onToggleMoney: () => void;
  saving?: boolean;
};

export function TopBar({ theme, onToggleTheme, showMoney, onToggleMoney, saving }: Props) {
  return (
    <div className="topbar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true" />
        <span>Garage&nbsp;OS · v1.0</span>
        {saving && <span className="saving-dot" aria-label="Salvando..." title="Salvando..." />}
      </div>
      <div className="topbar-actions">
        <button
          className="icon-btn"
          onClick={onToggleMoney}
          title={showMoney ? "Esconder valores" : "Mostrar valores"}
          aria-label="Alternar valores"
        >
          {showMoney ? <EyeIcon /> : <EyeOffIcon />}
        </button>
        <button
          className="icon-btn"
          onClick={onToggleTheme}
          title="Alternar tema"
          aria-label="Alternar tema"
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </div>
  );
}
