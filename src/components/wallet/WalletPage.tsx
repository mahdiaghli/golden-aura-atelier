import { Link } from "@tanstack/react-router";
import {
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  Coins,
  History,
  LineChart,
  Plus,
  Target,
  TrendingUp,
  Wallet as WalletIcon,
  AlertCircle,
  Send,
} from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { formatMarketPrice } from "@/lib/market-prices";
import { useLiveGold } from "@/lib/live-gold";
import { SHOP_SEARCH_DEFAULT } from "@/lib/shop-search";

// --- Mock Data (بعداً از API واقعی جایگزین شود) ---
const MOCK_WALLET = {
  totalValueToman: 125_480_000,
  todayChangePercent: 7.4,
  gold24kGrams: 4.825,
  cashBalance: 2_450_000,
  pendingSettlement: 15_000_000,
  totalProfit: 18_250_000,
  returnPercent: 17.2,
  todayProfit: 1_420_000,
  avgBuyPrice: 23_910_000,
  currentPrice: 24_770_000,
  profitPerGram: 860_000,
  investmentGoalGrams: 20,
  currentGoldGrams: 7.4,
  allocation: [
    { label: "طلای ۲۴ عیار", percent: 95, color: "bg-gold" },
    { label: "موجودی نقد", percent: 3, color: "bg-emerald-500" },
    { label: "گوی طلا", percent: 2, color: "bg-amber-600" },
  ],
  coins: [
    { name: "گوی ۵ گرمی", status: "تحویل نشده", qty: 1 },
    { name: "گوی ۱ گرمی", status: "در خزانه", qty: 2 },
    { name: "گوی ۰.۵ گرمی", status: "ارسال شده", qty: 1 },
  ],
  transactions: [
    { id: 1, type: "buy", title: "خرید طلا", amount: "+2.15 گرم", date: "۱۴۰۴/۰۵/۱۲", status: "success" },
    { id: 2, type: "sell", title: "فروش طلا", amount: "۳٬۲۰۰٬۰۰۰ تومان", date: "۱۴۰۴/۰۵/۱۰", status: "success" },
    { id: 3, type: "deposit", title: "واریز", amount: "+۵٬۰۰۰٬۰۰۰ تومان", date: "۱۴۰۴/۰۵/۰۸", status: "success" },
    { id: 4, type: "withdraw", title: "برداشت", amount: "-۱٬۲۰۰٬۰۰۰ تومان", date: "۱۴۰۴/۰۵/۰۵", status: "pending" },
    { id: 5, type: "physical", title: "ارسال فیزیکی", amount: "۱ گرم", date: "۱۴۰۴/۰۵/۰۱", status: "success" },
  ],
};

type Tab = "overview" | "assets" | "transactions" | "analysis";

