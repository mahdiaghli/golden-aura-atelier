import { useEffect, useState, useSyncExternalStore } from "react";

const KEY = "aurum-wishlist-v1";
const EMPTY_SNAPSHOT: string[] = [];

let state: string[] = [];
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(KEY);
    state = raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    state = [];
  }
}

function persist() {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

function getServerSnapshot() {
  return EMPTY_SNAPSHOT;
}

export function useWishlist() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!loaded) {
      load();
      loaded = true;
      listeners.forEach((listener) => listener());
    }
    setHydrated(true);
  }, []);

  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    ids: items,
    count: hydrated ? items.length : 0,
    has(id: string) {
      return items.includes(id);
    },
    toggle(id: string) {
      state = state.includes(id) ? state.filter((item) => item !== id) : [...state, id];
      persist();
    },
    clear() {
      state = [];
      persist();
    },
  };
}