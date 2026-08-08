import { recordAdminEvent } from "./admin-events";

/**
 * بک‌اند سبک محلی برای سفارش‌های سرمایه‌گذاری و سفارش‌های سفارشی.
 * داده‌ها در مرورگر ذخیره می‌شوند تا هم کاربر و هم پنل ادمین به آن‌ها دسترسی داشته باشند.
 */

export type GoldOrder = {
  id: string;
  ownerId?: string;
  kind: "amount" | "product" | "sell" | "ball";
  grams: number;
  amount: number;
  rate: number;
  productName?: string;
  productId?: string;
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

function currentOwnerId() {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem("aurum-session");
    if (!raw) return undefined;
    const session = JSON.parse(raw) as { email?: string; phone?: string };
    return session.email || session.phone;
  } catch {
    return undefined;
  }
}

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

export function listGoldOrders(ownerId?: string): GoldOrder[] {
  const rows = read<GoldOrder>(GOLD_KEY);
  if (!ownerId) return rows;
  return rows.filter((row) => row.ownerId === ownerId);
}

export function createGoldOrder(input: Omit<GoldOrder, "id" | "createdAt" | "status">): GoldOrder {
  const ownerId = input.ownerId ?? currentOwnerId();
  const order: GoldOrder = {
    ...input,
    ownerId,
    id: id("GLD"),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  write(GOLD_KEY, [order, ...listGoldOrders()]);
  recordAdminEvent({
    type: "gold_order_created",
    title: "درخواست سرمایه‌گذاری ثبت شد",
    entityType: "request",
    entityId: order.id,
    amount: order.amount,
    details: {
      kind: order.kind,
      grams: order.grams,
      delivery: order.delivery ?? "",
      ownerId: ownerId ?? "",
    },
  });
  return order;
}

export function updateGoldOrderStatus(orderId: string, status: GoldOrder["status"]) {
  const current = listGoldOrders().find((order) => order.id === orderId);
  write(
    GOLD_KEY,
    listGoldOrders().map((order) => (order.id === orderId ? { ...order, status } : order)),
  );
  recordAdminEvent({
    type: "gold_order_status_updated",
    title: "وضعیت درخواست سرمایه‌گذاری تغییر کرد",
    entityType: status === "shipped" || status === "done" ? "shipment" : "request",
    entityId: orderId,
    status,
    amount: current?.amount,
    details: {
      kind: current?.kind ?? "",
    },
  });
}

/** موجودی طلای کاربر بر اساس سفارش‌های ثبت‌شده */
export function goldHoldings() {
  const orders = listGoldOrders(currentOwnerId());
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
  recordAdminEvent({
    type: "custom_order_created",
    title: "سفارش سفارشی ثبت شد",
    entityType: "request",
    entityId: order.id,
    details: {
      service: order.service,
      name: order.name,
      phone: order.phone,
    },
  });
  return order;
}

export function updateCustomOrderStatus(orderId: string, status: CustomOrder["status"]) {
  const current = listCustomOrders().find((order) => order.id === orderId);
  write(
    CUSTOM_KEY,
    listCustomOrders().map((order) => (order.id === orderId ? { ...order, status } : order)),
  );
  recordAdminEvent({
    type: "custom_order_status_updated",
    title: "وضعیت سفارش سفارشی تغییر کرد",
    entityType: "request",
    entityId: orderId,
    status,
    details: {
      service: current?.service ?? "",
      customer: current?.name ?? "",
    },
  });
}
