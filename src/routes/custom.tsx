import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useRef } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/site/Chrome";
import { createCustomOrder } from "@/lib/requests";
import { useLiveGold } from "@/lib/live-gold";
import { useI18n } from "@/lib/i18n/context";
import {
  Camera,
  Check,
  ImagePlus,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

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

const SERVICE_IDS: ServiceId[] = [
  "name-plaque",
  "engraving",
  "photo-replica",
  "custom-ring",
  "custom-pendant",
  "other",
];

const KARATS = ["18", "21", "24"] as const;

const WEIGHT_PRESETS = [1, 2, 3, 5, 8, 10];

function CustomOrderPage() {
  const { t } = useI18n();
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

  const serviceTitle = (id: ServiceId) => t(`custom.service.${id}.title`);
  const serviceDesc = (id: ServiceId) => t(`custom.service.${id}.desc`);
  const serviceExamples = (id: ServiceId) => t(`custom.service.${id}.examples`);

  const { rates, isLive } = useLiveGold();

  /** Estimate based on live gold rate + ~15% making charge + 7% seller profit + 2% tax */
  const estimate = useMemo(() => {
    const karatKey = (karat === "24" ? "24K" : karat === "21" ? "21K" : "18K") as keyof typeof rates;
    const gold = weight * rates[karatKey];
    const making = gold * 0.15;
    const profit = (gold + making) * 0.07;
    const tax = (gold + making + profit) * 0.02;
    return { gold, making, profit, tax, total: gold + making + profit + tax };
  }, [karat, weight, rates]);

  const estimateNote = useMemo(() => {
    if (service === "name-plaque") return t("custom.estimateNotePlaque");
    if (service === "photo-replica") return t("custom.estimateNotePhoto");
    return t("custom.estimateNoteDefault");
  }, [service, t]);

  const onFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const next: typeof photos = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) {
        toast.error(t("custom.toastImageOnly"));
        continue;
      }
      if (file.size > 8 * 1024 * 1024) {
        toast.error(t("custom.toastMaxSize"));
        continue;
      }
      if (photos.length + next.length >= 5) {
        toast.error(t("custom.toastMaxPhotos"));
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
      toast.error(t("custom.toastNamePhoneRequired"));
      setStep(3);
      return;
    }
    if (service === "name-plaque" && !textOnItem.trim()) {
      toast.error(t("custom.toastTextRequired"));
      setStep(2);
      return;
    }
    if (service === "photo-replica" && photos.length === 0) {
      toast.error(t("custom.toastPhotoRequired"));
      setStep(2);
      return;
    }

    if (!session) {
      // Optional: force sign-in
      // navigate({ to: "/auth", search: { redirect: "/custom" } });
    }

    setBusy(true);
    try {
      const order = createCustomOrder({
        service,
        karat,
        weight,
        textOnItem: textOnItem.trim(),
        fontStyle,
        description: description.trim(),
        name: name.trim(),
        phone: phone.trim(),
        city: city.trim(),
        photos: photos.length,
      });
      toast.success(t("custom.toastOrderSuccess", { id: order.id }));
      setStep(1);
      setTextOnItem("");
      setDescription("");
      setPhotos([]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("custom.toastOrderFailed"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell>
      {/* Hero */}
      <section className="border-b border-onyx/10 bg-gradient-to-b from-white/80 to-transparent">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-gold">
            <Sparkles size={14} /> {t("custom.heroEyebrow")}
          </span>
          <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
            {t("custom.heroTitle")}
          </h1>
          <p className="mt-4 max-w-2xl font-light text-onyx/65">
            {t("custom.heroBody")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-[12px] text-onyx/55">
            <span className="rounded-full border border-onyx/15 px-4 py-1.5">{t("custom.badgeNoHiddenFee")}</span>
            <span className="rounded-full border border-onyx/15 px-4 py-1.5">{t("custom.badgeApproveBeforeMake")}</span>
            <span className="rounded-full border border-onyx/15 px-4 py-1.5">{t("custom.badgeSendPhoto")}</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        {/* Steps */}
        <div className="mb-10 flex flex-wrap gap-2">
          {(
            [
              [1, t("custom.stepOrderType")],
              [2, t("custom.stepDetailsPhoto")],
              [3, t("custom.stepContactInfo")],
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
            {/* ——— Step 1: service type ——— */}
            {step === 1 && (
              <div>
                <h2 className="font-serif text-2xl">{t("custom.step1Title")}</h2>
                <p className="mt-2 text-sm text-onyx/55">{t("custom.step1Subtitle")}</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {SERVICE_IDS.map((s) => {
                    const active = service === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setService(s)}
                        className={`rounded-2xl border p-5 text-right transition-all ${
                          active
                            ? "border-gold bg-white shadow-[0_16px_40px_rgba(15,15,15,0.06)]"
                            : "border-onyx/10 bg-white/60 hover:border-gold/40"
                        }`}
                      >
                        <p className="font-serif text-lg">{serviceTitle(s)}</p>
                        <p className="mt-1 text-xs leading-relaxed text-onyx/55">{serviceDesc(s)}</p>
                        <p className="mt-3 text-[11px] text-onyx/40">{serviceExamples(s)}</p>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 rounded-2xl border border-onyx/10 bg-white/70 p-6">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-onyx/50">{t("custom.karatLabel")}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {KARATS.map((k) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setKarat(k)}
                        className={`rounded-full border px-4 py-2 text-sm ${
                          karat === k ? "border-gold bg-gold/10 text-gold" : "border-onyx/15"
                        }`}
                      >
                        {t(`custom.karat${k}Label`)}
                        <span className="ms-2 text-[10px] text-onyx/45">{t(`custom.karat${k}Note`)}</span>
                      </button>
                    ))}
                  </div>

                  <h3 className="mt-6 text-[11px] font-bold uppercase tracking-widest text-onyx/50">
                    {t("custom.weightLabel")}
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
                        {t("custom.gramValue", { weight: w })}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setCustomWeight(true)}
                      className={`rounded-full border px-4 py-2 text-sm ${
                        customWeight ? "border-gold bg-gold/10 text-gold" : "border-onyx/15"
                      }`}
                    >
                      {t("custom.customWeightLabel")}
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
                      placeholder={t("custom.weightPlaceholder")}
                    />
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="mt-8 bg-onyx px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-parchment transition-all hover:bg-gold hover:text-onyx"
                >
                  {t("custom.continueDetails")}
                </button>
              </div>
            )}

            {/* ——— Step 2: text + description + photos ——— */}
            {step === 2 && (
              <div className="space-y-8">
                <div>
                  <h2 className="font-serif text-2xl">{serviceTitle(service)}</h2>
                  <p className="mt-1 text-sm text-onyx/55">{serviceDesc(service)}</p>
                </div>

                {(service === "name-plaque" || service === "engraving" || service === "custom-pendant") && (
                  <div className="rounded-2xl border border-onyx/10 bg-white/70 p-6">
                    <label className="block">
                      <span className="text-[10px] uppercase tracking-widest text-onyx/60">
                        {t("custom.textOnItemLabel")}
                      </span>
                      <input
                        value={textOnItem}
                        onChange={(e) => setTextOnItem(e.target.value)}
                        placeholder={t("custom.textOnItemPlaceholder")}
                        className="mt-2 w-full border-b border-onyx/20 bg-transparent py-3 text-xl outline-none focus:border-gold"
                        maxLength={40}
                      />
                    </label>
                    <p className="mt-2 text-[11px] text-onyx/40">{t("custom.charCount", { count: textOnItem.length })}</p>

                    <p className="mt-6 text-[10px] uppercase tracking-widest text-onyx/60">{t("custom.fontStyleLabel")}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(
                        [
                          ["nastaliq", t("custom.fontNastaliq")],
                          ["naskh", t("custom.fontNaskh")],
                          ["latin", t("custom.fontLatin")],
                          ["mixed", t("custom.fontMixed")],
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
                      {t("custom.freeDescriptionLabel")}
                    </span>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      placeholder={t("custom.freeDescriptionPlaceholder")}
                      className="mt-2 w-full resize-y border border-onyx/10 bg-transparent p-4 text-sm outline-none focus:border-gold"
                    />
                  </label>
                </div>

                {/* Reference photos */}
                <div className="rounded-2xl border border-onyx/10 bg-white/70 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-xl">{t("custom.referencePhotoTitle")}</h3>
                      <p className="mt-1 text-xs text-onyx/55">
                        {t("custom.referencePhotoBody")}
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
                          aria-label={t("custom.removePhotoAria")}
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
                        <span className="text-[10px] uppercase tracking-wider">{t("custom.addPhoto")}</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="mt-4 inline-flex items-center gap-2 text-sm text-gold hover:underline"
                  >
                    <Upload size={16} />
                    {t("custom.chooseFromGallery")}
                  </button>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="border border-onyx/20 px-6 py-3 text-[11px] font-bold uppercase tracking-wider"
                  >
                    {t("custom.back")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="bg-onyx px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-parchment hover:bg-gold hover:text-onyx"
                  >
                    {t("custom.continueContact")}
                  </button>
                </div>
              </div>
            )}

            {/* ——— Step 3: contact ——— */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl">{t("custom.contactTitle")}</h2>
                  <p className="mt-1 text-sm text-onyx/55">
                    {t("custom.contactBody")}
                  </p>
                </div>

                <div className="rounded-2xl border border-onyx/10 bg-white/70 p-6 space-y-5">
                  <Field
                    label={t("custom.fieldFullName")}
                    value={name}
                    onChange={setName}
                    required
                    autoComplete="name"
                  />
                  <Field
                    label={t("custom.fieldPhone")}
                    value={phone}
                    onChange={setPhone}
                    required
                    type="tel"
                    inputMode="tel"
                    placeholder={t("custom.fieldPhonePlaceholder")}
                    autoComplete="tel"
                  />
                  <Field label={t("custom.fieldCity")} value={city} onChange={setCity} placeholder={t("custom.fieldCityPlaceholder")} />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="border border-onyx/20 px-6 py-3 text-[11px] font-bold uppercase tracking-wider"
                  >
                    {t("custom.back")}
                  </button>
                  <button
                    type="submit"
                    disabled={busy}
                    className="bg-onyx px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-parchment transition-all hover:bg-gold hover:text-onyx disabled:opacity-50"
                  >
                    {busy ? t("custom.submitBusy") : t("custom.submit")}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Fixed summary */}
          <aside className="h-fit space-y-4 rounded-2xl bg-secondary p-7 lg:sticky lg:top-28">
            <h4 className="text-[11px] font-bold uppercase tracking-widest">{t("custom.requestSummary")}</h4>
            <Row label={t("custom.rowType")} value={serviceTitle(service)} />
            <Row label={t("custom.rowKarat")} value={t("custom.karatValue", { karat })} />
            <Row label={t("custom.rowWeight")} value={t("custom.gramValue", { weight })} />
            {textOnItem && <Row label={t("custom.rowText")} value={textOnItem} />}
            <Row label={t("custom.rowPhotos")} value={t("custom.photoCount", { count: photos.length })} />
            <div className="border-t border-onyx/10 pt-4">
              <p className="text-[10px] uppercase tracking-widest text-onyx/45">
                {isLive ? t("custom.estimateWithLiveRate") : t("custom.estimateWithDefaultRate")}
              </p>
              <Row label={t("custom.rowGoldValue")} value={`${fmt(estimate.gold)} ${t("custom.tomanUnit")}`} />
              <Row label={t("custom.rowMakingFee")} value={`${fmt(estimate.making)} ${t("custom.tomanUnit")}`} />
              <Row label={t("custom.rowProfit")} value={`${fmt(estimate.profit)} ${t("custom.tomanUnit")}`} />
              <Row label={t("custom.rowTax")} value={`${fmt(estimate.tax)} ${t("custom.tomanUnit")}`} />
              <Row label={t("custom.rowApproxTotal")} value={`${fmt(estimate.total)} ${t("custom.tomanUnit")}`} />
            </div>
            <p className="border-t border-onyx/10 pt-4 text-[11px] leading-relaxed text-onyx/50">
              {estimateNote}
            </p>
            <p className="text-[11px] text-onyx/45">
              {t("custom.telegramPrefix")}{" "}
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
              {t("custom.viewMadeToOrder")}
            </Link>
          </aside>
        </form>

        {/* How it works */}
        <div className="mt-20 border-t border-onyx/10 pt-14">
          <h2 className="font-serif text-2xl">{t("custom.howItWorksTitle")}</h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(["1", "2", "3", "4"] as const).map((n) => (
              <li key={n} className="rounded-2xl border border-onyx/10 bg-white/50 p-5">
                <span className="text-gold font-serif text-2xl">{n}</span>
                <p className="mt-2 text-sm text-onyx/70">{t(`custom.howItWorksStep${n}`)}</p>
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
