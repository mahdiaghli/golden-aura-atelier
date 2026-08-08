import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone, Send, MapPin, Clock, Instagram, ExternalLink } from "lucide-react";
import { Shell } from "@/components/site/Chrome";
import { useI18n } from "@/lib/i18n/context";

const GOOGLE_MAPS_LINK = "https://maps.app.goo.gl/ZEstCTe9VJWXRuw39";

// بعد از گرفتن کد Embed واقعی از گوگل، این مقدار رو جایگزین کن
const GOOGLE_MAPS_EMBED =
    "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d233.51773956567547!2d59.66993615928196!3d36.264903061549546!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sde!4v1786179551158!5m2!1sen!2sde";
// ;
//   "<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d233.51773956567547!2d59.66993615928196!3d36.264903061549546!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sde!4v1786179551158!5m2!1sen!2sde" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const { t } = useI18n();

  return (
    <Shell>
      {/* Hero */}
      <section className="border-b border-onyx/10 bg-secondary/40">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center md:py-24">
          <p className="text-[11px] uppercase tracking-[0.32em] text-gold">
            {t("contact.eyebrow") || "تماس با ما"}
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-tight md:text-6xl">
            {t("contact.title") || "با ما در ارتباط باشید"}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-onyx/65">
            {t("contact.intro") ||
              "زیورآلات طلا، طلای سرمایه‌گذاری و خدمات شخصی از طلاجات عقلی. مشتاقانه پاسخگوی شما هستیم."}
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Phones */}
          <div className="group border border-onyx/10 bg-white/70 p-8 shadow-[0_12px_40px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_16px_50px_rgba(0,0,0,0.07)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold">
              <Phone size={22} />
            </div>
            <h2 className="mt-6 font-serif text-2xl">تلفن‌های تماس</h2>
            <p className="mt-3 text-sm leading-relaxed text-onyx/60">
              برای سفارش، مشاوره و پیگیری با ما تماس بگیرید.
            </p>

            <div className="mt-6 space-y-4">
              <a
                href="tel:09153145726"
                className="flex items-start gap-3 transition-colors hover:text-gold"
              >
                <Phone size={15} className="mt-1 shrink-0 opacity-60" />
                <div>
                  <div className="text-[11px] text-onyx/45">سفارش و واتساپ</div>
                  <div className="font-medium tracking-wide" dir="ltr">
                    ۰۹۱۵ ۳۱۴ ۵۷۲۶
                  </div>
                </div>
              </a>

              <a
                href="tel:05133762430"
                className="flex items-start gap-3 transition-colors hover:text-gold"
              >
                <Phone size={15} className="mt-1 shrink-0 opacity-60" />
                <div>
                  <div className="text-[11px] text-onyx/45">تلفن ثابت فروشگاه</div>
                  <div className="font-medium tracking-wide" dir="ltr">
                    ۰۵۱۳ ۳۳۷۶ ۲۴۳۰
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Telegram & Social */}
          <div className="group border border-onyx/10 bg-white/70 p-8 shadow-[0_12px_40px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_16px_50px_rgba(0,0,0,0.07)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold">
              <Send size={22} />
            </div>
            <h2 className="mt-6 font-serif text-2xl">شبکه‌های اجتماعی</h2>
            <p className="mt-3 text-sm leading-relaxed text-onyx/60">
              محصولات جدید و قیمت‌های روز را در کانال‌های ما دنبال کنید.
            </p>

            <div className="mt-6 space-y-4">
              <a
                href="https://t.me/aaadmin_aghli"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 transition-colors hover:text-gold"
              >
                <Send size={15} className="shrink-0 opacity-60" />
                <div>
                  <div className="text-[11px] text-onyx/45">تلگرام ادمین</div>
                  <div className="font-medium">@aaadmin_aghli</div>
                </div>
              </a>

              <a
                href="https://instagram.com/aghligold/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 transition-colors hover:text-gold"
              >
                <Instagram size={15} className="shrink-0 opacity-60" />
                <div>
                  <div className="text-[11px] text-onyx/45">اینستاگرام</div>
                  <div className="font-medium">@aghligold</div>
                </div>
              </a>

              <a
                href="https://rubika.ir/aghligold"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 transition-colors hover:text-gold"
              >
                <span className="text-[13px] font-medium opacity-70">روبیکا</span>
                <div className="font-medium">@aghligold</div>
              </a>
            </div>
          </div>

          {/* Address */}
          <div className="group border border-onyx/10 bg-white/70 p-8 shadow-[0_12px_40px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_16px_50px_rgba(0,0,0,0.07)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold">
              <MapPin size={22} />
            </div>
            <h2 className="mt-6 font-serif text-2xl">آدرس فروشگاه</h2>
            <p className="mt-3 text-sm leading-relaxed text-onyx/60">
              مشهد، شهرک شهید رجایی
              <br />
              بین حر ۷ و ۹، جنب درمانگاه سما
            </p>

            <a
              href={GOOGLE_MAPS_LINK}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold transition-colors hover:underline"
            >
              <MapPin size={15} />
              مشاهده روی نقشه
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </section>

      {/* Hours + Map */}
      <section className="border-t border-onyx/10 bg-onyx py-16 text-parchment md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          {/* Working Hours */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-gold">ساعات کاری</p>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl">زمان حضور در فروشگاه</h2>

            <div className="mt-8 space-y-5">
              <div className="flex items-start gap-4">
                <Clock size={18} className="mt-1 shrink-0 text-gold" />
                <div>
                  <div className="text-sm text-parchment/50">شنبه تا پنج‌شنبه</div>
                  <div className="mt-1 text-lg">۹:۰۰ – ۱۳:۳۰ و ۱۶:۰۰ – ۲۱:۰۰</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock size={18} className="mt-1 shrink-0 text-gold" />
                <div>
                  <div className="text-sm text-parchment/50">ماه مبارک رمضان</div>
                  <div className="mt-1 text-lg">۹:۰۰ تا نیم ساعت قبل از اذان مغرب</div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="tel:09153145726"
                className="inline-flex items-center justify-center bg-gold px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-onyx transition-colors hover:bg-parchment"
              >
                تماس مستقیم
              </a>
              <Link
                to="/services"
                className="inline-flex items-center justify-center border border-parchment/30 px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-parchment transition-colors hover:border-gold hover:text-gold"
              >
                خدمات ما
              </Link>
            </div>
          </div>

          {/* Map */}
          <div className="overflow-hidden rounded-[1.75rem] border border-parchment/15 bg-white/5">
            <iframe
              title="موقعیت فروشگاه طلاجات عقلی"
              src={GOOGLE_MAPS_EMBED}
              className="h-[340px] w-full md:h-[400px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </Shell>
  );
}