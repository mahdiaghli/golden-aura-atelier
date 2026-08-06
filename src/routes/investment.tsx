import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/site/Chrome";
import { useLiveGold } from "@/lib/live-gold";
import { createGoldOrder, goldHoldings, type GoldOrder } from "@/lib/requests";
import { getSessionUser } from "@/lib/auth";
import { useI18n } from "@/lib/i18n/context";

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

const GOLD_BALLS = [
  { id: "g-0.5", weight_grams: 0.5, karat: "24K", premium_pct: 3, image_url: null as string | null },
  { id: "g-1", weight_grams: 1, karat: "24K", premium_pct: 2.5, image_url: null },
  { id: "g-2.5", weight_grams: 2.5, karat: "24K", premium_pct: 2, image_url: null },
  { id: "g-5", weight_grams: 5, karat: "24K", premium_pct: 1.8, image_url: null },
];

const AMOUNT_PRESETS = [1_000_000, 2_000_000, 5_000_000, 10_000_000, 25_000_000, 50_000_000];

type ChartRange = "1d" | "1w" | "1m" | "3m" | "1y" | "all";

function CatalogPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { rate18, rate24, isLive } = useLiveGold();
  const [session, setSession] = useState<{ id: string } | null>(null);
  const [orders, setOrders] = useState<GoldOrder[]>([]);

  const refresh = () => setOrders(goldHoldings().orders);

  useEffect(() => {
    const user = getSessionUser();
    setSession(user ? { id: user.email } : null);
    refresh();
  }, []);

  const [mainTab, setMainTab] = useState<"product" | "amount" | "dashboard">("amount");
  const [selected, setSelected] = useState<string | null>(GOLD_BALLS[0]?.id ?? null);
  const [quantity, setQuantity] = useState(1);
  const [amount, setAmount] = useState(5_000_000);
  const [delivery, setDelivery] = useState<"vault" | "shipping">("vault");
  const [shipMethod, setShipMethod] = useState<"post" | "tipax" | "courier" | "pickup">("post");
  const [busy, setBusy] = useState(false);
  const [chartRange, setChartRange] = useState<ChartRange>("1m");
  const [sellGrams, setSellGrams] = useState(1);
  const [ballRequest, setBallRequest] = useState<number | null>(null);

  const products = GOLD_BALLS;
  const product = products.find((p) => p.id === selected) ?? products[0] ?? null;
  const productName = (p: (typeof products)[number]) => t("investment.ballName", { weight: p.weight_grams });

  const totalProduct = product
    ? product.weight_grams * quantity * rate24 * (1 + Number(product.premium_pct) / 100)
    : 0;

  const gramsForAmount24 = rate24 > 0 ? amount / rate24 : 0;
  const gramsForAmount18 = rate18 > 0 ? amount / rate18 : 0;

  const holdings = useMemo(() => {
    let grams = 0;
    let buyValue = 0;
    orders.forEach((order) => {
      if (order.kind === "amount" || order.kind === "product") {
        grams += order.grams;
        buyValue += order.amount;
      }
      if (order.kind === "sell") {
        grams -= order.grams;
        buyValue -= order.amount;
      }
    });
    return { grams: Math.max(0, grams), buyValue: Math.max(0, buyValue) };
  }, [orders]);

  const holdingsGrams = holdings.grams;
  const holdingsValueToday = holdingsGrams * rate24;
  const holdingsProfit = holdingsValueToday - holdings.buyValue;
  const holdingsProfitPct =
    holdings.buyValue > 0 ? (holdingsProfit / holdings.buyValue) * 100 : 0;

  const chartPoints = useMemo(() => {
    const base = holdings.buyValue || holdingsValueToday;
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
      const noise = Math.sin(i * 1.7) * 0.012 + Math.cos(i * 0.9) * 0.008;
      pts.push(base + (end - base) * t * (1 + noise));
    }
    pts[pts.length - 1] = end;
    return pts;
  }, [chartRange, holdingsValueToday, holdings.buyValue]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session) {
      toast.error(t("investment.toastLoginRequired"));
      navigate({ to: "/login" });
      return;
    }
    setBusy(true);
    try {
      if (mainTab === "amount") {
        if (amount <= 0) throw new Error(t("investment.toastInvalidAmount"));
        createGoldOrder({
          kind: "amount",
          grams: Number(gramsForAmount24.toFixed(4)),
          amount,
          rate: rate24,
          delivery,
          shipMethod: delivery === "shipping" ? shipMethod : undefined,
        });
        toast.success(t("investment.toastAmountOrderSuccess", { grams: fmtDec(gramsForAmount24, 4) }));
      } else {
        if (!product) throw new Error(t("investment.toastNoProductSelected"));
        createGoldOrder({
          kind: "product",
          grams: product.weight_grams * quantity,
          amount: Math.round(totalProduct),
          rate: rate24,
          productName: productName(product),
          quantity,
          delivery,
          shipMethod: delivery === "shipping" ? shipMethod : undefined,
        });
        toast.success(t("investment.toastBallOrderSuccess"));
      }
      refresh();
      setMainTab("dashboard");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("investment.toastOrderFailed"));
    } finally {
      setBusy(false);
    }
  };

  const handleSell = (all: boolean) => {
    const g = all ? holdingsGrams : Math.min(sellGrams, holdingsGrams);
    if (g <= 0) {
      toast.error(t("investment.toastInvalidSellAmount"));
      return;
    }
    createGoldOrder({ kind: "sell", grams: Number(g.toFixed(4)), amount: Math.round(g * rate24), rate: rate24 });
    refresh();
    toast.success(t("investment.toastSellSuccess", { grams: fmtDec(g, 3) }));
  };

  const handleBallRequest = (w: number) => {
    if (w > holdingsGrams) {
      toast.error(t("investment.toastInsufficientBalance"));
      return;
    }
    setBallRequest(w);
    createGoldOrder({ kind: "ball", grams: w, amount: Math.round(w * rate24), rate: rate24 });
    refresh();
    toast.success(t("investment.toastBallRequestSuccess", { weight: w }));
  };

  return (
    <Shell>
      {/* Hero */}
      <section className="border-b border-onyx/10 bg-gradient-to-b from-white/70 to-transparent">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <span className="text-[11px] uppercase tracking-[0.3em] text-gold">{t("investment.heroEyebrow")}</span>
          <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
            {t("investment.heroTitle")}
          </h1>
          <p className="mt-4 max-w-2xl font-light text-onyx/65">
            {t("investment.heroBody")}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/70 px-5 py-2.5 text-sm">
              <span className="text-onyx/50">{t("investment.karat24Label")}</span>
              <strong className="text-gold">{fmt(rate24)} {t("investment.tomanUnit")}</strong>
              <span className="text-[10px] text-onyx/40">{isLive ? t("investment.liveLabel") : t("investment.loadingLabel")}</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-onyx/15 bg-white/50 px-5 py-2.5 text-sm">
              <span className="text-onyx/50">{t("investment.karat18Label")}</span>
              <strong>{fmt(rate18)} {t("investment.tomanUnit")}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        {/* Main tabs */}
        <div className="flex flex-wrap gap-2">
          <Tab active={mainTab === "amount"} onClick={() => setMainTab("amount")}>
            {t("investment.tabAmount")}
          </Tab>
          <Tab active={mainTab === "product"} onClick={() => setMainTab("product")}>
            {t("investment.tabProduct")}
          </Tab>
          <Tab active={mainTab === "dashboard"} onClick={() => setMainTab("dashboard")}>
            {t("investment.tabDashboard")}
          </Tab>
        </div>

        {/* ========== Amount tab ========== */}
        {mainTab === "amount" && (
          <form onSubmit={submit} className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
            <div className="space-y-8">
              <div className="rounded-2xl border border-onyx/10 bg-white/70 p-8">
                <label className="block">
                  <span className="text-[10px] uppercase tracking-widest text-onyx/60">
                    {t("investment.amountFieldLabel")}
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

                <div className="mt-8 rounded-xl border border-gold/30 bg-gradient-to-l from-gold/10 to-transparent p-6">
                  <p className="text-[11px] uppercase tracking-widest text-onyx/50">{t("investment.ownershipLabel")}</p>
                  <p className="mt-2 font-serif text-3xl text-gold">
                    {fmtDec(gramsForAmount24, 4)} <span className="text-lg">{t("investment.gramUnit")}</span>
                  </p>
                  <p className="mt-1 text-sm text-onyx/60">
                    {t("investment.equivalentPrefix")}{" "}
                    <strong>{fmtDec(gramsForAmount18, 3)} {t("investment.equivalent18Suffix")}</strong>
                  </p>
                </div>
              </div>

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
                { label: t("investment.amountRowLabel"), value: `${fmt(amount)} ${t("investment.tomanUnit")}` },
                { label: t("investment.goldRegisteredLabel"), value: `${fmtDec(gramsForAmount24, 4)} ${t("investment.gramUnit")} 24K` },
                { label: t("investment.custodyRowLabel"), value: delivery === "vault" ? t("investment.custodyVault") : t("investment.custodyShipping") },
              ]}
              submitLabel={session ? (busy ? t("investment.submitInvestBusy") : t("investment.submitInvest")) : t("investment.loginInvest")}
            />
          </form>
        )}

        {/* ========== Product tab ========== */}
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
                      <p className="font-serif text-xl">{productName(item)}</p>
                      <p className="mt-1 text-[11px] uppercase tracking-widest text-onyx/45">
                        {t("investment.weightKaratFee", { weight: item.weight_grams, karat: item.karat, fee: item.premium_pct })}
                      </p>
                      <p className="mt-3 text-sm text-gold">{fmt(price)} {t("investment.tomanUnit")}</p>
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
              <h4 className="text-[11px] font-bold uppercase tracking-widest">{t("investment.orderSummaryTitle")}</h4>
              <Row label={t("investment.productRowLabel")} value={product ? productName(product) : "—"} />
              <Row label={t("investment.quantityRowLabel")} value={String(quantity)} />
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
                label={t("investment.totalWeightRowLabel")}
                value={`${((product?.weight_grams ?? 0) * quantity).toFixed(3)} ${t("investment.gramUnit")}`}
              />
              <div className="flex justify-between border-t border-onyx/10 pt-3 font-serif text-lg">
                <span>{t("investment.amountRowLabel")}</span>
                <span>{fmt(totalProduct)} {t("investment.tomanUnit")}</span>
              </div>
              <button
                type="submit"
                disabled={busy || !product}
                className="mt-2 w-full bg-onyx py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-parchment transition-all hover:bg-gold hover:text-onyx disabled:opacity-50"
              >
                {session ? (busy ? t("investment.submitOrderBusy") : t("investment.submitOrder")) : t("investment.loginOrder")}
              </button>
              <p className="text-center text-[10px] uppercase tracking-widest text-gold">
                <Link to="/vault">{t("investment.viewMyGoldAccount")}</Link>
              </p>
            </aside>
          </form>
        )}

        {/* ========== Dashboard tab ========== */}
        {mainTab === "dashboard" && (
          <div className="mt-10 space-y-10">
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard label={t("investment.statGoldBalance")} value={`${fmtDec(holdingsGrams, 2)} ${t("investment.gramUnit")}`} />
              <StatCard label={t("investment.statValueToday")} value={`${fmt(holdingsValueToday)} ${t("investment.tomanUnit")}`} />
              <StatCard
                label={t("investment.statProfitLoss")}
                value={`${holdingsProfit >= 0 ? "+" : ""}${fmt(holdingsProfit)} ${t("investment.tomanUnit")}`}
                sub={`${holdingsProfitPct >= 0 ? "+" : ""}${holdingsProfitPct.toFixed(1)}٪`}
                positive={holdingsProfit >= 0}
              />
            </div>

            <div className="rounded-2xl border border-onyx/10 bg-white/70 p-6 sm:p-8">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h3 className="font-serif text-2xl">{t("investment.chartTitle")}</h3>
                  <p className="mt-1 text-sm text-onyx/55">{t("investment.chartSubtitle")}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {(
                    [
                      ["1d", t("investment.range1d")],
                      ["1w", t("investment.range1w")],
                      ["1m", t("investment.range1m")],
                      ["3m", t("investment.range3m")],
                      ["1y", t("investment.range1y")],
                      ["all", t("investment.rangeAll")],
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
                <MiniStat label={t("investment.miniBuyValue")} value={fmt(holdings.buyValue)} />
                <MiniStat label={t("investment.miniValueToday")} value={fmt(holdingsValueToday)} />
                <MiniStat
                  label={t("investment.miniProfit")}
                  value={`${holdingsProfit >= 0 ? "+" : ""}${fmt(holdingsProfit)}`}
                  accent={holdingsProfit >= 0 ? "text-emerald-600" : "text-red-600"}
                />
                <MiniStat
                  label={t("investment.miniGrowthPct")}
                  value={`${holdingsProfitPct >= 0 ? "+" : ""}${holdingsProfitPct.toFixed(1)}٪`}
                  accent={holdingsProfitPct >= 0 ? "text-emerald-600" : "text-red-600"}
                />
              </div>

              <div className="mt-8 h-48 w-full">
                <SimpleLineChart points={chartPoints} positive={holdingsProfit >= 0} />
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-onyx/10 bg-white/70 p-8">
                <h3 className="font-serif text-xl">{t("investment.rebuyTitle")}</h3>
                <p className="mt-2 text-sm text-onyx/55">{t("investment.rebuyBody")}</p>
                <button
                  type="button"
                  onClick={() => setMainTab("amount")}
                  className="mt-6 w-full bg-onyx py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-parchment transition-all hover:bg-gold hover:text-onyx"
                >
                  {t("investment.rebuyButton")}
                </button>
              </div>

              <div className="rounded-2xl border border-onyx/10 bg-white/70 p-8">
                <h3 className="font-serif text-xl">{t("investment.sellTitle")}</h3>
                <p className="mt-2 text-sm text-onyx/55">
                  {t("investment.sellBalance", { grams: fmtDec(holdingsGrams, 2), value: fmt(holdingsValueToday) })}
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
                      {t("investment.gramShort", { n: g })}
                    </button>
                  ))}
                </div>
                <label className="mt-4 block">
                  <span className="text-[10px] uppercase tracking-widest text-onyx/60">{t("investment.sellAmountLabel")}</span>
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
                    {t("investment.sellPartial")}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSell(true)}
                    className="flex-1 bg-onyx py-3 text-[11px] font-bold uppercase tracking-wider text-parchment hover:bg-gold hover:text-onyx"
                  >
                    {t("investment.sellAll")}
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-onyx/10 bg-white/70 p-8">
              <h3 className="font-serif text-xl">{t("investment.convertTitle")}</h3>
              <p className="mt-2 text-sm text-onyx/55">
                {t("investment.convertBody", { grams: fmtDec(holdingsGrams, 2) })}
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
                    {t("investment.ballOption", { weight: w })}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!ballRequest) {
                    toast.error(t("investment.toastSelectBallFirst"));
                    return;
                  }
                  toast.success(t("investment.toastBallOrderSent"));
                }}
                className="mt-6 bg-onyx px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-parchment hover:bg-gold hover:text-onyx"
              >
                {t("investment.requestBall")}
              </button>
            </div>

            <div className="rounded-2xl border border-onyx/10 bg-white/70 p-8">
              <h3 className="font-serif text-xl">{t("investment.shipTitle")}</h3>
              <p className="mt-2 text-sm text-onyx/55">
                {t("investment.shipBody")}
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {(
                  [
                    ["post", t("investment.shipPost")],
                    ["tipax", t("investment.shipTipax")],
                    ["courier", t("investment.shipCourier")],
                    ["pickup", t("investment.shipPickup")],
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
                onClick={() => toast.success(t("investment.toastShippingRequestSent"))}
                className="mt-6 bg-onyx px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-parchment hover:bg-gold hover:text-onyx"
              >
                {t("investment.sendForMe")}
              </button>
            </div>
          </div>
        )}
      </section>
    </Shell>
  );
}

