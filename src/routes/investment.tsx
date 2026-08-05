import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/site/Chrome";
// وقتی gold.functions آماده شد این را فعال کنید:
// import { getInvestData, createGoldOrder } from "@/lib/gold.functions";
// import { useSession } from "@/lib/use-session";

export const Route = createFileRoute("/investment")({
  head: () => ({
    meta: [
      { title: "کاتالوگ و سرمایه‌گذاری طلا | عقلی" },
      {
        name: "description",
        content:
          "خرید گوی طلا یا سرمایه‌گذاری با مبلغ دلخواه. نمودار سود، نگهداری امانی یا ارسال فیزیکی.",
      },
    ],
  }),
  component: CatalogPage,
});

const fmt = (n: number) =>
  new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 }).format(Math.round(n));

const fmtDec = (n: number, d = 4) =>
  new Intl.NumberFormat("fa-IR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: d,
  }).format(n);

/* ——— دادهٔ موقت ——— */
const MOCK_RATE_24 = 7_850_000;
const MOCK_RATE_18 = Math.round(MOCK_RATE_24 * (18 / 24));

const MOCK_PRODUCTS = [
  { id: "g-0.5", name: "گوی طلا ۰٫۵ گرم", weight_grams: 0.5, karat: "24K", premium_pct: 3, image_url: null as string | null },
  { id: "g-1", name: "گوی طلا ۱ گرم", weight_grams: 1, karat: "24K", premium_pct: 2.5, image_url: null },
  { id: "g-2.5", name: "گوی طلا ۲٫۵ گرم", weight_grams: 2.5, karat: "24K", premium_pct: 2, image_url: null },
  { id: "g-5", name: "گوی طلا ۵ گرم", weight_grams: 5, karat: "24K", premium_pct: 1.8, image_url: null },
];

/** موجودی فرضی کاربر برای داشبورد */
const MOCK_HOLDINGS = {
  grams24: 23.58,
  buyValue: 163_400_000, // ارزش خرید اولیه
  buyDate: "2025-11-12",
};

const AMOUNT_PRESETS = [1_000_000, 2_000_000, 5_000_000, 10_000_000, 25_000_000, 50_000_000];

type ChartRange = "1d" | "1w" | "1m" | "3m" | "1y" | "all";

