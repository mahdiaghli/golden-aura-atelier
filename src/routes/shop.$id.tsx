import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/site/Chrome";
import { products, priceBreakdown, formatToman, GOLD_RATE_PER_GRAM, type Product, type Karat } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { liveEntryFor, proxiedImage, useLiveInventory } from "@/lib/use-live-inventory";

export const Route = createFileRoute("/shop/$id")({
  loader: ({ params }) => {
    const product = products.find((p) => p.id === params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Piece not found — Aurum" }, { name: "robots", content: "noindex" }] };
    }
    const p = loaderData.product;
    return {
      meta: [
        { title: `${p.name} — Aurum` },
        { name: "description", content: `${p.name}. ${p.karat} gold, ${p.weight}g. ${p.description}` },
        { property: "og:title", content: `${p.name} — Aurum` },
        { property: "og:description", content: p.description },
        { property: "og:type", content: "product" },
      ],
    };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <Shell>
      <div className="max-w-3xl mx-auto px-6 py-32 text-center">
        <h1 className="font-serif text-5xl">Piece not found</h1>
        <p className="text-onyx/60 mt-4">This piece may have been reserved or archived.</p>
        <Link to="/shop" className="inline-block mt-8 text-[11px] uppercase tracking-widest text-gold border-b border-gold pb-1">
          Return to the collection
        </Link>
      </div>
    </Shell>
  ),
});

function ProductPage() {
  const { product } = Route.useLoaderData() as { product: Product };
  const { add } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const { items: liveItems } = useLiveInventory();
  const live = liveEntryFor(liveItems, product.code);
  const gallery = live && live.images.length > 0 ? live.images.map(proxiedImage) : product.gallery;
  const bd = priceBreakdown(product);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);


  return (
    <Shell>
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <nav className="text-[10px] uppercase tracking-widest text-onyx/50">
          <Link to="/" className="hover:text-gold">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-gold">Collection</Link>
          <span className="mx-2">/</span>
          <span className="text-onyx">{product.name}</span>
        </nav>
      </div>

      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <div className="bg-secondary overflow-hidden">
            <img
              src={gallery[Math.min(active, gallery.length - 1)]}
              alt={product.name}
              onError={(event) => {
                const img = event.currentTarget;
                if (img.src !== product.image) img.src = product.image;
              }}
              className="w-full aspect-square object-cover"
            />
          </div>
          <div className="flex gap-3 mt-4">
            {gallery.map((g, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-20 aspect-square overflow-hidden bg-secondary border ${
                  active === i ? "border-gold" : "border-transparent"
                }`}
              >
                <img src={g} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

        </div>

        <div>
          <span className="text-[11px] uppercase tracking-[0.3em] text-gold">{product.category}</span>
          <h1 className="font-serif text-4xl md:text-5xl mt-3 leading-tight">{product.name}</h1>
          <p className="text-[11px] uppercase tracking-widest text-onyx/40 mt-2">SKU {product.sku}</p>

          <div className="mt-8 flex items-baseline gap-3">
            <span className="text-4xl font-serif">{formatToman(bd.total)}</span>
            <span className="text-xs uppercase tracking-widest text-onyx/50">Incl. VAT</span>
          </div>

          <p className="text-onyx/70 mt-8 font-light leading-relaxed">{product.description}</p>

          <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-onyx/10 py-6">
            <Spec label="Karat" value={product.karat} />
            <Spec label="Weight" value={`${product.weight} g`} />
            <Spec label="Type" value={product.typeLabel || product.category} />
            <Spec label="Gold colour" value={(product.color || "—").replace("-", " ")} />
            <Spec label="Size" value={product.size || "—"} />
            <Spec label="Making" value={`${Math.round(product.makingPct * 100)}%`} />
            <Spec label="Wearer" value={product.gender[0].toUpperCase() + product.gender.slice(1)} />
            <Spec label="Reference" value={product.code || product.sku} />
            <Spec
              label="Availability"
              value={
                live
                  ? live.quantity > 0
                    ? `In stock — ${live.quantity} available`
                    : "Unavailable"
                  : product.inStock === false
                    ? "Reserved"
                    : "In stock"
              }
            />

            <Spec label="Gemstone" value={product.gemstone || "—"} />
          </dl>

          <div className="mt-8">
            <h4 className="text-[11px] uppercase tracking-widest font-bold mb-4">Live price breakdown</h4>
            <div className="space-y-2 text-sm">
              <Row label={`Gold value (${product.weight}g × ${formatToman(GOLD_RATE_PER_GRAM[product.karat])})`} value={formatToman(bd.gold)} />
              <Row label={`Making (${Math.round(product.makingPct * 100)}%)`} value={formatToman(bd.making)} />
              <Row label="VAT (9%)" value={formatToman(bd.vat)} />
              <div className="flex justify-between pt-3 border-t border-onyx/10">
                <span className="font-bold uppercase tracking-widest text-xs text-gold">Total</span>
                <span className="font-medium">{formatToman(bd.total)}</span>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <div className="flex items-center border border-onyx/15">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-12 hover:bg-onyx/5">−</button>
              <span className="w-10 text-center font-medium">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="w-10 h-12 hover:bg-onyx/5">+</button>
            </div>
            <button
              onClick={() => add(product.id, qty)}
              className="bg-onyx text-parchment px-10 py-4 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-gold hover:text-onyx transition-all duration-500"
            >
              Add to bag
            </button>
            <button
              onClick={() => {
                add(product.id, qty);
                router.navigate({ to: "/checkout" });
              }}
              className="border-b border-onyx py-2 text-[11px] uppercase tracking-[0.2em] font-bold hover:text-gold hover:border-gold"
            >
              Buy now
            </button>
          </div>

          <ul className="mt-10 grid grid-cols-2 gap-4 text-[11px] uppercase tracking-widest text-onyx/60">
            <li>· Complimentary insured shipping</li>
            <li>· Certificate of authenticity</li>
            <li>· 30-day returns</li>
            <li>· Lifetime polishing</li>
          </ul>
        </div>
      </section>

      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-20 border-t border-onyx/10">
          <h2 className="font-serif text-3xl mb-10">You may also love</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {related.map((r) => (
              <Link key={r.id} to="/shop/$id" params={{ id: r.id }} className="group">
                <div className="overflow-hidden bg-secondary mb-4">
                  <img src={r.image} alt={r.name} className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <h4 className="font-serif text-lg">{r.name}</h4>
                <p className="text-sm text-onyx/60 mt-1">{formatToman(priceBreakdown(r).total)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </Shell>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-widest text-onyx/50">{label}</dt>
      <dd className="text-sm mt-1 font-medium">{value}</dd>
    </div>
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
