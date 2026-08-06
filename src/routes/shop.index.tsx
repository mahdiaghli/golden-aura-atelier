  import { createFileRoute, Link } from "@tanstack/react-router";
  import { useMemo, useState } from "react";
  import { Heart, Share2, SlidersHorizontal, X } from "lucide-react";
  import { toast } from "sonner";
  import { Shell } from "@/components/site/Chrome";
  import { ProductImage } from "@/components/site/ProductImage";
  import { SHOP_SEARCH_DEFAULT, type ShopSearch } from "@/lib/shop-search";
  import {
    products,
    categories,
    priceBreakdown,
    formatToman,
    matchesQuickTag,
    QUICK_TAGS,
    type QuickTag,
  } from "@/lib/products";
  import { useLiveGold } from "@/lib/live-gold";
  import { useWishlist } from "@/lib/wishlist";

  const DEFAULTS: ShopSearch = SHOP_SEARCH_DEFAULT;

  export const Route = createFileRoute("/shop/")({
    validateSearch: (raw: Record<string, unknown>): ShopSearch => ({
      category: (raw.category as ShopSearch["category"]) || DEFAULTS.category,
      karat: (raw.karat as ShopSearch["karat"]) || DEFAULTS.karat,
      gender: (raw.gender as ShopSearch["gender"]) || DEFAULTS.gender,
      color: (raw.color as ShopSearch["color"]) || DEFAULTS.color,
      gemstone: (raw.gemstone as ShopSearch["gemstone"]) || DEFAULTS.gemstone,
      style: (raw.style as ShopSearch["style"]) || DEFAULTS.style,
      occasion: (raw.occasion as ShopSearch["occasion"]) || DEFAULTS.occasion,
      stock: (raw.stock as ShopSearch["stock"]) || DEFAULTS.stock,
      min: Number(raw.min) || DEFAULTS.min,
      max: Number(raw.max) || DEFAULTS.max,
      minWeight: Number(raw.minWeight) || DEFAULTS.minWeight,
      maxWeight: Number(raw.maxWeight) || DEFAULTS.maxWeight,
      minMaking: Number(raw.minMaking) || DEFAULTS.minMaking,
      maxMaking: Number(raw.maxMaking) || DEFAULTS.maxMaking,
      sort: (raw.sort as ShopSearch["sort"]) || DEFAULTS.sort,
      tag: (raw.tag as QuickTag) || DEFAULTS.tag,
      q: (raw.q as string) || "",
    }),
    head: () => ({
      meta: [
        { title: "Shop All Gold Jewelry & Bullion — Aurum" },
        {
          name: "description",
          content:
            "Browse Aurum's collection of 18K, 22K and 24K gold rings, necklaces, bracelets and certified bullion. Filter by karat, weight and price.",
        },
        { property: "og:title", content: "Shop Aurum — Fine Gold Jewelry" },
        {
          property: "og:description",
          content: "Filter by karat, category, and price. Live gold-rate valuation on every piece.",
        },
      ],
    }),
    component: ShopPage,
  });

  function ShopPage() {
    const search = Route.useSearch();
    const navigate = Route.useNavigate();
    const { has, toggle } = useWishlist();
    const { rate18, isLive } = useLiveGold();

    const [visible, setVisible] = useState(24);
    const [mobileFilters, setMobileFilters] = useState(false);

    const update = (patch: Partial<ShopSearch>) =>
      navigate({ search: (prev: ShopSearch) => ({ ...prev, ...patch }) });

    const activeFilterCount = useMemo(() => {
      let n = 0;
      if (search.category !== "all") n++;
      if (search.karat !== "all") n++;
      if (search.gender !== "all") n++;
      if (search.color !== "all") n++;
      if (search.gemstone !== "all") n++;
      if (search.style !== "all") n++;
      if (search.occasion !== "all") n++;
      if (search.stock !== "all") n++;
      if (search.tag !== "all") n++;
      if (search.q) n++;
      if (search.min > DEFAULTS.min || search.max < DEFAULTS.max) n++;
      return n;
    }, [search]);

    const shareProduct = async (product: (typeof products)[number]) => {
      const url = new URL(`/shop/${product.id}`, window.location.origin).toString();
      try {
        if (navigator.share) {
          await navigator.share({ title: product.name, text: product.description, url });
        } else {
          await navigator.clipboard.writeText(url);
        }
        toast.success("Link copied and ready to share");
      } catch {
        toast.error("Sharing was cancelled");
      }
    };

    const filtered = useMemo(() => {
      let list = products.filter((p) => {
        if (search.category !== "all" && p.category !== search.category) return false;
        if (search.karat !== "all" && p.karat !== search.karat) return false;
        if (search.gender !== "all" && p.gender !== search.gender) return false;
        if (search.color !== "all" && (p.color || "yellow") !== search.color) return false;
        if (search.gemstone !== "all" && (p.gemstone || "none") !== search.gemstone) return false;
        if (search.style !== "all" && (p.style || "classic") !== search.style) return false;
        if (search.occasion !== "all" && (p.occasion || "everyday") !== search.occasion) return false;
        if (search.stock === "in-stock" && p.inStock === false) return false;
        if (search.stock === "made-to-order" && !p.madeToOrder) return false;
        if (p.weight < search.minWeight || p.weight > search.maxWeight) return false;
        const makingPct = p.makingPct * 100;
        if (makingPct < search.minMaking || makingPct > search.maxMaking) return false;
        const total = priceBreakdown(p).total;
        if (total < search.min || total > search.max) return false;
        if (search.tag !== "all" && !matchesQuickTag(p, search.tag)) return false;
        if (
          search.q &&
          !`${p.name} ${p.sku} ${p.typeLabel ?? ""}`.toLowerCase().includes(search.q.toLowerCase())
        )
          return false;
        return true;
      });
      if (search.sort === "price-asc")
        list = [...list].sort((a, b) => priceBreakdown(a).total - priceBreakdown(b).total);
      if (search.sort === "price-desc")
        list = [...list].sort((a, b) => priceBreakdown(b).total - priceBreakdown(a).total);
      if (search.sort === "weight-desc") list = [...list].sort((a, b) => b.weight - a.weight);
      return list;
    }, [search, rate18]);
  function DualRangeSlider({
    min,
    max,
    step = 1,
    valueMin,
    valueMax,
    onChangeMin,
    onChangeMax,
    formatValue,
  }: {
    min: number;
    max: number;
    step?: number;
    valueMin: number;
    valueMax: number;
    onChangeMin: (v: number) => void;
    onChangeMax: (v: number) => void;
    formatValue?: (v: number) => string;
  }) {
    const lo = Math.min(valueMin, valueMax);
    const hi = Math.max(valueMin, valueMax);
    const range = max - min || 1;
    const leftPct = ((lo - min) / range) * 100;
    const rightPct = ((hi - min) / range) * 100;

    const clamp = (v: number) => Math.min(max, Math.max(min, v));

    return (
      <div className="space-y-3">
        <div className="relative h-6">
          {/* track */}
          <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-onyx/10" />
          {/* active range */}
          <div
            className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gold"
            style={{ left: `${leftPct}%`, width: `${rightPct - leftPct}%` }}
          />
          {/* min thumb */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={lo}
            onChange={(e) => {
              const next = clamp(Number(e.target.value));
              onChangeMin(Math.min(next, hi));
            }}
            className="pointer-events-none absolute inset-0 h-full w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-20 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gold [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:relative [&::-moz-range-thumb]:z-20 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-gold [&::-moz-range-thumb]:bg-white"
          />
          {/* max thumb */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={hi}
            onChange={(e) => {
              const next = clamp(Number(e.target.value));
              onChangeMax(Math.max(next, lo));
            }}
            className="pointer-events-none absolute inset-0 h-full w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-30 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gold [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:relative [&::-moz-range-thumb]:z-30 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-gold [&::-moz-range-thumb]:bg-white"
          />
        </div>

        <div className="flex items-center justify-between gap-2 text-[11px] text-onyx/55">
          <span className="truncate font-medium text-onyx/70">
            {formatValue ? formatValue(lo) : lo}
          </span>
          <span className="text-onyx/30">—</span>
          <span className="truncate text-right font-medium text-onyx/70">
            {formatValue ? formatValue(hi) : hi}
          </span>
        </div>
      </div>
    );
  }
  
  const filtersPanel = (
  <div className="space-y-8">
    {/* Search */}
    <div>
      <h4 className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-onyx/50">Search</h4>
      <input
        value={search.q}
        onChange={(e) => update({ q: e.target.value })}
        placeholder="Search pieces…"
        className="w-full border-b border-onyx/15 bg-transparent py-2.5 text-sm outline-none transition focus:border-gold"
      />
    </div>

    

{/* Category */}
<FilterGroup label="Category">
  {(
    [
      { slug: "all", label: "All Collections" },
      { slug: "rings", label: "Rings" },
      { slug: "necklaces", label: "Necklaces" },
      { slug: "bracelets", label: "Bracelets" },
      { slug: "earrings", label: "Earrings" },
      { slug: "sets", label: "Sets" },
      { slug: "bullion", label: "Investment" },
    ] as const
  ).map((c) => (
    <RadioRow
      key={c.slug}
      label={c.label}
      checked={search.category === c.slug}
      onChange={() => update({ category: c.slug })}
    />
  ))}
</FilterGroup>

    {/* Weight */}
    <FilterGroup label="Weight (g)">
      <DualRangeSlider
        min={0}
        max={200}
        step={0.1}
        valueMin={search.minWeight}
        valueMax={search.maxWeight > 200 ? 200 : search.maxWeight}
        onChangeMin={(v) => update({ minWeight: v })}
        onChangeMax={(v) => update({ maxWeight: v >= 200 ? 1000 : v })}
        formatValue={(v) => `${v} g`}
      />
    </FilterGroup>

    {/* Price */}
    <FilterGroup label="Price (Toman)">
      <DualRangeSlider
        min={DEFAULTS.min}
        max={DEFAULTS.max}
        step={Math.max(1, Math.round(DEFAULTS.max / 200))}
        valueMin={search.min}
        valueMax={search.max}
        onChangeMin={(v) => update({ min: v })}
        onChangeMax={(v) => update({ max: v })}
        formatValue={(v) => formatToman(v)}
      />
    </FilterGroup>

{/* Quick Filters (remaining items) */}
<FilterGroup label="Quick Filters">
  {(
    [
      { id: "all", label: "All" },
      { id: "on-sale", label: "On sale" },
      { id: "most-sold", label: "Most sold" },
      { id: "new-arrivals", label: "New arrivals" },
      { id: "recommended", label: "Recommended" },
      { id: "letters-names", label: "Letters & names" },
      { id: "birth-month", label: "Birth month" },
      { id: "lightweight", label: "Lightweight" },
    ] as const
  ).map((item) => (
    <RadioRow
      key={item.id}
      label={item.label}
      checked={search.tag === item.id}
      onChange={() => update({ tag: item.id as QuickTag })}
    />
  ))}
</FilterGroup>

{/* Chain Style (Cartier, Figaro, ...) */}
<FilterGroup label="Chain Style">
  {(
    [
      { id: "all", label: "All styles" },
      { id: "cartier-model", label: "Cartier model" },
      { id: "figaro", label: "Figaro" },
      { id: "venetian", label: "Venetian" },
      { id: "rope", label: "Rope" },
      { id: "flamingo", label: "Flamingo" },
    ] as const
  ).map((item) => (
    <RadioRow
      key={item.id}
      label={item.label}
      checked={search.tag === item.id}
      onChange={() => update({ tag: item.id as QuickTag })}
    />
  ))}
</FilterGroup>

    {/* Wearer */}
    <FilterGroup label="Wearer">
      {(["all", "women", "children"] as const).map((g) => (
        <RadioRow
          key={g}
          label={g === "all" ? "Everyone" : g[0].toUpperCase() + g.slice(1)}
          checked={search.gender === g}
          onChange={() => update({ gender: g })}
        />
      ))}
    </FilterGroup>

    {/* Gold Color */}
    <FilterGroup label="Gold Color">
      {(["all", "yellow", "white", "rose", "two-tone", "three-tone"] as const).map((c) => (
        <RadioRow
          key={c}
          label={
            c === "all"
              ? "All colors"
              : c
                  .replace(/-/g, " ")
                  .split(" ")
                  .map((w) => w[0].toUpperCase() + w.slice(1))
                  .join(" ")
          }
          checked={search.color === c}
          onChange={() => update({ color: c })}
        />
      ))}
    </FilterGroup>

    {/* Style */}
    <FilterGroup label="Style">
      {(["all", "classic", "minimal", "modern", "luxury", "vintage", "sporty"] as const).map((s) => (
        <RadioRow
          key={s}
          label={s === "all" ? "All styles" : s[0].toUpperCase() + s.slice(1)}
          checked={search.style === s}
          onChange={() => update({ style: s })}
        />
      ))}
    </FilterGroup>

    {/* Occasion */}
    <FilterGroup label="Occasion">
      {(["all", "everyday", "engagement", "wedding", "gift", "investment"] as const).map((o) => (
        <RadioRow
          key={o}
          label={o === "all" ? "All occasions" : o[0].toUpperCase() + o.slice(1)}
          checked={search.occasion === o}
          onChange={() => update({ occasion: o })}
        />
      ))}
    </FilterGroup>

    {/* Availability */}
    <FilterGroup label="Availability">
      {(["all", "in-stock", "made-to-order"] as const).map((status) => (
        <RadioRow
          key={status}
          label={
            status === "all"
              ? "All availability"
              : status === "in-stock"
                ? "In stock"
                : "Made-to-order"
          }
          checked={search.stock === status}
          onChange={() => update({ stock: status })}
        />
      ))}
    </FilterGroup>

    <button
      type="button"
      onClick={() => navigate({ search: DEFAULTS })}
      className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold underline-offset-4 hover:underline"
    >
      Reset all filters
    </button>
  </div>
);

    return (
      <Shell>
        {/* Hero */}
        {/* <section className="relative overflow-hidden border-b border-onyx/8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(201,162,39,0.12),_transparent_55%)]" />
          <div className="relative mx-auto max-w-7xl px-6 pb-12 pt-14 md:pb-16 md:pt-20"> */}
            {/* <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-gold">The Collection</p> */}
            {/* <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-[1.1] tracking-tight md:text-6xl">
              Every piece,{" "}
              <span className="italic text-onyx/80">live-priced</span>
            </h1>
            <p className="mt-5 max-w-lg text-[15px] font-light leading-relaxed text-onyx/60">
              Filter by category, karat, and weight. Transparent pricing from today’s gold rate — down
              to the last gram.
            </p> */}

            {/* <div className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-gold/30 bg-white/70 px-4 py-2 text-[11px] backdrop-blur-sm">
              <span
                className={`h-1.5 w-1.5 rounded-full ${isLive ? "animate-pulse bg-emerald-500" : "bg-onyx/30"}`}
              />
              {isLive ? (
                <span>
                  Live 18K · <strong className="text-gold">{formatToman(rate18)}</strong>
                  <span className="text-onyx/45"> / gram</span>
                </span>
              ) : (
                <span className="text-onyx/50">Loading today’s rate…</span>
              )}
            </div>  */}

            {/* Categories */}
            {/* <div className="mt-10 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((c) => {
                const active = search.category === c.slug;
                return (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => update({ category: c.slug })}
                    className={`shrink-0 rounded-full px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition-all ${
                      active
                        ? "bg-onyx text-parchment shadow-md"
                        : "border border-onyx/12 bg-white/50 text-onyx/70 hover:border-gold/50 hover:text-gold"
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>  */}

             {/* Quick tags */}
            {/* <div className="mt-4 flex flex-wrap gap-2">
              {QUICK_TAGS.map((tag) => {
                const active = search.tag === tag.id;
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => update({ tag: tag.id })}
                    className={`rounded-full px-3.5 py-1.5 text-[11px] transition-all ${
                      active
                        ? "bg-gold/90 font-medium text-onyx"
                        : "bg-onyx/[0.04] text-onyx/55 hover:bg-onyx/[0.08] hover:text-onyx"
                    }`}
                  >
                    {tag.label}
                  </button>
                );
              })}
            </div> */}
          {/* </div>
        </section> */}

        {/* Toolbar mobile */}
        <div className="sticky top-16 z-30 border-b border-onyx/8 bg-parchment/90 backdrop-blur-md lg:hidden">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-6 py-3">
            <button
              type="button"
              onClick={() => setMobileFilters(true)}
              className="inline-flex items-center gap-2 rounded-full border border-onyx/15 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider"
            >
              <SlidersHorizontal size={14} />
              Filters
              {activeFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-onyx">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <p className="text-[11px] uppercase tracking-widest text-onyx/45">
              {filtered.length} pieces
            </p>
          </div>
        </div>

        {/* Mobile filter drawer */}
        {mobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-onyx/40"
              aria-label="Close filters"
              onClick={() => setMobileFilters(false)}
            />
            <div className="absolute inset-y-0 left-0 flex w-[min(100%,320px)] flex-col bg-parchment shadow-2xl">
              <div className="flex items-center justify-between border-b border-onyx/10 px-5 py-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em]">Filters</p>
                <button type="button" onClick={() => setMobileFilters(false)} aria-label="Close">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-6">{filtersPanel}</div>
              <div className="border-t border-onyx/10 p-4">
                <button
                  type="button"
                  onClick={() => setMobileFilters(false)}
                  className="w-full rounded-xl bg-onyx py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-parchment"
                >
                  Show {filtered.length} pieces
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main */}
        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 lg:grid-cols-[220px_1fr] lg:gap-14 lg:py-16">
          <aside className="hidden lg:block">
            <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
              {filtersPanel}
            </div>
          </aside>

          <div>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-onyx/40">
                  {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
                </p>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={() => navigate({ search: DEFAULTS })}
                    className="mt-1 text-[11px] text-gold hover:underline"
                  >
                    Clear {activeFilterCount} active filter{activeFilterCount > 1 ? "s" : ""}
                  </button>
                )}
              </div>
              <label className="flex items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-onyx/50">
                Sort
                <select
                  value={search.sort}
                  onChange={(e) => update({ sort: e.target.value as ShopSearch["sort"] })}
                  className="border-b border-onyx/20 bg-transparent py-1 text-xs text-onyx outline-none focus:border-gold"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price · Low to high</option>
                  <option value="price-desc">Price · High to low</option>
                  <option value="weight-desc">Heaviest first</option>
                </select>
              </label>
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-onyx/15 bg-white/40 px-6 py-24 text-center">
                <p className="font-serif text-2xl md:text-3xl">No pieces match</p>
                <p className="mt-2 text-sm text-onyx/50">Try widening filters or clearing search.</p>
                <button
                  type="button"
                  onClick={() => navigate({ search: DEFAULTS })}
                  className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold underline-offset-4 hover:underline"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.slice(0, visible).map((p) => {
                  const { total } = priceBreakdown(p);
                  const liked = has(p.id);
                  return (
                    <article key={p.id} className="group flex flex-col">
                      <div className="relative mb-4 overflow-hidden rounded-2xl bg-[#f0e9dc]">
                        <Link
                          to="/shop/$id"
                          params={{ id: p.id }}
                          search={SHOP_SEARCH_DEFAULT}
                          className="block"
                        >
                          <ProductImage
                            product={p}
                            className="aspect-[4/5] w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                          />
                        </Link>

                        {/* Badges */}
                        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                          {p.bestseller && (
                            <Badge className="bg-gold text-onyx">Bestseller</Badge>
                          )}
                          {p.newest && <Badge className="bg-emerald-700 text-white">New</Badge>}
                          {p.mostSold && <Badge className="bg-onyx text-parchment">Most sold</Badge>}
                          {p.onSale && p.discount && (
                            <Badge className="bg-red-600 text-white">−{p.discount}%</Badge>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                          <IconBtn
                            label={liked ? "Remove from wishlist" : "Add to wishlist"}
                            active={liked}
                            onClick={() => toggle(p.id)}
                          >
                            <Heart size={15} fill={liked ? "currentColor" : "none"} strokeWidth={1.6} />
                          </IconBtn>
                          <IconBtn label={`Share ${p.name}`} onClick={() => shareProduct(p)}>
                            <Share2 size={15} strokeWidth={1.6} />
                          </IconBtn>
                        </div>

                        {/* Hover strip */}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-onyx/50 to-transparent p-4 pt-10 transition duration-300 group-hover:translate-y-0">
                          <p className="text-[10px] uppercase tracking-wider text-parchment/90">
                            View details
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Link
                              to="/shop/$id"
                              params={{ id: p.id }}
                              search={SHOP_SEARCH_DEFAULT}
                              className="block truncate font-medium leading-snug transition hover:text-gold"
                            >
                              {p.name}
                            </Link>
                            <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-onyx/40">
                              {p.karat} · {p.weight}g
                            </p>
                          </div>
                          {p.rating != null && (
                            <div className="shrink-0 text-right">
                              <span className="text-xs font-medium text-gold">★ {p.rating}</span>
                              {p.reviews != null && (
                                <p className="text-[9px] text-onyx/35">({p.reviews})</p>
                              )}
                            </div>
                          )}
                        </div>

                        <p className="mt-3 text-[15px] font-medium tracking-tight">
                          {formatToman(total)}
                        </p>

                        <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
                          {p.freeShipping && <Chip>Free shipping</Chip>}
                          {p.expressDelivery && <Chip>Express</Chip>}
                          {p.customizable && <Chip>Custom</Chip>}
                          {p.sizeAdjustable && <Chip>Adjustable</Chip>}
                          {p.madeToOrder && <Chip>Made to order</Chip>}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {filtered.length > visible && (
              <div className="mt-16 text-center">
                <button
                  type="button"
                  onClick={() => setVisible((v) => v + 24)}
                  className="rounded-full border border-onyx/15 px-10 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] transition hover:border-gold hover:text-gold"
                >
                  Load more · {filtered.length - visible} left
                </button>
              </div>
            )}
          </div>
        </section>
      </Shell>
    );
  }

  /* ——— UI atoms ——— */

  function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
      <span
        className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider shadow-sm ${className ?? ""}`}
      >
        {children}
      </span>
    );
  }

  function Chip({ children }: { children: React.ReactNode }) {
    return (
      <span className="rounded-full bg-onyx/[0.05] px-2 py-0.5 text-[9px] font-medium tracking-wide text-onyx/55">
        {children}
      </span>
    );
  }

  function IconBtn({
    children,
    label,
    onClick,
    active,
  }: {
    children: React.ReactNode;
    label: string;
    onClick: () => void;
    active?: boolean;
  }) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className={`rounded-full border p-2.5 shadow-sm backdrop-blur-md transition ${
          active
            ? "border-gold bg-gold text-onyx"
            : "border-white/50 bg-white/90 text-onyx hover:border-gold hover:text-gold"
        }`}
      >
        {children}
      </button>
    );
  }

  function RangeInputs({
    from,
    to,
    onFrom,
    onTo,
  }: {
    from: number;
    to: number;
    onFrom: (value: number) => void;
    onTo: (value: number) => void;
  }) {
    return (
      <div className="flex gap-2">
        <input
          type="number"
          value={from || ""}
          onChange={(e) => onFrom(Number(e.target.value))}
          placeholder="From"
          className="w-full rounded-lg border border-onyx/12 bg-white/50 px-3 py-2 text-xs outline-none focus:border-gold"
        />
        <input
          type="number"
          value={to >= 1000 ? "" : to}
          onChange={(e) => onTo(Number(e.target.value))}
          placeholder="To"
          className="w-full rounded-lg border border-onyx/12 bg-white/50 px-3 py-2 text-xs outline-none focus:border-gold"
        />
      </div>
    );
  }

  function StaticOptions({ options }: { options: string[] }) {
    return (
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-3 text-sm text-onyx/60 hover:text-onyx"
          >
            <input type="checkbox" className="accent-[var(--gold,#c9a227)]" />
            {option}
          </label>
        ))}
      </div>
    );
  }

  function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
    return (
      <div>
        <h4 className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-onyx/50">{label}</h4>
        <div className="space-y-1.5">{children}</div>
      </div>
    );
  }

  function RadioRow({
    label,
    checked,
    onChange,
  }: {
    label: string;
    checked: boolean;
    onChange: () => void;
  }) {
    return (
      <button
        type="button"
        onClick={onChange}
        className={`flex w-full items-center gap-3 rounded-lg px-1 py-1.5 text-left text-sm transition ${
          checked ? "font-medium text-onyx" : "text-onyx/55 hover:text-gold"
        }`}
      >
        <span
          className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border transition ${
            checked ? "border-gold bg-gold" : "border-onyx/25"
          }`}
        >
          {checked && <span className="h-1 w-1 rounded-full bg-onyx" />}
        </span>
        {label}
      </button>
    );
  }