import { Link } from "@tanstack/react-router";
import {
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  Coins,
  History,
  Plus,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet as WalletIcon,
  AlertCircle,
  Send,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useLiveGold } from "@/lib/live-gold";
import { SHOP_SEARCH_DEFAULT } from "@/lib/shop-search";
import { addAlert, deposit, removeAlert, requestWithdraw, setGoalGrams, useWallet } from "@/lib/wallet";

type Tab = "overview" | "assets" | "transactions" | "analysis";
type TxFilter = "all" | "buy" | "sell" | "deposit" | "withdraw" | "physical";

const faNum = (n: number) => new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 }).format(Math.round(n));
const faDec = (n: number, d = 3) => new Intl.NumberFormat("fa-IR", { maximumFractionDigits: d }).format(n);
const parseNum = (s: string) => Number(s.replace(/[^\d.]/g, ""));

export function WalletPage() {
  const { rate24, isLive } = useLiveGold();
  const { wallet, refresh } = useWallet(rate24);

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [iban, setIban] = useState("");
  const [txFilter, setTxFilter] = useState<TxFilter>("all");
  const [goalInput, setGoalInput] = useState("");
  const [alertInput, setAlertInput] = useState("");

  const tabs = [
    { id: "overview" as Tab, label: "نمای کلی", icon: WalletIcon },
    { id: "assets" as Tab, label: "دارایی‌ها", icon: Coins },
    { id: "transactions" as Tab, label: "تراکنش‌ها", icon: History },
    { id: "analysis" as Tab, label: "تحلیل", icon: BarChart3 },
  ];

  const filters: { id: TxFilter; label: string }[] = [
    { id: "all", label: "همه" },
    { id: "buy", label: "خرید" },
    { id: "sell", label: "فروش" },
    { id: "deposit", label: "واریز" },
    { id: "withdraw", label: "برداشت" },
    { id: "physical", label: "ارسال" },
  ];

  const visibleTx = useMemo(
    () => (txFilter === "all" ? wallet.transactions : wallet.transactions.filter((t) => t.type === txFilter)),
    [wallet.transactions, txFilter],
  );

  const inProfit = wallet.totalProfit >= 0;

  const handleDeposit = () => {
    const amount = parseNum(depositAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("مبلغ واریز معتبر نیست");
      return;
    }
    deposit(amount);
    setDepositAmount("");
    setShowDepositModal(false);
    refresh();
    toast.success("واریز با موفقیت ثبت شد");
  };

  const handleWithdraw = () => {
    const amount = parseNum(withdrawAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("مبلغ برداشت معتبر نیست");
      return;
    }
    if (amount > wallet.cashBalance) {
      toast.error("موجودی نقدی کافی نیست");
      return;
    }
    if (iban.trim().length < 10) {
      toast.error("شماره شبا را کامل وارد کنید");
      return;
    }
    requestWithdraw(amount, iban.trim());
    setWithdrawAmount("");
    setShowWithdrawModal(false);
    refresh();
    toast.success("درخواست برداشت ثبت شد");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">
            کیف پول <span className="text-gold">AGHLI</span>
          </h1>
          <p className="mt-1 text-sm text-onyx/60">
            مرکز مدیریت دارایی‌های طلا و نقدی شما — نرخ {isLive ? "زنده" : "پیش‌فرض"}: {faNum(rate24)} تومان بر گرم
          </p>
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
            to="/investment"
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
              activeTab === tab.id ? "border-b-2 border-gold text-gold" : "text-onyx/60 hover:text-onyx"
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
          <div className="rounded-3xl border border-onyx/10 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-[11px] uppercase tracking-[0.2em] text-onyx/50">دارایی کل</p>
            <div className="mt-2 flex flex-wrap items-end gap-3">
              <h2 className="font-serif text-4xl tracking-tight sm:text-5xl">
                {faNum(wallet.totalValue)}
                <span className="mr-2 text-lg font-normal text-onyx/50">تومان</span>
              </h2>
              {wallet.buyValue > 0 && (
                <span
                  className={`mb-1 flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-medium ${
                    inProfit ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                  }`}
                >
                  {inProfit ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {inProfit ? "+" : "−"}
                  {faNum(Math.abs(wallet.returnPercent))}٪ بازده
                </span>
              )}
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl bg-parchment/60 p-4">
                <p className="text-xs text-onyx/50">طلای ۲۴ عیار</p>
                <p className="mt-1 text-2xl font-semibold">{faDec(wallet.grams)} گرم</p>
              </div>
              <div className="rounded-2xl bg-parchment/60 p-4">
                <p className="text-xs text-onyx/50">موجودی ریالی</p>
                <p className="mt-1 text-2xl font-semibold">{faNum(wallet.cashBalance)} تومان</p>
              </div>
              <div className="rounded-2xl bg-parchment/60 p-4">
                <p className="text-xs text-onyx/50">در انتظار تسویه</p>
                <p className="mt-1 text-2xl font-semibold">{faNum(wallet.pendingSettlement)} تومان</p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <QuickAction icon={ArrowDownLeft} label="واریز وجه" onClick={() => setShowDepositModal(true)} />
              <QuickAction icon={ArrowUpRight} label="برداشت وجه" onClick={() => setShowWithdrawModal(true)} />
              <QuickAction icon={Plus} label="خرید طلا" to="/investment" />
              <QuickAction icon={Send} label="فروش طلا" to="/investment" />
            </div>
          </div>

          {/* Profit + Allocation */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-onyx/10 bg-white p-6">
              <p className="text-[11px] uppercase tracking-[0.2em] text-onyx/50">سود سرمایه</p>
              <p className={`mt-3 font-serif text-3xl ${inProfit ? "text-emerald-600" : "text-rose-600"}`}>
                {inProfit ? "+" : "−"}
                {faNum(Math.abs(wallet.totalProfit))}
              </p>
              <p className="mt-1 text-sm text-onyx/60">تومان</p>
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-onyx/60">بازده کل</span>
                  <span className={`font-medium ${inProfit ? "text-emerald-600" : "text-rose-600"}`}>
                    {inProfit ? "+" : "−"}
                    {faNum(Math.abs(wallet.returnPercent))}٪
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-onyx/60">ارزش خرید</span>
                  <span className="font-medium">{faNum(wallet.buyValue)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-onyx/10 bg-white p-6 lg:col-span-2">
              <p className="mb-5 text-[11px] uppercase tracking-[0.2em] text-onyx/50">تخصیص دارایی</p>
              {wallet.totalValue === 0 ? (
                <EmptyState
                  text="هنوز دارایی ثبت نشده است."
                  ctaText="شروع سرمایه‌گذاری"
                  to="/investment"
                />
              ) : (
                <div className="space-y-4">
                  {wallet.allocation.map((item) => (
                    <div key={item.label}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-onyx/70">{item.label}</span>
                        <span className="font-medium">{faNum(item.percent)}٪</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-onyx/10">
                        <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Avg buy */}
          <div className="rounded-3xl border border-onyx/10 bg-white p-6">
            <p className="mb-5 text-[11px] uppercase tracking-[0.2em] text-onyx/50">میانگین خرید</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex justify-between sm:block">
                <span className="text-onyx/60">میانگین خرید</span>
                <span className="font-semibold sm:mt-1 sm:block">{faNum(wallet.avgBuyPrice)}</span>
              </div>
              <div className="flex justify-between sm:block">
                <span className="text-onyx/60">قیمت امروز</span>
                <span className="font-semibold sm:mt-1 sm:block">{faNum(rate24)}</span>
              </div>
              <div className="flex justify-between sm:block">
                <span className="text-onyx/60">سود هر گرم</span>
                <span
                  className={`font-semibold sm:mt-1 sm:block ${
                    wallet.profitPerGram >= 0 ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {wallet.profitPerGram >= 0 ? "+" : "−"}
                  {faNum(Math.abs(wallet.profitPerGram))}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gold/20 bg-gradient-to-br from-gold/5 to-transparent p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-gold/10 p-2">
                <AlertCircle size={18} className="text-gold" />
              </div>
              <div>
                <p className="font-medium">تحلیل امروز</p>
                <p className="mt-2 text-sm leading-relaxed text-onyx/70">
                  {wallet.grams === 0
                    ? "هنوز طلایی در کیف پول شما ثبت نشده است. با خرید مقدار دلخواه می‌توانید دارایی خود را زنده دنبال کنید."
                    : inProfit
                      ? `میانگین خرید شما ${faNum(wallet.avgBuyPrice)} تومان است و نرخ فعلی بالاتر از آن قرار دارد؛ در حال حاضر در سود هستید.`
                      : `نرخ فعلی پایین‌تر از میانگین خرید شما (${faNum(wallet.avgBuyPrice)} تومان) است؛ دارایی شما موقتاً در زیان قرار دارد.`}{" "}
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
            <AssetCard title="طلای ۲۴ عیار" value={`${faDec(wallet.grams)} گرم`} subtitle="قابل فروش و ارسال" />
            <AssetCard title="موجودی نقد" value={`${faNum(wallet.cashBalance)} تومان`} subtitle="قابل برداشت" />
            <AssetCard
              title="در انتظار تسویه"
              value={`${faNum(wallet.pendingSettlement)} تومان`}
              subtitle="پس از تأیید فروش"
            />
          </div>

          <div className="rounded-3xl border border-onyx/10 bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-medium">گوی‌های من</h3>
              <Link to="/investment" className="text-sm text-gold hover:underline">
                خرید گوی جدید
              </Link>
            </div>
            {wallet.balls.length === 0 ? (
              <EmptyState text="هنوز گوی طلایی ثبت نشده است." ctaText="مشاهده گوی‌ها" to="/investment" />
            ) : (
              <div className="space-y-3">
                {wallet.balls.map((coin) => (
                  <div
                    key={`${coin.name}-${coin.status}`}
                    className="flex items-center justify-between rounded-2xl border border-onyx/10 px-4 py-3"
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
                    <span className="text-sm font-medium">{faNum(coin.qty)}×</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-onyx/10 bg-white p-6">
            <h3 className="mb-4 font-medium">ارسال فیزیکی</h3>
            <p className="mb-4 text-sm text-onyx/60">
              موجودی قابل ارسال: <strong>{faDec(wallet.grams)} گرم</strong>
            </p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {["پست", "تیپاکس", "پیک", "حضوری"].map((method) => (
                <Link
                  key={method}
                  to="/investment"
                  className="rounded-2xl border border-onyx/10 px-4 py-3 text-center text-sm transition hover:border-gold hover:text-gold"
                >
                  {method}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================== TRANSACTIONS ===================== */}
      {activeTab === "transactions" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setTxFilter(f.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  txFilter === f.id
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-onyx/10 text-onyx/60 hover:border-gold"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="overflow-hidden rounded-3xl border border-onyx/10 bg-white">
            {visibleTx.length === 0 ? (
              <div className="p-8">
                <EmptyState text="تراکنشی برای نمایش وجود ندارد." ctaText="ثبت اولین خرید" to="/investment" />
              </div>
            ) : (
              visibleTx.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between border-b border-onyx/10 px-5 py-4 last:border-0"
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
                    <p className={`text-xs ${tx.status === "success" ? "text-emerald-600" : "text-amber-600"}`}>
                      {tx.status === "success" ? "موفق" : "در انتظار"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ===================== ANALYSIS ===================== */}
      {activeTab === "analysis" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <PerfCard title="ارزش امروز" value={`${faNum(wallet.goldValue)}`} />
            <PerfCard
              title="سود / زیان"
              value={`${inProfit ? "+" : "−"}${faNum(Math.abs(wallet.totalProfit))}`}
              negative={!inProfit}
            />
            <PerfCard
              title="بازده"
              value={`${inProfit ? "+" : "−"}${faNum(Math.abs(wallet.returnPercent))}٪`}
              negative={!inProfit}
            />
          </div>

          <div className="rounded-3xl border border-onyx/10 bg-white p-6">
            <div className="mb-4 flex items-center gap-2">
              <Target size={18} className="text-gold" />
              <h3 className="font-medium">هدف سرمایه‌گذاری</h3>
            </div>
            <div className="mb-2 flex justify-between text-sm">
              <span>
                پیشرفت: {faDec(wallet.grams)} از {faNum(wallet.goalGrams)} گرم
              </span>
              <span className="font-medium">{faNum(wallet.progressPercent)}٪</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-onyx/10">
              <div
                className="h-full rounded-full bg-gold transition-all"
                style={{ width: `${wallet.progressPercent}%` }}
              />
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label className="mb-1 block text-xs text-onyx/50">هدف جدید (گرم)</label>
                <input
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  placeholder={faNum(wallet.goalGrams)}
                  className="w-full rounded-2xl border border-onyx/15 bg-parchment/40 px-4 py-3 text-sm outline-none focus:border-gold"
                />
              </div>
              <button
                onClick={() => {
                  const grams = parseNum(goalInput);
                  if (!Number.isFinite(grams) || grams <= 0) {
                    toast.error("مقدار هدف معتبر نیست");
                    return;
                  }
                  setGoalGrams(grams);
                  setGoalInput("");
                  refresh();
                  toast.success("هدف سرمایه‌گذاری به‌روزرسانی شد");
                }}
                className="rounded-2xl bg-onyx px-6 py-3 text-sm font-semibold text-parchment transition hover:bg-gold"
              >
                ثبت هدف
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-onyx/10 bg-white p-6">
            <h3 className="mb-4 font-medium">هشدار قیمت</h3>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label className="mb-1 block text-xs text-onyx/50">اگر قیمت هر گرم رسید به (تومان)</label>
                <input
                  value={alertInput}
                  onChange={(e) => setAlertInput(e.target.value)}
                  placeholder={faNum(rate24)}
                  className="w-full rounded-2xl border border-onyx/15 bg-parchment/40 px-4 py-3 text-sm outline-none focus:border-gold"
                />
              </div>
              <button
                onClick={() => {
                  const target = parseNum(alertInput);
                  if (!Number.isFinite(target) || target <= 0) {
                    toast.error("قیمت هشدار معتبر نیست");
                    return;
                  }
                  addAlert(target);
                  setAlertInput("");
                  refresh();
                  toast.success("هشدار قیمت ثبت شد");
                }}
                className="rounded-2xl bg-gold px-6 py-3 text-sm font-semibold text-parchment"
              >
                ثبت هشدار
              </button>
            </div>

            {wallet.alerts.length > 0 && (
              <div className="mt-5 space-y-2">
                {wallet.alerts.map((alert) => {
                  const reached = rate24 >= alert.targetPrice;
                  return (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between rounded-2xl border border-onyx/10 px-4 py-3 text-sm"
                    >
                      <span>
                        {faNum(alert.targetPrice)} تومان
                        <span className={`mr-3 text-xs ${reached ? "text-emerald-600" : "text-onyx/50"}`}>
                          {reached ? "فعال شد" : "در انتظار"}
                        </span>
                      </span>
                      <button
                        onClick={() => {
                          removeAlert(alert.id);
                          refresh();
                        }}
                        className="text-xs text-rose-600 hover:underline"
                      >
                        حذف
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================== DEPOSIT MODAL ===================== */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-onyx/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <h3 className="mb-1 font-serif text-2xl">واریز وجه</h3>
            <p className="mb-6 text-sm text-onyx/60">مبلغ به موجودی ریالی کیف پول شما اضافه می‌شود</p>
            <label className="mb-1 block text-xs text-onyx/50">مبلغ (تومان)</label>
            <input
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="۱٬۰۰۰٬۰۰۰"
              className="w-full rounded-2xl border border-onyx/15 px-4 py-3 text-sm outline-none focus:border-gold"
            />
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowDepositModal(false)}
                className="flex-1 rounded-2xl border border-onyx/15 py-3 text-sm font-medium"
              >
                انصراف
              </button>
              <button
                onClick={handleDeposit}
                className="flex-1 rounded-2xl bg-gold py-3 text-sm font-semibold text-parchment"
              >
                ثبت واریز
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
                  placeholder={`حداکثر ${faNum(wallet.cashBalance)}`}
                  className="w-full rounded-2xl border border-onyx/15 px-4 py-3 text-sm outline-none focus:border-gold"
                />
              </div>
              <p className="text-xs text-onyx/50">موجودی قابل برداشت: {faNum(wallet.cashBalance)} تومان</p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 rounded-2xl border border-onyx/15 py-3 text-sm font-medium"
              >
                انصراف
              </button>
              <button
                onClick={handleWithdraw}
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

/* --- Helper Components --- */

function QuickAction({
  icon: Icon,
  label,
  onClick,
  to,
}: {
  icon: typeof Plus;
  label: string;
  onClick?: () => void;
  to?: string;
}) {
  const content = (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-onyx/10 bg-parchment/40 py-4 transition hover:border-gold hover:bg-gold/5">
      <Icon size={20} className="text-gold" />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );

  if (to === "/investment") {
    return <Link to="/investment">{content}</Link>;
  }
  if (to === "/shop") {
    return (
      <Link to="/shop" search={{ ...SHOP_SEARCH_DEFAULT }}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className="w-full">
      {content}
    </button>
  );
}

function EmptyState({ text, ctaText, to }: { text: string; ctaText: string; to: "/investment" }) {
  return (
    <div className="flex flex-col items-center gap-3 py-6 text-center">
      <p className="text-sm text-onyx/55">{text}</p>
      <Link
        to={to}
        className="rounded-full border border-gold px-4 py-2 text-xs font-medium text-gold transition hover:bg-gold hover:text-parchment"
      >
        {ctaText}
      </Link>
    </div>
  );
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

function PerfCard({ title, value, negative }: { title: string; value: string; negative?: boolean }) {
  return (
    <div className="rounded-3xl border border-onyx/10 bg-white p-5 text-center">
      <p className="text-xs text-onyx/50">{title}</p>
      <p className={`mt-2 text-2xl font-semibold ${negative ? "text-rose-600" : "text-emerald-600"}`}>{value}</p>
    </div>
  );
}
