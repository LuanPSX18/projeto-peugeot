"use client";

import { useEffect, useRef, useState } from "react";
import type { ItemState, PriorityItem } from "@/lib/types";

type Props = {
  open: boolean;
  item: PriorityItem | null;
  state: ItemState | undefined;
  onClose: () => void;
  onSave: (data: { price: number | null; shop: string | null }) => void;
};

export function ItemEditor({ open, item, state, onClose, onSave }: Props) {
  const [price, setPrice] = useState("");
  const [shop, setShop] = useState("");
  const priceRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setPrice(state?.price != null ? String(state.price) : "");
      setShop(state?.shop ?? "");
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
    onSave({ price: cleanPrice, shop: cleanShop === "" ? null : cleanShop });
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
          <button type="button" className="btn" onClick={onClose}>Cancelar</button>
          <button type="button" className="btn primary" onClick={handleSave}>Salvar</button>
        </div>
      </div>
    </div>
  );
}
