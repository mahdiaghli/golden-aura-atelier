import { useEffect, useState, useSyncExternalStore } from "react";
import { products, priceBreakdown, type Product } from "./products";

type CartItem = { id: string; qty: number };
const KEY = "aurum-cart-v1";

let state: CartItem[] = [];
const listeners = new Set<() => void>();

function load() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY);
    state = raw ? JSON.parse(raw) : [];
  } catch {
    state = [];
  }
}
let loaded = false;

function persist() {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
function getSnapshot() {
  return state;
}
function getServerSnapshot(): CartItem[] {
  return [];
}

export function useCart() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (!loaded) {
      load();
      loaded = true;
      listeners.forEach((l) => l());
    }
    setHydrated(true);
  }, []);
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const detailed = items
    .map((it) => {
      const product = products.find((p) => p.id === it.id);
      if (!product) return null;
      return { product, qty: it.qty, lineTotal: priceBreakdown(product).total * it.qty };
    })
    .filter(Boolean) as { product: Product; qty: number; lineTotal: number }[];

  const subtotal = detailed.reduce((s, r) => s + r.lineTotal, 0);
  const count = hydrated ? detailed.reduce((s, r) => s + r.qty, 0) : 0;

  return {
    items: detailed,
    count,
    subtotal,
    add(id: string, qty = 1) {
      const existing = state.find((i) => i.id === id);
      if (existing) existing.qty += qty;
      else state = [...state, { id, qty }];
      persist();
    },
    remove(id: string) {
      state = state.filter((i) => i.id !== id);
      persist();
    },
    setQty(id: string, qty: number) {
      state = state
        .map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i))
        .filter((i) => i.qty > 0);
      persist();
    },
    clear() {
      state = [];
      persist();
    },
  };
}
