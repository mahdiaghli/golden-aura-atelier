import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, HandHeart, MapPin, ShieldCheck, Star } from "lucide-react";
import { Shell } from "@/components/site/Chrome";
import { useI18n } from "@/lib/i18n/context";

export const Route = createFileRoute("/why-us")({
  component: WhyUs,
  head: () => ({
    meta: [{ title: "Aghli Gold" }],
  }),
});

function WhyUs() {
  const { t } = useI18n();

  const reasons = [
    [ShieldCheck, t("whyUs.authenticityTitle"), t("whyUs.authenticityBody")],
    [BadgeCheck, t("whyUs.pricingTitle"), t("whyUs.pricingBody")],
    [HandHeart, t("whyUs.guidanceTitle"), t("whyUs.guidanceBody")],
    [MapPin, t("whyUs.storeTitle"), t("whyUs.storeBody")],
  ] as const;

  return (
    <Shell>
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <p className="text-[11px] uppercase tracking-[.32em] text-gold">
          {t("whyUs.eyebrow")}
        </p>
        <h1 className="mt-4 max-w-3xl font-serif text-5xl md:text-6xl">
          {t("whyUs.heroTitle")}
        </h1>
        <p className="mt-6 max-w-2xl leading-relaxed text-onyx/65">
          {t("whyUs.heroBody")}
        </p>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {reasons.map(([Icon, title, copy]) => {
            const I = Icon as typeof ShieldCheck;

            return (
              <div
                key={title}
                className="border border-onyx/10 bg-white/60 p-8"
              >
                <I className="text-gold" size={28} />
                <h2 className="mt-5 font-serif text-2xl">{title}</h2>
                <p className="mt-3 leading-relaxed text-onyx/65">{copy}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-onyx py-16 text-parchment">
        <div className="mx-auto max-w-7xl px-6">
          <Star className="text-gold" />
          <h2 className="mt-5 font-serif text-4xl">
            {t("whyUs.ctaTitle")}
          </h2>
          <p className="mt-4 max-w-xl text-parchment/70">
            {t("whyUs.ctaBody")}
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-block bg-gold px-7 py-4 text-[10px] font-bold uppercase tracking-widest text-onyx"
          >
            {t("whyUs.ctaButton")}
          </Link>
        </div>
      </section>
    </Shell>
  );
}

/////////////
//////////
/////