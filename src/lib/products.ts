import catRings from "@/assets/cat-rings.jpg";
import catNecklaces from "@/assets/cat-necklaces.jpg";
import catBracelets from "@/assets/cat-bracelets.jpg";
import catBullion from "@/assets/cat-bullion.jpg";

export type Karat = "18K" | "21K" | "22K" | "24K";
export type Category = "rings" | "necklaces" | "bracelets" | "bullion";
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

const imgFor: Record<Category, string> = {
  rings: catRings,
  necklaces: catNecklaces,
  bracelets: catBracelets,
  bullion: catBullion,
};

// These files are copied from rebuilt.File1405-04-23 into public/products/catalog.
// Keeping the image list next to the seed order gives every product a stable,
// distinct image while the catalog is still backed by the local SQL seed data.
const catalogImages = Array.from({ length: 22 }, (_, index) =>
  `/products/catalog/product-${String(index + 1).padStart(2, "0")}.webp`,
);

const seed: Array<Omit<Product, "gallery" | "image" | "sku">> = [
  { id: "aurelia-solitaire", name: "Aurelia Solitaire Ring", category: "rings", karat: "18K", weight: 4.85, makingPct: 0.07, gender: "women", gemstone: "Diamond", gemstoneType: "diamond", color: "white", style: "classic", occasion: "engagement", description: "A single-stone solitaire ring hand-cast in 18K white gold with a G-VS1 brilliant.", customizable: true, sizeAdjustable: true, warranty: "Lifetime warranty", returnable: true, rating: 4.8, reviews: 245, bestseller: true, aiRecommended: true },
  { id: "helios-signet", name: "Helios Signet Ring", category: "rings", karat: "22K", weight: 12.4, makingPct: 0.09, gender: "men", color: "yellow", style: "luxury", occasion: "gift", description: "Weighty engraved signet, drawn from our Persian Archive collection.", customizable: true, warranty: "Lifetime warranty", returnable: true, rating: 4.7, reviews: 128, mostSold: true },
  { id: "luna-chain", name: "Luna Byzantine Chain", category: "necklaces", karat: "18K", weight: 22.6, makingPct: 0.08, gender: "unisex", color: "yellow", style: "classic", occasion: "everyday", description: "A sculpted Byzantine link chain, satin-brushed with a hand-polished clasp.", freeShipping: true, warranty: "2-year warranty", returnable: true, rating: 4.9, reviews: 342, bestseller: true },
  { id: "sirocco-collar", name: "Sirocco Collar", category: "necklaces", karat: "24K", weight: 38.2, makingPct: 0.11, gender: "women", color: "yellow", style: "luxury", occasion: "investment", description: "Investment-grade collar in pure 24K gold â€” heirloom weight, contemporary form.", insurance: true, warranty: "Lifetime warranty", returnable: true, rating: 4.6, reviews: 89, aiRecommended: true },
  { id: "atlas-cuff", name: "Atlas Sculpted Cuff", category: "bracelets", karat: "18K", weight: 28.9, makingPct: 0.10, gender: "unisex", color: "white", style: "modern", occasion: "everyday", description: "Architectural cuff with hammered facets â€” no closure, sprung to fit.", sizeAdjustable: true, freeShipping: true, warranty: "2-year warranty", returnable: true, rating: 4.7, reviews: 156, bestseller: true },
  { id: "meridian-bracelet", name: "Meridian Tennis Bracelet", category: "bracelets", karat: "18K", weight: 9.1, makingPct: 0.09, gender: "women", gemstone: "Diamond", gemstoneType: "diamond", color: "white", style: "luxury", occasion: "party", description: "24 brilliants set in bezel-cut white gold with a hidden box clasp.", customizable: true, warranty: "Lifetime warranty", returnable: true, rating: 4.9, reviews: 412, mostSold: true, aiRecommended: true },
  { id: "ingot-100", name: "Aurum Ingot 100g", category: "bullion", karat: "24K", weight: 100, makingPct: 0.015, gender: "unisex", color: "yellow", style: "minimal", occasion: "investment", description: "Cast investment bar, 999.9 fineness. Serial-numbered with assay certificate.", insurance: true, warranty: "Authenticity guarantee", returnable: true, rating: 4.8, reviews: 203 },
  { id: "ingot-50", name: "Aurum Ingot 50g", category: "bullion", karat: "24K", weight: 50, makingPct: 0.018, gender: "unisex", color: "yellow", style: "minimal", occasion: "investment", description: "Serialized 50-gram cast bar with tamper-evident assay card.", insurance: true, warranty: "Authenticity guarantee", returnable: true, rating: 4.7, reviews: 178, freeShipping: true },
  { id: "sovereign-coin", name: "Sovereign Coin", category: "bullion", karat: "22K", weight: 7.98, makingPct: 0.04, gender: "unisex", color: "yellow", style: "classic", occasion: "investment", description: "Struck sovereign in 22K â€” a classic collector coin, sealed capsule.", insurance: true, warranty: "Authenticity guarantee", returnable: true, rating: 4.9, reviews: 267, bestseller: true },
  { id: "nova-band", name: "Nova Eternity Band", category: "rings", karat: "18K", weight: 3.6, makingPct: 0.12, gender: "women", gemstone: "Diamond", gemstoneType: "diamond", color: "white", style: "classic", occasion: "wedding", description: "Full-round eternity band with 30 hand-set brilliants.", customizable: true, sizeAdjustable: true, warranty: "Lifetime warranty", returnable: true, rating: 4.8, reviews: 334, aiRecommended: true },
  { id: "cyrus-cross", name: "Cyrus Cross Pendant", category: "necklaces", karat: "22K", weight: 6.4, makingPct: 0.08, gender: "unisex", color: "yellow", style: "vintage", occasion: "gift", description: "Cross pendant on a Venetian chain, matte-finished.", customizable: true, warranty: "Lifetime warranty", returnable: true, rating: 4.6, reviews: 145 },
  { id: "orbit-cuff-m", name: "Orbit Cuff â€” Slim", category: "bracelets", karat: "18K", weight: 14.2, makingPct: 0.09, gender: "unisex", color: "rose", style: "modern", occasion: "everyday", description: "Slim architectural cuff, high-polish outer face, satin interior.", sizeAdjustable: true, freeShipping: true, warranty: "2-year warranty", returnable: true, rating: 4.8, reviews: 198, bestseller: true },
  // Products under $1000
  { id: "ember-ring-gold", name: "Ember Gold Ring", category: "rings", karat: "18K", weight: 2.1, makingPct: 0.06, gender: "women", color: "yellow", style: "minimal", occasion: "everyday", description: "Delicate minimalist ring in warm yellow gold.", onSale: true, discount: 15, customizable: true, freeShipping: true, sizeAdjustable: true, warranty: "1-year warranty", returnable: true, rating: 4.5, reviews: 89, newest: true },
  { id: "grace-pendant", name: "Grace Pendant Necklace", category: "necklaces", karat: "18K", weight: 3.2, makingPct: 0.07, gender: "women", color: "yellow", style: "classic", occasion: "everyday", description: "Elegant pendant on delicate chain, perfect for layering.", freeShipping: true, customizable: true, expressDelivery: true, warranty: "1-year warranty", returnable: true, rating: 4.6, reviews: 124, aiRecommended: true },
  { id: "simple-band", name: "Simple Gold Band", category: "rings", karat: "18K", weight: 2.5, makingPct: 0.05, gender: "unisex", color: "white", style: "minimal", occasion: "everyday", description: "Timeless band ring, perfect for stacking or solo wear.", customizable: true, sizeAdjustable: true, expressDelivery: true, warranty: "Lifetime warranty", returnable: true, rating: 4.7, reviews: 267, bestseller: true },
  { id: "rose-gold-cuff", name: "Rose Gold Cuff", category: "bracelets", karat: "18K", weight: 7.8, makingPct: 0.08, gender: "women", color: "rose", style: "modern", occasion: "everyday", description: "Contemporary rose gold bangle with smooth finish.", freeShipping: true, warranty: "1-year warranty", returnable: true, rating: 4.5, reviews: 145, onSale: true, discount: 10 },
  { id: "gold-snake-chain", name: "Gold Snake Chain", category: "necklaces", karat: "18K", weight: 5.4, makingPct: 0.07, gender: "unisex", color: "yellow", style: "classic", occasion: "everyday", description: "Versatile snake chain, perfect base for pendants.", customizable: true, freeShipping: true, expressDelivery: true, warranty: "1-year warranty", returnable: true, rating: 4.8, reviews: 312 },
  { id: "dainty-ring-small", name: "Dainty Ring Collection", category: "rings", karat: "18K", weight: 1.8, makingPct: 0.06, gender: "women", color: "white", style: "minimal", occasion: "everyday", description: "Delicate stackable ring in white gold.", madeToOrder: true, customizable: true, sizeAdjustable: true, warranty: "Lifetime warranty", returnable: true, rating: 4.6, reviews: 198, newest: true, aiRecommended: true },
  { id: "comfort-band-men", name: "Comfort Fit Band", category: "rings", karat: "18K", weight: 4.2, makingPct: 0.07, gender: "men", color: "yellow", style: "classic", occasion: "everyday", description: "Comfortable everyday band for men with rounded edges.", customizable: true, sizeAdjustable: true, freeShipping: true, warranty: "Lifetime warranty", returnable: true, rating: 4.7, reviews: 256, bestseller: true },
  { id: "delicate-ankle", name: "Delicate Ankle Bracelet", category: "bracelets", karat: "18K", weight: 3.5, makingPct: 0.06, gender: "women", color: "yellow", style: "minimal", occasion: "everyday", description: "Lightweight ankle bracelet with elegant clasp.", customizable: true, sizeAdjustable: true, expressDelivery: true, warranty: "1-year warranty", returnable: true, rating: 4.5, reviews: 167, newest: true },
  { id: "gold-locket", name: "Memory Gold Locket", category: "necklaces", karat: "18K", weight: 4.0, makingPct: 0.08, gender: "women", color: "yellow", style: "vintage", occasion: "gift", description: "Hinged locket for precious memories, includes chain.", madeToOrder: true, customizable: true, warranty: "1-year warranty", returnable: true, rating: 4.8, reviews: 289, aiRecommended: true },
  { id: "twisted-band", name: "Twisted Gold Band", category: "rings", karat: "18K", weight: 3.0, makingPct: 0.06, gender: "unisex", color: "two-tone", style: "modern", occasion: "everyday", description: "Modern twisted design in two-tone gold.", customizable: true, sizeAdjustable: true, freeShipping: true, expressDelivery: true, warranty: "Lifetime warranty", returnable: true, rating: 4.6, reviews: 201, newest: true },
];

export const products: Product[] = seed.map((p, i) => ({
  ...p,
  image: catalogImages[i] ?? imgFor[p.category],
  gallery: [catalogImages[i] ?? imgFor[p.category], catalogImages[(i + 1) % catalogImages.length] ?? imgFor[p.category]],
  sku: `AU-${p.category.slice(0, 2).toUpperCase()}-${String(1000 + i)}`,
}));

export const categories: { slug: Category | "all"; label: string }[] = [
  { slug: "all", label: "All Collections" },
  { slug: "rings", label: "Rings" },
  { slug: "necklaces", label: "Necklaces" },
  { slug: "bracelets", label: "Bracelets" },
  { slug: "bullion", label: "Bullion & Coins" },
];
