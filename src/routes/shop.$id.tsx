import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Heart, Send, Share2, Star } from "lucide-react";
import { toast } from "sonner";
import { Shell } from "@/components/site/Chrome";
import { ProductImage } from "@/components/site/ProductImage";
import { SHOP_SEARCH_DEFAULT } from "@/lib/shop-search";
import { products, priceBreakdown, formatToman, GOLD_RATE_PER_GRAM, type Product, type Karat } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { useI18n } from "@/lib/i18n/context";
import { formatTomanLocalized, tGender } from "@/lib/i18n/helpers";

type Review = {
  name: string;
  rating: number;
  text: string;
  date: string;
  verified?: boolean;
};

function seedReviews(product: Product): Review[] {
  return [
    {
      name: "Alya",
      rating: product.rating ? Math.round(product.rating) : 5,
      text: `Beautiful finishing and balanced weight. The ${product.karat} tone looks even better in person.`,
      date: "Recently",
      verified: true,
    },
    {
      name: "Reza",
      rating: 5,
      text: `The piece matched the photos closely and the live price breakdown made the purchase easy to trust.`,
      date: "Last week",
      verified: true,
    },
    {
      name: "Mina",
      rating: 4,
      text: `Excellent for gifting. Packaging was clean and the engraving-ready finish is a nice touch.`,
      date: "2 weeks ago",
      verified: true,
    },
  ];
}

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
  notFoundComponent: () => {
    const { t } = useI18n();
    return (
      <Shell>
        <div className="max-w-3xl mx-auto px-6 py-32 text-center">
          <h1 className="font-serif text-5xl">{t("product.notFoundTitle")}</h1>
          <p className="text-onyx/60 mt-4">{t("product.notFoundBody")}</p>
          <Link to="/shop" search={SHOP_SEARCH_DEFAULT} className="inline-block mt-8 text-[11px] uppercase tracking-widest text-gold border-b border-gold pb-1">
            {t("product.notFoundCta")}
          </Link>
        </div>
      </Shell>
    );
  },
});

