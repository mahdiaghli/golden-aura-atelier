import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/site/Chrome";
import { ProductImage } from "@/components/site/ProductImage";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n/context";
import { formatTomanLocalized } from "@/lib/i18n/helpers";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Bag — طلاجات عقلی" },
      { name: "description", content: "Review the pieces reserved in your طلاجات عقلی bag before checkout." },
      { property: "og:title", content: "Your Bag — طلاجات عقلی" },
      { property: "og:description", content: "Review your reserved طلاجات عقلی pieces." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotal, setQty, remove } = useCart();
  const { t, locale } = useI18n();
  const shipping = subtotal > 0 ? 750_000 : 0;
  const total = subtotal + shipping;
  const fmt = (n: number) => formatTomanLocalized(n, locale);

  return (
    <Shell>
      <section className="max-w-6xl mx-auto px-6 py-16">
        <span className="text-[12px] uppercase tracking-[0.3em] text-gold">{t("cart.eyebrow")}</span>
        <h1 className="font-serif text-5xl mt-3 mb-12">{t("cart.title")}</h1>

        {items.length === 0 ? (
          <div className="border border-dashed border-onyx/15 py-24 text-center">
            <p className="font-serif text-2xl">{t("cart.emptyTitle")}</p>
            <p className="text-onyx/60 mt-2">{t("cart.emptyBody")}</p>
            <Link to="/shop" className="inline-block mt-8 bg-onyx text-parchment px-10 py-4 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-gold hover:text-onyx transition-all">
              {t("cart.emptyCta")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
            <ul className="divide-y divide-onyx/10">
              {items.map(({ product, qty, lineTotal }) => (
                <li key={product.id} className="py-6 flex gap-6 items-start">
                  <Link to="/shop/$id" params={{ id: product.id }} className="w-28 aspect-square bg-secondary overflow-hidden shrink-0">
                    <ProductImage product={product} className="w-full h-full" />
                  </Link>
                  <div className="flex-1">
                    <Link to="/shop/$id" params={{ id: product.id }} className="font-serif text-xl hover:text-gold">
                      {product.name}
                    </Link>
                    <p className="text-[10px] uppercase tracking-widest text-onyx/50 mt-1">
                      {product.karat} · {product.weight}g · {t("cart.skuLabel")} {product.sku}
                    </p>
                    <div className="flex items-center gap-6 mt-4">
                      <div className="flex items-center border border-onyx/15">
                        <button onClick={() => setQty(product.id, qty - 1)} className="w-8 h-9 hover:bg-onyx/5">−</button>
                        <span className="w-8 text-center text-sm">{qty}</span>
                        <button onClick={() => setQty(product.id, qty + 1)} className="w-8 h-9 hover:bg-onyx/5">+</button>
                      </div>
                      <button onClick={() => remove(product.id)} className="text-[10px] uppercase tracking-widest text-onyx/50 hover:text-gold">
                        {t("cart.remove")}
                      </button>
                    </div>
                  </div>
                  <p className="font-medium whitespace-nowrap">{fmt(lineTotal)}</p>
                </li>
              ))}
            </ul>

            <aside className="bg-secondary p-8 h-fit sticky top-28">
              <h4 className="text-[11px] uppercase tracking-widest font-bold mb-6">{t("cart.summaryTitle")}</h4>
              <div className="space-y-3 text-sm">
                <Row label={t("cart.subtotal")} value={fmt(subtotal)} />
                <Row label={t("cart.shipping")} value={fmt(shipping)} />
                <div className="flex justify-between pt-4 border-t border-onyx/10 text-lg font-serif">
                  <span>{t("cart.total")}</span>
                  <span>{fmt(total)}</span>
                </div>
              </div>
              <Link to="/checkout" className="mt-8 block text-center bg-onyx text-parchment py-4 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-gold hover:text-onyx transition-all">
                {t("cart.checkout")}
              </Link>
              <Link to="/shop" className="mt-4 block text-center text-[11px] uppercase tracking-widest text-onyx/60 hover:text-gold">
                {t("cart.continueBrowsing")}
              </Link>
            </aside>
          </div>
        )}
      </section>
    </Shell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-onyx/60">{label}</span>
      <span>{value}</span>
    </div>
  );
}
