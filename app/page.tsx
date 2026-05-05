import { CAR_INFO, PRIORITIES } from "@/lib/data";

export default function Home() {
  const totalItems = PRIORITIES.reduce((sum, p) => sum + p.items.length, 0);

  return (
    <main className="app">
      <div className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <span>Garage OS · v0.1</span>
        </div>
      </div>

      <section className="panel">
        <div className="panel-label">Veículo</div>
        <h1 className="car-name">
          {CAR_INFO.model}{" "}
          <span style={{ color: "var(--fg-dim)" }}>{CAR_INFO.year}</span>
        </h1>
        <div className="car-sub">
          <span><i />{CAR_INFO.engine}</span>
          <span>{CAR_INFO.km.toLocaleString("pt-BR")} km</span>
          <span>{PRIORITIES.length} prioridades · {totalItems} itens</span>
        </div>
      </section>

      <p style={{ marginTop: 24, color: "var(--fg-faint)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
        // Passo B concluído — dados, tipos, estilos e fontes carregados.
      </p>
    </main>
  );
}
