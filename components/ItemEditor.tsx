"use client";

import { useEffect, useRef, useState } from "react";
import type { ItemState, PriorityItem } from "@/lib/types";

type Props = {
  open: boolean;
  item: PriorityItem | null;
  state: ItemState | undefined;
  logEntryId: number | null;
  onClose: () => void;
  onSave: (data: { price: number | null; shop: string | null; file: File | null }) => void;
};

export function ItemEditor({ open, item, state, logEntryId, onClose, onSave }: Props) {
  const [price, setPrice] = useState("");
  const [shop, setShop] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setPrice(state?.price != null ? String(state.price) : "");
      setShop(state?.shop ?? "");
      setFile(null);
      const t = setTimeout(() => priceRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open, state]);

  if (!open || !item) return null;

  const handleSave = () => {
    const trimmed = price.trim();
    let cleanPrice: number | null = null;
    if (trimmed !== "") {
      const parsed = Number(trimmed.replace(",", "."));
      cleanPrice = Number.isFinite(parsed) ? parsed : null;
    }
    const cleanShop = shop.trim();
    onSave({ price: cleanPrice, shop: cleanShop === "" ? null : cleanShop, file });
  };

  const canAttach = logEntryId !== null;

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
        {canAttach && (
          <div className="field">
            <label>Nota fiscal (foto)</label>
            <label className={`receipt-file-btn${file ? " has-file" : ""}`}>
              {file ? file.name : "Selecionar arquivo…"}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
        )}
        <div className="editor-actions">
          <button type="button" className="btn" onClick={onClose}>Cancelar</button>
          <button type="button" className="btn primary" onClick={handleSave}>Salvar</button>
        </div>
      </div>
    </div>
  );
}
