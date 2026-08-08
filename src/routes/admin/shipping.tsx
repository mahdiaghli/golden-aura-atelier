import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ADMIN_PANEL_EVENTS } from "@/lib/admin-panel";
import { getOrders, updateOrderStatus, type Order } from "@/lib/orders";
import { listGoldOrders, updateGoldOrderStatus, type GoldOrder } from "@/lib/requests";

export const Route = createFileRoute("/admin/shipping")({
  component: AdminShippingPage,
});

const ORDER_STATUS: Order["status"][] = ["Pending", "Packed", "In transit", "Delivered"];
const GOLD_STATUS: GoldOrder["status"][] = ["pending", "confirmed", "shipped", "done"];

function AdminShippingPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [goldOrders, setGoldOrders] = useState<GoldOrder[]>([]);

  useEffect(() => {
    const refresh = () => {
      setOrders(getOrders());
      setGoldOrders(listGoldOrders());
    };
    refresh();
    ADMIN_PANEL_EVENTS.forEach((eventName) => window.addEventListener(eventName, refresh));
    return () => ADMIN_PANEL_EVENTS.forEach((eventName) => window.removeEventListener(eventName, refresh));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Shipping</p>
        <h1 className="mt-1 font-serif text-3xl">ارسال و تحویل</h1>
      </div>

      <section className="rounded-2xl border border-onyx/10 bg-parchment/90 p-6">
        <h2 className="font-serif text-2xl">ارسال سفارش‌های فروشگاه</h2>
        <div className="mt-4 space-y-3">
          {orders.map((order) => (
            <article key={order.id} className="rounded-xl border border-onyx/10 bg-white/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{order.id}</p>
                  <p className="text-sm text-onyx/55">{order.customer.name}</p>
                </div>
                <select
                  value={order.status}
                  onChange={(event) => {
                    updateOrderStatus(order.id, event.target.value as Order["status"]);
                    setOrders(getOrders());
                  }}
                  className="rounded-lg border border-onyx/15 bg-white px-2 py-1 text-xs"
                >
                  {ORDER_STATUS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </article>
          ))}
          {orders.length === 0 ? <p className="text-sm text-onyx/50">ارسالی وجود ندارد.</p> : null}
        </div>
      </section>

      <section className="rounded-2xl border border-onyx/10 bg-parchment/90 p-6">
        <h2 className="font-serif text-2xl">ارسال سفارش‌های سرمایه‌گذاری</h2>
        <div className="mt-4 space-y-3">
          {goldOrders.map((order) => (
            <article key={order.id} className="rounded-xl border border-onyx/10 bg-white/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{order.id}</p>
                  <p className="text-sm text-onyx/55">{order.kind} · {order.grams} گرم</p>
                </div>
                <select
                  value={order.status}
                  onChange={(event) => {
                    updateGoldOrderStatus(order.id, event.target.value as GoldOrder["status"]);
                    setGoldOrders(listGoldOrders());
                  }}
                  className="rounded-lg border border-onyx/15 bg-white px-2 py-1 text-xs"
                >
                  {GOLD_STATUS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </article>
          ))}
          {goldOrders.length === 0 ? <p className="text-sm text-onyx/50">ارسال سرمایه‌گذاری وجود ندارد.</p> : null}
        </div>
      </section>
    </div>
  );
}
