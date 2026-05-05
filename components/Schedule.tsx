import type { ScheduleEntry } from "@/lib/types";
import { fmtKm } from "@/lib/format";

type Props = {
  services: ScheduleEntry[];
  currentKm: number;
};

type Level = "ok" | "warn" | "danger";

function levelFor(remaining: number, every: number): Level {
  if (remaining < 0) return "danger";
  if (remaining < every * 0.2) return "warn";
  return "ok";
}

export function Schedule({ services, currentKm }: Props) {
  return (
    <section className="schedule">
      <h3 className="schedule-title">Próximas revisões por quilometragem</h3>
      <div className="schedule-grid">
        {services.map((s, i) => {
          const nextAt = s.lastKm + s.every;
          const remaining = nextAt - currentKm;
          const usedPct = Math.min(
            100,
            Math.max(0, ((currentKm - s.lastKm) / s.every) * 100),
          );
          const level = levelFor(remaining, s.every);
          const status =
            level === "danger"
              ? `Atrasada ${fmtKm(Math.abs(remaining))} km`
              : `Faltam ${fmtKm(remaining)} km`;

          return (
            <div className="sched-item" key={`${s.label}-${i}`}>
              <div className="sched-name">{s.label}</div>
              <div className="sched-bar-wrap">
                <span className="mono">{fmtKm(s.lastKm)}</span>
                <div className="sched-bar">
                  <span className={level} style={{ width: `${usedPct}%` }} />
                </div>
                <span className="mono">{fmtKm(nextAt)}</span>
              </div>
              <div className={`sched-status ${level}`}>{status}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
