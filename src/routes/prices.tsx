import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Shell } from "@/components/site/Chrome";
import { useI18n } from "@/lib/i18n/context";
import { formatTomanLocalized } from "@/lib/i18n/helpers";
import { useLiveGold } from "@/lib/live-gold";
import type { MarketItem, MarketSnapshot } from "@/lib/market-prices";
import { getHistory, type PriceHistorySymbol } from "@/lib/price-history";

type MarketKey = "gold18k" | "gold24k" | "silver" | "usd" | "emami" | "half" | "quarter";

const MARKET_CONFIG: { key: MarketKey; snapshotKey: keyof MarketSnapshot; historySymbol: PriceHistorySymbol }[] = [
  { key: "gold18k", snapshotKey: "gold18k", historySymbol: "gold18k" },
  { key: "gold24k", snapshotKey: "gold24k", historySymbol: "gold24k" },
  { key: "silver", snapshotKey: "silver", historySymbol: "silver" },
  { key: "usd", snapshotKey: "dollar", historySymbol: "dollar" },
  { key: "emami", snapshotKey: "emamiCoin", historySymbol: "emamiCoin" },
  { key: "half", snapshotKey: "halfCoin", historySymbol: "halfCoin" },
  { key: "quarter", snapshotKey: "quarterCoin", historySymbol: "quarterCoin" },
];

export const Route = createFileRoute("/prices")({
  component: Prices,
  head: () => ({ meta: [{ title: "Market Prices | Aghli Gold" }] }),
});

function formatTime(value: string | null | undefined, locale: string) {
  if (!value) return "--";
  const asDate = new Date(value);
  if (Number.isNaN(asDate.getTime())) return value;
  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(asDate);
}

function ChangeBadge({ value, locale }: { value?: number; locale: string }) {
  if (value === undefined || Number.isNaN(value)) {
    return <span className="text-xs text-onyx/40">--</span>;
  }
  const positive = value >= 0;
  const formatted = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US", {
    maximumFractionDigits: 2,
    signDisplay: "always",
  }).format(value);
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        positive ? "bg-emerald-600/10 text-emerald-700" : "bg-red-600/10 text-red-700"
      }`}
    >
      {formatted}٪
    </span>
  );
}

function MarketCard({
  marketKey,
  item,
  historySymbol,
  loading,
  locale,
}: {
  marketKey: MarketKey;
  item?: MarketItem;
  historySymbol: PriceHistorySymbol;
  loading: boolean;
  locale: string;
}) {
  const { t } = useI18n();
  const fmt = (n: number) => formatTomanLocalized(n, locale as "fa" | "en");

  const series = useMemo(() => {
    const points = getHistory(historySymbol);
    return points.map((point) => ({
      time: point.t,
      price: point.price,
      label: new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(point.t)),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historySymbol, item?.price, locale]);

  return (
    <article className="border border-onyx/10 bg-white/60 p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-xl">{t(`prices.markets.${marketKey}`)}</h3>
          <p className="mt-1 text-[11px] uppercase tracking-widest text-onyx/40">
            {t("prices.updatedAt")}: {formatTime(item?.time ?? null, locale)}
          </p>
        </div>
        <ChangeBadge value={item?.changePercent} locale={locale} />
      </div>

      <p className="mt-4 font-serif text-3xl text-gold">
        {loading && !item ? t("prices.loading") : item ? fmt(item.price) : "--"}
      </p>

      <div className="mt-6 h-32">
        {series.length > 1 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${marketKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c8a24a" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#c8a24a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" hide />
              <YAxis hide domain={["auto", "auto"]} />
              <Tooltip
                formatter={(value: number) => [fmt(value), t(`prices.markets.${marketKey}`)]}
                labelFormatter={() => ""}
                contentStyle={{ fontSize: 12, borderRadius: 4 }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#c8a24a"
                strokeWidth={2}
                fill={`url(#gradient-${marketKey})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-onyx/40">
            {t("prices.chartEmpty")}
          </div>
        )}
      </div>
      <p className="mt-3 text-[11px] text-onyx/45">{t("prices.chartCaption")}</p>
    </article>
  );
}

function Prices() {
  const { t, locale } = useI18n();
  const { snapshot, loading, error, isLive, refresh } = useLiveGold();

  return (
    <Shell>
      <section className="max-w-7xl mx-auto px-6 py-16">
        <p className="text-[11px] uppercase tracking-[.32em] text-gold">{t("prices.eyebrow")}</p>
        <h1 className="mt-4 font-serif text-5xl">{t("prices.title")}</h1>
        <p className="mt-5 max-w-2xl text-onyx/65">{t("prices.intro")}</p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
              isLive ? "bg-emerald-600/10 text-emerald-700" : "bg-onyx/10 text-onyx/60"
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${isLive ? "bg-emerald-600" : "bg-onyx/40"}`} />
            {isLive ? t("prices.liveOn") : t("prices.liveOff")}
          </span>
          <button
            type="button"
            onClick={() => refresh()}
            className="text-xs font-medium uppercase tracking-widest text-onyx/60 hover:text-gold"
          >
            {t("prices.refresh")}
          </button>
        </div>

        {error && (
          <div className="mt-6 border border-red-600/20 bg-red-600/5 p-4 text-sm text-red-700">
            {t("prices.errorMessage")}
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MARKET_CONFIG.map((config) => (
            <MarketCard
              key={config.key}
              marketKey={config.key}
              item={snapshot?.[config.snapshotKey] as MarketItem | undefined}
              historySymbol={config.historySymbol}
              loading={loading}
              locale={locale}
            />
          ))}
        </div>

        <p className="mt-8 text-xs text-onyx/50">{t("prices.disclaimer")}</p>

        <Link
          to="/contact"
          className="mt-8 inline-block bg-onyx px-7 py-4 text-[10px] font-bold uppercase tracking-widest text-parchment hover:bg-gold hover:text-onyx"
        >
          {t("prices.cta")}
        </Link>
      </section>
    </Shell>
  );
}
