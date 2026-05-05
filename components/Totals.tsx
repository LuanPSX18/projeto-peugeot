import type { ItemsState, Priority } from "@/lib/types";
import { fmtKm, fmtMoney } from "@/lib/format";

type Props = {
  priorities: Priority[];
  itemsState: ItemsState;
  showMoney: boolean;
};

export function Totals({ priorities, itemsState, showMoney }: Props) {
  const allItems = priorities.flatMap((p) => p.items);
  const totalSpent = allItems.reduce(
    (s, it) => s + (Number(itemsState[it.id]?.price) || 0),
    0,
  );
  const estLow = priorities.reduce((s, p) => s + p.estimate[0], 0);
  const estHigh = priorities.reduce((s, p) => s + p.estimate[1], 0);
  const remainingItems = allItems.filter((it) => !itemsState[it.id]?.done).length;

  return (
    <div className="totals">
      <div className="total-card">
        <div className="total-label">Estimativa total</div>
        <div className="total-value mono">
          <span className="currency">R$</span>
          {fmtKm(estLow)} – {fmtKm(estHigh)}
        </div>
      </div>
      {showMoney && (
        <div className="total-card">
          <div className="total-label">Já gasto</div>
          <div className="total-value mono" style={{ color: "var(--accent)" }}>
            <span className="currency">R$</span>
            {fmtMoney(totalSpent)}
          </div>
        </div>
      )}
      <div className="total-card">
        <div className="total-label">Itens restantes</div>
        <div className="total-value mono">
          {remainingItems}
          <span style={{ color: "var(--fg-faint)", fontSize: 12, marginLeft: 6 }}>
            / {allItems.length}
          </span>
        </div>
      </div>
    </div>
  );
}