function CatalogPage() {
  const session = null as { id: string } | null; // بعداً useSession
  const navigate = useNavigate();

  const [mainTab, setMainTab] = useState<"product" | "amount" | "dashboard">("amount");
  const [selected, setSelected] = useState<string | null>(MOCK_PRODUCTS[0]?.id ?? null);
  const [quantity, setQuantity] = useState(1);
  const [amount, setAmount] = useState(5_000_000);
  const [delivery, setDelivery] = useState<"vault" | "shipping">("vault");
  const [shipMethod, setShipMethod] = useState<"post" | "tipax" | "courier" | "pickup">("post");
  const [busy, setBusy] = useState(false);
  const [chartRange, setChartRange] = useState<ChartRange>("1m");
  const [sellGrams, setSellGrams] = useState(1);
  const [ballRequest, setBallRequest] = useState<number | null>(null);

  const rate24 = MOCK_RATE_24;
  const rate18 = MOCK_RATE_18;
  const products = MOCK_PRODUCTS;
  const product = products.find((p) => p.id === selected) ?? products[0] ?? null;

  const totalProduct = product
    ? product.weight_grams * quantity * rate24 * (1 + Number(product.premium_pct) / 100)
    : 0;

  /** گرم طلای ۲۴ عیار برای مبلغ دلخواه */
  const gramsForAmount24 = rate24 > 0 ? amount / rate24 : 0;
  /** معادل ۱۸ عیار (برای نمایش) */
  const gramsForAmount18 = rate18 > 0 ? amount / rate18 : 0;

  /* موجودی و سود */
  const holdingsGrams = MOCK_HOLDINGS.grams24;
  const holdingsValueToday = holdingsGrams * rate24;
  const holdingsProfit = holdingsValueToday - MOCK_HOLDINGS.buyValue;
  const holdingsProfitPct =
    MOCK_HOLDINGS.buyValue > 0 ? (holdingsProfit / MOCK_HOLDINGS.buyValue) * 100 : 0;

  /* نقاط نمودار ساده بر اساس بازه */
  const chartPoints = useMemo(() => {
    const base = MOCK_HOLDINGS.buyValue;
    const end = holdingsValueToday;
    const steps: Record<ChartRange, number> = {
      "1d": 8,
      "1w": 7,
      "1m": 12,
      "3m": 12,
      "1y": 12,
      all: 16,
    };
    const n = steps[chartRange];
    const pts: number[] = [];
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      // شبیه‌سازی نوسان + روند صعودی
      const noise = Math.sin(i * 1.7) * 0.012 + Math.cos(i * 0.9) * 0.008;
      pts.push(base + (end - base) * t * (1 + noise));
    }
    pts[pts.length - 1] = end;
    return pts;
  }, [chartRange, holdingsValueToday]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session) {
      navigate({ to: "/auth", search: { redirect: "/catalog" } });
      return;
    }
    setBusy(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      toast.success(
        mainTab === "amount"
          ? `سفارش ${fmtDec(gramsForAmount24, 4)} گرم ثبت شد.`
          : "سفارش گوی ثبت شد.",
      );
      setMainTab("dashboard");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "ثبت سفارش ناموفق بود");
    } finally {
      setBusy(false);
    }
  };

  const handleSell = (all: boolean) => {
    const g = all ? holdingsGrams : Math.min(sellGrams, holdingsGrams);
    if (g <= 0) {
      toast.error("مقدار نامعتبر است");
      return;
    }
    toast.success(`درخواست فروش ${fmtDec(g, 3)} گرم ثبت شد (نسخه آزمایشی).`);
  };

  const handleBallRequest = (w: number) => {
    if (w > holdingsGrams) {
      toast.error("موجودی کافی نیست");
      return;
    }
    setBallRequest(w);
    toast.success(`درخواست ساخت گوی ${w} گرمی ثبت شد.`);
  };

  return (
    <Shell>
      {/* Hero */}
      <section dir="rtl" className="border-b border-onyx/10 bg-gradient-to-b from-white/70 to-transparent">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <span className="text-[11px] uppercase tracking-[0.3em] text-gold">طلا · سرمایه‌گذاری</span>
          <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
            طلا بخرید، نگه دارید، رشد ببینید.
          </h1>
          <p className="mt-4 max-w-2xl font-light text-onyx/65">
            گوی آماده بخرید یا با هر مبلغی سرمایه‌گذاری کنید. نمودار سود مثل اپ بورسی، نگهداری در خزانه
            یا ارسال فیزیکی.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/70 px-5 py-2.5 text-sm">
              <span className="text-onyx/50">۲۴ عیار</span>
              <strong className="text-gold">{fmt(rate24)} تومان</strong>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-onyx/15 bg-white/50 px-5 py-2.5 text-sm">
              <span className="text-onyx/50">۱۸ عیار</span>
              <strong>{fmt(rate18)} تومان</strong>
            </div>
          </div>
        </div>
      </section>

      <section dir="rtl" className="mx-auto max-w-6xl px-6 py-12">
        {/* تب‌های اصلی */}
        <div className="flex flex-wrap gap-2">
          <Tab active={mainTab === "amount"} onClick={() => setMainTab("amount")}>
            سرمایه‌گذاری با مبلغ دلخواه
          </Tab>
          <Tab active={mainTab === "product"} onClick={() => setMainTab("product")}>
            خرید گوی طلا
          </Tab>
          <Tab active={mainTab === "dashboard"} onClick={() => setMainTab("dashboard")}>
            موجودی و نمودار
          </Tab>
        </div>

        {/* ========== تب مبلغ دلخواه ========== */}
        {mainTab === "amount" && (
          <form onSubmit={submit} className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
            <div className="space-y-8">
              {/* مبلغ */}
              <div className="rounded-2xl border border-onyx/10 bg-white/70 p-8">
                <label className="block">
                  <span className="text-[10px] uppercase tracking-widest text-onyx/60">
                    مبلغ سرمایه‌گذاری (تومان)
                  </span>
                  <input
                    type="number"
                    min={500_000}
                    step={100_000}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value) || 0)}
                    className="mt-2 w-full border-b border-onyx/20 bg-transparent py-3 text-3xl outline-none focus:border-gold"
                  />
                </label>

                {/* اسلایدر */}
                <input
                  type="range"
                  min={1_000_000}
                  max={100_000_000}
                  step={500_000}
                  value={Math.min(100_000_000, Math.max(1_000_000, amount))}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="mt-6 w-full accent-[var(--gold,#c9a227)]"
                />

                <div className="mt-4 flex flex-wrap gap-2">
                  {AMOUNT_PRESETS.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setAmount(v)}
                      className={`rounded-full border px-4 py-2 text-xs transition-all ${
                        amount === v ? "border-gold bg-gold/10 text-gold" : "border-onyx/15 hover:border-gold"
                      }`}
                    >
                      {fmt(v)}
                    </button>
                  ))}
                </div>

                {/* نمایش لحظه‌ای مالکیت */}
                <div className="mt-8 rounded-xl border border-gold/30 bg-gradient-to-l from-gold/10 to-transparent p-6">
                  <p className="text-[11px] uppercase tracking-widest text-onyx/50">شما مالک خواهید شد</p>
                  <p className="mt-2 font-serif text-3xl text-gold">
                    {fmtDec(gramsForAmount24, 4)} <span className="text-lg">گرم</span>
                  </p>
                  <p className="mt-1 text-sm text-onyx/60">
                    طلای ۲۴ عیار · معادل تقریبی{" "}
                    <strong>{fmtDec(gramsForAmount18, 3)} گرم ۱۸ عیار</strong>
                  </p>
                </div>
              </div>

              {/* نحوه نگهداری */}
              <DeliveryCards
                delivery={delivery}
                setDelivery={setDelivery}
                shipMethod={shipMethod}
                setShipMethod={setShipMethod}
              />
            </div>

            <OrderAside
              session={!!session}
              busy={busy}
              rows={[
                { label: "مبلغ", value: `${fmt(amount)} تومان` },
                { label: "طلای ثبت‌شده", value: `${fmtDec(gramsForAmount24, 4)} گرم ۲۴K` },
                { label: "نگهداری", value: delivery === "vault" ? "خزانه امن" : "ارسال فیزیکی" },
              ]}
              submitLabel={session ? (busy ? "در حال ثبت…" : "ثبت سرمایه‌گذاری") : "ورود و سرمایه‌گذاری"}
            />
          </form>
        )}

        {/* ========== تب خرید گوی ========== */}
        {mainTab === "product" && (
          <form onSubmit={submit} className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
            <div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((item) => {
                  const active = product?.id === item.id;
                  const price =
                    item.weight_grams * rate24 * (1 + Number(item.premium_pct) / 100);
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setSelected(item.id)}
                      className={`rounded-2xl border p-5 text-right transition-all ${
                        active
                          ? "border-gold bg-white shadow-[0_20px_50px_rgba(15,15,15,0.08)]"
                          : "border-onyx/10 bg-white/60 hover:border-gold/50"
                      }`}
                    >
                      <div className="mb-4 flex aspect-square w-full items-center justify-center rounded-xl bg-gradient-to-br from-gold/25 to-transparent text-3xl">
                        ●
                      </div>
                      <p className="font-serif text-xl">{item.name}</p>
                      <p className="mt-1 text-[11px] uppercase tracking-widest text-onyx/45">
                        {item.weight_grams} گرم · {item.karat} · اجرت {item.premium_pct}٪
                      </p>
                      <p className="mt-3 text-sm text-gold">{fmt(price)} تومان</p>
                    </button>
                  );
                })}
              </div>
              <div className="mt-10">
                <DeliveryCards
                  delivery={delivery}
                  setDelivery={setDelivery}
                  shipMethod={shipMethod}
                  setShipMethod={setShipMethod}
                />
              </div>
            </div>

            <aside className="sticky top-28 h-fit space-y-4 rounded-2xl bg-secondary p-8">
              <h4 className="text-[11px] font-bold uppercase tracking-widest">خلاصه سفارش</h4>
              <Row label="محصول" value={product?.name ?? "—"} />
              <Row label="تعداد" value={String(quantity)} />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="h-8 w-8 border border-onyx/20"
                >
                  −
                </button>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(50, q + 1))}
                  className="h-8 w-8 border border-onyx/20"
                >
                  +
                </button>
              </div>
              <Row
                label="وزن کل"
                value={`${((product?.weight_grams ?? 0) * quantity).toFixed(3)} گرم`}
              />
              <div className="flex justify-between border-t border-onyx/10 pt-3 font-serif text-lg">
                <span>مبلغ</span>
                <span>{fmt(totalProduct)} تومان</span>
              </div>
              <button
                type="submit"
                disabled={busy || !product}
                className="mt-2 w-full bg-onyx py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-parchment transition-all hover:bg-gold hover:text-onyx disabled:opacity-50"
              >
                {session ? (busy ? "در حال ثبت…" : "ثبت سفارش") : "ورود و ثبت سفارش"}
              </button>
              <p className="text-center text-[10px] uppercase tracking-widest text-gold">
                <Link to="/vault">مشاهده حساب طلای من</Link>
              </p>
            </aside>
          </form>
        )}

        {/* ========== داشبورد موجودی + نمودار + فروش + گوی ========== */}
        {mainTab === "dashboard" && (
          <div className="mt-10 space-y-10">
            {/* کارت‌های موجودی */}
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard label="موجودی طلا" value={`${fmtDec(holdingsGrams, 2)} گرم`} />
              <StatCard label="ارزش روز" value={`${fmt(holdingsValueToday)} تومان`} />
              <StatCard
                label="سود / زیان"
                value={`${holdingsProfit >= 0 ? "+" : ""}${fmt(holdingsProfit)} تومان`}
                sub={`${holdingsProfitPct >= 0 ? "+" : ""}${holdingsProfitPct.toFixed(1)}٪`}
                positive={holdingsProfit >= 0}
              />
            </div>

            {/* نمودار رشد سرمایه */}
            <div className="rounded-2xl border border-onyx/10 bg-white/70 p-6 sm:p-8">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h3 className="font-serif text-2xl">نمودار رشد سرمایه</h3>
                  <p className="mt-1 text-sm text-onyx/55">مثل اپلیکیشن‌های بورسی</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {(
                    [
                      ["1d", "۱ روز"],
                      ["1w", "۱ هفته"],
                      ["1m", "۱ ماه"],
                      ["3m", "۳ ماه"],
                      ["1y", "۱ سال"],
                      ["all", "همه"],
                    ] as const
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setChartRange(key)}
                      className={`rounded-full px-3 py-1.5 text-[11px] font-bold tracking-wide ${
                        chartRange === key
                          ? "bg-onyx text-parchment"
                          : "border border-onyx/15 hover:border-gold"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-4">
                <MiniStat label="ارزش خرید" value={fmt(MOCK_HOLDINGS.buyValue)} />
                <MiniStat label="ارزش امروز" value={fmt(holdingsValueToday)} />
                <MiniStat
                  label="سود"
                  value={`${holdingsProfit >= 0 ? "+" : ""}${fmt(holdingsProfit)}`}
                  accent={holdingsProfit >= 0 ? "text-emerald-600" : "text-red-600"}
                />
                <MiniStat
                  label="درصد رشد"
                  value={`${holdingsProfitPct >= 0 ? "+" : ""}${holdingsProfitPct.toFixed(1)}٪`}
                  accent={holdingsProfitPct >= 0 ? "text-emerald-600" : "text-red-600"}
                />
              </div>

              <div className="mt-8 h-48 w-full">
                <SimpleLineChart points={chartPoints} positive={holdingsProfit >= 0} />
              </div>
            </div>

            {/* خرید مجدد + فروش */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-onyx/10 bg-white/70 p-8">
                <h3 className="font-serif text-xl">خرید مجدد</h3>
                <p className="mt-2 text-sm text-onyx/55">با مبلغ دلخواه یا گوی آماده طلا بخرید.</p>
                <button
                  type="button"
                  onClick={() => setMainTab("amount")}
                  className="mt-6 w-full bg-onyx py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-parchment transition-all hover:bg-gold hover:text-onyx"
                >
                  خرید طلا
                </button>
              </div>

              <div className="rounded-2xl border border-onyx/10 bg-white/70 p-8">
                <h3 className="font-serif text-xl">فروش طلا</h3>
                <p className="mt-2 text-sm text-onyx/55">
                  موجودی: {fmtDec(holdingsGrams, 2)} گرم · ارزش ≈ {fmt(holdingsValueToday)} تومان
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[0.3, 1, 5, 10].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setSellGrams(g)}
                      className={`rounded-full border px-3 py-1.5 text-xs ${
                        sellGrams === g ? "border-gold bg-gold/10" : "border-onyx/15"
                      }`}
                    >
                      {g} گرم
                    </button>
                  ))}
                </div>
                <label className="mt-4 block">
                  <span className="text-[10px] uppercase tracking-widest text-onyx/60">مقدار (گرم)</span>
                  <input
                    type="number"
                    min={0.01}
                    max={holdingsGrams}
                    step={0.01}
                    value={sellGrams}
                    onChange={(e) => setSellGrams(Number(e.target.value) || 0)}
                    className="mt-1 w-full border-b border-onyx/20 bg-transparent py-2 text-lg outline-none focus:border-gold"
                  />
                </label>
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleSell(false)}
                    className="flex-1 border border-onyx/20 py-3 text-[11px] font-bold uppercase tracking-wider hover:border-gold"
                  >
                    فروش بخشی
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSell(true)}
                    className="flex-1 bg-onyx py-3 text-[11px] font-bold uppercase tracking-wider text-parchment hover:bg-gold hover:text-onyx"
                  >
                    فروش همه
                  </button>
                </div>
              </div>
            </div>

            {/* تبدیل به گوی */}
            <div className="rounded-2xl border border-onyx/10 bg-white/70 p-8">
              <h3 className="font-serif text-xl">تبدیل به گوی</h3>
              <p className="mt-2 text-sm text-onyx/55">
                شما {fmtDec(holdingsGrams, 2)} گرم طلا دارید. وزن گوی مورد نظر را انتخاب کنید.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {[5, 10, 20].map((w) => (
                  <button
                    key={w}
                    type="button"
                    disabled={w > holdingsGrams}
                    onClick={() => handleBallRequest(w)}
                    className={`rounded-xl border px-6 py-4 text-sm transition-all disabled:opacity-40 ${
                      ballRequest === w
                        ? "border-gold bg-gold/10"
                        : "border-onyx/15 hover:border-gold"
                    }`}
                  >
                    گوی {w} گرمی
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!ballRequest) {
                    toast.error("ابتدا وزن گوی را انتخاب کنید");
                    return;
                  }
                  toast.success("درخواست ساخت گوی ارسال شد.");
                }}
                className="mt-6 bg-onyx px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-parchment hover:bg-gold hover:text-onyx"
              >
                درخواست ساخت گوی
              </button>
            </div>

            {/* ارسال موجودی فیزیکی */}
            <div className="rounded-2xl border border-onyx/10 bg-white/70 p-8">
              <h3 className="font-serif text-xl">ارسال فیزیکی موجودی</h3>
              <p className="mt-2 text-sm text-onyx/55">
                پس از رسیدن موجودی به هر وزن دلخواه، می‌توانید درخواست ارسال دهید.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {(
                  [
                    ["post", "پست"],
                    ["tipax", "تیپاکس"],
                    ["courier", "پیک"],
                    ["pickup", "تحویل حضوری"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setShipMethod(key)}
                    className={`rounded-xl border p-4 text-sm ${
                      shipMethod === key ? "border-gold bg-gold/10" : "border-onyx/15 hover:border-gold"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => toast.success("درخواست ارسال ثبت شد (نسخه آزمایشی).")}
                className="mt-6 bg-onyx px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-parchment hover:bg-gold hover:text-onyx"
              >
                ارسال برای من
              </button>
            </div>
          </div>
        )}
      </section>
    </Shell>
  );
}

