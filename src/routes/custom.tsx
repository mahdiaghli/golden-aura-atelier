import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useRef } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/site/Chrome";
import {
  Camera,
  Check,
  ImagePlus,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
// اگر useSession دارید:
// import { useSession } from "@/lib/use-session";

export const Route = createFileRoute("/custom")({
  head: () => ({
    meta: [
      { title: "سفارش طلای سفارشی — پلاک اسم، حکاکی | عقلی" },
      {
        name: "description",
        content:
          "طلای دلخواه خود را سفارش دهید: پلاک اسم، حکاکی، طرح از روی عکس. ارسال تصویر مرجع و ثبت سفارش آنلاین.",
      },
    ],
  }),
  component: CustomOrderPage,
});

const fmt = (n: number) =>
  new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 }).format(Math.round(n));

type ServiceId =
  | "name-plaque"
  | "engraving"
  | "photo-replica"
  | "custom-ring"
  | "custom-pendant"
  | "other";

const SERVICES: {
  id: ServiceId;
  title: string;
  desc: string;
  examples: string[];
}[] = [
  {
    id: "name-plaque",
    title: "پلاک اسم",
    desc: "پلاک طلا با نام یا متن دلخواه به فارسی یا انگلیسی.",
    examples: ["اسم کوچک", "تاریخ تولد", "عبارت کوتاه"],
  },
  {
    id: "engraving",
    title: "حکاکی روی طلا",
    desc: "حکاکی روی انگشتر، دستبند یا پلاک موجود.",
    examples: ["متن پشت انگشتر", "مختصات", "تاریخ ازدواج"],
  },
  {
    id: "photo-replica",
    title: "ساخت از روی عکس",
    desc: "طرح یا قطعهٔ مشابه عکس ارسالی شما ساخته می‌شود.",
    examples: ["کپی طرح اینستاگرام", "یادبود خانوادگی", "مدل خاص"],
  },
  {
    id: "custom-ring",
    title: "انگشتر سفارشی",
    desc: "سایز، عیار، نگین و طرح مطابق سلیقه شما.",
    examples: ["نامزدی", "ست زوج", "طرح مینیمال"],
  },
  {
    id: "custom-pendant",
    title: "آویز / گردنبند سفارشی",
    desc: "پلاک، حرف اول، نماد مذهبی یا طرح آزاد.",
    examples: ["حرف اول", "نقشه ایران", "نماد شخصی"],
  },
  {
    id: "other",
    title: "سایر سفارش‌ها",
    desc: "هر ایدهٔ دیگری که در دسته‌های بالا نیست.",
    examples: ["ست کامل", "تعویض نگین", "تعمیر خاص"],
  },
];

const KARATS = [
  { id: "18", label: "۱۸ عیار", note: "رایج برای جواهر" },
  { id: "21", label: "۲۱ عیار", note: "زرد کلاسیک" },
  { id: "24", label: "۲۴ عیار", note: "خالص‌تر، نرم‌تر" },
];

const WEIGHT_PRESETS = [1, 2, 3, 5, 8, 10];

