import type { MaintenanceLog } from "@/lib/types";
import { fmtKm, fmtMoney } from "@/lib/format";

type Props = {
  entries: MaintenanceLog[];
  showMoney: boolean;
};

function fmtDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function HistoryLog({ entries, showMoney }: Props) {
  if (entries.length === 0) {
    return (
      <section className="history">
        <h3 className="history-title">Histórico de manutenção</h3>
        <p className="history-empty">
          // nenhum serviço registrado ainda — marque um item como feito para começar
        </p>
      </section>
    );
  }

  return (
    <section className="history">
      <h3 className="history-title">Histórico de manutenção</h3>
      <div className="history-list">
        {entries.map((e) => (
          <div className="hist-entry" key={e.id}>
            <div className="hist-dot" />
            <div className="hist-body">
              <div className="hist-name">{e.item_name}</div>
              <div className="hist-meta">
                <span className="mono">{fmtKm(e.km_at)} km</span>
                <span className="hist-sep">·</span>
                <span>{fmtDate(e.done_at)}</span>
                {e.shop && (
                  <>
                    <span className="hist-sep">·</span>
                    <span>{e.shop}</span>
                  </>
                )}
              </div>
            </div>
            <div className="hist-right">
              {showMoney && e.price != null && (
                <div className="hist-price">{fmtMoney(e.price)}</div>
              )}
              {e.receipt_url && (
                <a href={e.receipt_url} target="_blank" rel="noopener noreferrer" className="hist-thumb-link">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={e.receipt_url} alt="Nota fiscal" className="hist-thumb" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
