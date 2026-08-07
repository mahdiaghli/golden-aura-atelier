import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/contact')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50 text-stone-800">
      {/* Header */}
      <header className="border-b border-amber-200/60 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-amber-900">AGHLI</h1>
            <p className="text-xs text-amber-700/80 mt-0.5">اغلی گلد</p>
          </div>
          <nav className="hidden sm:flex gap-6 text-sm font-medium text-stone-600">
            <a href="/shop" className="hover:text-amber-800 transition-colors">فروشگاه</a>
            <a href="/prices" className="hover:text-amber-800 transition-colors">قیمت‌های بازار</a>
            <a href="/contact" className="text-amber-800 border-b-2 border-amber-600 pb-0.5">تماس</a>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        {/* Hero / Intro */}
        <section className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-amber-950 mb-3">
            تماس با ما
          </h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            زیورآلات طلا، طلای سرمایه‌گذاری و خدمات شخصی از{' '}
            <span className="font-semibold text-amber-800">اغلی گلد</span>
          </p>
        </section>

        {/* Contact Cards */}
        <section className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Phone numbers */}
          <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6 md:p-8 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-stone-800">تلفن‌های تماس</h3>
            </div>
            <div className="space-y-4">
              <a
                href="tel:09153145726"
                className="flex items-center justify-between group p-3 rounded-xl bg-amber-50/70 hover:bg-amber-100 transition-colors"
              >
                <span className="font-mono text-lg tracking-wide text-stone-800" dir="ltr">
                  0915 314 5726
                </span>
                <span className="text-sm text-amber-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  تماس
                </span>
              </a>
              <a
                href="tel:05133762430"
                className="flex items-center justify-between group p-3 rounded-xl bg-amber-50/70 hover:bg-amber-100 transition-colors"
              >
                <span className="font-mono text-lg tracking-wide text-stone-800" dir="ltr">
                  051 3376 2430
                </span>
                <span className="text-sm text-amber-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  تماس
                </span>
              </a>
            </div>
          </div>

          {/* Social / Location */}
          <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6 md:p-8 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-stone-800">ارتباط و موقعیت</h3>
            </div>
            <div className="space-y-4">
              <a
                href="https://instagram.com/aaadmin_aghli"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between group p-3 rounded-xl bg-amber-50/70 hover:bg-amber-100 transition-colors"
              >
                <span className="font-medium text-stone-800" dir="ltr">
                  @aaadmin_aghli
                </span>
                <span className="text-sm text-amber-700">اینستاگرام</span>
              </a>
              <a
                href="#"
                className="flex items-center justify-between group p-3 rounded-xl bg-amber-50/70 hover:bg-amber-100 transition-colors"
              >
                <span className="font-medium text-stone-800">باز کردن در نشان</span>
                <span className="text-sm text-amber-700">نقشه</span>
              </a>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="bg-gradient-to-r from-amber-800 to-amber-900 rounded-2xl p-8 text-center text-amber-50 shadow-lg">
          <h3 className="text-xl font-semibold mb-6">بخش‌ها</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/shop"
              className="px-6 py-2.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm transition-colors font-medium"
            >
              فروشگاه
            </a>
            <a
              href="/prices"
              className="px-6 py-2.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm transition-colors font-medium"
            >
              قیمت‌های بازار
            </a>
            <a
              href="/contact"
              className="px-6 py-2.5 rounded-full bg-amber-100 text-amber-900 font-medium"
            >
              تماس
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-amber-200/60 mt-8 py-6 text-center text-sm text-stone-500">
        <p>© {new Date().getFullYear()} AGHLI — اغلی گلد</p>
        <p className="mt-1 text-xs">زیورآلات طلا • طلای سرمایه‌گذاری • خدمات شخصی</p>
      </footer>
    </div>
  )
}