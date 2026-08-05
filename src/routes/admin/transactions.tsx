import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/transactions")({
  component: AdminTransactionsPage,
});

const fmt = (n: number) =>
  new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 }).format(n);

const ROWS = [
  { id: "T-901", type: "خرید", amount: 8_200_000, cost: 7_900_000, date: "۱۴۰۴/۰۵/۱۴" },
  { id: "T-900", type: "خرید", amount: 25_000_000, cost: 24_100_000, date: "۱۴۰۴/۰۵/۱۴" },
  { id: "T-899", type: "فروش مشتری", amount: 15_000_000, cost: 14_600_000, date: "۱۴۰۴/۰۵/۱۳" },
];

function AdminTransactionsPage() {
  const profit = ROWS.reduce((s, r) => s + (r.amount - r.cost), 0);
  const volume = ROWS.reduce((s, r) => s + r.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Reports</p>
        <h1 className="mt-1 font-serif text-3xl">گزارش معاملات و سود فروشگاه</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-onyx/10 bg-parchment/90 p-5">
          <p className="text-[11px] text-onyx/45">حجم معاملات (نمونه)</p>
          <p className="mt-2 font-serif text-2xl">{fmt(volume)} تومان</p>
        </div>
        <div className="rounded-2xl border border-onyx/10 bg-parchment/90 p-5">
          <p className="text-[11px] text-onyx/45">سود ناخالص (مبلغ − بهای تمام‌شده)</p>
          <p className="mt-2 font-serif text-2xl text-emerald-700">{fmt(profit)} تومان</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-onyx/10 bg-parchment/90">
        <table className="w-full min-w-[560px] text-right text-sm">
          <thead className="border-b border-onyx/10 text-[11px] uppercase text-onyx/45">
            <tr>
              <th className="p-4">کد</th>
              <th className="p-4">نوع</th>
              <th className="p-4">مبلغ</th>
              <th className="p-4">بهای تمام‌شده</th>
              <th className="p-4">سود</th>
              <th className="p-4">تاریخ</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.id} className="border-b border-onyx/5">
                <td className="p-4 font-mono text-xs">{r.id}</td>
                <td className="p-4">{r.type}</td>
                <td className="p-4">{fmt(r.amount)}</td>
                <td className="p-4">{fmt(r.cost)}</td>
                <td className="p-4 text-emerald-700">{fmt(r.amount - r.cost)}</td>
                <td className="p-4">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}