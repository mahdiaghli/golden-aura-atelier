import catRings from "@/assets/cat-rings.jpg";
import catNecklaces from "@/assets/cat-necklaces.jpg";
import catBracelets from "@/assets/cat-bracelets.jpg";
import catBullion from "@/assets/cat-bullion.jpg";
import heroRing from "@/assets/hero-ring.jpg";

export type Karat = "18K" | "22K" | "24K";
export type Category = "rings" | "necklaces" | "bracelets" | "bullion";

export type Product = {
  id: string;
  name: string;
  category: Category;
  karat: Karat;
  weight: number; // grams
  makingPct: number;
  gender: "women" | "men" | "unisex";
  gemstone?: string;
  image: string;
  gallery: string[];
  description: string;
  sku: string;
};

// Live rate used for price calc (Toman per gram)
export const GOLD_RATE_PER_GRAM: Record<Karat, number> = {
  "18K": 3_452_000,
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

const imgFor: Record<Category, string> = {
  rings: catRings,
  necklaces: catNecklaces,
  bracelets: catBracelets,
  bullion: catBullion,
};

const seed: Array<Omit<Product, "gallery" | "image" | "sku">> = [
  { id: "aurelia-solitaire", name: "Aurelia Solitaire Ring", category: "rings", karat: "18K", weight: 4.85, makingPct: 0.07, gender: "women", gemstone: "Diamond", description: "A single-stone solitaire ring hand-cast in 18K yellow gold with a G-VS1 brilliant." },
  { id: "helios-signet", name: "Helios Signet Ring", category: "rings", karat: "22K", weight: 12.4, makingPct: 0.09, gender: "men", description: "Weighty engraved signet, drawn from our Persian Archive collection." },
  { id: "luna-chain", name: "Luna Byzantine Chain", category: "necklaces", karat: "18K", weight: 22.6, makingPct: 0.08, gender: "unisex", description: "A sculpted Byzantine link chain, satin-brushed with a hand-polished clasp." },
  { id: "sirocco-collar", name: "Sirocco Collar", category: "necklaces", karat: "24K", weight: 38.2, makingPct: 0.11, gender: "women", description: "Investment-grade collar in pure 24K gold — heirloom weight, contemporary form." },
  { id: "atlas-cuff", name: "Atlas Sculpted Cuff", category: "bracelets", karat: "18K", weight: 28.9, makingPct: 0.10, gender: "unisex", description: "Architectural cuff with hammered facets — no closure, sprung to fit." },
  { id: "meridian-bracelet", name: "Meridian Tennis Bracelet", category: "bracelets", karat: "18K", weight: 9.1, makingPct: 0.09, gender: "women", gemstone: "Diamond", description: "24 brilliants set in bezel-cut yellow gold with a hidden box clasp." },
  { id: "ingot-100", name: "Aurum Ingot 100g", category: "bullion", karat: "24K", weight: 100, makingPct: 0.015, gender: "unisex", description: "Cast investment bar, 999.9 fineness. Serial-numbered with assay certificate." },
  { id: "ingot-50", name: "Aurum Ingot 50g", category: "bullion", karat: "24K", weight: 50, makingPct: 0.018, gender: "unisex", description: "Serialized 50-gram cast bar with tamper-evident assay card." },
  { id: "sovereign-coin", name: "Sovereign Coin", category: "bullion", karat: "22K", weight: 7.98, makingPct: 0.04, gender: "unisex", description: "Struck sovereign in 22K — a classic collector coin, sealed capsule." },
  { id: "nova-band", name: "Nova Eternity Band", category: "rings", karat: "18K", weight: 3.6, makingPct: 0.12, gender: "women", gemstone: "Diamond", description: "Full-round eternity band with 30 hand-set brilliants." },
  { id: "cyrus-cross", name: "Cyrus Cross Pendant", category: "necklaces", karat: "22K", weight: 6.4, makingPct: 0.08, gender: "unisex", description: "Cross pendant on a Venetian chain, matte-finished." },
  { id: "orbit-cuff-m", name: "Orbit Cuff — Slim", category: "bracelets", karat: "18K", weight: 14.2, makingPct: 0.09, gender: "unisex", description: "Slim architectural cuff, high-polish outer face, satin interior." },
];

export const products: Product[] = seed.map((p, i) => ({
  ...p,
  image: p.category === "rings" && i === 0 ? heroRing : imgFor[p.category],
  gallery: [imgFor[p.category], p.category === "rings" ? heroRing : imgFor[p.category]],
  sku: `AU-${p.category.slice(0, 2).toUpperCase()}-${String(1000 + i)}`,
}));

export const categories: { slug: Category | "all"; label: string }[] = [
  { slug: "all", label: "All Collections" },
  { slug: "rings", label: "Rings" },
  { slug: "necklaces", label: "Necklaces" },
  { slug: "bracelets", label: "Bracelets" },
  { slug: "bullion", label: "Bullion & Coins" },
];
