"use client";

import Link from "next/link";
import { EyeIcon, EyeOffIcon, MoonIcon, SunIcon } from "./Icons";

type Theme = "dark" | "light";

type Props = {
  theme: Theme;
  onToggleTheme: () => void;
  showMoney: boolean;
  onToggleMoney: () => void;
  saving?: boolean;
  isAuthed: boolean;
  onLogout: () => void;
};

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const UnlockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
  </svg>
);

export function TopBar({ theme, onToggleTheme, showMoney, onToggleMoney, saving, isAuthed, onLogout }: Props) {
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
        {isAuthed ? (
          <button
            className="icon-btn"
            onClick={onLogout}
            title="Sair"
            aria-label="Sair"
            style={{ color: "var(--accent)" }}
          >
            <UnlockIcon />
          </button>
        ) : (
          <Link
            href="/login"
            className="icon-btn"
            title="Entrar"
            aria-label="Entrar"
            style={{ display: "grid", placeItems: "center" }}
          >
            <LockIcon />
          </Link>
        )}
      </div>
    </div>
  );
}
