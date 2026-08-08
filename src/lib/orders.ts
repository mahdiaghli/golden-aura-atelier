import type { Product } from "./products";
import { recordAdminEvent } from "./admin-events";

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sku: string;
};

export type Order = {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  placedAt: string;
  status: "Pending" | "Packed" | "In transit" | "Delivered";
};

const ORDERS_KEY = "aurum-orders-v1";

function loadOrdersFromStorage(): Order[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(ORDERS_KEY);
    return stored ? (JSON.parse(stored) as Order[]) : [];
  } catch {
    return [];
  }
}

function saveOrdersToStorage(orders: Order[]) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent(`${ORDERS_KEY}:changed`));
  }
}

export function createOrder(payload: {
  customer: Order["customer"];
  items: Array<{ product: Product; quantity: number; lineTotal: number }>;
  subtotal: number;
  shipping: number;
  total: number;
}): Order {
  const order: Order = {
    id: `ORD-${Math.floor(Date.now() / 1000)}`,
    customer: payload.customer,
    items: payload.items.map(({ product, quantity, lineTotal }) => ({
      id: product.id,
      name: product.name,
      price: lineTotal,
      quantity,
      image: product.image,
      sku: product.sku,
    })),
    subtotal: payload.subtotal,
    shipping: payload.shipping,
    total: payload.total,
    placedAt: new Date().toISOString(),
    status: "Pending",
  };

  const orders = [order, ...loadOrdersFromStorage()];
  saveOrdersToStorage(orders);
  recordAdminEvent({
    type: "order_created",
    title: "سفارش جدید ثبت شد",
    entityType: "order",
    entityId: order.id,
    amount: order.total,
    details: {
      customer: order.customer.name,
      phone: order.customer.phone,
      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    },
  });
  recordAdminEvent({
    type: "order_created",
    title: "سود سفارش ثبت شد",
    entityType: "transaction",
    entityId: order.id,
    amount: order.total,
    profit: Math.round(order.items.reduce((sum, item) => sum + item.price * 0.07, 0)),
    details: {
      customer: order.customer.name,
    },
  });
  return order;
}

export function getOrders(): Order[] {
  return loadOrdersFromStorage();
}

export function updateOrderStatus(orderId: string, status: Order["status"]): void {
  const current = loadOrdersFromStorage().find((order) => order.id === orderId);
  const nextOrders = loadOrdersFromStorage().map((order) =>
    order.id === orderId ? { ...order, status } : order,
  );
  saveOrdersToStorage(nextOrders);
  recordAdminEvent({
    type: "order_status_updated",
    title: "وضعیت سفارش تغییر کرد",
    entityType: status === "In transit" || status === "Delivered" ? "shipment" : "order",
    entityId: orderId,
    status,
    amount: current?.total,
    details: {
      customer: current?.customer.name ?? "",
    },
  });
}