function CustomOrderPage() {
  // const { session } = useSession();
  const session = null as { id: string } | null;
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [service, setService] = useState<ServiceId>("name-plaque");
  const [karat, setKarat] = useState("18");
  const [weight, setWeight] = useState(3);
  const [customWeight, setCustomWeight] = useState(false);
  const [textOnItem, setTextOnItem] = useState("");
  const [fontStyle, setFontStyle] = useState<"nastaliq" | "naskh" | "latin" | "mixed">("nastaliq");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [photos, setPhotos] = useState<{ id: string; url: string; file: File }[]>([]);
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const selectedService = SERVICES.find((s) => s.id === service)!;

  const estimateNote = useMemo(() => {
    if (service === "name-plaque") return "قیمت نهایی پس از تأیید طرح و وزن اعلام می‌شود.";
    if (service === "photo-replica") return "بعد از بررسی عکس، امکان‌پذیری و حدود قیمت پیامک می‌شود.";
    return "کارشناس ظرف چند ساعت با شما هماهنگ می‌کند.";
  }, [service]);

  const onFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const next: typeof photos = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) {
        toast.error("فقط تصویر مجاز است");
        continue;
      }
      if (file.size > 8 * 1024 * 1024) {
        toast.error("حجم هر عکس حداکثر ۸ مگابایت");
        continue;
      }
      if (photos.length + next.length >= 5) {
        toast.error("حداکثر ۵ عکس");
        break;
      }
      next.push({
        id: `${Date.now()}-${i}`,
        url: URL.createObjectURL(file),
        file,
      });
    }
    setPhotos((p) => [...p, ...next]);
  };

  const removePhoto = (id: string) => {
    setPhotos((p) => {
      const item = p.find((x) => x.id === id);
      if (item) URL.revokeObjectURL(item.url);
      return p.filter((x) => x.id !== id);
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("نام و شماره تماس الزامی است");
      setStep(3);
      return;
    }
    if (service === "name-plaque" && !textOnItem.trim()) {
      toast.error("متن روی پلاک را وارد کنید");
      setStep(2);
      return;
    }
    if (service === "photo-replica" && photos.length === 0) {
      toast.error("حداقل یک عکس مرجع بفرستید");
      setStep(2);
      return;
    }

    if (!session) {
      // اختیاری: اجبار ورود
      // navigate({ to: "/auth", search: { redirect: "/custom" } });
    }

    setBusy(true);
    try {
      // بعداً به API وصل کنید — فعلاً شبیه‌سازی
      // const form = new FormData();
      // form.append("service", service);
      // form.append("karat", karat);
      // form.append("weight", String(weight));
      // form.append("textOnItem", textOnItem);
      // form.append("fontStyle", fontStyle);
      // form.append("description", description);
      // form.append("name", name);
      // form.append("phone", phone);
      // form.append("city", city);
      // photos.forEach((p, i) => form.append(`photo_${i}`, p.file));
      // await fetch("/api/custom-orders", { method: "POST", body: form });

      await new Promise((r) => setTimeout(r, 900));
      toast.success("درخواست ثبت شد. به‌زودی با شما تماس می‌گیریم.");
      setStep(1);
      setTextOnItem("");
      setDescription("");
      setPhotos([]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ثبت ناموفق بود");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell>
      {/* Hero */}
      <section dir="rtl" className="border-b border-onyx/10 bg-gradient-to-b from-white/80 to-transparent">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-gold">
            <Sparkles size={14} /> سفارش سفارشی
          </span>
          <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
            طلایی که فقط مال شماست.
          </h1>
          <p className="mt-4 max-w-2xl font-light text-onyx/65">
            پلاک اسم، حکاکی، ساخت از روی عکس یا هر طرح دیگری که در ذهن دارید. عکس مرجع بفرستید؛
            ما امکان‌پذیری و قیمت را اعلام می‌کنیم و بعد از تأیید، می‌سازیم.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-[12px] text-onyx/55">
            <span className="rounded-full border border-onyx/15 px-4 py-1.5">بدون اجرت ثابت پنهان</span>
            <span className="rounded-full border border-onyx/15 px-4 py-1.5">تأیید طرح قبل از ساخت</span>
            <span className="rounded-full border border-onyx/15 px-4 py-1.5">ارسال عکس از واتساپ/سایت</span>
          </div>
        </div>
      </section>

      <section dir="rtl" className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        {/* Steps */}
        <div className="mb-10 flex flex-wrap gap-2">
          {(
            [
              [1, "نوع سفارش"],
              [2, "جزئیات و عکس"],
              [3, "اطلاعات تماس"],
            ] as const
          ).map(([n, label]) => (
            <button
              key={n}
              type="button"
              onClick={() => setStep(n)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-all ${
                step === n
                  ? "bg-onyx text-parchment"
                  : step > n
                    ? "border border-gold/50 text-gold"
                    : "border border-onyx/15 text-onyx/50"
              }`}
            >
              {step > n ? <Check size={14} /> : <span className="opacity-60">{n}</span>}
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="grid gap-10 lg:grid-cols-[1fr_340px]">
          <div className="space-y-8">
            {/* ——— مرحله ۱: نوع سرویس ——— */}
            {step === 1 && (
              <div>
                <h2 className="font-serif text-2xl">چه چیزی می‌خواهید؟</h2>
                <p className="mt-2 text-sm text-onyx/55">یک مورد را انتخاب کنید؛ بعد جزئیات را می‌پرسیم.</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {SERVICES.map((s) => {
                    const active = service === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setService(s.id)}
                        className={`rounded-2xl border p-5 text-right transition-all ${
                          active
                            ? "border-gold bg-white shadow-[0_16px_40px_rgba(15,15,15,0.06)]"
                            : "border-onyx/10 bg-white/60 hover:border-gold/40"
                        }`}
                      >
                        <p className="font-serif text-lg">{s.title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-onyx/55">{s.desc}</p>
                        <p className="mt-3 text-[11px] text-onyx/40">{s.examples.join(" · ")}</p>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 rounded-2xl border border-onyx/10 bg-white/70 p-6">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-onyx/50">عیار</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {KARATS.map((k) => (
                      <button
                        key={k.id}
                        type="button"
                        onClick={() => setKarat(k.id)}
                        className={`rounded-full border px-4 py-2 text-sm ${
                          karat === k.id ? "border-gold bg-gold/10 text-gold" : "border-onyx/15"
                        }`}
                      >
                        {k.label}
                        <span className="ms-2 text-[10px] text-onyx/45">{k.note}</span>
                      </button>
                    ))}
                  </div>

                  <h3 className="mt-6 text-[11px] font-bold uppercase tracking-widest text-onyx/50">
                    وزن تقریبی (گرم)
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {WEIGHT_PRESETS.map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => {
                          setCustomWeight(false);
                          setWeight(w);
                        }}
                        className={`rounded-full border px-4 py-2 text-sm ${
                          !customWeight && weight === w
                            ? "border-gold bg-gold/10 text-gold"
                            : "border-onyx/15"
                        }`}
                      >
                        {w} گرم
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setCustomWeight(true)}
                      className={`rounded-full border px-4 py-2 text-sm ${
                        customWeight ? "border-gold bg-gold/10 text-gold" : "border-onyx/15"
                      }`}
                    >
                      وزن دلخواه
                    </button>
                  </div>
                  {customWeight && (
                    <input
                      type="number"
                      min={0.5}
                      step={0.1}
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value) || 0)}
                      className="mt-4 w-full max-w-xs border-b border-onyx/20 bg-transparent py-2 text-lg outline-none focus:border-gold"
                      placeholder="مثلاً ۴٫۵"
                    />
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="mt-8 bg-onyx px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-parchment transition-all hover:bg-gold hover:text-onyx"
                >
                  ادامه — جزئیات و عکس
                </button>
              </div>
            )}

            {/* ——— مرحله ۲: متن + توضیح + عکس ——— */}
            {step === 2 && (
              <div className="space-y-8">
                <div>
                  <h2 className="font-serif text-2xl">{selectedService.title}</h2>
                  <p className="mt-1 text-sm text-onyx/55">{selectedService.desc}</p>
                </div>

                {(service === "name-plaque" || service === "engraving" || service === "custom-pendant") && (
                  <div className="rounded-2xl border border-onyx/10 bg-white/70 p-6">
                    <label className="block">
                      <span className="text-[10px] uppercase tracking-widest text-onyx/60">
                        متن روی کار (اسم، تاریخ، عبارت)
                      </span>
                      <input
                        value={textOnItem}
                        onChange={(e) => setTextOnItem(e.target.value)}
                        placeholder="مثلاً: سارا  ·  ۱۴۰۳/۰۱/۰۱"
                        className="mt-2 w-full border-b border-onyx/20 bg-transparent py-3 text-xl outline-none focus:border-gold"
                        maxLength={40}
                      />
                    </label>
                    <p className="mt-2 text-[11px] text-onyx/40">{textOnItem.length}/۴۰ کاراکتر</p>

                    <p className="mt-6 text-[10px] uppercase tracking-widest text-onyx/60">سبک نوشتار</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(
                        [
                          ["nastaliq", "نستعلیق"],
                          ["naskh", "نسخ"],
                          ["latin", "لاتین"],
                          ["mixed", "ترکیبی"],
                        ] as const
                      ).map(([id, label]) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setFontStyle(id)}
                          className={`rounded-full border px-4 py-2 text-xs ${
                            fontStyle === id ? "border-gold bg-gold/10 text-gold" : "border-onyx/15"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-2xl border border-onyx/10 bg-white/70 p-6">
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-widest text-onyx/60">
                      توضیحات آزاد
                    </span>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      placeholder="سایز انگشتر، رنگ طلا (زرد/سفید/رزگلد)، جزئیات طرح، بودجه‌ی تقریبی…"
                      className="mt-2 w-full resize-y border border-onyx/10 bg-transparent p-4 text-sm outline-none focus:border-gold"
                    />
                  </label>
                </div>

                {/* آپلود عکس */}
                <div className="rounded-2xl border border-onyx/10 bg-white/70 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-xl">عکس مرجع</h3>
                      <p className="mt-1 text-xs text-onyx/55">
                        تا ۵ تصویر · JPG/PNG · حداکثر ۸ مگابایت — از روی عکس مدل، اسکرین اینستاگرام یا دست‌نویس.
                      </p>
                    </div>
                    <Camera className="shrink-0 text-gold/80" size={22} />
                  </div>

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      onFiles(e.target.files);
                      e.target.value = "";
                    }}
                  />

                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                    {photos.map((p) => (
                      <div key={p.id} className="group relative aspect-square overflow-hidden rounded-xl border border-onyx/10">
                        <img src={p.url} alt="" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(p.id)}
                          className="absolute end-1.5 top-1.5 rounded-full bg-onyx/80 p-1 text-parchment opacity-0 transition group-hover:opacity-100"
                          aria-label="حذف"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}

                    {photos.length < 5 && (
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-onyx/25 bg-onyx/[0.02] text-onyx/50 transition hover:border-gold hover:text-gold"
                      >
                        <ImagePlus size={22} />
                        <span className="text-[10px] uppercase tracking-wider">افزودن</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="mt-4 inline-flex items-center gap-2 text-sm text-gold hover:underline"
                  >
                    <Upload size={16} />
                    انتخاب از گالری
                  </button>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="border border-onyx/20 px-6 py-3 text-[11px] font-bold uppercase tracking-wider"
                  >
                    بازگشت
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="bg-onyx px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-parchment hover:bg-gold hover:text-onyx"
                  >
                    ادامه — تماس
                  </button>
                </div>
              </div>
            )}

            {/* ——— مرحله ۳: تماس ——— */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl">راه‌های تماس</h2>
                  <p className="mt-1 text-sm text-onyx/55">
                    بعد از ثبت، کارشناس برای تأیید طرح و اعلام قیمت با شما هماهنگ می‌کند.
                  </p>
                </div>

                <div className="rounded-2xl border border-onyx/10 bg-white/70 p-6 space-y-5">
                  <Field
                    label="نام و نام خانوادگی"
                    value={name}
                    onChange={setName}
                    required
                    autoComplete="name"
                  />
                  <Field
                    label="شماره موبایل"
                    value={phone}
                    onChange={setPhone}
                    required
                    type="tel"
                    inputMode="tel"
                    placeholder="۰۹۱۲…"
                    autoComplete="tel"
                  />
                  <Field label="شهر" value={city} onChange={setCity} placeholder="مثلاً مشهد" />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="border border-onyx/20 px-6 py-3 text-[11px] font-bold uppercase tracking-wider"
                  >
                    بازگشت
                  </button>
                  <button
                    type="submit"
                    disabled={busy}
                    className="bg-onyx px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-parchment transition-all hover:bg-gold hover:text-onyx disabled:opacity-50"
                  >
                    {busy ? "در حال ثبت…" : "ثبت درخواست سفارش"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* خلاصه ثابت */}
          <aside className="h-fit space-y-4 rounded-2xl bg-secondary p-7 lg:sticky lg:top-28">
            <h4 className="text-[11px] font-bold uppercase tracking-widest">خلاصه درخواست</h4>
            <Row label="نوع" value={selectedService.title} />
            <Row label="عیار" value={`${karat} عیار`} />
            <Row label="وزن تقریبی" value={`${weight} گرم`} />
            {textOnItem && <Row label="متن" value={textOnItem} />}
            <Row label="عکس‌ها" value={`${photos.length} فایل`} />
            <p className="border-t border-onyx/10 pt-4 text-[11px] leading-relaxed text-onyx/50">
              {estimateNote}
            </p>
            <p className="text-[11px] text-onyx/45">
              یا مستقیم در تلگرام بفرستید:{" "}
              <a
                href="https://t.me/aghligold"
                target="_blank"
                rel="noreferrer"
                className="text-gold hover:underline"
              >
                @aghligold
              </a>
            </p>
            <Link
              to="/shop"
              search={{ stock: "made-to-order" } as never}
              className="block pt-2 text-center text-[10px] uppercase tracking-widest text-gold"
            >
              مشاهده محصولات آماده سفارش
            </Link>
          </aside>
        </form>

        {/* نمونه‌کار / اعتماد */}
        <div className="mt-20 border-t border-onyx/10 pt-14">
          <h2 className="font-serif text-2xl">چطور کار می‌کند؟</h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["۱", "نوع کار و جزئیات را مشخص کنید"],
              ["۲", "عکس یا متن مرجع بفرستید"],
              ["۳", "قیمت و زمان ساخت را تأیید کنید"],
              ["۴", "پس از ساخت، ارسال یا تحویل حضوری"],
            ].map(([n, t]) => (
              <li key={n} className="rounded-2xl border border-onyx/10 bg-white/50 p-5">
                <span className="text-gold font-serif text-2xl">{n}</span>
                <p className="mt-2 text-sm text-onyx/70">{t}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </Shell>
  );
}

function Field({
  label,
  value,
  onChange,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest text-onyx/60">{label}</span>
      <input
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border-b border-onyx/20 bg-transparent py-2.5 text-sm outline-none focus:border-gold"
      />
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="shrink-0 text-onyx/50">{label}</span>
      <span className="text-left font-medium">{value}</span>
    </div>
  );
}