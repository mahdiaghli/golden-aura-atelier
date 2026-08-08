import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroRing from "@/assets/hero-ring.jpg";
import { requestPhoneCode, signIn, signInWithPhone, verifyPhoneCode } from "@/lib/auth";
import { useI18n } from "@/lib/i18n/context";

const NESHAN_URL = "https://nshn.ir/43_b1B-UGJVSbV";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [email, setEmail] = useState("admin@aurum.com");
  const [password, setPassword] = useState("admin123");
  const [phone, setPhone] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [phoneInfo, setPhoneInfo] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const user = signIn(email, password);
    if (!user) {
      setError(t("auth.login.errorInvalid"));
      return;
    }

    navigate({ to: "/" });
  };

  const handleSendCode = () => {
    setPhoneError("");
    setPhoneInfo("");
    try {
      const result = requestPhoneCode(phone);
      setCodeSent(true);
      setPhoneInfo(`کد تایید برای تست: ${result.code}`);
    } catch (err) {
      setPhoneError(err instanceof Error ? err.message : "ارسال کد انجام نشد.");
    }
  };

  const handlePhoneLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPhoneError("");

    const verified = verifyPhoneCode(phone, phoneCode);
    if (!verified) {
      setPhoneError("کد واردشده درست نیست.");
      return;
    }

    setCodeVerified(true);
    const user = signInWithPhone(phone);
    if (!user) {
      setPhoneError("برای این شماره حسابی پیدا نشد. لطفاً ثبت‌نام کنید.");
      return;
    }

    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(200,161,74,0.16),_transparent_35%),linear-gradient(135deg,_#f7f0e3_0%,_#f2e7d6_100%)] text-onyx">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 lg:px-10">
        <header className="flex items-center justify-between">
          <Link to="/" className="font-serif text-3xl tracking-tighter font-bold select-none">
            {t("auth.brand").replace(".", "")}
            <span className="text-gold">.</span>
          </Link>
          <Link to="/signup" className="text-[11px] uppercase tracking-[0.3em] font-semibold text-onyx/70 hover:text-gold">
            {t("auth.login.createAccountLink")}
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center py-10">
          <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-onyx/10 bg-parchment/90 shadow-[0_30px_80px_rgba(37,28,12,0.12)] lg:grid-cols-[1.05fr_0.95fr]">
            <section className="relative hidden overflow-hidden lg:block">
              <img
                src={heroRing}
                alt={t("auth.login.imageAlt")}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-parchment/20 via-onyx/20 to-onyx/70" />
              <div className="absolute bottom-8 left-8 right-8 rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
                <p className="text-[11px] uppercase tracking-[0.35em] text-gold">{t("auth.login.heroEyebrow")}</p>
                <h2 className="mt-3 font-serif text-3xl text-parchment">{t("auth.login.heroTitle")}</h2>
                <p className="mt-3 text-sm leading-relaxed text-parchment/80">
                  {t("auth.login.heroBody")}
                </p>
              </div>
            </section>

            <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-12">
              <div className="w-full max-w-md">
                <p className="text-[11px] uppercase tracking-[0.35em] text-gold">{t("auth.login.eyebrow")}</p>
                <h1 className="mt-3 font-serif text-4xl text-onyx">{t("auth.login.title")}</h1>
                <p className="mt-3 text-sm leading-relaxed text-onyx/60">
                  {t("auth.login.subtitle")}
                </p>
                <div className="mt-4 rounded-2xl border border-gold/30 bg-gold/5 p-4 text-sm text-onyx/75">
                  <p>ورود ادمین فعال است.</p>
                  <p className="mt-1">ایمیل: admin@aurum.com — رمز: admin123</p>
                </div>

                <form className="mt-8 space-y-5" onSubmit={handlePhoneLogin}>
                  <div>
                    <label className="mb-2 block text-[11px] uppercase tracking-[0.3em] text-onyx/60">
                      شماره موبایل
                    </label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="09xxxxxxxxx"
                      className="h-12 rounded-xl border-onyx/10 bg-white/70 px-4"
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                    <div>
                      <label className="mb-2 block text-[11px] uppercase tracking-[0.3em] text-onyx/60">
                        کد تایید
                      </label>
                      <Input
                        value={phoneCode}
                        onChange={(event) => setPhoneCode(event.target.value)}
                        placeholder="111111"
                        className="h-12 rounded-xl border-onyx/10 bg-white/70 px-4"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSendCode}
                      className="h-12 rounded-xl border-onyx/20 bg-white/70 px-5"
                    >
                      دریافت کد
                    </Button>
                  </div>

                  {phoneInfo ? <p className="text-sm text-emerald-700">{phoneInfo}</p> : null}
                  {phoneError ? <p className="text-sm text-red-600">{phoneError}</p> : null}

                  <Button
                    type="submit"
                    disabled={!codeSent}
                    className="h-12 w-full rounded-xl bg-onyx text-parchment hover:bg-gold hover:text-onyx disabled:opacity-50"
                  >
                    ورود با کد تایید
                  </Button>
                  {codeVerified ? null : (
                    <p className="text-sm text-onyx/60">
                      اگر حسابی ندارید، بعد از دریافت کد از صفحه ثبت‌نام استفاده کنید.
                    </p>
                  )}
                </form>

                <div className="my-8 flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-onyx/35">
                  <span className="h-px flex-1 bg-onyx/10" />
                  <span>ورود مدیریت</span>
                  <span className="h-px flex-1 bg-onyx/10" />
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div>
                    <label className="mb-2 block text-[11px] uppercase tracking-[0.3em] text-onyx/60">
                      {t("auth.login.email")}
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder={t("auth.login.emailPlaceholder")}
                      className="h-12 rounded-xl border-onyx/10 bg-white/70 px-4"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[11px] uppercase tracking-[0.3em] text-onyx/60">
                      {t("auth.login.password")}
                    </label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder={t("auth.login.passwordPlaceholder")}
                      className="h-12 rounded-xl border-onyx/10 bg-white/70 px-4"
                    />
                  </div>

                  {error ? <p className="text-sm text-red-600">{error}</p> : null}

                  <Button type="submit" className="h-12 w-full rounded-xl bg-onyx text-parchment hover:bg-gold hover:text-onyx">
                    {t("auth.login.submit")}
                  </Button>
                </form>

                <div className="mt-8 flex items-center justify-between text-sm text-onyx/60">
                  <Link to="/" className="hover:text-gold">
                    {t("auth.login.returnHome")}
                  </Link>
                  <Link to="/signup" className="hover:text-gold">
                    {t("auth.login.needAccount")}
                  </Link>
                </div>
                <a
                  href={NESHAN_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 block text-center text-sm text-onyx/60 hover:text-gold"
                >
                  موقعیت فروشگاه در نشان
                </a>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
