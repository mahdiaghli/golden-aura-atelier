/**
 * بک‌اند محلی کیف پول: موجودی نقدی، واریز/برداشت، هدف سرمایه‌گذاری و هشدار قیمت.
 * موجودی طلا از سفارش‌های سرمایه‌گذاری (src/lib/requests.ts) خوانده می‌شود تا
 * کیف پول و صفحه‌ی investment همیشه یک داده‌ی واحد را نشان دهند.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { getSessionUser } from "./auth";
import { goldHoldings, listGoldOrders, type GoldOrder } from "./requests";

export type CashEntry = {
  id: string;
  type: "deposit" | "withdraw";
  amount: number;
  status: "success" | "pending";
  iban?: string;
  createdAt: string;
};

export type PriceAlert = {
  id: string;
  targetPrice: number;
  createdAt: string;
};

export type WalletTransaction = {
  id: string;
  type: "buy" | "sell" | "deposit" | "withdraw" | "physical";
  title: string;
  amount: string;
  date: string;
  status: "success" | "pending";
};

const CASH_KEY = "aurum-wallet-cash-v1";
const GOAL_KEY = "aurum-wallet-goal-v1";
const ALERT_KEY = "aurum-wallet-alerts-v1";
export const WALLET_CHANGED = "aurum-wallet:changed";

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, rows: T[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(rows));
  window.dispatchEvent(new CustomEvent(WALLET_CHANGED));
}

function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
}

/* ---------- تراکنش‌های نقدی ---------- */

export function listCashEntries(): CashEntry[] {
  return read<CashEntry>(CASH_KEY);
}

export function deposit(amount: number): CashEntry {
  const entry: CashEntry = {
    id: newId("DEP"),
    type: "deposit",
    amount: Math.round(amount),
    status: "success",
    createdAt: new Date().toISOString(),
  };
  write(CASH_KEY, [entry, ...listCashEntries()]);
  return entry;
}

export function requestWithdraw(amount: number, iban: string): CashEntry {
  const entry: CashEntry = {
    id: newId("WDR"),
    type: "withdraw",
    amount: Math.round(amount),
    status: "pending",
    iban,
    createdAt: new Date().toISOString(),
  };
  write(CASH_KEY, [entry, ...listCashEntries()]);
  return entry;
}

/* ---------- هدف و هشدار ---------- */

export function getGoalGrams(): number {
  if (typeof window === "undefined") return 20;
  const raw = window.localStorage.getItem(GOAL_KEY);
  const value = raw ? Number(raw) : NaN;
  return Number.isFinite(value) && value > 0 ? value : 20;
}

export function setGoalGrams(grams: number) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(GOAL_KEY, String(grams));
  window.dispatchEvent(new CustomEvent(WALLET_CHANGED));
}

export function listAlerts(): PriceAlert[] {
  return read<PriceAlert>(ALERT_KEY);
}

export function addAlert(targetPrice: number): PriceAlert {
  const alert: PriceAlert = {
    id: newId("ALR"),
    targetPrice: Math.round(targetPrice),
    createdAt: new Date().toISOString(),
  };
  write(ALERT_KEY, [alert, ...listAlerts()]);
  return alert;
}

export function removeAlert(id: string) {
  write(
    ALERT_KEY,
    listAlerts().filter((a) => a.id !== id),
  );
}

/* ---------- محاسبه‌ی وضعیت کیف پول ---------- */

const faDate = (iso: string) => {
  try {
    return new Intl.DateTimeFormat("fa-IR").format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
};

const faNum = (n: number) => new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 }).format(Math.round(n));

export type WalletSnapshot = {
  grams: number;
  buyValue: number;
  goldValue: number;
  cashBalance: number;
  pendingSettlement: number;
  totalValue: number;
  totalProfit: number;
  returnPercent: number;
  avgBuyPrice: number;
  profitPerGram: number;
  allocation: { label: string; percent: number; color: string }[];
  balls: { name: string; status: string; qty: number }[];
  transactions: WalletTransaction[];
  goalGrams: number;
  progressPercent: number;
  alerts: PriceAlert[];
  goldOrders: GoldOrder[];
};

