import type { Category, Karat } from "@/lib/products";

export type ShopSearch = {
  category: Category | "all";
  karat: Karat | "all";
  gender: "all" | "women" | "men" | "children" | "unisex";
  color: "all" | "yellow" | "white" | "rose" | "two-tone" | "three-tone";
  gemstone:
    | "all"
    | "none"
    | "diamond"
    | "brilliant"
    | "emerald"
    | "ruby"
    | "sapphire"
    | "opal"
    | "tanzanite"
    | "pearl"
    | "topaz"
    | "amethyst";
  style: "all" | "classic" | "minimal" | "modern" | "luxury" | "vintage" | "sporty";
  occasion: "all" | "everyday" | "engagement" | "wedding" | "party" | "gift" | "investment";
  stock: "all" | "in-stock" | "made-to-order";
  min: number;
  max: number;
  minWeight: number;
  maxWeight: number;
  minMaking: number;
  maxMaking: number;
  sort: "featured" | "price-asc" | "price-desc" | "weight-desc";
  q: string;
};

export const SHOP_SEARCH_DEFAULT: ShopSearch = {
  category: "all",
  karat: "all",
  gender: "all",
  color: "all",
  gemstone: "all",
  style: "all",
  occasion: "all",
  stock: "all",
  min: 0,
  max: 1_000_000_000,
  minWeight: 0,
  maxWeight: 1_000,
  minMaking: 0,
  maxMaking: 100,
  sort: "featured",
  q: "",
};