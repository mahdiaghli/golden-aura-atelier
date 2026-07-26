import type { Product } from "@/lib/products";
import type { BlogPost } from "@/lib/blog";
import type { Locale, Messages } from "./types";

export function formatTomanLocalized(n: number, locale: Locale) {
  const formatted = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US", {
    maximumFractionDigits: 0,
  }).format(Math.round(n));
  return locale === "fa" ? `${formatted} تومان` : `${formatted} T`;
}

export function localizeProduct(product: Product, messages: Messages): Product {
  const tr = messages.products[product.id];
  if (!tr) return product;
  return {
    ...product,
    name: tr.name,
    description: tr.description,
    warranty: tr.warranty ?? product.warranty,
    gemstone: product.gemstone && tr.warranty ? product.gemstone : product.gemstone,
  };
}

export function localizeBlogPost(post: BlogPost, messages: Messages): BlogPost {
  const tr = messages.blogPosts[post.slug];
  if (!tr) return post;
  return { ...post, ...tr };
}

export function tGender(gender: Product["gender"], t: (key: string) => string) {
  const map: Record<Product["gender"], string> = {
    women: t("shop.filters.gender.women"),
    men: t("shop.filters.gender.men"),
    children: t("shop.filters.gender.children"),
    unisex: t("shop.filters.gender.unisex"),
  };
  return map[gender];
}

export function tCategory(slug: string, t: (key: string) => string) {
  if (slug === "all") return t("shop.categories.all");
  return t(`shop.categories.${slug}`);
}
