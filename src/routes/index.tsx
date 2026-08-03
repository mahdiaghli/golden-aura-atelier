import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, BadgeCheck, HeartHandshake, MapPin, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Shell } from "@/components/site/Chrome";
import { useI18n } from "@/lib/i18n/context";
import { formatTomanLocalized, localizeProduct } from "@/lib/i18n/helpers";
import { priceBreakdown, products } from "@/lib/products";

export const Route = createFileRoute("/")({ component: Home });

function ProductCard({ product }: { product: (typeof products)[number] }) {
  const { locale, messages, t } = useI18n();
  const localizedProduct = localizeProduct(product, messages);
  const { total } = priceBreakdown(product);

  return (
    <Link to="/shop/$id" params={{ id: product.id }} className="group block">
      <div className="relative overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={localizedProduct.name}
          className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105"
        />
        {product.bestseller && (
          <span className="absolute left-3 top-3 bg-gold px-2 py-1 text-[9px] font-bold uppercase tracking-wider">
            {t("home.bestseller")}
          </span>
        )}
      </div>
      <div className="pt-4">
        <h3 className="text-lg font-medium tracking-tight group-hover:text-gold transition-colors duration-350">{localizedProduct.name}</h3>
        <p className="mt-1 text-[10px] uppercase tracking-widest text-onyx/50">
          {product.karat} · {product.weight}g
        </p>
        <p className="mt-2 text-sm font-medium">{formatTomanLocalized(total, locale)}</p>
      </div>
    </Link>
  );
}

function Showcase({ eyebrow, title, items }: { eyebrow: string; title: string; items: typeof products }) {
  const { t } = useI18n();

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      <div className="mb-10 flex items-end justify-between gap-6">
        <div>
          <p className="text-[11px] uppercase tracking-[.32em] text-gold">{eyebrow}</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-medium tracking-tight">{title}</h2>
        </div>
        <Link to="/shop" className="shrink-0 border-b border-gold pb-1 text-[10px] font-bold uppercase tracking-widest text-gold">
          {t("home.shopAll")}
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4 md:gap-x-7">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

function Home() {
  const { t } = useI18n();
  const newest = products.filter((product) => product.newest).slice(0, 4);
  const bestsellers = products.filter((product) => product.bestseller || product.mostSold).slice(0, 4);
  const recommended = products.filter((product) => product.aiRecommended).slice(0, 4);
  const forYou = products.filter((product) => product.gender === "women" || product.gender === "unisex").slice(0, 4);
  const completeTheLook = products.filter((product) => product.category === "necklaces" || product.category === "bracelets").slice(0, 4);

  const trustItems = [
    [ShieldCheck, t("home.trustQualityTitle"), t("home.trustQualityBody")],
    [Truck, t("home.trustDeliveryTitle"), t("home.trustDeliveryBody")],
    [HeartHandshake, t("home.trustGuidanceTitle"), t("home.trustGuidanceBody")],
  ] as const;

  const valueItems = [
    [Award, t("home.craftTitle"), t("home.craftBody")],
    [BadgeCheck, t("home.pricingTitle"), t("home.pricingBody")],
    [Sparkles, t("home.customTitle"), t("home.customBody")],
    [MapPin, t("home.supportTitle"), t("home.supportBody")],
  ] as const;

  return (
    <Shell>
      <section className="relative min-h-[660px] overflow-hidden">
        <img src="/products/hero-ring.jpg" alt={t("home.heroImageAlt")} className="absolute inset-0 h-full w-full object-cover" />
<div className="absolute inset-0 bg-gradient-to-l from-parchment/40 via-parchment/20 to-transparent" />
        <div className="relative mx-auto flex min-h-[660px] max-w-7xl items-center px-6">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[.38em] text-gold">{t("home.heroEyebrow")}</p>
            {/* کاهش سایز هدر اصلی (طلایی که بخشی از داستان شما می‌شود) به text-3xl و در دسکتاپ md:text-5xl */}
            <h1 className="mt-5 text-3xl md:text-5xl font-semibold leading-[1.2] tracking-tight">{t("home.heroTitle")}</h1>
            <p className="mt-7 max-w-lg text-base leading-relaxed text-onyx/70">{t("home.heroSubtitle")}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/shop" className="bg-onyx px-7 py-4 text-[10px] font-bold uppercase tracking-widest text-parchment hover:bg-gold hover:text-onyx transition-colors duration-300">
                {t("home.heroCtaShop")}
              </Link>
              <Link to="/signup" className="border border-onyx/30 px-7 py-4 text-[10px] font-bold uppercase tracking-widest hover:border-gold hover:text-gold transition-colors duration-300">
                {t("home.heroCtaConsultation")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Showcase eyebrow={t("home.newestEyebrow")} title={t("home.newestTitle")} items={newest} />

      <section className="bg-onyx py-16 text-parchment md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-3">
          {trustItems.map(([Icon, title, text]) => {
            const I = Icon as typeof ShieldCheck;
            return (
              <div key={title} className="border-t border-parchment/20 pt-6">
                <I className="text-gold" size={28} />
                <h2 className="mt-5 text-xl md:text-2xl font-medium tracking-tight">{title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-parchment/65">{text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <Showcase eyebrow={t("home.bestsellersEyebrow")} title={t("home.bestsellersTitle")} items={bestsellers} />
      <Showcase eyebrow={t("home.recommendedEyebrow")} title={t("home.recommendedTitle")} items={recommended} />

      <section className="bg-secondary py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="text-[11px] uppercase tracking-[.32em] text-gold">{t("home.whyEyebrow")}</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-medium tracking-tight">{t("home.whyTitle")}</h2>
            <p className="mt-6 max-w-md leading-relaxed text-onyx/65">{t("home.whyBody")}</p>
          </div>
          <div className="grid gap-px bg-onyx/10 sm:grid-cols-2">
            {valueItems.map(([Icon, title, text]) => {
              const I = Icon as typeof Award;
              return (
                <div key={title} className="bg-secondary p-6">
                  <I size={22} className="text-gold" />
                  <h3 className="mt-4 text-lg font-medium tracking-tight">{title}</h3>
                  <p className="mt-2 text-sm text-onyx/60">{text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Showcase eyebrow={t("home.forYouEyebrow")} title={t("home.forYouTitle")} items={forYou} />
      <Showcase eyebrow={t("home.completeEyebrow")} title={t("home.completeTitle")} items={completeTheLook} />
    </Shell>
  );
}
