const MARKET_URL = "https://api.brsapi.ir/Market/Gold_Currency.php?key=BfKuD79S2KxCDekqGNPqLVdNERfv75p4";

export type MarketItem = {
  symbol: string;
  name: string;
  price: number;
  changePercent?: number;
  unit?: string;
  time?: string;
};

export type MarketSnapshot = {
  gold18k?: MarketItem;
  gold24k?: MarketItem;
  silver?: MarketItem;
  dollar?: MarketItem;
  emamiCoin?: MarketItem;
  halfCoin?: MarketItem;
  quarterCoin?: MarketItem;
  items: MarketItem[];
  updatedAt?: string;
};

function toNumber(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value.replace(/,/g, ""));
  return NaN;
}

function normalize(item: Record<string, unknown>): MarketItem {
  return {
    symbol: String(item.symbol ?? ""),
    name: String(item.name_en ?? item.name ?? item.symbol ?? ""),
    price: toNumber(item.price),
    changePercent: typeof item.change_percent === "number" ? item.change_percent : undefined,
    unit: typeof item.unit === "string" ? item.unit : undefined,
    time: typeof item.time === "string" ? item.time : undefined,
  };
}

export async function fetchMarketSnapshot(signal?: AbortSignal): Promise<MarketSnapshot> {
  const response = await fetch(MARKET_URL, { signal });
  if (!response.ok) {
    throw new Error(`Market API request failed: ${response.status}`);
  }

  const payload = (await response.json()) as Record<string, unknown>;
  const gold = Array.isArray(payload.gold) ? payload.gold.map((item) => normalize(item as Record<string, unknown>)) : [];
  const currency = Array.isArray(payload.currency) ? payload.currency.map((item) => normalize(item as Record<string, unknown>)) : [];
  const silver = Array.isArray(payload.silver) ? payload.silver.map((item) => normalize(item as Record<string, unknown>)) : [];
  const coins = Array.isArray(payload.coin) ? payload.coin.map((item) => normalize(item as Record<string, unknown>)) : [];

  const lookup = (symbol: string) => [...gold, ...currency, ...silver, ...coins].find((item) => item.symbol === symbol);

  return {
    gold18k: lookup("IR_GOLD_18K"),
    gold24k: lookup("IR_GOLD_24K") ?? lookup("IR_GOLD_24K_GOLD"),
    silver: lookup("IR_SILVER_999"),
    dollar: lookup("USD") ?? lookup("USDT"),
    emamiCoin: lookup("SEKEH_EMAMI") ?? lookup("EMAMI"),
    halfCoin: lookup("SEKEH_NIM"),
    quarterCoin: lookup("SEKEH_RUB"),
    items: [
      ...gold.slice(0, 4),
      ...currency.filter((item) => ["USD", "USDT"].includes(item.symbol)).slice(0, 2),
      ...coins.slice(0, 3),
    ],
    updatedAt: gold[0]?.time ? `${gold[0].time}` : undefined,
  };
}

export function formatMarketPrice(item?: MarketItem) {
  if (!item || Number.isNaN(item.price)) return "--";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(item.price));
}