import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const fmt = (n: number) =>
  new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 }).format(Math.round(n));

/** دادهٔ موقت — بعداً از API */
const STATS = {
  vaultGoldGrams: 1842.35,
  rialBalance: 12_450_000_000,
  usersCount: 1284,
  ordersToday: 37,
  volumeToday: 890_500_000,
  unshipped: 14,
  withdrawRequests: 5,
};

const SALES_7D = [42, 55, 38, 70, 62, 88, 75]; // میلیون تومان — نمونه

function AdminDashboard() {
  const maxSale = Math.max(...SALES_7D);

  const cards = useMemo(
    () => [
      { label: "موجودی طلای خزانه", value: `${fmt(STATS.vaultGoldGrams)} گرم`, tone: "text-gold" },
      { label: "موجودی ریالی", value: `${fmt(STATS.rialBalance)} تومان`, tone: "text-onyx" },
      { label: "تعداد کاربران", value: fmt(STATS.usersCount), tone: "text-onyx" },
      { label: "سفارشات امروز", value: fmt(STATS.ordersToday), tone: "text-onyx" },
      { label: "حجم معاملات امروز", value: `${fmt(STATS.volumeToday)} تومان`, tone: "text-onyx" },
      {
        label: "سفارشات ارسال‌نشده",
        value: fmt(STATS.unshipped),
        tone: "text-amber-700",
        to: "/admin/shipping",
      },
      {
        label: "درخواست‌های برداشت",
        value: fmt(STATS.withdrawRequests),
        tone: "text-red-700",
        to: "/admin/orders",
      },
    ],
    [],
  );

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Overview</p>
        <h1 className="mt-1 font-serif text-3xl">داشبورد مدیریتی</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => {
          const inner = (
            <div className="rounded-2xl border border-onyx/10 bg-parchment/90 p-5 shadow-sm transition hover:border-gold/40">
              <p className="text-[11px] uppercase tracking-[0.18em] text-onyx/45">{c.label}</p>
              <p className={`mt-3 font-serif text-2xl ${c.tone}`}>{c.value}</p>
            </div>
          );
          return c.to ? (
            <Link key={c.label} to={c.to}>
              {inner}
            </Link>
          ) : (
            <div key={c.label}>{inner}</div>
          );
        })}
      </div>

      {/* نمودار فروش ساده */}
      <div className="rounded-2xl border border-onyx/10 bg-parchment/90 p-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl">نمودار فروش ۷ روز اخیر</h2>
            <p className="mt-1 text-sm text-onyx/50">حجم تقریبی (میلیون تومان)</p>
          </div>
          <Link to="/admin/transactions" className="text-[11px] uppercase tracking-wider text-gold">
            گزارش کامل
          </Link>
        </div>
        <div className="mt-8 flex h-48 items-end gap-2 sm:gap-3">
          {SALES_7D.map((v, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-[10px] text-onyx/40">{v}</span>
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-onyx to-gold/80"
                style={{ height: `${(v / maxSale) * 100}%`, minHeight: 8 }}
              />
              <span className="text-[10px] text-onyx/40">{["ش", "ی", "د", "س", "چ", "پ", "ج"][i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <QuickLink to="/admin/orders" title="تأیید خرید" desc="فیش‌ها و پرداخت‌های در انتظار" />
        <QuickLink to="/admin/shipping" title="ارسال" desc="سفارشات آماده‌به‌ارسال" />
        <QuickLink to="/admin/users" title="کاربران" desc="لیست و وضعیت حساب‌ها" />
      </div>
    </div>
  );
}

function QuickLink({ to, title, desc }: { to: string; title: string; desc: string }) {
  return (
    <Link
      to={to}
      className="rounded-2xl border border-onyx/10 bg-white/60 p-5 transition hover:border-gold"
    >
      <p className="font-serif text-lg">{title}</p>
      <p className="mt-1 text-sm text-onyx/50">{desc}</p>
    </Link>
  );
}