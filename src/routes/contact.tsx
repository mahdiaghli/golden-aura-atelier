import { createFileRoute, Link } from '@tanstack/react-router'
import { Phone, Send, MapPin, Clock3 } from 'lucide-react'
import { Shell } from '@/components/site/Chrome'
import { useI18n } from '@/lib/i18n/context'

const NESHAN_URL =
  "https://neshan.org/maps/?q=%D9%85%D8%B4%D9%87%D8%AF%20%D8%A8%DB%8C%D9%86%20%D8%AD%D8%B1%207%20%D9%88%209%20%D8%AC%D9%86%D8%A8%20%D8%AF%D8%B1%D9%85%D8%A7%D9%86%DA%AF%D8%A7%D9%87%20%D8%B3%D9%85%D8%A7%20%D8%B7%D9%84%D8%A7%D8%AC%D8%A7%D8%AA%20%D8%B9%D9%82%D9%84%DB%8C";

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})

function ContactPage() {
  const { t } = useI18n();

  return (
    <Shell>
      <section className="border-b border-onyx/10 bg-secondary/40">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center md:py-20">
          <p className="text-[11px] uppercase tracking-[0.32em] text-gold">{t("contact.eyebrow")}</p>
          <h1 className="mt-4 font-serif text-5xl leading-tight md:text-6xl">{t("contact.title")}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-onyx/65">{t("contact.intro")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="border border-onyx/10 bg-white/70 p-8 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
            <Phone className="text-gold" />
            <h2 className="mt-6 font-serif text-2xl">{t("contact.cards.phoneTitle")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-onyx/65">{t("contact.cards.phoneBody")}</p>
            <div className="mt-5 space-y-2 text-sm text-onyx/70">
              <a className="flex items-center gap-2 hover:text-gold" href="tel:09153145726"><Phone size={14} />09153145726</a>
              <a className="flex items-center gap-2 hover:text-gold" href="tel:05133762430"><Phone size={14} />05133762430</a>
            </div>
          </div>

          <div className="border border-onyx/10 bg-white/70 p-8 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
            <Send className="text-gold" />
            <h2 className="mt-6 font-serif text-2xl">{t("contact.cards.telegramTitle")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-onyx/65">{t("contact.cards.telegramBody")}</p>
            <a
              className="mt-5 flex items-center gap-2 text-sm text-onyx/70 hover:text-gold"
              href="https://t.me/aaadmin_aghli"
              target="_blank"
              rel="noreferrer"
            >
              <Send size={14} />
              @aaadmin_aghli
            </a>
          </div>

          <div className="border border-onyx/10 bg-white/70 p-8 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
            <MapPin className="text-gold" />
            <h2 className="mt-6 font-serif text-2xl">{t("contact.cards.locationTitle")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-onyx/65">{t("contact.cards.locationBody")}</p>
            <a
              className="mt-5 flex items-center gap-2 text-sm text-onyx/70 hover:text-gold"
              href={NESHAN_URL}
              target="_blank"
              rel="noreferrer"
            >
              <MapPin size={14} />
              {t("footer.openMap")}
            </a>
          </div>
        </div>
      </section>

      <section className="border-t border-onyx/10 bg-onyx py-16 text-parchment md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-gold">{t("contact.hoursTitle")}</p>
            <div className="mt-5 space-y-3 text-parchment/80">
              <p className="flex items-center gap-3"><Clock3 size={16} className="text-gold" />{t("contact.hoursWeek")}</p>
              <p className="flex items-center gap-3"><Clock3 size={16} className="text-gold" />{t("contact.hoursFriday")}</p>
            </div>
            <Link
              to="/services"
              className="mt-8 inline-flex items-center justify-center bg-gold px-6 py-4 text-[10px] font-bold uppercase tracking-[0.24em] text-onyx transition-colors hover:bg-parchment"
            >
              {t("nav.services")}
            </Link>
          </div>
          <div className="overflow-hidden rounded-[1.5rem] border border-parchment/15">
            <iframe
              title={t("footer.mapTitle")}
              src={NESHAN_URL}
              className="h-[300px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </Shell>
  )
}
