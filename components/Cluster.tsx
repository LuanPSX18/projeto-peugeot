import type { CarInfo } from "@/lib/types";
import { fmtKm } from "@/lib/format";

type Props = {
  car: CarInfo;
  totalDone: number;
  totalItems: number;
  onEditKm: () => void;
};

export function Cluster({ car, totalDone, totalItems, onEditKm }: Props) {
  const pct = totalItems ? Math.round((totalDone / totalItems) * 100) : 0;
  const odoFill = Math.min(100, (car.km % 200000) / 2000);

  return (
    <div className="cluster">
      <div className="panel car-panel">
        <div className="panel-label">Veículo</div>
        <h1 className="car-name">
          {car.model}{" "}
          <span style={{ color: "var(--fg-dim)", fontWeight: 500 }}>{car.year}</span>
        </h1>
        <div className="car-sub">
          <span><i />{car.engine}</span>
          <span>VIN&nbsp;····7B2</span>
          <span>PLACA&nbsp;···· 4F92</span>
        </div>
      </div>

      <div className="panel odo">
        <div>
          <div className="panel-label">Odômetro</div>
          <button
            className="odo-value odo-value-btn"
            onClick={onEditKm}
            title="Clique para editar km"
            aria-label="Editar quilometragem"
          >
            {fmtKm(car.km)}
            <span className="unit">KM</span>
            <span className="odo-edit-hint" aria-hidden="true">✎</span>
          </button>
        </div>
        <div>
          <div className="odo-bar">
            <span
              style={{
                display: "block",
                height: "100%",
                width: `${odoFill}%`,
                background: "var(--accent)",
                boxShadow: "0 0 12px var(--accent-soft)",
              }}
            />
          </div>
          <div className="odo-ticks">
            <span>0</span>
            <span>50K</span>
            <span>100K</span>
            <span>150K</span>
            <span>200K</span>
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
          <span style={{ width: `${pct}%` }} />
        </div>
        <div className="prog-meta">
          <span>{totalItems - totalDone} pendentes</span>
          <span>{totalDone} concluídos</span>
        </div>
      </div>
    </div>
  );
}
