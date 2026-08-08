import catalog from "@/data/catalog.json";
import imageMap from "@/data/product-image-map.json";
import rawCoins from "../../coins.json";

export type Karat = "18K" | "21K" | "22K" | "24K";
export type Category = "rings" | "necklaces" | "bracelets" | "earrings" | "sets" | "bullion";
export type GoldColor = "yellow" | "white" | "rose" | "two-tone" | "three-tone";
export type GemstoneType = "none" | "diamond" | "emerald" | "ruby" | "pearl";
export type ProductStyle = "classic" | "minimal" | "modern" | "luxury" | "vintage";
export type Occasion = "everyday" | "engagement" | "wedding" | "party" | "gift" | "investment";

export type Product = {
  id: string;
  name: string;
  category: Category;
  karat: Karat;
  weight: number;
  makingPct: number;
  gender: "women" | "men" | "children" | "unisex";
  gemstone?: string;
  gemstoneType?: GemstoneType;
  color?: GoldColor;
  style?: ProductStyle;
  occasion?: Occasion;
  image: string;
  gallery: string[];
  description: string;
  sku: string;
  onSale?: boolean;
  discount?: number;
  freeShipping?: boolean;
  customizable?: boolean;
  sizeAdjustable?: boolean;
  expressDelivery?: boolean;
  madeToOrder?: boolean;
  inStock?: boolean;
  warranty?: string;
  insurance?: boolean;
  returnable?: boolean;
  rating?: number;
  reviews?: number;
  bestseller?: boolean;
  newest?: boolean;
  mostSold?: boolean;
  aiRecommended?: boolean;
  code?: string;
  typeLabel?: string;
  size?: string;
  imageName?: string;
  kids?: boolean;
  letters?: boolean;
  chainModel?: string;
  birthMonth?: string;
};

export const GOLD_RATE_PER_GRAM: Record<Karat, number> = {
  "18K": 3_452_000,
  "21K": 4_020_000,
  "22K": 4_215_000,
  "24K": 4_602_000,
};
/** سود فروشنده ۷٪ روی ارزش طلا + اجرت */
export const SELLER_PROFIT_PCT = 0.07;
/** مالیات ۲٪ روی مجموع (طلا + اجرت + سود) */
export const TAX_PCT = 0.02;

export function priceBreakdown(p: Product) {
  const gold = p.weight * GOLD_RATE_PER_GRAM[p.karat];
  const making = gold * p.makingPct;
  const subtotal = gold + making;
  const profit = subtotal * SELLER_PROFIT_PCT;
  const tax = (subtotal + profit) * TAX_PCT;
  const total = subtotal + profit + tax;
  return { gold, making, profit, tax, total };
}

export function formatToman(n: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(n)) + " T";
}

export function allowsMultipleQuantities(product: Product): boolean {
  if (product.category === "bracelets" || product.category === "bullion") {
    return true;
  }

  const haystack = `${product.name} ${product.typeLabel ?? ""} ${product.sku}`.toLowerCase();
  return (
    haystack.includes("coin") ||
    haystack.includes("bar") ||
    haystack.includes("bullion") ||
    haystack.includes("ball") ||
    haystack.includes("شمش") ||
    haystack.includes("سکه") ||
    haystack.includes("پارسیان") ||
    haystack.includes("گوی طلا")
  );
}


type CatalogRow = {
  id: string;
  name: string;
  category: Category;
  karat: Karat;
  weight: number;
  makingPct: number;
  gender: Product["gender"];
  color: GoldColor;
  code: string;
  typeLabel: string;
  size?: string;
  imageName?: string;
};

type CoinRow = {
  "کد": string;
  "وزن": string;
  "نوع": string;
  "عکس محصول": string | null;
};

export const PRODUCT_IMAGE_DIR = "/product-images";

/**
 * آدرس عکس محصول را برمی‌گرداند.
 * اولویت:
 * 1. مپ CDN (product-image-map.json)
 * 2. فایل محلی در public/product-images/
 * 3. null (تا در کامپوننت placeholder نشان داده شود)
 */
export function productImageUrl(imageName?: string): string | null {
  if (!imageName || imageName === "nopicture.png" || imageName.trim() === "") {
    return null;
  }

  // اگر در مپ CDN وجود داشت
  const mapped = (imageMap as Record<string, string>)[imageName];
  if (mapped) return mapped;

  // فایل محلی
  return `${PRODUCT_IMAGE_DIR}/${imageName}`;
}

export function hasUploadedPhoto(imageName?: string): boolean {
  if (!imageName || imageName === "nopicture.png") return false;
  return Boolean((imageMap as Record<string, string>)[imageName]);
}

// hash برای تولید مقادیر ثابت
function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const styles: ProductStyle[] = ["classic", "minimal", "modern", "luxury", "vintage"];
const occasions: Occasion[] = ["everyday", "gift", "party", "wedding", "engagement"];