/* ——— Helper components ——— */

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
  const { t } = useI18n();
  return (
    <div className="rounded-2xl border border-onyx/10 bg-white/70 p-8">
      <h3 className="font-serif text-2xl">{t("investment.deliveryTitle")}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setDelivery("shipping")}
          className={`rounded-2xl border p-6 text-right transition-all ${
            delivery === "shipping" ? "border-gold bg-white shadow-md" : "border-onyx/10 hover:border-gold/50"
          }`}
        >
          <p className="font-serif text-xl">{t("investment.deliveryPhysicalTitle")}</p>
          <p className="mt-2 text-xs leading-relaxed text-onyx/55">
            {t("investment.deliveryPhysicalBody")}
          </p>
          <span className="mt-4 inline-block text-[11px] font-bold uppercase tracking-wider text-gold">
            {t("investment.deliverySendForMeLabel")}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setDelivery("vault")}
          className={`rounded-2xl border p-6 text-right transition-all ${
            delivery === "vault" ? "border-gold bg-white shadow-md" : "border-onyx/10 hover:border-gold/50"
          }`}
        >
          <p className="font-serif text-xl">{t("investment.deliveryVaultTitle")}</p>
          <p className="mt-2 text-xs leading-relaxed text-onyx/55">
            {t("investment.deliveryVaultBody")}
          </p>
          <ul className="mt-3 space-y-1 text-[11px] text-onyx/50">
            <li>✓ {t("investment.deliveryVaultBullet1")}</li>
            <li>✓ {t("investment.deliveryVaultBullet2")}</li>
            <li>✓ {t("investment.deliveryVaultBullet3")}</li>
            <li>✓ {t("investment.deliveryVaultBullet4")}</li>
          </ul>
          <span className="mt-4 inline-block text-[11px] font-bold uppercase tracking-wider text-gold">
            {t("investment.deliveryKeepAtStoreLabel")}
          </span>
        </button>
      </div>

      {delivery === "shipping" && (
        <div className="mt-6">
          <p className="text-[10px] uppercase tracking-widest text-onyx/60">{t("investment.shippingMethodLabel")}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-4">
            {(
              [
                ["post", t("investment.shipPost")],
                ["tipax", t("investment.shipTipax")],
                ["courier", t("investment.shipCourier")],
                ["pickup", t("investment.shipPickup")],
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
            <Field label={t("investment.fieldRecipientName")} name="shipping_name" required />
            <Field label={t("investment.fieldRecipientPhone")} name="shipping_phone" required />
            <Field label={t("investment.fieldFullAddress")} name="shipping_address" required />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label={t("investment.fieldCity")} name="shipping_city" />
              <Field label={t("investment.fieldPostalCode")} name="shipping_zip" />
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
  const { t } = useI18n();
  return (
    <aside className="sticky top-28 h-fit space-y-4 rounded-2xl bg-secondary p-8">
      <h4 className="text-[11px] font-bold uppercase tracking-widest">{t("investment.orderSummaryTitle")}</h4>
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
        {t("investment.paymentNote")}
      </p>
      <p className="text-center text-[10px] uppercase tracking-widest text-gold">
        <Link to="/vault">{t("investment.viewMyGoldAccount")}</Link>
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

/** Simple SVG line chart (no external dependency) */
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
