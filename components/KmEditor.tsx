"use client";

import { useEffect, useState } from "react";
import { fmtKm } from "@/lib/format";

type Props = {
  open: boolean;
  currentKm: number;
  onClose: () => void;
  onSave: (km: number) => void;
};

export function KmEditor({ open, currentKm, onClose, onSave }: Props) {
  const [value, setValue] = useState(String(currentKm));

  useEffect(() => {
    if (open) setValue(String(currentKm));
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null;

  const parsed = parseInt(value, 10);
  const valid = !isNaN(parsed) && parsed > 0;
  const decreasing = valid && parsed < currentKm;

  const handleSave = () => {
    if (!valid) return;
    onSave(parsed);
    onClose();
  };

  return (
    <div
      className="editor-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="editor">
        <h3>Atualizar quilometragem</h3>
        <div className="editor-sub">Atual: {fmtKm(currentKm)} km</div>
        <div className="field">
          <label htmlFor="km-input">Nova quilometragem (km)</label>
          <input
            id="km-input"
            type="number"
            value={value}
            min={1}
            autoFocus
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
        </div>
        {decreasing && (
          <p className="km-warn">
            Valor menor que o atual — ok pra corrigir um erro de digitação anterior.
          </p>
        )}
        <div className="editor-actions">
          <button className="btn" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn primary" onClick={handleSave} disabled={!valid}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