/* ——— کامپوننت‌های کمکی ——— */

function Tab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-5 py-3 text-[11px] font-bold uppercase tracking-[0.15em] transition-all ${
        active ? "bg-onyx text-parchment" : "border border-onyx/15 hover:border-gold"
      }`}
    >
      {children}
    </button>
  );
}

function DeliveryCards({
  delivery,
  setDelivery,
  shipMethod,
  setShipMethod,
}: {
  delivery: "vault" | "shipping";
  setDelivery: (d: "vault" | "shipping") => void;
  shipMethod: "post" | "tipax" | "courier" | "pickup";
  setShipMethod: (m: "post" | "tipax" | "courier" | "pickup") => void;
}) {
  return (
    <div className="rounded-2xl border border-onyx/10 bg-white/70 p-8">
      <h3 className="font-serif text-2xl">نحوه نگهداری</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setDelivery("shipping")}
          className={`rounded-2xl border p-6 text-right transition-all ${
            delivery === "shipping" ? "border-gold bg-white shadow-md" : "border-onyx/10 hover:border-gold/50"
          }`}
        >
          <p className="font-serif text-xl">ارسال فیزیکی</p>
          <p className="mt-2 text-xs leading-relaxed text-onyx/55">
            پس از رسیدن موجودی به هر وزنی برای شما ارسال می‌شود.
          </p>
          <span className="mt-4 inline-block text-[11px] font-bold uppercase tracking-wider text-gold">
            ارسال برای من
          </span>
        </button>

        <button
          type="button"
          onClick={() => setDelivery("vault")}
          className={`rounded-2xl border p-6 text-right transition-all ${
            delivery === "vault" ? "border-gold bg-white shadow-md" : "border-onyx/10 hover:border-gold/50"
          }`}
        >
          <p className="font-serif text-xl">خزانه امن</p>
          <p className="mt-2 text-xs leading-relaxed text-onyx/55">
            طلای شما در خزانه فروشگاه نگهداری می‌شود.
          </p>
          <ul className="mt-3 space-y-1 text-[11px] text-onyx/50">
            <li>✓ بیمه</li>
            <li>✓ امنیت</li>
            <li>✓ بدون هزینه نگهداری</li>
            <li>✓ امکان فروش فوری</li>
          </ul>
          <span className="mt-4 inline-block text-[11px] font-bold uppercase tracking-wider text-gold">
            نگهداری نزد فروشگاه
          </span>
        </button>
      </div>

      {delivery === "shipping" && (
        <div className="mt-6">
          <p className="text-[10px] uppercase tracking-widest text-onyx/60">روش ارسال</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-4">
            {(
              [
                ["post", "پست"],
                ["tipax", "تیپاکس"],
                ["courier", "پیک"],
                ["pickup", "تحویل حضوری"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setShipMethod(key)}
                className={`rounded-lg border py-3 text-xs ${
                  shipMethod === key ? "border-gold bg-gold/10" : "border-onyx/15"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="mt-4 space-y-3">
            <Field label="نام گیرنده" name="shipping_name" required />
            <Field label="شماره تماس" name="shipping_phone" required />
            <Field label="نشانی کامل" name="shipping_address" required />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="شهر" name="shipping_city" />
              <Field label="کد پستی" name="shipping_zip" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OrderAside({
  session,
  busy,
  rows,
  submitLabel,
}: {
  session: boolean;
  busy: boolean;
  rows: { label: string; value: string }[];
  submitLabel: string;
}) {
  return (
    <aside className="sticky top-28 h-fit space-y-4 rounded-2xl bg-secondary p-8">
      <h4 className="text-[11px] font-bold uppercase tracking-widest">خلاصه سفارش</h4>
      {rows.map((r) => (
        <Row key={r.label} label={r.label} value={r.value} />
      ))}
      <button
        type="submit"
        disabled={busy}
        className="mt-2 w-full bg-onyx py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-parchment transition-all hover:bg-gold hover:text-onyx disabled:opacity-50"
      >
        {submitLabel}
      </button>
      <p className="pt-2 text-center text-[10px] leading-relaxed text-onyx/45">
        پرداخت کارت‌به‌کارت/حواله؛ پس از تأیید، طلا به حساب شما اضافه می‌شود.
      </p>
      <p className="text-center text-[10px] uppercase tracking-widest text-gold">
        <Link to="/vault">مشاهده حساب طلای من</Link>
      </p>
    </aside>
  );
}

function StatCard({
  label,
  value,
  sub,
  positive,
}: {
  label: string;
  value: string;
  sub?: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-onyx/10 bg-white/70 p-6">
      <p className="text-[10px] uppercase tracking-widest text-onyx/50">{label}</p>
      <p className="mt-2 font-serif text-2xl">{value}</p>
      {sub && (
        <p
          className={`mt-1 text-sm font-medium ${
            positive === undefined ? "text-onyx/50" : positive ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

function MiniStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-onyx/45">{label}</p>
      <p className={`mt-1 text-sm font-semibold ${accent ?? ""}`}>{value}</p>
    </div>
  );
}

/** نمودار خطی ساده با SVG (بدون وابستگی خارجی) */
function SimpleLineChart({ points, positive }: { points: number[]; positive: boolean }) {
  if (points.length < 2) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const w = 600;
  const h = 160;
  const pad = 8;
  const coords = points.map((p, i) => {
    const x = pad + (i / (points.length - 1)) * (w - pad * 2);
    const y = pad + (1 - (p - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  });
  const line = coords.join(" ");
  const area = `${pad},${h - pad} ${line} ${w - pad},${h - pad}`;
  const stroke = positive ? "#059669" : "#dc2626";
  const fill = positive ? "rgba(5,150,105,0.12)" : "rgba(220,38,38,0.12)";

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" preserveAspectRatio="none">
      <polygon points={area} fill={fill} />
      <polyline points={line} fill="none" stroke={stroke} strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest text-onyx/60">{label}</span>
      <input
        {...rest}
        className="mt-1 w-full border-b border-onyx/20 bg-transparent py-2 text-sm outline-none focus:border-gold"
      />
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-onyx/55">{label}</span>
      <span>{value}</span>
    </div>
  );
}