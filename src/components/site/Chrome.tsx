import { Link } from "@tanstack/react-router";
import { ChevronDown, Heart, Instagram,Clock, MapPin, Menu, Phone, Search, Send, ShoppingBag, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";
import { SHOP_SEARCH_DEFAULT } from "@/lib/shop-search";
import { formatMarketPrice } from "@/lib/market-prices";
import { useLiveGold } from "@/lib/live-gold";
import { getSessionUser, isAdmin, type AuthUser } from "@/lib/auth";
import { useWishlist } from "@/lib/wishlist";

const NESHAN_URL = "https://neshan.org/maps/places/43be0ea8a81fc6111e4c1a7078331a10";
// const GOOGLE_MAPS_EMBED =
//   "https://maps.google.com/maps?q=مشهد+شهرک+شهید+رجایی+بین+حر+۷+و+۹+جنب+درمانگاه+سما+طلاجات+عقلی&t=&z=17&ie=UTF8&iwloc=&output=embed";

  const GOOGLE_MAPS_LINK = "https://maps.app.goo.gl/ZEstCTe9VJWXRuw39";

// این لینک Embed رو بعداً با روش پایین جایگزین کن
// const GOOGLE_MAPS_EMBED =
//   "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3200!2d59.55!3d36.30!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDE4JzAwLjAiTiA1OcKwMzMnMDAuMCJF!5e0!3m2!1sen!2s!4v1710000000000!5m2!1sen!2s";

  const GOOGLE_MAPS_EMBED =
    "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d233.51773956567547!2d59.66993615928196!3d36.264903061549546!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sde!4v1786179551158!5m2!1sen!2sde";
// ;
function buildShopSearch(item: string) {
  const categoryMap: Record<string, "rings" | "necklaces" | "bracelets" | "earrings" | "bullion"> = {
    Shop: "bullion",
    النگو: "bracelets",
    "تک پوش": "bracelets",
    دستبند: "bracelets",
    زنجیر: "necklaces",
    گردنبند: "necklaces",
    پلاک: "necklaces",
    انگشتر: "rings",
    گوشواره: "earrings",
    Ring: "rings",
    "Wedding Ring": "rings",
    "Engagement Ring": "rings",
    Necklace: "necklaces",
    Chain: "necklaces",
    Bracelet: "bracelets",
    Pendant: "necklaces",
    Earrings: "earrings",
    "Bullion / Bar": "bullion",
    Coin: "bullion",
    پارسیان: "bullion",
    شمش: "bullion",
    "بهار آزادی": "bullion",
    نیم: "bullion",
    ربع: "bullion",
    "گوی طلا": "bullion",
  };

  const queryMap: Record<string, string> = {
    النگو: "Bangle",
    "تک پوش": "Bangle",
    دستبند: "Bracelet",
    زنجیر: "Chain",
    گردنبند: "Necklace",
    پلاک: "Pendant",
    انگشتر: "Ring",
    گوشواره: "Earrings",
    پارسیان: "پارسیان",
    شمش: "شمش",
    "بهار آزادی": "بهار آزادی",
    نیم: "نیم",
    ربع: "ربع",
    "گوی طلا": "گوی طلا",
  };

  const category = categoryMap[item];
  const q = queryMap[item];
  if (category && q) return { ...SHOP_SEARCH_DEFAULT, category, q };
  return category ? { ...SHOP_SEARCH_DEFAULT, category } : { ...SHOP_SEARCH_DEFAULT, q: q ?? item };
}

export function Ticker() {
  const { messages } = useI18n();
  const { snapshot: market } = useLiveGold();

  const items = market?.items.length
    ? market.items.map((item) => ({
        label: item.name,
        value: `${formatMarketPrice(item)} ${item.unit ?? "Toman"}`,
        dot: item.symbol.includes("USD") ? "bg-gold-soft" : "bg-emerald-500",
      }))
    : [
        { ...messages.ticker.live18k, dot: "bg-emerald-500 animate-pulse" },
        { ...messages.ticker.globalSpot, dot: "bg-gold-soft" },
        { ...messages.ticker.marketStatus, dot: "bg-gold" },
        { ...messages.ticker.gold24k, dot: "bg-emerald-500" },
        { ...messages.ticker.makingRate, dot: "bg-gold-soft" },
      ];

  return (
    <div className="overflow-hidden whitespace-nowrap border-b border-gold/30 bg-onyx py-2 text-parchment">
      <div className="flex w-max animate-marquee gap-12 px-6 text-[10px] font-medium uppercase tracking-[0.2em]">
        {[...items, ...items].map((item, index) => (
          <div key={`${item.label}-${index}`} className="flex shrink-0 items-center gap-2">
            <span className={`h-1.5 w-1.5 rounded-full ${item.dot}`} />
            {item.label}: {item.value}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Nav() {
  const { count } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { t } = useI18n();
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sessionUser, setSessionUser] = useState<AuthUser | null>(null);
  const admin = isAdmin(sessionUser);

  useEffect(() => {
    setSessionUser(getSessionUser());
  }, []);

  const serviceAnchors = useMemo(
    () => [
      { label: t("nav.services.repair"), hash: "repair" },
      { label: t("nav.services.resizing"), hash: "resizing" },
      { label: t("nav.services.customDesign"), hash: "custom" },
      { label: t("nav.services.tradeIn"), hash: "trade-in" },
      { label: t("nav.services.investment"), hash: "investment" },
      { label: t("nav.services.insurance"), hash: "insurance" },
    ],
    [t],
  );

  const primaryLinks = useMemo(
    () => [
      { to: "/", label: t("nav.home") },
      { to: "/prices", label: t("nav.prices") },
      { to: "/services", label: t("nav.services") },
    ],
    [t],
  );

  const megaMenu = useMemo(
    () => [
      // { label: t("nav.mega.products"), links: ["همه محصولات", "انگشتر", "گردنبند", "زنجیر", "دستبند", "النگو", "تک پوش", "پلاک", "گوشواره"] },
      // // { label: t("nav.mega.gemstones"), links: [t("nav.mega.diamond"), t("nav.mega.ruby"), t("nav.mega.emerald"), t("nav.mega.sapphire"), t("nav.mega.pearl"), t("nav.mega.topaz"), t("nav.mega.amethyst")] },
      // { label: t("nav.mega.investment"), links: ["صفحه سرمایه گذاری", "سکه پارسیان", "کیف پول", "شمش", "گوی طلا (اقتصادی)", "سکه بهار آزادی، نیم، ربع"] },
      // { label: t("nav.mega.gifts"), links: [t("nav.mega.birthdayGift"), t("nav.mega.anniversaryGift"), t("nav.mega.weddingGift"), t("nav.mega.graduationGift")] },
      // { label: t("nav.mega.wedding"), links: ["Ring", t("nav.mega.bridalSet"), t("nav.mega.couplesSet")] },
      // { label: t("nav.services"), links: ["خدمات ما", "آیینه جادویی (جدید)", "سفارش محصول", "قیمت روز طلا"] },
      // { label: t("nav.mega.resources"), links: [t("nav.mega.buyingGuide"), t("nav.mega.blog"), t("nav.mega.faq")] },
      // { label: t("nav.contact"), links: ["Contact us"] },

      
      { label: t("nav.mega.products"), links: ["Shop", "انگشتر", "گردنبند", "زنجیر", "دستبند", "النگو", "تک پوش", "پلاک", "گوشواره"] },
      // { label: t("nav.mega.gemstones"), links: [t("nav.mega.diamond"), t("nav.mega.ruby"), t("nav.mega.emerald"), t("nav.mega.sapphire"), t("nav.mega.pearl"), t("nav.mega.topaz"), t("nav.mega.amethyst")] },
      { label: t("nav.mega.investment"), links: ["Investment", "Wallet", "پارسیان", "شمش", "بهار آزادی", "نیم", "ربع", "گوی طلا"] },
      { label: t("nav.mega.gifts"), links: [t("nav.mega.birthdayGift"), t("nav.mega.anniversaryGift"), t("nav.mega.weddingGift"), t("nav.mega.graduationGift")] },
      { label: t("nav.mega.wedding"), links: ["Ring", t("nav.mega.bridalSet"), t("nav.mega.couplesSet")] },
      { label: t("nav.services"), links: ["Services", "Try on", "Custom", "Market"] },
      { label: t("nav.contact"), links: ["Contact us"] },
      { label: t("nav.mega.resources"), links: [t("nav.mega.buyingGuide"), t("nav.mega.blog"), t("nav.mega.faq")] },
    ],
    [t],
  );

  const resolveMegaLink = (menuLabel: string, item: string) => {
    if (menuLabel === t("nav.contact")) {
      return { to: "/contact" as const, search: undefined };
    }

    if (menuLabel === t("nav.services")) {
      if (item === "Try on") return { to: "/try-on" as const, search: undefined };
      if (item === "Custom") return { to: "/custom" as const, search: undefined };
      if (item === "Market") return { to: "/prices" as const, search: undefined };
      return { to: "/services" as const, search: undefined };
    }

    if (menuLabel === t("nav.mega.investment")) {
      if (item === "Investment") return { to: "/investment" as const, search: undefined };
      if (item === "Wallet") return { to: "/wallet" as const, search: undefined };
      return { to: "/shop" as const, search: buildShopSearch(item) };
    }

    if (menuLabel === t("nav.mega.products") && item === "Shop") {
      return { to: "/shop" as const, search: undefined };
    }

    if (menuLabel === t("nav.mega.resources")) {
      if (item === t("nav.mega.blog")) return { to: "/blog" as const, search: undefined };
      if (item === t("nav.mega.faq")) return { to: "/faq" as const, search: undefined };
      if (item === t("nav.mega.buyingGuide")) {
        return { to: "/shop" as const, search: { ...SHOP_SEARCH_DEFAULT, q: item } };
      }
    }

    return { to: "/shop" as const, search: buildShopSearch(item) };
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-onyx/10 bg-parchment/95 backdrop-blur-md" onMouseLeave={() => setOpen(null)}>
      <div className="hidden border-b border-onyx/8 bg-white/55 lg:block">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-6 text-[10px] uppercase tracking-[0.22em] text-onyx/55">
          <div className="flex items-center gap-5">
            {/* <Link to="/shop" search={SHOP_SEARCH_DEFAULT} className="hover:text-gold">Shop</Link> */}
            {/* <Link to="/shop" search={{ ...SHOP_SEARCH_DEFAULT, stock: "made-to-order" }} className="hover:text-gold">Engraving</Link> */}
            {/* <Link to="/prices" className="hover:text-gold">Market</Link>
            <Link to="/custom" className="hover:text-gold">custom</Link>
            <Link to="/try-on" className="hover:text-gold">Try on</Link>
            <Link to="/wallet" className="hover:text-gold">wallet</Link>
              <Link to="/investment" className="hover:text-gold">investment</Link>

            <Link to="/services" className="hover:text-gold">Services</Link> */}
            {admin && (
              <Link to="/admin" className="font-bold text-gold hover:text-onyx">پنل ادمین</Link>
            )}
          </div>
          <div className="flex items-center gap-5">
            <a href="tel:09153145726" className="hover:text-gold">09153145726</a>
            <a href="https://t.me/aghligold" target="_blank" rel="noreferrer" className="hover:text-gold">Telegram</a>
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <button className="-ml-2 p-2 lg:hidden" onClick={() => setMobileOpen((value) => !value)} aria-label={t("nav.ariaToggle")}>
          {mobileOpen ? <X size={21} /> : <Menu size={22} />}
        </button>

        <Link to="/" className="lg:absolute lg:left-1/2 lg:-translate-x-1/2">
          <h1 className="select-none text-3xl font-semibold tracking-[0.18em]">
            AGHLI<span className="text-gold">.</span>
          </h1>
        </Link>

        <div className="flex items-center gap-2 sm:gap-5">
          <div className="hidden sm:block">
            <LanguageSwitcher compact />
          </div>
          <Link to="/shop" search={SHOP_SEARCH_DEFAULT} aria-label={t("nav.ariaSearch")} className="rounded-full p-2 transition-colors hover:text-gold">
            <Search size={19} />
          </Link>
          <Link to="/profile" className="hidden text-[11px] font-semibold uppercase tracking-widest text-gold sm:block">
            {t("nav.account")}
          </Link>
          <Link to="/wishlist" className="relative rounded-full p-1" aria-label="Wishlist">
            {wishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-parchment">
                {wishlistCount}
              </span>
            )}
            <Heart size={19} strokeWidth={1.7} />
          </Link>
          <Link to="/cart" className="relative rounded-full p-1" aria-label={t("nav.ariaCart")}>
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-parchment">
                {count}
              </span>
            )}
            <ShoppingBag size={20} strokeWidth={1.7} />
          </Link>
        </div>
      </div>

      <div className="hidden border-t border-onyx/8 lg:block">
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-center gap-1 px-6">
          {megaMenu.map((menu) => (
            <div key={menu.label} className="relative" onMouseEnter={() => setOpen(menu.label)}>
              <button
                onClick={() => setOpen(open === menu.label ? null : menu.label)}
                className={`flex h-12 items-center gap-1 px-4 text-[11px] font-semibold uppercase tracking-widest transition-colors ${open === menu.label ? "text-gold" : "hover:text-gold"}`}
              >
                {menu.label}
                <ChevronDown size={13} className={open === menu.label ? "rotate-180" : ""} />
              </button>
{open === menu.label && (
  <div
    className="absolute left-1/2 top-full z-50 w-[min(96vw,52rem)] -translate-x-1/2 
               border-t-0 bg-white shadow-xl 
               animate-in fade-in slide-in-from-top-2 duration-200"
    onMouseLeave={() => setOpen(null)}
  >
    <div className="border-t-2 border-gold/20" />
    <div className="px-8 py-12">
      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em] 
                        text-onyx/60 transition-colors hover:text-gold">
            {menu.label}
          </p>
          <ul className="space-y-3">
            {menu.links.map((item) => (
              <li key={item}>
                <Link
                  to={resolveMegaLink(menu.label, item).to}
                  search={resolveMegaLink(menu.label, item).search}
                  className="group flex items-center gap-2 text-[15px] font-light 
                             text-onyx/75 transition-all duration-200 
                             hover:text-gold hover:translate-x-1"
                  onClick={() => setOpen(null)}
                >
                  <span className="h-px w-0 bg-gold transition-all duration-200 
                                   group-hover:w-4" />
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
)}

            </div>
          ))}
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-onyx/8 bg-parchment lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-4 px-6 py-5">
            <div className="flex items-center justify-between gap-3">
              <LanguageSwitcher compact />
            </div>

            <div className="flex flex-wrap gap-2">
              {primaryLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full border border-onyx/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors hover:border-gold hover:text-gold"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="grid gap-2">
              {admin && (
                <Link to="/admin" onClick={() => setMobileOpen(false)} className="rounded-2xl border border-gold bg-gold/10 px-4 py-3 text-sm font-bold text-gold">
                  Admin panel
                </Link>
              )}
              <Link to="/contact" onClick={() => setMobileOpen(false)} className="rounded-2xl border border-onyx/10 px-4 py-3 text-sm transition-colors hover:border-gold hover:text-gold">
                {t("nav.contact")}
              </Link>
              <Link to="/prices" onClick={() => setMobileOpen(false)} className="rounded-2xl border border-onyx/10 px-4 py-3 text-sm transition-colors hover:border-gold hover:text-gold">
                {t("nav.prices")}
              </Link>
              <Link to="/services" onClick={() => setMobileOpen(false)} className="rounded-2xl border border-onyx/10 px-4 py-3 text-sm transition-colors hover:border-gold hover:text-gold">
                {t("nav.services")}
              </Link>
            </div>

            <div className="grid gap-3">
              {serviceAnchors.map((service) => (
                <Link key={service.hash} to="/services" hash={service.hash} onClick={() => setMobileOpen(false)} className="rounded-2xl border border-onyx/10 px-4 py-3 text-sm transition-colors hover:border-gold hover:text-gold">
                  {service.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
function StoreMap({ compact = false }: { compact?: boolean }) {
  const { t } = useI18n();

  return (
    <div
      className={`overflow-hidden border border-onyx/10 bg-white/70 ${
        compact ? "rounded-[1.5rem]" : "rounded-[2rem]"
      }`}
    >
      <div className="border-b border-onyx/10 px-5 py-4">
        <p className="text-[10px] uppercase tracking-[0.24em] text-onyx/45">
          {t("footer.locationEyebrow")}
        </p>
        <p className="mt-2 font-serif text-xl">{t("footer.locationTitle")}</p>
      </div>

      <div className={compact ? "h-[260px]" : "h-[360px]"}>
        <iframe
          title={t("footer.mapTitle")}
          src={GOOGLE_MAPS_EMBED}
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  );
}
export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-onyx/10 bg-parchment pb-10 pt-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-16 grid gap-12 lg:grid-cols-[1.15fr_1fr_1fr_1.35fr]">
          
          {/* Brand + Social */}
          <div>
            <h2 className="font-serif text-4xl tracking-tighter">
              AGHLI<span className="text-gold">.</span>
            </h2>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-onyx/60 whitespace-pre-line">
  {t("footer.tagline")}
</p>

            <div className="mt-7 flex items-center gap-5 text-onyx/55">
              <a
                aria-label={t("footer.ariaTelegram")}
                href="https://t.me/aghligold"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-gold"
              >
                <Send size={18} />
              </a>
              <a
                aria-label={t("footer.ariaInstagram")}
                href="https://instagram.com/aghligold/"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-gold"
              >
                <Instagram size={18} />
              </a>
              <a
                aria-label="روبیکا"
                href="https://rubika.ir/aghligold"
                target="_blank"
                rel="noreferrer"
                className="text-[13px] font-medium tracking-wide transition-colors hover:text-gold"
              >
                روبیکا
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-onyx/80">
              {t("footer.contactTitle")}
            </h3>
            <div className="mt-6 space-y-4 text-sm text-onyx/65">
              <a
                href="tel:05133762430"
                className="group flex items-start gap-3 transition-colors hover:text-gold"
              >
                <Phone size={16} className="mt-0.5 shrink-0 opacity-70 group-hover:opacity-100" />
                <div>
                  <div className="text-[11px] text-onyx/45">تلفن ثابت</div>
                  <div className="font-medium tracking-wide">۰۵۱۳۳۷۶۲۴۳۰</div>
                </div>
              </a>

              <a
                href="tel:09153145726"
                className="group flex items-start gap-3 transition-colors hover:text-gold"
              >
                <Phone size={16} className="mt-0.5 shrink-0 opacity-70 group-hover:opacity-100" />
                <div>
                  <div className="text-[11px] text-onyx/45">سفارش و واتساپ</div>
                  <div className="font-medium tracking-wide">۰۹۱۵۳۱۴۵۷۲۶</div>
                </div>
              </a>

              <a
                href="https://t.me/aadmin_aghli"
                target="_blank"
                rel="noreferrer"
                className="group flex items-start gap-3 transition-colors hover:text-gold"
              >
                <Send size={16} className="mt-0.5 shrink-0 opacity-70 group-hover:opacity-100" />
                <div>
                  <div className="text-[11px] text-onyx/45">تلگرام ادمین</div>
                  <div className="font-medium">@aadmin_aghli</div>
                </div>
              </a>
            </div>
          </div>

          {/* Address + Hours */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-onyx/80">
              آدرس و ساعات کاری
            </h3>

            <div className="mt-6 space-y-5 text-sm text-onyx/65">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 opacity-70" />
                <div className="leading-relaxed">
                  <p>مشهد، شهرک شهید رجایی، بین حر۷و ۹</p>
                  <p className="text-onyx/50">جنب درمانگاه سما</p>
                    <a
  href={GOOGLE_MAPS_LINK}
  target="_blank"
  rel="noreferrer"
  className="mt-1.5 inline-flex items-center gap-1 text-[12px] font-medium text-gold hover:underline"
>
  مشاهده روی نقشه
  <span className="text-[10px]">↗</span>
</a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock size={16} className="mt-0.5 shrink-0 opacity-70" />
                <div className="space-y-1.5 leading-relaxed">
                  <div>
                    <span className="text-[11px] text-onyx/45">شنبه تا پنج‌شنبه</span>
                    <p>۹:۰۰ – ۱۳:۳۰ و ۱۶:۰۰ – ۲۱:۰۰</p>
                  </div>
                  <div className="pt-1">
                    <span className="text-[11px] text-onyx/45">ماه رمضان</span>
                    <p>۹:۰۰ تا نیم ساعت قبل از اذان مغرب</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="lg:pl-4">
            <StoreMap compact />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col gap-4 border-t border-onyx/10 pt-6 text-xs text-onyx/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© AGHLI. {t("footer.copyright")}</p>
          <div className="flex items-center gap-6">
            <Link
              to="/shop"
              search={SHOP_SEARCH_DEFAULT}
              className="transition-colors hover:text-gold"
            >
              {t("footer.exploreShop")}
            </Link>
            <Link to="/prices" className="transition-colors hover:text-gold">
              {t("footer.exploreMarketPrices")}
            </Link>
            <Link to="/contact" className="transition-colors hover:text-gold">
              {t("nav.contact")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-parchment text-onyx">
      <Ticker />
      <Nav />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
