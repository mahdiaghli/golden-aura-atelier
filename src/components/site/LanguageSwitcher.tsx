import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";

const options: { locale: Locale; label: string }[] = [
  { locale: "en", label: "EN" },
  { locale: "fa", label: "فا" },
];

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useI18n();

  return (
    <div
      className={`flex items-center rounded-full border border-onyx/15 bg-white/60 p-0.5 ${compact ? "text-[10px]" : "text-[11px]"}`}
      role="group"
      aria-label="Language"
    >
      {options.map(({ locale: value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => setLocale(value)}
          className={`rounded-full px-2.5 py-1 font-semibold uppercase tracking-wider transition-colors ${
            locale === value ? "bg-onyx text-parchment" : "text-onyx/60 hover:text-gold"
          }`}
          aria-pressed={locale === value}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