/** عیارهای اکسل (۷۵۰، ۸۷۵ …) به عیار استاندارد تبدیل می‌شوند */
export function normalizeKarat(raw: string): Karat {
  const value = String(raw).replace(/[^0-9.]/g, "");
  const num = Number(value);
  if (!Number.isFinite(num)) return "18K";
  if (num >= 990) return "24K";
  if (num >= 910) return "22K";
  if (num >= 870) return "21K";
  if (num >= 700) return "18K";
  if (num === 24 || num === 22 || num === 21 || num === 18) return `${num}K` as Karat;
  return "18K";
}

export const CHAIN_MODELS = ["cartier", "figaro", "venetian", "rope", "flamingo"] as const;
export type ChainModel = (typeof CHAIN_MODELS)[number];

export const BIRTH_MONTHS = [
  "farvardin",
  "ordibehesht",
  "khordad",
  "tir",
  "mordad",
  "shahrivar",
  "mehr",
  "aban",
  "azar",
  "dey",
  "bahman",
  "esfand",
] as const;
export type BirthMonth = (typeof BIRTH_MONTHS)[number];

export const products: Product[] = (catalog as CatalogRow[]).map((row) => {
  const h = hash(row.id);
  // Only ever show the piece's own photo. If it hasn't been uploaded yet we
  // leave the image empty and the UI renders a neutral placeholder frame,
  // so no product is displayed with another product's picture.
  const image = hasUploadedPhoto(row.imageName) ? productImageUrl(row.imageName)! : "";
  const karat = normalizeKarat(row.karat as unknown as string);
  const type = (row.typeLabel ?? "").toLowerCase();
  const onSale = h % 9 === 0;
  const isLetter = type.includes("single pendant") || type.includes("pendant");
  const isKids = row.weight <= 1.5 && (type.includes("bangle") || type.includes("ring") || type.includes("earring"));

  return {
    ...row,
    karat,
    image,
    gallery: image ? [image] : [],
    sku: row.code,
    style: styles[h % styles.length]!,
    occasion: occasions[(h >> 3) % occasions.length]!,
    gemstoneType: "none" as GemstoneType,
    description: `${row.typeLabel} in ${karat} ${row.color?.replace("-", " ") ?? "yellow"} gold, ${row.weight} g${
      row.size ? `, size ${row.size}` : ""
    }. Reference ${row.code}. Priced live against the daily gold rate.`,
    inStock: true,
    customizable: row.category === "rings" || row.category === "sets" || h % 4 === 0,
    madeToOrder: row.category === "rings" || row.category === "sets" || h % 5 === 0,
    returnable: true,
    sizeAdjustable: row.category === "rings" || row.category === "bracelets",
    warranty: "Certificate of authenticity",
    rating: Math.round((4 + (h % 10) / 10) * 10) / 10,
    reviews: 8 + (h % 240),
    bestseller: h % 11 === 0,
    newest: h % 13 === 0,
    mostSold: h % 17 === 0,
    aiRecommended: h % 7 === 0,
    freeShipping: row.weight > 5,
    onSale,
    discount: onSale ? 5 + (h % 3) * 5 : undefined,
    kids: isKids,
    letters: isLetter,
    chainModel: CHAIN_MODELS[h % CHAIN_MODELS.length]!,
    birthMonth: isLetter ? BIRTH_MONTHS[(h >> 5) % BIRTH_MONTHS.length]! : undefined,
  };
});

function parseCoinWeight(raw: string) {
  return Number(String(raw).replace("/", "."));
}

function buildBullionProduct(input: {
  id: string;
  name: string;
  sku: string;
  weight: number;
  karat?: Karat;
  typeLabel: string;
  description?: string;
}) {
  const karat = input.karat ?? "24K";
  return {
    id: input.id,
    name: input.name,
    category: "bullion" as const,
    karat,
    weight: input.weight,
    makingPct: karat === "22K" ? 0.015 : 0.01,
    gender: "unisex" as const,
    gemstoneType: "none" as const,
    color: "yellow" as const,
    style: "classic" as const,
    occasion: "investment" as const,
    image: "",
    gallery: [],
    description:
      input.description ??
      `${input.typeLabel} ${input.weight} گرمی با عیار ${karat} برای خرید و نگهداری سرمایه‌ای.`,
    sku: input.sku,
    inStock: true,
    customizable: false,
    madeToOrder: false,
    returnable: true,
    sizeAdjustable: false,
    warranty: "Certificate of authenticity",
    rating: 4.8,
    reviews: 12,
    bestseller: input.weight >= 1,
    newest: false,
    mostSold: input.weight <= 1,
    aiRecommended: input.weight === 1,
    freeShipping: input.weight >= 2,
    onSale: false,
    code: input.sku,
    typeLabel: input.typeLabel,
  } satisfies Product;
}

