import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/site/Chrome";
import { useI18n } from "@/lib/i18n/context";
import { formatTomanLocalized } from "@/lib/i18n/helpers";

type MarketRow = {
  key: "gold18k" | "gold24k" | "silver" | "emami" | "half" | "quarter" | "usd";
  current: number;
  history: number[];
};

const markets: MarketRow[] = [
  { key: "gold18k", current: 3_452_000, history: [3_415_000, 3_438_000, 3_452_000, 3_426_000, 3_452_000] },
  { key: "gold24k", current: 4_602_000, history: [4_550_000, 4_578_000, 4_602_000, 4_566_000, 4_602_000] },
  { key: "silver", current: 74_000, history: [71_500, 72_300, 73_100, 72_700, 74_000] },
  { key: "emami", current: 41_200_000, history: [40_400_000, 40_850_000, 41_000_000, 40_700_000, 41_200_000] },
  { key: "half", current: 22_100_000, history: [21_700_000, 21_850_000, 22_000_000, 21_800_000, 22_100_000] },
  { key: "quarter", current: 13_100_000, history: [12_850_000, 12_920_000, 13_000_000, 12_900_000, 13_100_000] },
  { key: "usd", current: 93_500, history: [91_800, 92_200, 92_900, 92_400, 93_500] },
];

export const Route = createFileRoute("/prices")({
  component: Prices,
  head: () => ({ meta: [{ title: "Market Prices | Aghli Gold" }] }),
});

function Prices() {
  const { t, locale } = useI18n();
  const fmt = (n: number) => formatTomanLocalized(n, locale);

  return (
    <Shell>
      <section className="max-w-7xl mx-auto px-6 py-16">
        <p className="text-[11px] uppercase tracking-[.32em] text-gold">{t("prices.eyebrow")}</p>
        <h1 className="mt-4 font-serif text-5xl">{t("prices.title")}</h1>
        <p className="mt-5 max-w-2xl text-onyx/65">{t("prices.intro")}</p>

        <div className="mt-12 overflow-x-auto border border-onyx/10">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-onyx text-parchment text-[10px] uppercase tracking-widest">
              <tr>
                <th className="p-5">{t("prices.tableMarket")}</th>
                <th className="p-5">{t("prices.tableCurrent")}</th>
                <th className="p-5">{t("prices.tableHistory", { n: 1 })}</th>
                <th className="p-5">{t("prices.tableHistory", { n: 2 })}</th>
                <th className="p-5">{t("prices.tableHistory", { n: 3 })}</th>
                <th className="p-5">{t("prices.tableHistory", { n: 4 })}</th>
                <th className="p-5">{t("prices.tableLatest")}</th>
              </tr>
            </thead>
            <tbody>
              {markets.map((row) => (
                <tr key={row.key} className="border-t border-onyx/10">
                  <td className="p-5 font-serif text-lg">{t(`prices.markets.${row.key}`)}</td>
                  <td className="p-5 font-medium text-gold">{fmt(row.current)}</td>
                  {row.history.map((item, index) => (
                    <td key={index} className="p-5 text-sm text-onyx/65">
                      {fmt(item)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-5 text-xs text-onyx/50">{t("prices.disclaimer")}</p>

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
