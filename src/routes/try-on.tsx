import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  Camera,
  Heart,
  ImagePlus,
  RotateCcw,
  ShoppingBag,
  Upload,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { toast } from "sonner";
import { Shell } from "@/components/site/Chrome";
import { ProductImage } from "@/components/site/ProductImage";
import { products, priceBreakdown, formatToman } from "@/lib/products";
import { useWishlist } from "@/lib/wishlist";
import { useCart } from "@/lib/cart";
import { SHOP_SEARCH_DEFAULT } from "@/lib/shop-search";

export const Route = createFileRoute("/try-on")({
  head: () => ({
    meta: [
      { title: "Virtual Try-On — Necklaces & Earrings | Aurum" },
      {
        name: "description",
        content:
          "Upload your photo and try on necklaces and earrings virtually. Save favorites or add to cart.",
      },
    ],
  }),
  component: TryOnPage,
});

type OverlayKind = "necklace" | "earrings";

type TryOnProduct = (typeof products)[number] & {
  tryOnKind: OverlayKind;
};

/** محصولات مناسب پرو مجازی */
function getTryOnCatalog(): TryOnProduct[] {
  return products
    .filter((p) => {
      const cat = (p.category || "").toLowerCase();
      const name = (p.name || "").toLowerCase();
      const isNecklace =
        cat.includes("necklace") ||
        cat.includes("pendant") ||
        name.includes("necklace") ||
        name.includes("pendant") ||
        name.includes("chain");
      const isEarring =
        cat.includes("earring") ||
        cat.includes("bracelet") === false && name.includes("earring");
      // اگر category دقیق‌تری دارید، همان را جایگزین کنید
      return isNecklace || isEarring || cat === "necklaces" || cat === "earrings";
    })
    .map((p) => {
      const cat = (p.category || "").toLowerCase();
      const name = (p.name || "").toLowerCase();
      const tryOnKind: OverlayKind =
        cat.includes("earring") || name.includes("earring") ? "earrings" : "necklace";
      return { ...p, tryOnKind };
    });
}

export default function TryOnPage() {
  return <TryOnPageInner />;
}