function ProductPage() {
  const { product } = Route.useLoaderData() as { product: Product };
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(Math.round(product.rating ?? 5));
  const { t, locale } = useI18n();
  const fmt = (n: number) => formatTomanLocalized(n, locale);
  const bd = priceBreakdown(product);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);
  const reviewKey = `aurum-product-reviews-${product.id}`;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(reviewKey);
    setReviews(raw ? (JSON.parse(raw) as Review[]) : seedReviews(product));
  }, [product, reviewKey]);

  useEffect(() => {
    if (typeof window === "undefined" || reviews.length === 0) return;
    window.localStorage.setItem(reviewKey, JSON.stringify(reviews));
  }, [reviewKey, reviews]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return product.rating ?? 0;
    return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  }, [product.rating, reviews]);

  const shareProduct = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, text: product.description, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
      toast.success(t("product.shareSuccess"));
    } catch {
      toast.error(t("product.shareError"));
    }
  };

  const submitReview = () => {
    if (!reviewName.trim() || !reviewText.trim()) {
      toast.error(t("product.reviewErrorFields"));
      return;
    }

    const nextReview: Review = {
      name: reviewName.trim(),
      rating: reviewRating,
      text: reviewText.trim(),
      date: t("product.justNow"),
      verified: false,
    };

    setReviews((current) => [nextReview, ...current]);
    setReviewName("");
    setReviewText("");
    setReviewRating(5);
    toast.success(t("product.reviewSavedToast"));
  };

  return (
    <Shell>
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <nav className="text-[10px] uppercase tracking-widest text-onyx/50">
          <Link to="/" className="hover:text-gold">{t("product.breadcrumbHome")}</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" search={SHOP_SEARCH_DEFAULT} className="hover:text-gold">{t("product.breadcrumbCollection")}</Link>
          <span className="mx-2">/</span>
          <span className="text-onyx">{product.name}</span>
        </nav>
      </div>

      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <div className="bg-secondary overflow-hidden">
            <ProductImage
              product={{ ...product, image: product.gallery[active] ?? product.image }}
              loading="eager"
              className="w-full aspect-square"
            />
          </div>
          {product.gallery.length > 1 && (
            <div className="flex gap-3 mt-4">
              {product.gallery.map((g, i) => (
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
          )}

        </div>

        <div>
          <span className="text-[11px] uppercase tracking-[0.3em] text-gold">{product.category}</span>
          <h1 className="font-serif text-4xl md:text-5xl mt-3 leading-tight">{product.name}</h1>
          <p className="text-[11px] uppercase tracking-widest text-onyx/40 mt-2">{t("product.skuLabel", { sku: product.sku })}</p>

          <div className="mt-8 flex items-baseline gap-3">
            <span className="text-4xl font-serif">{fmt(bd.total)}</span>
            <span className="text-xs uppercase tracking-widest text-onyx/50">{t("product.vatIncluded")}</span>
          </div>

          <p className="text-onyx/70 mt-8 font-light leading-relaxed">{product.description}</p>

          <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-onyx/10 py-6">
            <Spec label={t("product.specKarat")} value={product.karat} />
            <Spec label={t("product.specWeight")} value={`${product.weight} ${locale === "fa" ? "گرم" : "g"}`} />
            <Spec label={t("product.specType")} value={product.typeLabel || product.category} />
            <Spec label={t("product.specGoldColor")} value={(product.color || t("product.dash")).replace("-", " ")} />
            <Spec label={t("product.specSize")} value={product.size || t("product.dash")} />
            <Spec label={t("product.specMaking")} value={`${Math.round(product.makingPct * 100)}%`} />
            <Spec label={t("product.specWearer")} value={tGender(product.gender === "unisex" ? "unisex" : product.gender, t)} />
            <Spec label={t("product.specReference")} value={product.code || product.sku} />
            <Spec label={t("product.specAvailability")} value={product.inStock === false ? t("product.availabilityReserved") : t("product.availabilityInStock")} />
            <Spec label={t("product.specGemstone")} value={product.gemstone || t("product.noGemstone")} />
          </dl>

          <div className="mt-8">
            <h4 className="text-[11px] uppercase tracking-widest font-bold mb-4">Live price breakdown</h4>
            <div className="space-y-2 text-sm">
              <Row label={`Gold value (${product.weight}g × ${formatToman(GOLD_RATE_PER_GRAM[product.karat])})`} value={formatToman(bd.gold)} />
              <Row label={`Making (${Math.round(product.makingPct * 100)}%)`} value={formatToman(bd.making)} />
              <Row label="Seller profit (7%)" value={formatToman(bd.profit)} />
              <Row label="Tax (2%)" value={formatToman(bd.tax)} />
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

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => toggle(product.id)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.2em] font-bold transition-colors ${
                has(product.id) ? "border-gold bg-gold text-onyx" : "border-onyx/15 hover:border-gold hover:text-gold"
              }`}
            >
              <Heart size={14} fill={has(product.id) ? "currentColor" : "none"} />
              {has(product.id) ? "Saved" : "Save to wishlist"}
            </button>
            <button
              onClick={shareProduct}
              className="inline-flex items-center gap-2 rounded-full border border-onyx/15 px-4 py-2 text-[11px] uppercase tracking-[0.2em] font-bold hover:border-gold hover:text-gold transition-colors"
            >
              <Share2 size={14} /> Share
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

      <section className="max-w-7xl mx-auto px-6 pb-20 pt-4 border-t border-onyx/10">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-gold">Customer reviews</p>
            <h2 className="mt-3 text-3xl">What buyers say about this piece</h2>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-3xl bg-secondary p-5">
                <div className="text-4xl font-semibold text-gold">{averageRating.toFixed(1)}</div>
                <p className="mt-2 text-sm text-onyx/60">Average rating</p>
              </div>
              <div className="rounded-3xl bg-secondary p-5">
                <div className="text-4xl font-semibold text-gold">{reviews.length}</div>
                <p className="mt-2 text-sm text-onyx/60">Review count</p>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-onyx/10 bg-white/60 p-5">
              <h3 className="text-lg">Leave a review</h3>
              <div className="mt-4 grid gap-3">
                <input value={reviewName} onChange={(e) => setReviewName(e.target.value)} placeholder="Your name" className="w-full border border-onyx/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-gold" />
                <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Tell us what you thought about the piece" rows={4} className="w-full border border-onyx/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-gold" />
                <label className="flex items-center gap-3 text-sm text-onyx/60">
                  Rating
                  <select value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))} className="border border-onyx/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-gold">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <option key={rating} value={rating}>
                        {rating} stars
                      </option>
                    ))}
                  </select>
                </label>
                <button onClick={submitReview} className="inline-flex items-center justify-center gap-2 bg-onyx px-5 py-3 text-[11px] uppercase tracking-[0.2em] font-bold text-parchment hover:bg-gold hover:text-onyx transition-all">
                  <Send size={14} /> Save review
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {reviews.map((review) => (
              <article key={`${review.name}-${review.date}-${review.text.slice(0, 12)}`} className="rounded-3xl border border-onyx/10 bg-white/70 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{review.name}</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-onyx/45">{review.date} {review.verified ? "· Verified buyer" : "· Saved locally"}</p>
                  </div>
                  <div className="flex items-center gap-1 text-gold">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} size={14} fill={index < review.rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-onyx/70">{review.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-20 border-t border-onyx/10">
          <h2 className="font-serif text-3xl mb-10">You may also love</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {related.map((r) => (
              <Link key={r.id} to="/shop/$id" params={{ id: r.id }} className="group">
                <div className="overflow-hidden bg-secondary mb-4">
                  <ProductImage product={r} className="w-full aspect-[4/5] group-hover:scale-105 transition-transform duration-700" />
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
