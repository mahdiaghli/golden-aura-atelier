import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  listCustomOrders,
  listGoldOrders,
  updateCustomOrderStatus,
  updateGoldOrderStatus,
  type CustomOrder,
  type GoldOrder,
} from "@/lib/requests";

export const Route = createFileRoute("/admin/requests")({
  component: AdminRequestsPage,
});

const fmt = (n: number) =>
  new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 }).format(Math.round(n));

const KIND_LABEL: Record<GoldOrder["kind"], string> = {
  amount: "خرید مبلغی",
  product: "خرید گوی",
  sell: "فروش طلا",
  ball: "درخواست ساخت گوی",
};

const GOLD_STATUS: GoldOrder["status"][] = ["pending", "confirmed", "shipped", "done"];
const CUSTOM_STATUS: CustomOrder["status"][] = ["new", "reviewing", "quoted", "done"];

function AdminRequestsPage() {
  const [gold, setGold] = useState<GoldOrder[]>([]);
  const [custom, setCustom] = useState<CustomOrder[]>([]);

  const refresh = () => {
    setGold(listGoldOrders());
    setCustom(listCustomOrders());
  };

  useEffect(refresh, []);

  return (
    <div className="space-y-10">
      <div>
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Requests</p>
        <h1 className="mt-1 font-serif text-3xl">درخواست‌های سرمایه‌گذاری و سفارشی</h1>
      </div>

      <section className="rounded-2xl border border-onyx/10 bg-parchment/90 p-6">
        <h2 className="font-serif text-xl">سفارش‌های طلا ({gold.length})</h2>
        {gold.length === 0 ? (
          <p className="mt-4 text-sm text-onyx/50">هنوز سفارشی ثبت نشده است.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="text-[11px] uppercase tracking-widest text-onyx/45">
                <tr>
                  <th className="py-2 text-right">کد</th>
                  <th className="py-2 text-right">نوع</th>
                  <th className="py-2 text-right">وزن</th>
                  <th className="py-2 text-right">مبلغ</th>
                  <th className="py-2 text-right">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {gold.map((order) => (
                  <tr key={order.id} className="border-t border-onyx/10">
                    <td className="py-3">{order.id}</td>
                    <td className="py-3">
                      {KIND_LABEL[order.kind]}
                      {order.productName ? ` — ${order.productName}` : ""}
                    </td>
                    <td className="py-3">{order.grams} گرم</td>
                    <td className="py-3">{fmt(order.amount)} تومان</td>
                    <td className="py-3">
                      <select
                        value={order.status}
                        onChange={(e) => {
                          updateGoldOrderStatus(order.id, e.target.value as GoldOrder["status"]);
                          refresh();
                        }}
                        className="rounded-lg border border-onyx/15 bg-white/70 px-2 py-1 text-xs"
                      >
                        {GOLD_STATUS.map((s) => (
                          <option key={s} value={s}>
                            {s}
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

      <section className="rounded-2xl border border-onyx/10 bg-parchment/90 p-6">
        <h2 className="font-serif text-xl">سفارش‌های ساخت سفارشی ({custom.length})</h2>
        {custom.length === 0 ? (
          <p className="mt-4 text-sm text-onyx/50">هنوز درخواستی ثبت نشده است.</p>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {custom.map((order) => (
              <article key={order.id} className="rounded-xl border border-onyx/10 bg-white/60 p-5">
                <div className="flex items-center justify-between">
                  <p className="font-serif text-lg">{order.service}</p>
                  <span className="text-[11px] text-onyx/45">{order.id}</span>
                </div>
                <p className="mt-2 text-sm text-onyx/60">
                  {order.name} · {order.phone} · {order.city}
                </p>
                <p className="mt-1 text-sm text-onyx/60">
                  {order.karat} عیار · {order.weight} گرم · {order.photos} عکس
                </p>
                {order.textOnItem && (
                  <p className="mt-1 text-sm text-onyx/60">متن: {order.textOnItem}</p>
                )}
                {order.description && (
                  <p className="mt-2 text-sm leading-relaxed text-onyx/50">{order.description}</p>
                )}
                <select
                  value={order.status}
                  onChange={(e) => {
                    updateCustomOrderStatus(order.id, e.target.value as CustomOrder["status"]);
                    refresh();
                  }}
                  className="mt-4 rounded-lg border border-onyx/15 bg-white/70 px-2 py-1 text-xs"
                >
                  {CUSTOM_STATUS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
