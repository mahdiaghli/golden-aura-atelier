import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ADMIN_PANEL_EVENTS, getAdminSnapshot } from "@/lib/admin-panel";

export const Route = createFileRoute("/admin/transactions")({
  component: AdminTransactionsPage,
});

const money = (value: number) =>
  new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 }).format(Math.round(value));

function AdminTransactionsPage() {
  const [snapshot, setSnapshot] = useState(getAdminSnapshot);

  useEffect(() => {
    const refresh = () => setSnapshot(getAdminSnapshot());
    refresh();
    ADMIN_PANEL_EVENTS.forEach((eventName) => window.addEventListener(eventName, refresh));
    return () => ADMIN_PANEL_EVENTS.forEach((eventName) => window.removeEventListener(eventName, refresh));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Transactions</p>
        <h1 className="mt-1 font-serif text-3xl">معاملات و سود</h1>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <Card label="گردش مالی کل" value={`${money(snapshot.totals.revenue)} تومان`} />
        <Card label="سود تخمینی" value={`${money(snapshot.totals.profit)} تومان`} />
        <Card label="معاملات ثبت‌شده" value={String(snapshot.orders.length + snapshot.goldOrders.length)} />
      </section>

      <section className="rounded-2xl border border-onyx/10 bg-parchment/90 p-6">
        <h2 className="font-serif text-2xl">سفارش‌های فروشگاهی</h2>
        <div className="mt-4 space-y-3">
          {snapshot.orders.map((order) => (
            <article key={order.id} className="rounded-xl border border-onyx/10 bg-white/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{order.id}</p>
                <span>{money(order.total)} تومان</span>
              </div>
              <p className="mt-1 text-sm text-onyx/55">
                سود تقریبی {money(order.items.reduce((sum, item) => sum + item.price * 0.07, 0))} تومان
              </p>
            </article>
          ))}
          {snapshot.orders.length === 0 ? <p className="text-sm text-onyx/50">هنوز سفارشی ثبت نشده است.</p> : null}
        </div>
      </section>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-onyx/10 bg-parchment/90 p-5">
      <p className="text-sm text-onyx/55">{label}</p>
      <p className="mt-2 font-serif text-3xl">{value}</p>
    </div>
  );
}