function TryOnPageInner() {
  const catalog = useMemo(() => getTryOnCatalog(), []);
  const { has, toggle } = useWishlist();
  const cart = useCart();

  const fileRef = useRef<HTMLInputElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const [faceUrl, setFaceUrl] = useState<string | null>(null);
  const [kind, setKind] = useState<OverlayKind | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(catalog[0]?.id ?? null);

  // موقعیت و مقیاس لایه جواهر (درصد نسبت به کادر)
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0); // درصد از مرکز
  const [offsetY, setOffsetY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  const selected = catalog.find((p) => p.id === selectedId) ?? catalog[0] ?? null;

  const filtered = useMemo(() => {
    if (kind === "all") return catalog;
    return catalog.filter((p) => p.tryOnKind === kind);
  }, [catalog, kind]);

  const onUpload = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Max file size is 10MB");
      return;
    }
    if (faceUrl) URL.revokeObjectURL(faceUrl);
    const url = URL.createObjectURL(file);
    setFaceUrl(url);
    // پیش‌فرض موقعیت مناسب گردنبند / گوشواره
    resetTransform(selected?.tryOnKind ?? "necklace");
    toast.success("Photo loaded — drag the jewelry to adjust");
  };

  const resetTransform = (k: OverlayKind) => {
    setScale(k === "earrings" ? 0.55 : 0.85);
    setOffsetX(0);
    setOffsetY(k === "earrings" ? -8 : 18);
  };

  const clearFace = () => {
    if (faceUrl) URL.revokeObjectURL(faceUrl);
    setFaceUrl(null);
  };

  const selectProduct = (p: TryOnProduct) => {
    setSelectedId(p.id);
    resetTransform(p.tryOnKind);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!faceUrl || !selected) return;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, ox: offsetX, oy: offsetY };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || !dragStart.current || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const dx = ((e.clientX - dragStart.current.x) / rect.width) * 100;
    const dy = ((e.clientY - dragStart.current.y) / rect.height) * 100;
    setOffsetX(Math.max(-40, Math.min(40, dragStart.current.ox + dx)));
    setOffsetY(Math.max(-40, Math.min(45, dragStart.current.oy + dy)));
  };

  const onPointerUp = () => {
    setDragging(false);
    dragStart.current = null;
  };

  const addToCart = useCallback(() => {
    if (!selected) return;
    // اگر API سبد شما add(id) یا add(product) است، هماهنگ کنید:
    try {
      // نمونه رایج:
      // cart.add(selected.id);
      // یا:
      (cart as { add?: (id: string) => void; addItem?: (p: unknown) => void }).add?.(selected.id);
      (cart as { addItem?: (p: unknown) => void }).addItem?.(selected);
      toast.success("Added to bag");
    } catch {
      toast.error("Could not add to bag — check cart API");
    }
  }, [cart, selected]);

  const total = selected ? priceBreakdown(selected).total : 0;

  // تصویر overlay: ترجیح با image محصول؛ اگر PNG شفاف دارید بهتر است
  const overlaySrc =
    (selected as { tryOnImage?: string; image?: string; imageUrl?: string } | null)?.tryOnImage ||
    (selected as { image?: string } | null)?.image ||
    null;

  return (
    <Shell>
      <section className="border-b border-onyx/10 bg-gradient-to-b from-white/80 to-transparent">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-18">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-gold">
            Virtual try-on
          </p>
          <h1 className="mt-3 max-w-2xl font-serif text-4xl leading-tight md:text-5xl">
            See it on you before you buy
          </h1>
          <p className="mt-4 max-w-xl text-sm font-light leading-relaxed text-onyx/60">
            Upload a clear front-facing photo, pick a necklace or earrings, then drag and scale the
            piece on your image. Save to wishlist or add to bag.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1fr_340px] lg:py-16">
        {/* Stage */}
        <div>
          <div
            ref={stageRef}
            className="relative mx-auto aspect-[3/4] max-h-[min(78vh,720px)] w-full max-w-lg overflow-hidden rounded-[1.75rem] border border-onyx/10 bg-[#ebe4d6] shadow-[0_24px_60px_rgba(30,20,10,0.08)]"
          >
            {!faceUrl ? (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex h-full w-full flex-col items-center justify-center gap-4 px-8 text-center transition hover:bg-white/30"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-onyx/25 bg-white/50">
                  <ImagePlus className="text-onyx/45" size={28} />
                </div>
                <div>
                  <p className="font-serif text-xl">Upload your photo</p>
                  <p className="mt-2 text-xs text-onyx/50">
                    Front face, good light · JPG or PNG · max 10MB
                  </p>
                </div>
                <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-onyx px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-parchment">
                  <Upload size={14} /> Choose image
                </span>
              </button>
            ) : (
              <>
                <img
                  src={faceUrl}
                  alt="Your photo"
                  className="h-full w-full object-cover"
                  draggable={false}
                />

                {/* Jewelry overlay */}
                {selected && (
                  <div
                    className={`absolute left-1/2 top-1/2 touch-none select-none ${
                      dragging ? "cursor-grabbing" : "cursor-grab"
                    }`}
                    style={{
                      width: selected.tryOnKind === "earrings" ? "42%" : "70%",
                      transform: `translate(calc(-50% + ${offsetX}%), calc(-50% + ${offsetY}%)) scale(${scale})`,
                      transformOrigin: "center center",
                    }}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerUp}
                  >
                    {overlaySrc ? (
                      <img
                        src={overlaySrc}
                        alt={selected.name}
                        className="w-full drop-shadow-lg"
                        draggable={false}
                        style={{
                          // اگر پس‌زمینه سفید دارید، تقریبی شفاف‌سازی ملایم:
                          mixBlendMode: "multiply",
                        }}
                      />
                    ) : (
                      // fallback وقتی تصویر جدا برای try-on ندارید
                      <div className="flex flex-col items-center opacity-90">
                        <ProductImage
                          product={selected}
                          className="w-full object-contain drop-shadow-lg"
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="absolute left-3 top-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="rounded-full border border-white/40 bg-white/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider backdrop-blur"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Camera size={12} /> Change
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={clearFace}
                    className="rounded-full border border-white/40 bg-white/90 p-1.5 backdrop-blur"
                    aria-label="Remove photo"
                  >
                    <X size={14} />
                  </button>
                </div>

                <p className="absolute bottom-3 left-0 right-0 text-center text-[10px] text-white/90 drop-shadow">
                  Drag jewelry · use controls to scale
                </p>
              </>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              onUpload(e.target.files);
              e.target.value = "";
            }}
          />

          {/* Controls */}
          {faceUrl && selected && (
            <div className="mx-auto mt-6 flex max-w-lg flex-wrap items-center justify-center gap-3">
              <ControlBtn
                label="Smaller"
                onClick={() => setScale((s) => Math.max(0.35, +(s - 0.08).toFixed(2)))}
              >
                <ZoomOut size={16} />
              </ControlBtn>
              <ControlBtn
                label="Larger"
                onClick={() => setScale((s) => Math.min(1.8, +(s + 0.08).toFixed(2)))}
              >
                <ZoomIn size={16} />
              </ControlBtn>
              <ControlBtn label="Reset position" onClick={() => resetTransform(selected.tryOnKind)}>
                <RotateCcw size={16} />
              </ControlBtn>
              <span className="text-[11px] tabular-nums text-onyx/45">{Math.round(scale * 100)}%</span>
            </div>
          )}
        </div>

        {/* Sidebar: product + list */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-onyx/10 bg-white/70 p-6">
            {selected ? (
              <>
                <p className="text-[10px] uppercase tracking-[0.2em] text-onyx/40">
                  {selected.tryOnKind === "earrings" ? "Earrings" : "Necklace"}
                </p>
                <h2 className="mt-1 font-serif text-2xl leading-snug">{selected.name}</h2>
                <p className="mt-1 text-[11px] uppercase tracking-wider text-onyx/45">
                  {selected.karat} · {selected.weight}g
                </p>
                <p className="mt-4 text-lg font-medium text-gold">{formatToman(total)}</p>

                <div className="mt-6 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={addToCart}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-onyx py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-parchment transition hover:bg-gold hover:text-onyx"
                  >
                    <ShoppingBag size={15} /> Add to bag
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      toggle(selected.id);
                      toast.success(
                        has(selected.id) ? "Removed from wishlist" : "Saved to wishlist",
                      );
                    }}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] transition ${
                      has(selected.id)
                        ? "border-gold bg-gold/15 text-onyx"
                        : "border-onyx/15 hover:border-gold"
                    }`}
                  >
                    <Heart size={15} fill={has(selected.id) ? "currentColor" : "none"} />
                    {has(selected.id) ? "In wishlist" : "Wishlist"}
                  </button>
                  <Link
                    to="/shop/$id"
                    params={{ id: selected.id }}
                    search={SHOP_SEARCH_DEFAULT}
                    className="pt-1 text-center text-[11px] text-gold hover:underline"
                  >
                    View product details
                  </Link>
                </div>
              </>
            ) : (
              <p className="text-sm text-onyx/50">No try-on pieces in catalog yet.</p>
            )}
          </div>

          <div>
            <div className="mb-3 flex gap-2">
              {(
                [
                  ["all", "All"],
                  ["necklace", "Necklaces"],
                  ["earrings", "Earrings"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setKind(id)}
                  className={`rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider ${
                    kind === id ? "bg-onyx text-parchment" : "border border-onyx/15 text-onyx/60"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="grid max-h-[420px] grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3 lg:grid-cols-2">
              {filtered.map((p) => {
                const active = p.id === selected?.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => selectProduct(p)}
                    className={`overflow-hidden rounded-xl border text-left transition ${
                      active
                        ? "border-gold ring-1 ring-gold/40"
                        : "border-onyx/10 hover:border-gold/40"
                    }`}
                  >
                    <ProductImage product={p} className="aspect-square w-full object-cover" />
                    <div className="bg-white/80 p-2">
                      <p className="truncate text-[11px] font-medium leading-tight">{p.name}</p>
                      <p className="mt-0.5 text-[10px] text-gold">
                        {formatToman(priceBreakdown(p).total)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-[11px] leading-relaxed text-onyx/40">
            Tip: use a straight-on selfie without heavy filters. For best results, product images with
            transparent backgrounds work best as overlays.
          </p>
        </aside>
      </section>
    </Shell>
  );
}

function ControlBtn({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="rounded-full border border-onyx/15 bg-white/80 p-2.5 text-onyx transition hover:border-gold hover:text-gold"
    >
      {children}
    </button>
  );
}