const coinProducts: Product[] = (rawCoins as CoinRow[]).map((row) =>
  buildBullionProduct({
    id: `bullion-${row["کد"].toLowerCase()}`,
    name: `${row["نوع"]} ${parseCoinWeight(row["وزن"])} گرمی`,
    sku: row["کد"],
    weight: parseCoinWeight(row["وزن"]),
    typeLabel: row["نوع"],
  }),
);

const classicCoinProducts: Product[] = [
  buildBullionProduct({
    id: "coin-bahar-azadi",
    name: "سکه بهار آزادی",
    sku: "COIN-BAHAR-AZADI",
    weight: 8.133,
    karat: "22K",
    typeLabel: "Coin",
  }),
  buildBullionProduct({
    id: "coin-nim-bahar-azadi",
    name: "نیم سکه بهار آزادی",
    sku: "COIN-NIM-BAHAR-AZADI",
    weight: 4.066,
    karat: "22K",
    typeLabel: "Coin",
  }),
  buildBullionProduct({
    id: "coin-rob-bahar-azadi",
    name: "ربع سکه بهار آزادی",
    sku: "COIN-ROB-BAHAR-AZADI",
    weight: 2.033,
    karat: "22K",
    typeLabel: "Coin",
  }),
];

const goldBallProducts: Product[] = [
  buildBullionProduct({
    id: "gold-ball-0-5",
    name: "گوی طلا ۰.۵ گرمی",
    sku: "BALL-0.5G",
    weight: 0.5,
    karat: "24K",
    typeLabel: "گوی طلا",
  }),
  buildBullionProduct({
    id: "gold-ball-1",
    name: "گوی طلا ۱ گرمی",
    sku: "BALL-1G",
    weight: 1,
    karat: "24K",
    typeLabel: "گوی طلا",
  }),
  buildBullionProduct({
    id: "gold-ball-2-5",
    name: "گوی طلا ۲.۵ گرمی",
    sku: "BALL-2.5G",
    weight: 2.5,
    karat: "24K",
    typeLabel: "گوی طلا",
  }),
  buildBullionProduct({
    id: "gold-ball-5",
    name: "گوی طلا ۵ گرمی",
    sku: "BALL-5G",
    weight: 5,
    karat: "24K",
    typeLabel: "گوی طلا",
  }),
];

export const investmentProducts: Product[] = [...coinProducts, ...classicCoinProducts, ...goldBallProducts];
export const productsWithBullion: Product[] = [...products, ...investmentProducts];

export type QuickTag =
  | "all"
  | "kids"
  | "white-gold"
  | "letters"
  | "birth-month"
  | "cartier"
  | "figaro"
  | "venetian"
  | "rope"
  | "flamingo"
  | "lightweight"
  | "on-sale"
  | "bestseller"
  | "newest"
  | "most-sold"
  | "ai-picks"
  | "free-shipping";

export function matchesQuickTag(product: Product, tag: QuickTag): boolean {
  switch (tag) {
    case "all":
      return true;
    case "kids":
      return Boolean(product.kids);
    case "white-gold":
      return product.color === "white";
    case "letters":
      return Boolean(product.letters);
    case "birth-month":
      return Boolean(product.birthMonth);
    case "cartier":
    case "figaro":
    case "venetian":
    case "rope":
    case "flamingo":
      return product.chainModel === tag;
    case "lightweight":
      return product.weight <= 2;
    case "on-sale":
      return Boolean(product.onSale);
    case "bestseller":
      return Boolean(product.bestseller);
    case "newest":
      return Boolean(product.newest);
    case "most-sold":
      return Boolean(product.mostSold);
    case "ai-picks":
      return Boolean(product.aiRecommended);
    case "free-shipping":
      return Boolean(product.freeShipping);
    default:
      return true;
  }
}

export const QUICK_TAGS: { id: QuickTag; label: string }[] = [
  { id: "all", label: "All" },
  { id: "kids", label: "Kids" },
  { id: "white-gold", label: "White gold" },
  { id: "letters", label: "Letters & names" },
  { id: "birth-month", label: "Birth month" },
  { id: "cartier", label: "Cartier model" },
  { id: "figaro", label: "Figaro" },
  { id: "venetian", label: "Venetian" },
  { id: "rope", label: "Rope" },
  { id: "flamingo", label: "Flamingo" },
  { id: "lightweight", label: "Lightweight" },
  { id: "on-sale", label: "On sale" },
  { id: "bestseller", label: "Bestsellers" },
  { id: "most-sold", label: "Most sold" },
  { id: "newest", label: "New arrivals" },
  { id: "ai-picks", label: "Recommended" },
  { id: "free-shipping", label: "Free shipping" },
];


export const categories: { slug: Category | "all"; label: string }[] = [
  { slug: "all", label: "All Collections" },
  { slug: "rings", label: "Rings" },
  { slug: "necklaces", label: "Necklaces" },
  { slug: "bracelets", label: "Bracelets & Bangles" },
  { slug: "earrings", label: "Earrings" },
  { slug: "sets", label: "Sets" },
  { slug: "bullion", label: "Investment & Coins" },
];
