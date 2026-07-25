import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Shell } from "@/components/site/Chrome";
import { products, categories, priceBreakdown, formatToman, type Category, type Karat } from "@/lib/products";

type ShopSearch = {
  category: Category | "all";
  karat: Karat | "all";
  gender: "all" | "women" | "men" | "unisex";
  min: number;
  max: number;
  sort: "featured" | "price-asc" | "price-desc" | "weight-desc";
  q: string;
};

const DEFAULTS: ShopSearch = {
  category: "all",
  karat: "all",
  gender: "all",
  min: 0,
  max: 1_000_000_000,
  sort: "featured",
  q: "",
};

export const Route = createFileRoute("/shop")({
  validateSearch: (raw: Record<string, unknown>): ShopSearch => ({
    category: (raw.category as ShopSearch["category"]) || DEFAULTS.category,
    karat: (raw.karat as ShopSearch["karat"]) || DEFAULTS.karat,
    gender: (raw.gender as ShopSearch["gender"]) || DEFAULTS.gender,
    min: Number(raw.min) || DEFAULTS.min,
    max: Number(raw.max) || DEFAULTS.max,
    sort: (raw.sort as ShopSearch["sort"]) || DEFAULTS.sort,
    q: (raw.q as string) || "",
  }),
  head: () => ({
    meta: [
      { title: "Shop All Gold Jewelry & Bullion — Aurum" },
      { name: "description", content: "Browse Aurum's collection of 18K, 22K and 24K gold rings, necklaces, bracelets and certified bullion. Filter by karat, weight and price." },
      { property: "og:title", content: "Shop Aurum — Fine Gold Jewelry" },
      { property: "og:description", content: "Filter by karat, category, and price. Live gold-rate valuation on every piece." },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const update = (patch: Partial<ShopSearch>) =>
    navigate({ search: (prev: ShopSearch) => ({ ...prev, ...patch }) });

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (search.category !== "all" && p.category !== search.category) return false;
      if (search.karat !== "all" && p.karat !== search.karat) return false;
      if (search.gender !== "all" && p.gender !== search.gender) return false;
      const total = priceBreakdown(p).total;
      if (total < search.min || total > search.max) return false;
      if (search.q && !p.name.toLowerCase().includes(search.q.toLowerCase())) return false;
      return true;
    });
    if (search.sort === "price-asc") list = [...list].sort((a, b) => priceBreakdown(a).total - priceBreakdown(b).total);
    if (search.sort === "price-desc") list = [...list].sort((a, b) => priceBreakdown(b).total - priceBreakdown(a).total);
    if (search.sort === "weight-desc") list = [...list].sort((a, b) => b.weight - a.weight);
    return list;
  }, [search]);

  return (
    <Shell>
      <section className="border-b border-onyx/10">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <span className="text-[12px] uppercase tracking-[0.3em] text-gold mb-3 block">The Collection</span>
          <h1 className="font-serif text-5xl md:text-6xl leading-tight">Every piece, live-priced.</h1>
          <p className="text-onyx/60 mt-6 max-w-xl font-light">
            Filter Aurum's archive by category, karat, and weight. Prices update from today's rate,
            transparent to the last gram.
          </p>
          <div className="mt-10 flex flex-wrap gap-2">
            {categories.map((c) => {
              const active = search.category === c.slug;
              return (
                <button
                  key={c.slug}
                  onClick={() => update({ category: c.slug })}
                  className={`px-5 py-2 text-[11px] uppercase tracking-widest font-semibold border transition-all ${
                    active
                      ? "bg-onyx text-parchment border-onyx"
                      : "border-onyx/15 text-onyx hover:border-gold hover:text-gold"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12">
        <aside className="space-y-10">
          <div>
            <h4 className="text-[11px] uppercase tracking-widest font-bold mb-4">Search</h4>
            <input
              value={search.q}
              onChange={(e) => update({ q: e.target.value })}
              placeholder="Search pieces…"
              className="w-full bg-transparent border-b border-onyx/20 py-2 text-sm outline-none focus:border-gold"
            />
          </div>

          <FilterGroup label="Karat">
            {(["all", "18K", "22K", "24K"] as const).map((k) => (
              <RadioRow
                key={k}
                label={k === "all" ? "All karats" : k}
                checked={search.karat === k}
                onChange={() => update({ karat: k })}
              />
            ))}
          </FilterGroup>

          <FilterGroup label="Wearer">
            {(["all", "women", "men", "unisex"] as const).map((g) => (
              <RadioRow
                key={g}
                label={g === "all" ? "Everyone" : g[0].toUpperCase() + g.slice(1)}
                checked={search.gender === g}
                onChange={() => update({ gender: g })}
              />
            ))}
          </FilterGroup>

          <FilterGroup label="Price (Toman)">
            <div className="flex gap-2">
              <input
                type="number"
                value={search.min || ""}
                onChange={(e) => update({ min: Number(e.target.value) || 0 })}
                placeholder="Min"
                className="w-full bg-transparent border border-onyx/15 px-3 py-2 text-xs outline-none focus:border-gold"
              />
              <input
                type="number"
                value={search.max === DEFAULTS.max ? "" : search.max}
                onChange={(e) => update({ max: Number(e.target.value) || DEFAULTS.max })}
                placeholder="Max"
                className="w-full bg-transparent border border-onyx/15 px-3 py-2 text-xs outline-none focus:border-gold"
              />
            </div>
          </FilterGroup>

          <button
            onClick={() => navigate({ search: DEFAULTS })}
            className="text-[11px] uppercase tracking-widest text-gold border-b border-gold pb-1"
          >
            Reset filters
          </button>
        </aside>

        <div>
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <p className="text-xs uppercase tracking-widest text-onyx/50">
              {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
            </p>
            <label className="text-xs uppercase tracking-widest flex items-center gap-3">
              Sort
              <select
                value={search.sort}
                onChange={(e) => update({ sort: e.target.value as ShopSearch["sort"] })}
                className="bg-transparent border-b border-onyx/20 py-1 text-xs focus:outline-none focus:border-gold"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price · Low to high</option>
                <option value="price-desc">Price · High to low</option>
                <option value="weight-desc">Heaviest first</option>
              </select>
            </label>
          </div>

          {filtered.length === 0 ? (
            <div className="border border-dashed border-onyx/15 py-24 text-center">
              <p className="font-serif text-2xl">No pieces match your filters.</p>
              <button onClick={() => navigate({ search: DEFAULTS })} className="mt-4 text-[11px] uppercase tracking-widest text-gold border-b border-gold">
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14">
              {filtered.map((p) => {
                const { total } = priceBreakdown(p);
                return (
                  <Link
                    key={p.id}
                    to="/shop/$id"
                    params={{ id: p.id }}
                    className="group"
                  >
                    <div className="overflow-hidden bg-secondary mb-4">
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-serif text-lg leading-tight">{p.name}</h3>
                        <p className="text-[10px] uppercase tracking-widest text-onyx/50 mt-1">
                          {p.karat} · {p.weight}g
                        </p>
                      </div>
                      <p className="text-sm font-medium whitespace-nowrap">{formatToman(total)}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Shell>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-[11px] uppercase tracking-widest font-bold mb-4">{label}</h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function RadioRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`flex items-center gap-3 text-sm w-full text-left transition-colors ${
        checked ? "text-onyx font-medium" : "text-onyx/60 hover:text-gold"
      }`}
    >
      <span
        className={`w-3 h-3 rounded-full border ${
          checked ? "border-gold bg-gold" : "border-onyx/30"
        }`}
      />
      {label}
    </button>
  );
}
