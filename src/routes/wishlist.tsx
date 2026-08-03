import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Shell } from "@/components/site/Chrome";
import { useWishlist } from "@/lib/wishlist";
import { formatToman, priceBreakdown, products } from "@/lib/products";

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

function WishlistPage() {
  const { ids, count, toggle, clear } = useWishlist();
  const items = products.filter((product) => ids.includes(product.id));

  return (
    <Shell>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-[11px] uppercase tracking-[0.32em] text-gold">Saved pieces</p>
        <h1 className="mt-4 text-5xl">Your Wishlist</h1>
        <p className="mt-4 max-w-2xl text-onyx/65">
          Keep track of the pieces you love, compare live prices, and return when you are ready to buy or discuss customization.
        </p>

        {count === 0 ? (
          <div className="mt-12 border border-dashed border-onyx/15 py-24 text-center">
            <Heart className="mx-auto text-gold" size={28} />
            <p className="mt-4 text-2xl">Nothing saved yet.</p>
            <Link to="/shop" search={{ category: "all", karat: "all", gender: "all", color: "all", gemstone: "all", style: "all", occasion: "all", stock: "all", min: 0, max: 1_000_000_000, minWeight: 0, maxWeight: 1_000, minMaking: 0, maxMaking: 100, sort: "featured", q: "" }} className="mt-8 inline-flex items-center gap-2 bg-onyx px-8 py-4 text-[11px] uppercase tracking-[0.2em] font-bold text-parchment hover:bg-gold hover:text-onyx transition-all">
              <ShoppingBag size={16} /> Browse the collection
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
                      <img src={product.image} alt={product.name} className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105" />
                    </Link>
                    <div className="p-5">
                      <Link to="/shop/$id" params={{ id: product.id }} className="text-xl font-medium hover:text-gold">
                        {product.name}
                      </Link>
                      <p className="mt-1 text-[10px] uppercase tracking-widest text-onyx/50">
                        {product.karat} · {product.weight}g
                      </p>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <p className="font-medium">{formatToman(total)}</p>
                        <button onClick={() => toggle(product.id)} className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-onyx/55 hover:text-gold">
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <aside className="h-fit rounded-3xl border border-onyx/10 bg-secondary p-8 sticky top-28">
              <p className="text-[11px] uppercase tracking-widest text-gold">Wishlist summary</p>
              <h2 className="mt-3 text-2xl">{count} saved pieces</h2>
              <p className="mt-3 text-sm text-onyx/60">Use the heart button on any product card or product page to save and unsave pieces instantly.</p>
              <button onClick={clear} className="mt-8 w-full border border-onyx/15 px-5 py-3 text-[11px] uppercase tracking-[0.2em] font-bold hover:border-gold hover:text-gold transition-colors">
                Clear wishlist
              </button>
              <Link to="/shop" search={{ category: "all", karat: "all", gender: "all", color: "all", gemstone: "all", style: "all", occasion: "all", stock: "all", min: 0, max: 1_000_000_000, minWeight: 0, maxWeight: 1_000, minMaking: 0, maxMaking: 100, sort: "featured", q: "" }} className="mt-4 block text-center bg-onyx px-5 py-3 text-[11px] uppercase tracking-[0.2em] font-bold text-parchment hover:bg-gold hover:text-onyx transition-all">
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </section>
    </Shell>
  );
}