export function WalletPage() {
  const { t } = useI18n();
  const { snapshot: market } = useLiveGold();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [iban, setIban] = useState("");

  const livePrice = market?.items?.[0] ? formatMarketPrice(market.items[0]) : "۲۴٬۷۷۰٬۰۰۰";

  const tabs = [
    { id: "overview" as Tab, label: "نمای کلی", icon: WalletIcon },
    { id: "assets" as Tab, label: "دارایی‌ها", icon: Coins },
    { id: "transactions" as Tab, label: "تراکنش‌ها", icon: History },
    { id: "analysis" as Tab, label: "تحلیل", icon: BarChart3 },
  ];

  const progressPercent = Math.min(
    100,
    Math.round((MOCK_WALLET.currentGoldGrams / MOCK_WALLET.investmentGoalGrams) * 100)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">
            کیف پول <span className="text-gold">AGHLI</span>
          </h1>
          <p className="mt-1 text-sm text-onyx/60">مرکز مدیریت دارایی‌های طلا و نقدی شما</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="flex items-center gap-2 rounded-full border border-onyx/15 bg-white px-4 py-2.5 text-sm font-medium transition hover:border-gold hover:text-gold"
          >
            <ArrowUpRight size={16} />
            برداشت وجه
          </button>
          <Link
            to="/shop"
            search={{ ...SHOP_SEARCH_DEFAULT, category: "bullion" }}
            className="flex items-center gap-2 rounded-full bg-gold px-4 py-2.5 text-sm font-semibold text-parchment transition hover:bg-gold/90"
          >
            <Plus size={16} />
            خرید طلا
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-1 overflow-x-auto border-b border-onyx/10 pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-medium transition ${
              activeTab === tab.id
                ? "border-b-2 border-gold text-gold"
                : "text-onyx/60 hover:text-onyx"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===================== OVERVIEW ===================== */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Total Assets Card */}
          <div className="rounded-3xl border border-onyx/10 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-[11px] uppercase tracking-[0.2em] text-onyx/50">دارایی کل</p>
            <div className="mt-2 flex flex-wrap items-end gap-3">
              <h2 className="font-serif text-4xl tracking-tight sm:text-5xl">
                {MOCK_WALLET.totalValueToman.toLocaleString("fa-IR")}
                <span className="mr-2 text-lg font-normal text-onyx/50">تومان</span>
              </h2>
              <span className="mb-1 flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-sm font-medium text-emerald-700">
                <TrendingUp size={14} />
                +{MOCK_WALLET.todayChangePercent}٪ امروز
              </span>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl bg-parchment/60 p-4">
                <p className="text-xs text-onyx/50">طلای ۲۴ عیار</p>
                <p className="mt-1 text-2xl font-semibold">{MOCK_WALLET.gold24kGrams} گرم</p>
              </div>
              <div className="rounded-2xl bg-parchment/60 p-4">
                <p className="text-xs text-onyx/50">موجودی ریالی</p>
                <p className="mt-1 text-2xl font-semibold">
                  {MOCK_WALLET.cashBalance.toLocaleString("fa-IR")} تومان
                </p>
              </div>
              <div className="rounded-2xl bg-parchment/60 p-4">
                <p className="text-xs text-onyx/50">در انتظار تسویه</p>
                <p className="mt-1 text-2xl font-semibold">
                  {MOCK_WALLET.pendingSettlement.toLocaleString("fa-IR")} تومان
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <QuickAction icon={ArrowDownLeft} label="واریز وجه" onClick={() => {}} />
              <QuickAction icon={ArrowUpRight} label="برداشت وجه" onClick={() => setShowWithdrawModal(true)} />
              <QuickAction
                icon={Plus}
                label="خرید طلا"
                to="/shop"
                search={{ ...SHOP_SEARCH_DEFAULT, category: "bullion" }}
              />
              <QuickAction icon={Send} label="فروش طلا" onClick={() => {}} />
            </div>
          </div>

          {/* Profit + Chart Row */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-onyx/10 bg-white p-6">
              <p className="text-[11px] uppercase tracking-[0.2em] text-onyx/50">سود سرمایه</p>
              <p className="mt-3 font-serif text-3xl text-emerald-600">
                +{MOCK_WALLET.totalProfit.toLocaleString("fa-IR")}
              </p>
              <p className="mt-1 text-sm text-onyx/60">تومان</p>
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-onyx/60">بازده کل</span>
                  <span className="font-medium text-emerald-600">+{MOCK_WALLET.returnPercent}٪</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-onyx/60">سود امروز</span>
                  <span className="font-medium">+{MOCK_WALLET.todayProfit.toLocaleString("fa-IR")}</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-onyx/10 bg-white p-6 lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.2em] text-onyx/50">نمودار ارزش کیف پول</p>
                <div className="flex gap-1 text-xs">
                  {["1D", "1W", "1M", "3M", "6M", "1Y", "ALL"].map((r) => (
                    <button
                      key={r}
                      className={`rounded-full px-2.5 py-1 ${
                        r === "1M" ? "bg-gold text-parchment" : "text-onyx/50 hover:text-onyx"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex h-48 items-center justify-center rounded-2xl bg-parchment/40">
                <div className="text-center text-onyx/40">
                  <LineChart size={32} className="mx-auto mb-2" />
                  <p className="text-sm">نمودار ارزش دارایی (در حال اتصال به داده زنده)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Allocation + Avg Buy */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-onyx/10 bg-white p-6">
              <p className="mb-5 text-[11px] uppercase tracking-[0.2em] text-onyx/50">تخصیص دارایی</p>
              <div className="flex items-center gap-8">
                <div className="relative h-32 w-32 shrink-0">
                  <div className="absolute inset-0 rounded-full border-[12px] border-gold" />
                  <div className="absolute inset-3 rounded-full border-[8px] border-emerald-500" />
                  <div className="absolute inset-6 rounded-full border-[6px] border-amber-600" />
                  <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                    ۹۵٪
                  </div>
                </div>
                <div className="space-y-3">
                  {MOCK_WALLET.allocation.map((item) => (
                    <div key={item.label} className="flex items-center gap-3 text-sm">
                      <span className={`h-3 w-3 rounded-full ${item.color}`} />
                      <span className="text-onyx/70">{item.label}</span>
                      <span className="mr-auto font-medium">{item.percent}٪</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-onyx/10 bg-white p-6">
              <p className="mb-5 text-[11px] uppercase tracking-[0.2em] text-onyx/50">میانگین خرید</p>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-onyx/60">میانگین خرید</span>
                  <span className="font-semibold">{MOCK_WALLET.avgBuyPrice.toLocaleString("fa-IR")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-onyx/60">قیمت امروز</span>
                  <span className="font-semibold">{livePrice}</span>
                </div>
                <div className="flex justify-between border-t border-onyx/10 pt-4">
                  <span className="text-onyx/60">سود هر گرم</span>
                  <span className="font-semibold text-emerald-600">
                    +{MOCK_WALLET.profitPerGram.toLocaleString("fa-IR")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insight */}
          <div className="rounded-3xl border border-gold/20 bg-gradient-to-br from-gold/5 to-transparent p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-gold/10 p-2">
                <AlertCircle size={18} className="text-gold" />
              </div>
              <div>
                <p className="font-medium">تحلیل امروز</p>
                <p className="mt-2 text-sm leading-relaxed text-onyx/70">
                  قیمت طلا امروز ۱.۳٪ افزایش داشته است. میانگین خرید شما پایین‌تر از قیمت فعلی است و در حال حاضر در سود هستید.
                  این صرفاً یک تحلیل اطلاعاتی است و توصیه قطعی برای خرید یا فروش نیست.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== ASSETS ===================== */}
      {activeTab === "assets" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AssetCard title="طلای ۲۴ عیار" value={`${MOCK_WALLET.gold24kGrams} گرم`} subtitle="قابل فروش و ارسال" />
            <AssetCard
              title="موجودی نقد"
              value={`${MOCK_WALLET.cashBalance.toLocaleString("fa-IR")} تومان`}
              subtitle="قابل برداشت"
            />
            <AssetCard
              title="در انتظار تسویه"
              value={`${MOCK_WALLET.pendingSettlement.toLocaleString("fa-IR")} تومان`}
              subtitle="پس از تأیید فروش"
            />
          </div>

          <div className="rounded-3xl border border-onyx/10 bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-medium">گوی‌های من</h3>
              <Link
                to="/shop"
                search={{ ...SHOP_SEARCH_DEFAULT, category: "bullion" }}
                className="text-sm text-gold hover:underline"
              >
                خرید گوی جدید
              </Link>
            </div>
            <div className="space-y-3">
              {MOCK_WALLET.coins.map((coin, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-2xl border border-onyx/8 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-gold/10 p-2">
                      <Coins size={18} className="text-gold" />
                    </div>
                    <div>
                      <p className="font-medium">{coin.name}</p>
                      <p className="text-xs text-onyx/50">{coin.status}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium">{coin.qty}×</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-onyx/10 bg-white p-6">
            <h3 className="mb-4 font-medium">ارسال فیزیکی</h3>
            <p className="mb-4 text-sm text-onyx/60">
              موجودی قابل ارسال: <strong>۶ گرم</strong>
            </p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {["پست", "تیپاکس", "پیک", "حضوری"].map((method) => (
                <button
                  key={method}
                  className="rounded-2xl border border-onyx/10 px-4 py-3 text-sm transition hover:border-gold hover:text-gold"
                >
                  {method}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================== TRANSACTIONS ===================== */}
      {activeTab === "transactions" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {["همه", "خرید", "فروش", "واریز", "برداشت", "ارسال"].map((f) => (
              <button
                key={f}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  f === "همه"
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-onyx/10 text-onyx/60 hover:border-gold"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="overflow-hidden rounded-3xl border border-onyx/10 bg-white">
            {MOCK_WALLET.transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between border-b border-onyx/8 px-5 py-4 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-full p-2 ${
                      tx.type === "buy" || tx.type === "deposit"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-rose-50 text-rose-600"
                    }`}
                  >
                    {tx.type === "buy" || tx.type === "deposit" ? (
                      <ArrowDownLeft size={16} />
                    ) : (
                      <ArrowUpRight size={16} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{tx.title}</p>
                    <p className="text-xs text-onyx/50">{tx.date}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-medium">{tx.amount}</p>
                  <p
                    className={`text-xs ${
                      tx.status === "success" ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {tx.status === "success" ? "موفق" : "در انتظار"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== ANALYSIS ===================== */}
      {activeTab === "analysis" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <PerfCard title="امسال" value="+۲۸٪" />
            <PerfCard title="ماه گذشته" value="+۴٪" />
            <PerfCard title="این هفته" value="+۱.۷٪" />
          </div>

          <div className="rounded-3xl border border-onyx/10 bg-white p-6">
            <div className="mb-4 flex items-center gap-2">
              <Target size={18} className="text-gold" />
              <h3 className="font-medium">هدف سرمایه‌گذاری</h3>
            </div>
            <div className="mb-2 flex justify-between text-sm">
              <span>
                پیشرفت: {MOCK_WALLET.currentGoldGrams} از {MOCK_WALLET.investmentGoalGrams} گرم
              </span>
              <span className="font-medium">{progressPercent}٪</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-onyx/10">
              <div
                className="h-full rounded-full bg-gold transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-onyx/10 bg-white p-6">
            <h3 className="mb-4 font-medium">هشدار قیمت</h3>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label className="mb-1 block text-xs text-onyx/50">اگر قیمت هر گرم رسید به</label>
                <input
                  type="text"
                  placeholder="۳۰٬۰۰۰٬۰۰۰"
                  className="w-full rounded-2xl border border-onyx/15 bg-parchment/40 px-4 py-3 text-sm outline-none focus:border-gold"
                />
              </div>
              <button className="rounded-2xl bg-gold px-6 py-3 text-sm font-semibold text-parchment">
                ثبت هشدار
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== WITHDRAW MODAL ===================== */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-onyx/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <h3 className="mb-1 font-serif text-2xl">درخواست برداشت</h3>
            <p className="mb-6 text-sm text-onyx/60">مبلغ به حساب بانکی شما واریز می‌شود</p>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs text-onyx/50">شماره شبا</label>
                <input
                  value={iban}
                  onChange={(e) => setIban(e.target.value)}
                  placeholder="IR..."
                  className="w-full rounded-2xl border border-onyx/15 px-4 py-3 text-sm outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-onyx/50">مبلغ (تومان)</label>
                <input
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="حداکثر ۲٬۴۵۰٬۰۰۰"
                  className="w-full rounded-2xl border border-onyx/15 px-4 py-3 text-sm outline-none focus:border-gold"
                />
              </div>
              <p className="text-xs text-onyx/50">
                موجودی قابل برداشت: {MOCK_WALLET.cashBalance.toLocaleString("fa-IR")} تومان
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 rounded-2xl border border-onyx/15 py-3 text-sm font-medium"
              >
                انصراف
              </button>
              <button
                onClick={() => {
                  setShowWithdrawModal(false);
                  alert("درخواست برداشت با موفقیت ثبت شد");
                }}
                className="flex-1 rounded-2xl bg-gold py-3 text-sm font-semibold text-parchment"
              >
                ثبت درخواست
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Helper Components ---
function QuickAction({
  icon: Icon,
  label,
  onClick,
  to,
  search,
}: {
  icon: any;
  label: string;
  onClick?: () => void;
  to?: string;
  search?: any;
}) {
  const content = (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-onyx/10 bg-parchment/40 py-4 transition hover:border-gold hover:bg-gold/5">
      <Icon size={20} className="text-gold" />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );

  if (to) {
    return (
      <Link to={to} search={search}>
        {content}
      </Link>
    );
  }
  return <button onClick={onClick}>{content}</button>;
}

function AssetCard({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return (
    <div className="rounded-3xl border border-onyx/10 bg-white p-5">
      <p className="text-xs text-onyx/50">{title}</p>
      <p className="mt-2 text-xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-onyx/40">{subtitle}</p>
    </div>
  );
}

function PerfCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl border border-onyx/10 bg-white p-5 text-center">
      <p className="text-xs text-onyx/50">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-emerald-600">{value}</p>
    </div>
  );
}