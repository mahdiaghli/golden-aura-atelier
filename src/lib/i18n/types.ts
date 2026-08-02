export type Locale = "en" | "fa";

export type FaqCategory = {
  category: string;
  questions: { q: string; a: string }[];
};

export type ProductTranslation = {
  name: string;
  description: string;
  warranty?: string;
};

export type BlogTranslation = {
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  content: string[];
};

export type Messages = {
  signup?: Record<string, unknown>;
  common: Record<string, string>;
  nav: Record<string, string | Record<string, string>>;
  ticker: Record<string, { label: string; value: string }>;
  footer: Record<string, string | Record<string, string>>;
  errors: Record<string, string>;
  home: Record<string, string | string[] | Record<string, string>>;
  shop: Record<string, unknown>;
  cart: Record<string, string>;
  checkout: Record<string, string>;
  auth: Record<string, unknown>;
  services: Record<string, unknown>;
  prices: Record<string, unknown>;
  contact: Record<string, unknown>;
  faq: { title: string; subtitle: string; contact: Record<string, string>; categories: FaqCategory[] };
  about: Record<string, unknown>;
  whyUs: Record<string, unknown>;
  profile: Record<string, string>;
  blog: Record<string, unknown>;
  product: Record<string, string>;
  under1000: Record<string, string>;
  admin: Record<string, string>;
  products: Record<string, ProductTranslation>;
  blogPosts: Record<string, BlogTranslation>;
};