export function buildWalletSnapshot(rate24: number): WalletSnapshot {
  const holdings = goldHoldings();
  const orders = listGoldOrders(getSessionUser()?.email);
  const cash = listCashEntries();

  const deposits = cash.filter((c) => c.type === "deposit").reduce((s, c) => s + c.amount, 0);
  const withdrawals = cash.filter((c) => c.type === "withdraw").reduce((s, c) => s + c.amount, 0);
  const cashBalance = Math.max(0, deposits - withdrawals);

  const pendingSettlement = orders
    .filter((o) => o.kind === "sell" && o.status === "pending")
    .reduce((s, o) => s + o.amount, 0);

  const goldValue = holdings.grams * rate24;
  const totalValue = goldValue + cashBalance + pendingSettlement;
  const totalProfit = goldValue - holdings.buyValue;
  const returnPercent = holdings.buyValue > 0 ? (totalProfit / holdings.buyValue) * 100 : 0;
  const avgBuyPrice = holdings.grams > 0 ? holdings.buyValue / holdings.grams : 0;
  const profitPerGram = avgBuyPrice > 0 ? rate24 - avgBuyPrice : 0;

  const ballOrders = orders.filter((o) => o.kind === "ball" || o.kind === "product");
  const ballMap = new Map<string, { name: string; status: string; qty: number }>();
  ballOrders.forEach((o) => {
    const name = o.productName ?? `${o.grams} گرم`;
    const status =
      o.delivery === "shipping"
        ? o.status === "shipped"
          ? "ارسال شده"
          : "در انتظار ارسال"
        : "در خزانه";
    const key = `${name}|${status}`;
    const prev = ballMap.get(key);
    ballMap.set(key, { name, status, qty: (prev?.qty ?? 0) + (o.quantity ?? 1) });
  });

  const pct = (part: number) => (totalValue > 0 ? Math.round((part / totalValue) * 100) : 0);
  const allocation = [
    { label: "طلای ۲۴ عیار", percent: pct(goldValue), color: "bg-gold" },
    { label: "موجودی نقد", percent: pct(cashBalance), color: "bg-emerald-500" },
    { label: "در انتظار تسویه", percent: pct(pendingSettlement), color: "bg-amber-600" },
  ];

  const goldTx: WalletTransaction[] = orders.map((o) => ({
    id: o.id,
    type: o.kind === "sell" ? "sell" : o.delivery === "shipping" ? "physical" : "buy",
    title:
      o.kind === "sell"
        ? "فروش طلا"
        : o.kind === "ball" || o.kind === "product"
          ? `خرید ${o.productName ?? "گوی طلا"}`
          : "خرید طلا",
    amount:
      o.kind === "sell"
        ? `${faNum(o.amount)} تومان`
        : `+${new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 3 }).format(o.grams)} گرم`,
    date: faDate(o.createdAt),
    status: o.status === "pending" ? "pending" : "success",
  }));

  const cashTx: WalletTransaction[] = cash.map((c) => ({
    id: c.id,
    type: c.type,
    title: c.type === "deposit" ? "واریز" : "برداشت",
    amount: `${c.type === "deposit" ? "+" : "-"}${faNum(c.amount)} تومان`,
    date: faDate(c.createdAt),
    status: c.status,
  }));

  const transactions = [...goldTx, ...cashTx].sort((a, b) => (a.date < b.date ? 1 : -1));

  const goalGrams = getGoalGrams();

  return {
    grams: holdings.grams,
    buyValue: holdings.buyValue,
    goldValue,
    cashBalance,
    pendingSettlement,
    totalValue,
    totalProfit,
    returnPercent,
    avgBuyPrice,
    profitPerGram,
    allocation,
    balls: [...ballMap.values()],
    transactions,
    goalGrams,
    progressPercent: goalGrams > 0 ? Math.min(100, Math.round((holdings.grams / goalGrams) * 100)) : 0,
    alerts: listAlerts(),
    goldOrders: orders,
  };
}

/** هوک کیف پول: با هر تغییر در تراکنش‌ها یا نرخ زنده به‌روزرسانی می‌شود. */
export function useWallet(rate24: number) {
  const [version, setVersion] = useState(0);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    setReady(true);
    const handler = () => refresh();
    window.addEventListener(WALLET_CHANGED, handler);
    window.addEventListener("aurum-gold-orders-v1:changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(WALLET_CHANGED, handler);
      window.removeEventListener("aurum-gold-orders-v1:changed", handler);
      window.removeEventListener("storage", handler);
    };
  }, [refresh]);

  const wallet = useMemo(
    () => (ready ? buildWalletSnapshot(rate24) : buildWalletSnapshot(0)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rate24, ready, version],
  );

  return { wallet, refresh };
}
