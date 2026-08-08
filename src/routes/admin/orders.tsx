import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ADMIN_PANEL_EVENTS } from "@/lib/admin-panel";
import { getOrders, updateOrderStatus, type Order } from "@/lib/orders";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrdersPage,
});

const ORDER_STATUS: Order["status"][] = ["Pending", "Packed", "In transit", "Delivered"];
const money = (value: number) =>
  new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 }).format(Math.round(value));

function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const refresh = () => setOrders(getOrders());
    refresh();
    ADMIN_PANEL_EVENTS.forEach((eventName) => window.addEventListener(eventName, refresh));
    return () => ADMIN_PANEL_EVENTS.forEach((eventName) => window.removeEventListener(eventName, refresh));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Orders</p>
        <h1 className="mt-1 font-serif text-3xl">سفارشات فروشگاه</h1>
      </div>

      <section className="rounded-2xl border border-onyx/10 bg-parchment/90 p-6">
        {orders.length === 0 ? (
          <p className="text-sm text-onyx/50">هنوز سفارشی ثبت نشده است.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-sm">
              <thead className="text-[11px] uppercase tracking-widest text-onyx/45">
                <tr>
                  <th className="py-2 text-right">کد</th>
                  <th className="py-2 text-right">مشتری</th>
                  <th className="py-2 text-right">اقلام</th>
                  <th className="py-2 text-right">مبلغ</th>
                  <th className="py-2 text-right">زمان</th>
                  <th className="py-2 text-right">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-onyx/10 align-top">
                    <td className="py-3">{order.id}</td>
                    <td className="py-3">
                      <p>{order.customer.name}</p>
                      <p className="text-xs text-onyx/45">{order.customer.phone}</p>
                    </td>
                    <td className="py-3">
                      {order.items.map((item) => `${item.name} × ${item.quantity}`).join("، ")}
                    </td>
                    <td className="py-3">{money(order.total)} تومان</td>
                    <td className="py-3">{new Date(order.placedAt).toLocaleString("fa-IR")}</td>
                    <td className="py-3">
                      <select
                        value={order.status}
                        onChange={(event) => {
                          updateOrderStatus(order.id, event.target.value as Order["status"]);
                          setOrders(getOrders());
                        }}
                        className="rounded-lg border border-onyx/15 bg-white/70 px-2 py-1 text-xs"
                      >
                        {ORDER_STATUS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
