import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Shell } from "@/components/site/Chrome";
import { SHOP_SEARCH_DEFAULT, type ShopSearch } from "@/lib/shop-search";
import { products, categories, priceBreakdown, formatToman, type Category, type Karat } from "@/lib/products";

const DEFAULTS: ShopSearch = SHOP_SEARCH_DEFAULT;

export const Route = createFileRoute("/shop")({
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
    q: (raw.q as string) || "",
  }),
  head: () => ({
    meta: [
      { title: "Shop All Gold Jewelry & Bullion â€” Aurum" },
      { name: "description", content: "Browse Aurum's collection of 18K, 22K and 24K gold rings, necklaces, bracelets and certified bullion. Filter by karat, weight and price." },
      { property: "og:title", content: "Shop Aurum â€” Fine Gold Jewelry" },
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
      if (search.color !== "all" && (p.color || "yellow") !== search.color) return false;
      if (search.gemstone !== "all" && (p.gemstone || "none") !== search.gemstone) return false;
      if (search.style !== "all" && (p.style || "classic") !== search.style) return false;
      if (search.occasion !== "all" && (p.occasion || "everyday") !== search.occasion) return false;
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
              placeholder="Search piecesâ€¦"
              className="w-full bg-transparent border-b border-onyx/20 py-2 text-sm outline-none focus:border-gold"
            />
          </div>

          <FilterGroup label="Karat">
            {(["all", "18K", "21K", "22K", "24K"] as const).map((k) => (
              <RadioRow
                key={k}
                label={k === "all" ? "All karats" : k}
                checked={search.karat === k}
                onChange={() => update({ karat: k })}
              />
            ))}
          </FilterGroup>

          <FilterGroup label="Wearer">
            {(["all", "women", "men", "children", "unisex"] as const).map((g) => (
              <RadioRow
                key={g}
                label={g === "all" ? "Everyone" : g[0].toUpperCase() + g.slice(1)}
                checked={search.gender === g}
                onChange={() => update({ gender: g })}
              />
            ))}
          </FilterGroup>

          <FilterGroup label="Gold Color">
            {(["all", "yellow", "white", "rose", "two-tone", "three-tone"] as const).map((c) => (
              <RadioRow
                key={c}
                label={c === "all" ? "All colors" : c.replace(/-/g, " ").split(" ").map(w => w[0].toUpperCase() + w.slice(1)).join(" ")}
                checked={search.color === c}
                onChange={() => update({ color: c })}
              />
            ))}
          </FilterGroup>

          <FilterGroup label="Gemstone">
            {(["all", "none", "diamond", "brilliant", "emerald", "ruby", "sapphire", "opal", "tanzanite", "pearl", "topaz", "amethyst"] as const).map((g) => (
              <RadioRow
                key={g}
                label={g === "all" ? "Any stone" : g === "none" ? "Without stone" : g[0].toUpperCase() + g.slice(1)}
                checked={search.gemstone === g}
                onChange={() => update({ gemstone: g })}
              />
            ))}
          </FilterGroup>

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

          <FilterGroup label="Occasion">
            {(["all", "everyday", "engagement", "wedding", "party", "gift", "investment"] as const).map((o) => (
              <RadioRow
                key={o}
                label={o === "all" ? "All occasions" : o === "party" ? "Party/Evening" : o[0].toUpperCase() + o.slice(1)}
                checked={search.occasion === o}
                onChange={() => update({ occasion: o })}
              />
            ))}
          </FilterGroup>

          <FilterGroup label="Availability / Stock">
            {(["all", "in-stock", "made-to-order"] as const).map((status) => (
              <RadioRow key={status} label={status === "all" ? "All availability" : status === "in-stock" ? "In stock" : "Made-to-order"} checked={search.stock === status} onChange={() => update({ stock: status })} />
            ))}
          </FilterGroup>

          <FilterGroup label="Weight (grams)">
            <RangeInputs from={search.minWeight} to={search.maxWeight} onFrom={(value) => update({ minWeight: value || 0 })} onTo={(value) => update({ maxWeight: value || 1000 })} />
          </FilterGroup>

          <FilterGroup label="Making Charge / Workmanship (%)">
            <RangeInputs from={search.minMaking} to={search.maxMaking} onFrom={(value) => update({ minMaking: value || 0 })} onTo={(value) => update({ maxMaking: value || 100 })} />
          </FilterGroup>

          <details className="border-y border-onyx/10 py-4 group">
            <summary className="text-[11px] uppercase tracking-widest font-bold cursor-pointer list-none flex justify-between">More specifications <span className="text-gold group-open:rotate-45 transition-transform">+</span></summary>
            <div className="pt-5 space-y-7">
              <FilterGroup label="Number of Stones"><StaticOptions options={["Single Stone", "Multiple Stones", "Without Stone"]} /></FilterGroup>
              <FilterGroup label="Shape / Cut"><StaticOptions options={["Round", "Oval", "Square", "Pear / Teardrop", "Heart", "Marquise", "Princess"]} /></FilterGroup>
              <FilterGroup label="Clasp Type"><StaticOptions options={["Stud", "Hoop", "Drop / Dangle"]} /></FilterGroup>
              <FilterGroup label="Chain Type"><StaticOptions options={["Flamingo", "Venetian", "Cartier", "Rope", "Figaro"]} /></FilterGroup>
              <FilterGroup label="Size"><StaticOptions options={["Ring Size", "Anklet Size", "Necklace Length"]} /></FilterGroup>
              <FilterGroup label="Manufacturing"><StaticOptions options={["Handmade", "Machine-Made"]} /></FilterGroup>
              <FilterGroup label="Material"><StaticOptions options={["Gold", "Gold & Diamond", "Gold & Gemstone"]} /></FilterGroup>
              <FilterGroup label="Brand"><StaticOptions options={["Aurum", "Partner Brands"]} /></FilterGroup>
              <FilterGroup label="Country of Origin"><StaticOptions options={["Iran", "Italy", "Turkey"]} /></FilterGroup>
            </div>
          </details>
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
                <option value="price-asc">Price Â· Low to high</option>
                <option value="price-desc">Price Â· High to low</option>
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
                    search={SHOP_SEARCH_DEFAULT}
                    className="group"
                  >
                    <div className="overflow-hidden bg-secondary mb-4 relative">
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {p.bestseller && (
                          <span className="bg-gold text-onyx text-[9px] px-2.5 py-1 font-bold uppercase tracking-wider">Bestseller</span>
                        )}
                        {p.newest && (
                          <span className="bg-emerald-600 text-white text-[9px] px-2.5 py-1 font-bold uppercase tracking-wider">New</span>
                        )}
                        {p.mostSold && (
                          <span className="bg-blue-600 text-white text-[9px] px-2.5 py-1 font-bold uppercase tracking-wider">Most Sold</span>
                        )}
                      </div>
                      {p.onSale && p.discount && (
                        <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] px-2.5 py-1.5 font-bold rounded">
                          -{p.discount}%
                        </div>
                      )}
                      {p.aiRecommended && (
                        <div className="absolute bottom-4 right-4 text-xl">âœ¨</div>
                      )}
                    </div>
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <div>
                        <h3 className="font-serif text-lg leading-tight group-hover:text-gold transition-colors">{p.name}</h3>
                        <p className="text-[10px] uppercase tracking-widest text-onyx/50 mt-1">
                          {p.karat} Â· {p.weight}g
                        </p>
                      </div>
                      <div className="text-right">
                        {p.rating && (
                          <div className="text-xs">
                            <span className="text-gold font-semibold">â˜… {p.rating}</span>
                            {p.reviews && <p className="text-[9px] text-onyx/40">({p.reviews})</p>}
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm font-medium mb-2">{formatToman(total)}</p>
                    {/* Features */}
                    <div className="space-y-1">
                      {p.freeShipping && <p className="text-[9px] text-emerald-600 font-medium">ðŸšš Free Shipping</p>}
                      {p.expressDelivery && <p className="text-[9px] text-blue-600 font-medium">âš¡ Express Delivery</p>}
                      {p.customizable && <p className="text-[9px] text-onyx/60 font-medium">âœï¸ Customizable</p>}
                      {p.sizeAdjustable && <p className="text-[9px] text-onyx/60 font-medium">âš™ï¸ Size Adjustable</p>}
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

function RangeInputs({ from, to, onFrom, onTo }: { from: number; to: number; onFrom: (value: number) => void; onTo: (value: number) => void }) {
  return <div className="flex gap-2"><input type="number" value={from || ""} onChange={(e) => onFrom(Number(e.target.value))} placeholder="From" className="w-full bg-transparent border border-onyx/15 px-3 py-2 text-xs outline-none focus:border-gold" /><input type="number" value={to >= 1000 ? "" : to} onChange={(e) => onTo(Number(e.target.value))} placeholder="To" className="w-full bg-transparent border border-onyx/15 px-3 py-2 text-xs outline-none focus:border-gold" /></div>;
}

function StaticOptions({ options }: { options: string[] }) {
  return <div className="space-y-2">{options.map((option) => <label key={option} className="flex items-center gap-3 text-sm text-onyx/60 cursor-pointer"><input type="checkbox" className="accent-[var(--gold)]" />{option}</label>)}</div>;
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



