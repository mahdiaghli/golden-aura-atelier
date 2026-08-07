import type { MarketItem, MarketSnapshot } from "@/lib/market-prices";

export type PricePoint = { t: number; price: number };

export type PriceHistorySymbol =
  | "gold18k"
  | "gold24k"
  | "silver"
  | "dollar"
  | "emamiCoin"
  | "halfCoin"
  | "quarterCoin";

const STORAGE_KEY = "aghli-gold:price-history:v1";
const MAX_POINTS = 500;

type HistoryStore = Partial<Record<PriceHistorySymbol, PricePoint[]>>;

const SYMBOL_KEYS: PriceHistorySymbol[] = [
  "gold18k",
  "gold24k",
  "silver",
  "dollar",
  "emamiCoin",
  "halfCoin",
  "quarterCoin",
];

function readStore(): HistoryStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as HistoryStore;
  } catch {
    return {};
  }
}

function writeStore(store: HistoryStore) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore quota / serialization errors
  }
}

function minuteBucket(t: number) {
  return Math.floor(t / 60_000);
}

function seedSeries(item: MarketItem, now: number): PricePoint[] {
  const changePercent = item.changePercent ?? 0;
  const before = item.price / (1 + changePercent / 100 || 1);
  return [
    { t: now - 60 * 60_000, price: Math.round(before) },
    { t: now, price: Math.round(item.price) },
  ];
}

function appendPoint(series: PricePoint[] | undefined, item: MarketItem, now: number): PricePoint[] {
  const base = series && series.length > 0 ? series : seedSeries(item, now);
  const last = base[base.length - 1];
  if (last && minuteBucket(last.t) === minuteBucket(now)) {
    const next = base.slice(0, -1).concat({ t: now, price: Math.round(item.price) });
    return next.slice(-MAX_POINTS);
  }
  const next = base.concat({ t: now, price: Math.round(item.price) });
  return next.slice(-MAX_POINTS);
}

/** Append the latest snapshot values to the rolling history kept in localStorage. */
export function recordSnapshot(snapshot: MarketSnapshot): HistoryStore {
  const now = Date.now();
  const store = readStore();

  SYMBOL_KEYS.forEach((key) => {
    const item = snapshot[key];
    if (!item || !Number.isFinite(item.price)) return;
    store[key] = appendPoint(store[key], item, now);
  });

  writeStore(store);
  return store;
}

/** Read the current stored history for a given market symbol. */
export function getHistory(symbol: PriceHistorySymbol): PricePoint[] {
  const store = readStore();
  return store[symbol] ?? [];
}
