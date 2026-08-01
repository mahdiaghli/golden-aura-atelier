import catalog from "@/data/catalog.json";

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
  weight: number; // grams
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
  // New attributes
  onSale?: boolean;
  discount?: number; // percentage
  freeShipping?: boolean;
  customizable?: boolean;
  sizeAdjustable?: boolean;
  expressDelivery?: boolean;
  madeToOrder?: boolean;
  inStock?: boolean;
  warranty?: string; // warranty description
  insurance?: boolean;
  returnable?: boolean;
  rating?: number; // 0-5
  reviews?: number;
  bestseller?: boolean;
  newest?: boolean;
  mostSold?: boolean;
  aiRecommended?: boolean;
};

// Live rate used for price calc (Toman per gram)
export const GOLD_RATE_PER_GRAM: Record<Karat, number> = {
  "18K": 3_452_000,
  "21K": 4_020_000,
  "22K": 4_215_000,
  "24K": 4_602_000,
};
export const VAT_PCT = 0.09;

export function priceBreakdown(p: Product) {
  const gold = p.weight * GOLD_RATE_PER_GRAM[p.karat];
  const making = gold * p.makingPct;
  const subtotal = gold + making;
  const vat = subtotal * VAT_PCT;
  const total = subtotal + vat;
  return { gold, making, vat, total };
}

export function formatToman(n: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(n)) + " T";
}

const catalogImages = Array.from({ length: 22 }, (_, index) =>
  `/products/catalog/product-${String(index + 1).padStart(2, "0")}.webp`,
);

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
};

// Deterministic pseudo-random so ratings/badges stay stable between renders.
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

export const products: Product[] = (catalog as CatalogRow[]).map((row, i) => {
  const h = hash(row.id);
  const image = catalogImages[i % catalogImages.length]!;
  const alt = catalogImages[(i + 1) % catalogImages.length]!;
  return {
    ...row,
    image,
    gallery: [image, alt],
    sku: row.code,
    style: styles[h % styles.length]!,
    occasion: occasions[(h >> 3) % occasions.length]!,
    gemstoneType: "none",
    description: `${row.typeLabel} in ${row.karat} ${row.color.replace("-", " ")} gold, ${row.weight} g${
      row.size ? `, size ${row.size}` : ""
    }. Reference ${row.code}. Priced live against the daily gold rate.`,
    inStock: true,
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
  };
});

export const categories: { slug: Category | "all"; label: string }[] = [
  { slug: "all", label: "All Collections" },
  { slug: "rings", label: "Rings" },
  { slug: "necklaces", label: "Necklaces" },
  { slug: "bracelets", label: "Bracelets & Bangles" },
  { slug: "earrings", label: "Earrings" },
  { slug: "sets", label: "Sets" },
];
