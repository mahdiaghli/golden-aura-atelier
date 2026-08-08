import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Shell } from "@/components/site/Chrome";
import { ProductImage } from "@/components/site/ProductImage";
import { useWishlist } from "@/lib/wishlist";
import { priceBreakdown, productsWithBullion as products } from "@/lib/products";
import { useI18n } from "@/lib/i18n/context";
import { formatTomanLocalized } from "@/lib/i18n/helpers";

export const Route = createFileRoute("/wishlist")({
  component: WishlistPage,
  head: () => ({
    meta: [
      { title: "Wishlist — Aurum" },
      { name: "description", content: "Save your favorite Aurum pieces and return to them later." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

const shopSearch = { category: "all", karat: "all", gender: "all", color: "all", gemstone: "all", style: "all", occasion: "all", stock: "all", min: 0, max: 1_000_000_000, minWeight: 0, maxWeight: 1_000, minMaking: 0, maxMaking: 100, sort: "featured" as const, q: "" };

function WishlistPage() {
  const { ids, count, toggle, clear } = useWishlist();
  const { t, locale } = useI18n();
  const items = products.filter((product) => ids.includes(product.id));
  const fmt = (n: number) => formatTomanLocalized(n, locale);

  return (
    <Shell>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-[11px] uppercase tracking-[0.32em] text-gold">{t("wishlist.eyebrow")}</p>
        <h1 className="mt-4 text-5xl">{t("wishlist.title")}</h1>
        <p className="mt-4 max-w-2xl text-onyx/65">{t("wishlist.intro")}</p>

        {count === 0 ? (
          <div className="mt-12 border border-dashed border-onyx/15 py-24 text-center">
            <Heart className="mx-auto text-gold" size={28} />
            <p className="mt-4 text-2xl">{t("wishlist.emptyTitle")}</p>
            <Link to="/shop" search={shopSearch} className="mt-8 inline-flex items-center gap-2 bg-onyx px-8 py-4 text-[11px] uppercase tracking-[0.2em] font-bold text-parchment hover:bg-gold hover:text-onyx transition-all">
              <ShoppingBag size={16} /> {t("wishlist.emptyCta")}
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((product) => {
                const total = priceBreakdown(product).total;
                return (
                  <div key={product.id} className="group overflow-hidden rounded-3xl border border-onyx/10 bg-white/60">
                    <Link to="/shop/$id" params={{ id: product.id }} className="block overflow-hidden">
                      <ProductImage product={product} className="aspect-[4/5] w-full transition duration-700 group-hover:scale-105" />
                    </Link>
                    <div className="p-5">
                      <Link to="/shop/$id" params={{ id: product.id }} className="text-xl font-medium hover:text-gold">
                        {product.name}
                      </Link>
                      <p className="mt-1 text-[10px] uppercase tracking-widest text-onyx/50">
                        {t("wishlist.weightLabel", { karat: product.karat, weight: product.weight })}
                      </p>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <p className="font-medium">{fmt(total)}</p>
                        <button onClick={() => toggle(product.id)} className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-onyx/55 hover:text-gold">
                          <Trash2 size={14} /> {t("wishlist.remove")}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <aside className="h-fit rounded-3xl border border-onyx/10 bg-secondary p-8 sticky top-28">
              <p className="text-[11px] uppercase tracking-widest text-gold">{t("wishlist.summaryEyebrow")}</p>
              <h2 className="mt-3 text-2xl">{t("wishlist.summaryTitle", { count })}</h2>
              <p className="mt-3 text-sm text-onyx/60">{t("wishlist.summaryBody")}</p>
              <button onClick={clear} className="mt-8 w-full border border-onyx/15 px-5 py-3 text-[11px] uppercase tracking-[0.2em] font-bold hover:border-gold hover:text-gold transition-colors">
                {t("wishlist.clear")}
              </button>
              <Link to="/shop" search={shopSearch} className="mt-4 block text-center bg-onyx px-5 py-3 text-[11px] uppercase tracking-[0.2em] font-bold text-parchment hover:bg-gold hover:text-onyx transition-all">
                {t("wishlist.continueShopping")}
              </Link>
            </aside>
          </div>
        )}
      </section>
    </Shell>
  );
}
