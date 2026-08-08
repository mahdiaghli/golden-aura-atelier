import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ADMIN_PANEL_EVENTS, getAdminSnapshot } from "@/lib/admin-panel";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardPage,
});

const money = (value: number) =>
  new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 }).format(Math.round(value));

function AdminDashboardPage() {
  const [snapshot, setSnapshot] = useState(getAdminSnapshot);

  useEffect(() => {
    const refresh = () => setSnapshot(getAdminSnapshot());
    refresh();
    ADMIN_PANEL_EVENTS.forEach((eventName) => window.addEventListener(eventName, refresh));
    return () => ADMIN_PANEL_EVENTS.forEach((eventName) => window.removeEventListener(eventName, refresh));
  }, []);

  const cards = [
    { label: "سفارش‌ها", value: snapshot.totals.orders, to: "/admin/orders" as const },
    { label: "درخواست‌ها", value: snapshot.totals.requests, to: "/admin/requests" as const },
    { label: "کاربران", value: snapshot.totals.users, to: "/admin/users" as const },
    { label: "نظرات", value: snapshot.totals.reviews, to: "/admin/users" as const },
    { label: "ارسال‌ها", value: snapshot.totals.shipments, to: "/admin/shipping" as const },
    { label: "سود تقریبی", value: `${money(snapshot.totals.profit)} تومان`, to: "/admin/transactions" as const },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Dashboard</p>
        <h1 className="mt-1 font-serif text-3xl">نمای کلی همه رویدادها</h1>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="rounded-2xl border border-onyx/10 bg-parchment/90 p-5 transition hover:border-gold/40 hover:bg-white/80"
          >
            <p className="text-sm text-onyx/55">{card.label}</p>
            <p className="mt-2 font-serif text-3xl">{card.value}</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-onyx/10 bg-parchment/90 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl">رویدادهای اخیر</h2>
            <span className="text-xs text-onyx/45">{snapshot.events.length} رویداد</span>
          </div>
          <div className="mt-5 space-y-3">
            {snapshot.events.length === 0 ? (
              <p className="text-sm text-onyx/50">هنوز رویدادی ثبت نشده است.</p>
            ) : (
              snapshot.events.slice(0, 12).map((event) => (
                <article key={event.id} className="rounded-xl border border-onyx/10 bg-white/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{event.title}</p>
                    <span className="text-[11px] text-onyx/45">
                      {new Date(event.createdAt).toLocaleString("fa-IR")}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-onyx/60">
                    {event.entityType}
                    {event.entityId ? ` · ${event.entityId}` : ""}
                    {typeof event.amount === "number" ? ` · ${money(event.amount)} تومان` : ""}
                  </p>
                </article>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-onyx/10 bg-parchment/90 p-6">
            <h2 className="font-serif text-2xl">فروش و سود</h2>
            <div className="mt-4 space-y-2 text-sm">
              <Row label="گردش مالی" value={`${money(snapshot.totals.revenue)} تومان`} />
              <Row label="سود تخمینی" value={`${money(snapshot.totals.profit)} تومان`} />
              <Row label="سفارش‌های فروشگاهی" value={String(snapshot.orders.length)} />
              <Row label="درخواست‌های سرمایه‌گذاری" value={String(snapshot.goldOrders.length)} />
            </div>
          </section>

          <section className="rounded-2xl border border-onyx/10 bg-parchment/90 p-6">
            <h2 className="font-serif text-2xl">آخرین نظرات</h2>
            <div className="mt-4 space-y-3">
              {snapshot.reviews.slice(0, 4).map((review) => (
                <article key={review.id} className="rounded-xl border border-onyx/10 bg-white/70 p-4">
                  <p className="font-medium">{review.name}</p>
                  <p className="mt-1 text-sm text-onyx/55">
                    امتیاز {review.rating} از ۵ · {review.productId}
                  </p>
                </article>
              ))}
              {snapshot.reviews.length === 0 ? <p className="text-sm text-onyx/50">نظری ثبت نشده است.</p> : null}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-onyx/55">{label}</span>
      <span>{value}</span>
    </div>
  );
}
