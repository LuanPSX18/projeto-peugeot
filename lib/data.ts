import type { AlertText, CarInfo, Priority, ScheduleEntry } from "./types";

export const CAR_INFO: CarInfo = {
  model: "Peugeot 2008",
  year: "2017",
  engine: "1.6 Automático",
  km: 147612,
  lastService: null,
};

export const NEXT_SERVICES: ScheduleEntry[] = [
  { label: "Próxima troca de óleo", every: 10000, lastKm: 142000 },
  { label: "Alinhamento", every: 10000, lastKm: 140000 },
  { label: "Filtro de ar", every: 20000, lastKm: 130000 },
  { label: "Líquido de arrefecimento", every: 40000, lastKm: 110000 },
];

export const PRIORITIES: Priority[] = [
  {
    id: "p1",
    rank: 1,
    title: "Segurança",
    subtitle: "Esses itens NÃO podem esperar",
    tag: "CRITICAL",
    accent: "danger",
    estimate: [1000, 2200],
    items: [
      { id: "p1-1", name: "Correia dentada + tensor", note: "Substituição completa do kit" },
      { id: "p1-2", name: "Bomba d'água", note: "Trocar junto com a correia" },
      { id: "p1-3", name: "Pastilhas de freio", note: "Verificar / trocar" },
      { id: "p1-4", name: "Discos de freio", note: "Inspeção visual e medição" },
      { id: "p1-5", name: "Fluido de freio", note: "Sangria completa" },
    ],
  },
  {
    id: "p2",
    rank: 2,
    title: "Funcionamento do motor",
    subtitle: "Garante que o carro rode liso e sem dor de cabeça",
    tag: "ENGINE",
    accent: "warn",
    estimate: [400, 1000],
    items: [
      { id: "p2-1", name: "Óleo do motor", note: "5W30 ou conforme manual" },
      { id: "p2-2", name: "Filtro de óleo", note: "" },
      { id: "p2-3", name: "Filtro de ar", note: "" },
      { id: "p2-4", name: "Filtro de cabine", note: "" },
      { id: "p2-5", name: "Velas", note: "Jogo completo (4)" },
      { id: "p2-6", name: "Limpeza do corpo de borboleta", note: "" },
      { id: "p2-7", name: "Scanner — injeção eletrônica", note: "Leitura de códigos de falha" },
    ],
  },
  {
    id: "p3",
    rank: 3,
    title: "Arrefecimento",
    subtitle: "Vital em Peugeot — evita superaquecimento",
    tag: "COOLING",
    accent: "info",
    estimate: [300, 800],
    items: [
      { id: "p3-1", name: "Líquido de arrefecimento", note: "Aditivo correto (orgânico)" },
      { id: "p3-2", name: "Radiador", note: "Inspeção visual + pressão" },
      { id: "p3-3", name: "Mangueiras", note: "Procurar ressecamento ou trinca" },
      { id: "p3-4", name: "Válvula termostática", note: "Teste de abertura" },
    ],
  },
  {
    id: "p4",
    rank: 4,
    title: "Câmbio automático",
    subtitle: "Item frequentemente ignorado — não pule",
    tag: "TRANSMISSION",
    accent: "purple",
    estimate: [400, 1200],
    items: [
      { id: "p4-1", name: "Óleo do câmbio automático", note: "Fluido específico do AL4" },
      { id: "p4-2", name: "Verificar trancos / atraso", note: "Diagnóstico em rodagem" },
    ],
  },
  {
    id: "p5",
    rank: 5,
    title: "Suspensão",
    subtitle: "Desgaste esperado nessa quilometragem",
    tag: "SUSPENSION",
    accent: "neutral",
    estimate: [0, 2000],
    items: [
      { id: "p5-1", name: "Amortecedores", note: "" },
      { id: "p5-2", name: "Buchas", note: "" },
      { id: "p5-3", name: "Pivôs", note: "" },
      { id: "p5-4", name: "Bieletas", note: "" },
    ],
  },
  {
    id: "p6",
    rank: 6,
    title: "Itens extras",
    subtitle: "Dependem do estado atual",
    tag: "EXTRAS",
    accent: "teal",
    estimate: [200, 800],
    items: [
      { id: "p6-1", name: "Bateria", note: "Teste de carga" },
      { id: "p6-2", name: "Correia auxiliar", note: "" },
      { id: "p6-3", name: "Bobinas", note: "" },
      { id: "p6-4", name: "Alinhamento + balanceamento", note: "" },
    ],
  },
];

export const ALERT_TEXT: AlertText = {
  title: "ALERTA — Carro com 147 mil km",
  body: "Os 3 itens que quase sempre aparecem nessa quilometragem: correia dentada, freios e suspensão dianteira. Peça orçamento separado por prioridade na oficina.",
};
