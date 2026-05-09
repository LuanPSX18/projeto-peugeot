export type AccentTone =
  | "danger"
  | "warn"
  | "info"
  | "purple"
  | "neutral"
  | "teal";

export type PriorityItem = {
  id: string;
  name: string;
  note: string;
};

export type Priority = {
  id: string;
  rank: number;
  title: string;
  subtitle: string;
  tag: string;
  accent: AccentTone;
  estimate: [number, number];
  items: PriorityItem[];
};

export type ScheduleEntry = {
  label: string;
  every: number;
  lastKm: number;
  linkedItemIds?: string[];
};

export type MaintenanceLog = {
  id: number;
  item_id: string;
  item_name: string;
  done_at: string;
  km_at: number;
  price: number | null;
  shop: string | null;
};

export type CarInfo = {
  model: string;
  year: string;
  engine: string;
  km: number;
  lastService: string | null;
};

export type AlertText = {
  title: string;
  body: string;
};

export type ItemState = {
  done: boolean;
  price: number | null;
  shop: string | null;
};

export type ItemsState = Record<string, ItemState>;
