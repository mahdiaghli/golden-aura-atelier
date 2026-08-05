/**
 * بک‌اند سبک محلی برای سفارش‌های سرمایه‌گذاری و سفارش‌های سفارشی.
 * داده‌ها در مرورگر ذخیره می‌شوند تا هم کاربر و هم پنل ادمین به آن‌ها دسترسی داشته باشند.
 */

export type GoldOrder = {
  id: string;
  kind: "amount" | "product" | "sell" | "ball";
  grams: number;
  amount: number;
  rate: number;
  productName?: string;
  quantity?: number;
  delivery?: "vault" | "shipping";
  shipMethod?: string;
  status: "pending" | "confirmed" | "shipped" | "done";
  createdAt: string;
};

export type CustomOrder = {
  id: string;
  service: string;
  karat: string;
  weight: number;
  textOnItem: string;
  fontStyle: string;
  description: string;
  name: string;
  phone: string;
  city: string;
  photos: number;
  status: "new" | "reviewing" | "quoted" | "done";
  createdAt: string;
};

const GOLD_KEY = "aurum-gold-orders-v1";
const CUSTOM_KEY = "aurum-custom-orders-v1";

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
  window.dispatchEvent(new CustomEvent(`${key}:changed`));
}

function id(prefix: string) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
}

/* ---------- سرمایه‌گذاری طلا ---------- */

export function listGoldOrders(): GoldOrder[] {
  return read<GoldOrder>(GOLD_KEY);
}

export function createGoldOrder(input: Omit<GoldOrder, "id" | "createdAt" | "status">): GoldOrder {
  const order: GoldOrder = {
    ...input,
    id: id("GLD"),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  write(GOLD_KEY, [order, ...listGoldOrders()]);
  return order;
}

export function updateGoldOrderStatus(orderId: string, status: GoldOrder["status"]) {
  write(
    GOLD_KEY,
    listGoldOrders().map((order) => (order.id === orderId ? { ...order, status } : order)),
  );
}

/** موجودی طلای کاربر بر اساس سفارش‌های ثبت‌شده */
export function goldHoldings() {
  const orders = listGoldOrders();
  let grams = 0;
  let buyValue = 0;

  orders.forEach((order) => {
    if (order.kind === "amount" || order.kind === "product") {
      grams += order.grams;
      buyValue += order.amount;
    }
    if (order.kind === "sell") {
      grams -= order.grams;
      buyValue -= order.amount;
    }
  });

  return {
    grams: Math.max(0, Number(grams.toFixed(4))),
    buyValue: Math.max(0, Math.round(buyValue)),
    orders,
  };
}

/* ---------- سفارش سفارشی ---------- */

export function listCustomOrders(): CustomOrder[] {
  return read<CustomOrder>(CUSTOM_KEY);
}

export function createCustomOrder(input: Omit<CustomOrder, "id" | "createdAt" | "status">): CustomOrder {
  const order: CustomOrder = {
    ...input,
    id: id("CST"),
    status: "new",
    createdAt: new Date().toISOString(),
  };
  write(CUSTOM_KEY, [order, ...listCustomOrders()]);
  return order;
}

export function updateCustomOrderStatus(orderId: string, status: CustomOrder["status"]) {
  write(
    CUSTOM_KEY,
    listCustomOrders().map((order) => (order.id === orderId ? { ...order, status } : order)),
  );
}
