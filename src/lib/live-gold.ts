import { useSyncExternalStore } from "react";
import { fetchMarketSnapshot, type MarketSnapshot } from "@/lib/market-prices";
import { GOLD_RATE_PER_GRAM, type Karat } from "@/lib/products";

/**
 * یک استور سبک برای قیمت لحظه‌ای طلا.
 * فقط یک بار fetch می‌شود و همهٔ صفحات از همان استفاده می‌کنند.
 * وقتی قیمت جدید رسید، جدول GOLD_RATE_PER_GRAM هم به‌روزرسانی می‌شود
 * تا محاسبهٔ قیمت محصولات با نرخ روز انجام شود.
 */

type State = {
  snapshot: MarketSnapshot | null;
  loading: boolean;
  error: string | null;
  updatedAt: string | null;
};

let state: State = { snapshot: null, loading: false, error: null, updatedAt: null };
const listeners = new Set<() => void>();
let started = false;

function emit() {
  listeners.forEach((listener) => listener());
}

function setState(patch: Partial<State>) {
  state = { ...state, ...patch };
  emit();
}

const KARAT_PURITY: Record<Karat, number> = {
  "18K": 18,
  "21K": 21,
  "22K": 22,
  "24K": 24,
};

function applyRates(snapshot: MarketSnapshot) {
  const base18 = snapshot.gold18k?.price;
  const base24 = snapshot.gold24k?.price;
  const perPurity =
    base18 && Number.isFinite(base18) && base18 > 0
      ? base18 / 18
      : base24 && Number.isFinite(base24) && base24 > 0
        ? base24 / 24
        : null;

  if (!perPurity) return;

  (Object.keys(KARAT_PURITY) as Karat[]).forEach((karat) => {
    GOLD_RATE_PER_GRAM[karat] = Math.round(perPurity * KARAT_PURITY[karat]);
  });
}

export function loadLiveGold(force = false) {
  if (typeof window === "undefined") return;
  if (started && !force) return;
  started = true;
  setState({ loading: true, error: null });

  fetchMarketSnapshot()
    .then((snapshot) => {
      applyRates(snapshot);
      setState({
        snapshot,
        loading: false,
        error: null,
        updatedAt: snapshot.updatedAt ?? new Date().toISOString(),
      });
    })
    .catch((error: unknown) => {
      setState({
        loading: false,
        error: error instanceof Error ? error.message : "market unavailable",
      });
    });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  loadLiveGold();
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return state;
}

function getServerSnapshot() {
  return state;
}

/** قیمت لحظه‌ای بازار + نرخ هر عیار (با fallback به نرخ ثابت) */
export function useLiveGold() {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    ...current,
    isLive: Boolean(current.snapshot),
    rates: { ...GOLD_RATE_PER_GRAM },
    rate18: GOLD_RATE_PER_GRAM["18K"],
    rate24: GOLD_RATE_PER_GRAM["24K"],
    refresh: () => loadLiveGold(true),
  };
}
