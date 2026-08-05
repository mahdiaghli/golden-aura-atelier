import { Link } from "@tanstack/react-router";
import { ChevronDown, Heart, Instagram, MapPin, Menu, Phone, Search, Send, ShoppingBag, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";
import { SHOP_SEARCH_DEFAULT } from "@/lib/shop-search";
import { formatMarketPrice } from "@/lib/market-prices";
import { useLiveGold } from "@/lib/live-gold";
import { getSessionUser, isAdmin, type AuthUser } from "@/lib/auth";
import { useWishlist } from "@/lib/wishlist";

const NESHAN_URL =
  "https://neshan.org/maps/?q=%D9%85%D8%B4%D9%87%D8%AF%20%D8%A8%DB%8C%D9%86%20%D8%AD%D8%B1%207%20%D9%88%209%20%D8%AC%D9%86%D8%A8%20%D8%AF%D8%B1%D9%85%D8%A7%D9%86%DA%AF%D8%A7%D9%87%20%D8%B3%D9%85%D8%A7%20%D8%B7%D9%84%D8%A7%D8%AC%D8%A7%D8%AA%20%D8%B9%D9%82%D9%84%DB%8C";

function buildShopSearch(item: string) {
  const categoryMap: Record<string, "rings" | "necklaces" | "bracelets" | "bullion"> = {
    Ring: "rings",
    "Wedding Ring": "rings",
    "Engagement Ring": "rings",
    Necklace: "necklaces",
    Chain: "necklaces",
    Bracelet: "bracelets",
    Pendant: "necklaces",
    Earrings: "bracelets",
    "Bullion / Bar": "bullion",
    Coin: "bullion",
  };

  const category = categoryMap[item];
  return category ? { ...SHOP_SEARCH_DEFAULT, category } : { ...SHOP_SEARCH_DEFAULT, q: item };
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
      { label: t("nav.mega.products"), links: ["Ring", "Wedding Ring", "Engagement Ring", "Necklace", "Chain", "Bracelet", "Pendant", "Earrings"] },
      { label: t("nav.mega.gemstones"), links: [t("nav.mega.diamond"), t("nav.mega.ruby"), t("nav.mega.emerald"), t("nav.mega.sapphire"), t("nav.mega.pearl"), t("nav.mega.topaz"), t("nav.mega.amethyst")] },
      { label: t("nav.mega.investment"), links: ["Bullion / Bar", "Coin", t("nav.mega.meltedGold"), t("nav.mega.secondHandGold")] },
      { label: t("nav.mega.gifts"), links: [t("nav.mega.birthdayGift"), t("nav.mega.anniversaryGift"), t("nav.mega.weddingGift"), t("nav.mega.graduationGift")] },
      { label: t("nav.mega.wedding"), links: ["Ring", t("nav.mega.bridalSet"), t("nav.mega.couplesSet")] },
      { label: t("nav.services"), links: serviceAnchors.map((item) => item.label) },
      { label: t("nav.mega.resources"), links: [t("nav.mega.buyingGuide"), t("nav.mega.blog"), t("nav.mega.faq")] },
    ],
    [serviceAnchors, t],
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-onyx/10 bg-parchment/95 backdrop-blur-md" onMouseLeave={() => setOpen(null)}>
      <div className="hidden border-b border-onyx/8 bg-white/55 lg:block">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-6 text-[10px] uppercase tracking-[0.22em] text-onyx/55">
          <div className="flex items-center gap-5">
            <Link to="/shop" search={SHOP_SEARCH_DEFAULT} className="hover:text-gold">Shop</Link>
            <Link to="/shop" search={{ ...SHOP_SEARCH_DEFAULT, stock: "made-to-order" }} className="hover:text-gold">Engraving</Link>
            <Link to="/prices" className="hover:text-gold">Market</Link>
            <Link to="/custom" className="hover:text-gold">custom</Link>
            <Link to="/try-on" className="hover:text-gold">Try on</Link>
              <Link to="/investment" className="hover:text-gold">investment</Link>

            <Link to="/services" className="hover:text-gold">Services</Link>
            {admin && (
              <Link to="/admin" className="font-bold text-gold hover:text-onyx">Admin panel</Link>
            )}
          </div>
          <div className="flex items-center gap-5">
            <a href="tel:09153145726" className="hover:text-gold">0915 314 5726</a>
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
                  to={
                    menu.label === t("nav.services")
                      ? "/services"
                      : menu.label === t("nav.mega.resources")
                        ? item === t("nav.mega.blog")
                          ? "/blog"
                          : item === t("nav.mega.faq")
                            ? "/faq"
                            : "/shop"
                        : "/shop"
                  }
                  search={
                    menu.label === t("nav.mega.resources")
                      ? item === t("nav.mega.buyingGuide")
                        ? { ...SHOP_SEARCH_DEFAULT, q: item }
                        : undefined
                      : menu.label === t("nav.services")
                        ? undefined
                        : buildShopSearch(item)
                  }
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
    <div className={`overflow-hidden border border-onyx/10 bg-white/70 ${compact ? "rounded-[1.5rem]" : "rounded-[2rem]"}`}>
      <div className="border-b border-onyx/10 px-5 py-4">
        <p className="text-[10px] uppercase tracking-[0.24em] text-onyx/45">{t("footer.locationEyebrow")}</p>
        <p className="mt-2 font-serif text-xl">{t("footer.locationTitle")}</p>
      </div>
      <div className={compact ? "h-[260px]" : "h-[360px]"}>
        <iframe title={t("footer.mapTitle")} src={NESHAN_URL} className="h-full w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </div>
    </div>
  );
}

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-onyx/10 bg-parchment pb-10 pt-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 grid gap-12 lg:grid-cols-[1.05fr_.9fr_.8fr_.85fr_1.25fr]">
          <div>
            <h2 className="font-serif text-4xl tracking-tighter">
              AGHLI<span className="text-gold">.</span>
            </h2>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-onyx/60">{t("footer.tagline")}</p>
            <div className="mt-6 flex gap-4 text-onyx/60">
              <a aria-label={t("footer.ariaTelegram")} href="https://t.me/aghligold" target="_blank" rel="noreferrer" className="hover:text-gold">
                <Send size={18} />
              </a>
              <a aria-label={t("footer.ariaInstagram")} href="https://instagram.com/aghligold/" target="_blank" rel="noreferrer" className="hover:text-gold">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest">{t("footer.contactTitle")}</h3>
            <div className="mt-5 space-y-3 text-sm text-onyx/60">
              <a className="flex gap-2 hover:text-gold" href="tel:09153145726"><Phone size={15} />09153145726</a>
              <a className="flex gap-2 hover:text-gold" href="tel:05133762430"><Phone size={15} />05133762430</a>
              <a className="flex gap-2 hover:text-gold" href="https://t.me/aaadmin_aghli" target="_blank" rel="noreferrer"><Send size={15} />@aaadmin_aghli</a>
              <a className="flex gap-2 hover:text-gold" href={NESHAN_URL} target="_blank" rel="noreferrer"><MapPin size={15} />{t("footer.openMap")}</a>
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest">{t("footer.exploreTitle")}</h3>
            <div className="mt-5 space-y-3 text-sm text-onyx/60">
              <Link to="/shop" search={SHOP_SEARCH_DEFAULT} className="block hover:text-gold">{t("footer.exploreShop")}</Link>
              <Link to="/prices" className="block hover:text-gold">{t("footer.exploreMarketPrices")}</Link>
              <Link to="/contact" className="block hover:text-gold">{t("nav.contact")}</Link>
            </div>
          </div>

          <div className="lg:col-span-2">
            <StoreMap compact />
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-onyx/10 pt-6 text-xs text-onyx/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© AGHLI. {t("footer.copyright")}.</p>
          <LanguageSwitcher />
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
