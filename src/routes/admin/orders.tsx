import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrdersPage,
});

const fmt = (n: number) =>
  new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 }).format(n);

type OrderStatus = "pending_payment" | "awaiting_review" | "approved" | "rejected" | "shipped";

type Order = {
  id: string;
  user: string;
  phone: string;
  type: string;
  amount: number;
  grams: number;
  status: OrderStatus;
  receiptUrl?: string;
  note?: string;
  createdAt: string;
};

const INITIAL: Order[] = [
  {
    id: "ORD-1042",
    user: "سارا محمدی",
    phone: "0912…4567",
    type: "خرید گوی ۱ گرم",
    amount: 8_200_000,
    grams: 1,
    status: "awaiting_review",
    receiptUrl: "#",
    createdAt: "۱۴۰۴/۰۵/۱۴ — ۱۰:۲۲",
  },
  {
    id: "ORD-1041",
    user: "علی رضایی",
    phone: "0915…1122",
    type: "سرمایه‌گذاری مبلغی",
    amount: 25_000_000,
    grams: 3.18,
    status: "awaiting_review",
    receiptUrl: "#",
    createdAt: "۱۴۰۴/۰۵/۱۴ — ۰۹:۰۵",
  },
  {
    id: "ORD-1038",
    user: "مریم احمدی",
    phone: "0935…7788",
    type: "پلاک اسم سفارشی",
    amount: 12_500_000,
    grams: 1.5,
    status: "approved",
    createdAt: "۱۴۰۴/۰۵/۱۳ — ۱۶:۴۰",
  },
];

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending_payment: "در انتظار پرداخت",
  awaiting_review: "در انتظار تأیید",
  approved: "تأیید شده",
  rejected: "رد شده",
  shipped: "ارسال شده",
};

function AdminOrdersPage() {
  const [orders, setOrders] = useState(INITIAL);
  const [filter, setFilter] = useState<"all" | OrderStatus>("awaiting_review");
  const [selected, setSelected] = useState<Order | null>(null);
  const [note, setNote] = useState("");

  const list =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const setStatus = (id: string, status: OrderStatus, adminNote?: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status, note: adminNote ?? o.note } : o,
      ),
    );
    setSelected(null);
    setNote("");
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Orders</p>
        <h1 className="mt-1 font-serif text-3xl">مدیریت سفارشات و تأیید خرید</h1>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["awaiting_review", "در انتظار تأیید"],
            ["all", "همه"],
            ["approved", "تأیید شده"],
            ["rejected", "رد شده"],
            ["shipped", "ارسال شده"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider ${
              filter === key ? "bg-onyx text-parchment" : "border border-onyx/15"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-onyx/10 bg-parchment/90">
        <table className="w-full min-w-[720px] text-right text-sm">
          <thead className="border-b border-onyx/10 text-[11px] uppercase tracking-wider text-onyx/45">
            <tr>
              <th className="p-4 font-medium">کد</th>
              <th className="p-4 font-medium">مشتری</th>
              <th className="p-4 font-medium">نوع</th>
              <th className="p-4 font-medium">مبلغ</th>
              <th className="p-4 font-medium">وضعیت</th>
              <th className="p-4 font-medium">اقدام</th>
            </tr>
          </thead>
          <tbody>
            {list.map((o) => (
              <tr key={o.id} className="border-b border-onyx/5 hover:bg-white/40">
                <td className="p-4 font-mono text-xs">{o.id}</td>
                <td className="p-4">
                  <p>{o.user}</p>
                  <p className="text-xs text-onyx/45">{o.phone}</p>
                </td>
                <td className="p-4">
                  {o.type}
                  <p className="text-xs text-onyx/45">{o.grams} گرم</p>
                </td>
                <td className="p-4">{fmt(o.amount)} تومان</td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                      o.status === "awaiting_review"
                        ? "bg-amber-100 text-amber-800"
                        : o.status === "approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : o.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-onyx/5 text-onyx/60"
                    }`}
                  >
                    {STATUS_LABEL[o.status]}
                  </span>
                </td>
                <td className="p-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-8 rounded-lg text-xs"
                    onClick={() => {
                      setSelected(o);
                      setNote(o.note ?? "");
                    }}
                  >
                    بررسی
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* مودال تأیید / رد */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-onyx/40 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-onyx/10 bg-parchment p-6 shadow-xl">
            <h2 className="font-serif text-2xl">بررسی سفارش {selected.id}</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-onyx/50">مشتری</dt>
                <dd>{selected.user}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-onyx/50">مبلغ</dt>
                <dd>{fmt(selected.amount)} تومان</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-onyx/50">زمان</dt>
                <dd>{selected.createdAt}</dd>
              </div>
            </dl>

            {selected.receiptUrl && (
              <a
                href={selected.receiptUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block text-sm text-gold hover:underline"
              >
                مشاهده فیش پرداخت
              </a>
            )}

            <label className="mt-5 block">
              <span className="text-[11px] uppercase tracking-wider text-onyx/50">توضیح ادمین</span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="mt-2 w-full rounded-xl border border-onyx/10 bg-white/70 p-3 text-sm outline-none focus:border-gold"
                placeholder="مثلاً: فیش تأیید شد / مبلغ ناقص است…"
              />
            </label>

            <div className="mt-6 flex flex-wrap gap-2">
              <Button
                type="button"
                className="rounded-xl bg-emerald-800 text-white hover:bg-emerald-700"
                onClick={() => setStatus(selected.id, "approved", note)}
              >
                تأیید
              </Button>
              <Button
                type="button"
                className="rounded-xl bg-red-700 text-white hover:bg-red-600"
                onClick={() => setStatus(selected.id, "rejected", note)}
              >
                رد
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => setSelected(null)}
              >
                بستن
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}