# افزودن صفحه‌ی «پرو مجازی جواهرات» به golden-aura-atelier

این پکیج مستقیماً منطبق با ساختار واقعی پروژه‌ی شماست (TanStack Start + TanStack
Router + TypeScript + Tailwind + سیستم دوزبانه‌ی fa/en). دو دسته تغییر لازم است:

1. **فایل‌های کاملاً جدید** — فقط کپی کنید، کاری باهاشون ندارید (پوشه‌ی `new-files/`)
2. **ویرایش‌های کوچک روی فایل‌های موجود** — چند خط، که دقیقاً پایین توضیح داده شده

---

## ۱. کپی‌کردن فایل‌های جدید

محتوای پوشه‌ی `new-files/` را عیناً روی ریشه‌ی پروژه‌تون کپی کنید (ساختار پوشه‌ها
دقیقاً همینه که در پروژه‌ی خودتون باید قرار بگیره):

```
new-files/
  public/
    jewelry-tryon-products/
      necklace_pendant.svg
      necklace_choker.svg
      earring_hoop.svg
      earring_stud.svg
      tiara_gold.svg
  src/
    routes/
      jewelry-tryon.tsx                 ← صفحه‌ی جدید، مسیر: /jewelry-tryon
    components/site/jewelry-tryon/
      UploadPanel.tsx
      ProductRail.tsx
      StageCanvas.tsx
    lib/jewelry-tryon/
      face-landmarker.ts                 ← تشخیص چهره با MediaPipe
      products.ts                         ← کاتالوگ محصولات
      types.ts
    lib/i18n/locales/fa/jewelry-tryon.ts   ← ترجمه فارسی
    lib/i18n/locales/en/jewelry-tryon.ts   ← ترجمه انگلیسی
```

اگر با ترمینال راحت‌ترید، از ریشه‌ی هر دو پروژه:

```bash
cp -r new-files/public/jewelry-tryon-products  path/to/golden-aura-atelier/public/
cp -r new-files/src/routes/jewelry-tryon.tsx    path/to/golden-aura-atelier/src/routes/
cp -r new-files/src/components/site/jewelry-tryon path/to/golden-aura-atelier/src/components/site/
cp -r new-files/src/lib/jewelry-tryon           path/to/golden-aura-atelier/src/lib/
cp new-files/src/lib/i18n/locales/fa/jewelry-tryon.ts path/to/golden-aura-atelier/src/lib/i18n/locales/fa/
cp new-files/src/lib/i18n/locales/en/jewelry-tryon.ts path/to/golden-aura-atelier/src/lib/i18n/locales/en/
```

## ۲. نصب پکیج تشخیص چهره

```bash
npm install @mediapipe/tasks-vision
```

(اگه ترجیح می‌دید دستی اضافه کنید: در `package.json`، داخل `dependencies`، این خط
را کنار بقیه اضافه کنید: `"@mediapipe/tasks-vision": "^0.10.14",`)

## ۳. ویرایش‌های لازم روی فایل‌های موجود

فقط **۳ فایل** نیاز به ویرایش دارن — همه‌شون تغییرات کوچیک و مشخص:

### الف) `src/lib/i18n/types.ts`
داخل تایپ `Messages`، این خط رو اضافه کنید (هرجای مناسب، مثلاً کنار `products`):

```ts
products: Record<string, ProductTranslation>;
jewelryTryOn: Record<string, unknown>;   // 👈 این خط جدید
blogPosts: Record<string, BlogTranslation>;
```

### ب) `src/lib/i18n/locales/fa/index.ts`
سه تغییر کوچک:

**۱. بالای فایل، کنار بقیه importها:**
```ts
import { jewelryTryOnFa } from "./jewelry-tryon";
```

**۲. داخل شیء `footer`، کنار `exploreShop`:**
```ts
exploreShop: "فروشگاه",
exploreTryOn: "پرو مجازی جواهرات",   // 👈 این خط جدید
exploreMarketPrices: "قیمت‌های بازار",
```

**۳. کنار `products: productsFa,` (نزدیک انتهای فایل، قبل از `blogPosts`):**
```ts
products: productsFa,
jewelryTryOn: jewelryTryOnFa,   // 👈 این خط جدید
blogPosts: {
```

### ج) `src/lib/i18n/locales/en/index.ts`
دقیقاً همون ۳ تغییر، با فایل انگلیسی:

```ts
import { jewelryTryOnEn } from "./jewelry-tryon";
```
```ts
exploreShop: "Shop",
exploreTryOn: "Virtual jewelry try-on",   // 👈 این خط جدید
exploreMarketPrices: "Market prices",
```
```ts
products: productsEn,
jewelryTryOn: jewelryTryOnEn,   // 👈 این خط جدید
blogPosts: {
```

### د) `src/components/site/Chrome.tsx` (اختیاری، ولی توصیه می‌شود)
برای این‌که لینک صفحه در فوتر سایت هم دیده بشه، داخل تابع `Footer()`، در بخش
`exploreTitle`، این خط رو اضافه کنید:

```tsx
<Link to="/shop" className="block hover:text-gold">{t("footer.exploreShop")}</Link>
<Link to="/jewelry-tryon" className="block hover:text-gold">{t("footer.exploreTryOn")}</Link>  {/* 👈 جدید */}
<Link to="/prices" className="block hover:text-gold">{t("footer.exploreMarketPrices")}</Link>
```

اگه دوست دارید به منوی بالای سایت (nav) هم اضافه بشه، در همون فایل داخل
`primaryLinks` (تابع `Nav()`) یک آیتم مشابه اضافه کنید:
```ts
{ to: "/jewelry-tryon", label: t("jewelryTryOn.eyebrow") },
```

## ۴. اجرا و تست

```bash
npm run dev
```

آدرس `/jewelry-tryon` رو باز کنید. توجه: فایل `src/routeTree.gen.ts` به‌صورت
خودکار توسط پلاگین TanStack Router در همین مرحله بازتولید می‌شه و مسیر جدید رو
می‌شناسه — نیازی به ویرایش دستی اون فایل نیست.

> **نکته:** بار اول برای بارگذاری مدل تشخیص چهره (از CDN گوگل/jsDelivr) به
> اینترنت نیاز دارید؛ بعد از اون مرورگر آن را کش می‌کند.

## ۵. جایگزینی عکس‌های واقعی محصولات

الان جواهرات نمونه (SVG ساده طلایی) هستن. برای واقعی‌کردن‌شون:

1. عکس هر جواهر رو با **پس‌زمینه‌ی کاملاً شفاف** (PNG یا SVG) در
   `public/jewelry-tryon-products/` بذارید.
2. در `src/lib/jewelry-tryon/products.ts` یک آیتم جدید به آرایه‌ی
   `JEWELRY_PRODUCTS` اضافه کنید:

```ts
{
  id: "necklace_new",
  category: "necklace",   // "necklace" | "earring" | "other"
  anchor: "neck",           // "neck" | "ears" | "forehead"
  image: "/jewelry-tryon-products/necklace_new.png",
  aspect: عرض_تصویر / ارتفاع_تصویر,
  widthRatio: 1.3,           // با آزمون‌وخطا تنظیم کنید
}
```

3. نام محصول رو هم به هر دو فایل ترجمه اضافه کنید:
   - `src/lib/i18n/locales/fa/jewelry-tryon.ts` → داخل `products: { ... }`
   - `src/lib/i18n/locales/en/jewelry-tryon.ts` → همون‌جا، معادل انگلیسی

کلید ترجمه باید دقیقاً با `id` محصول یکی باشه (مثلاً `necklace_new`).

---

## محدودیت‌های فعلی (برای توسعه بعدی)

- **نقطه‌ی گردن** با یک فرمول تقریبی محاسبه می‌شه (چون MediaPipe Face Mesh فقط
  صورت رو پوشش می‌ده، نه بدن). برای دقت بیشتر می‌شه `PoseLandmarker` رو هم اضافه کرد.
- **پوشش مو روی گردنبند:** فعلاً گردنبند همیشه روی عکس دیده می‌شه، حتی اگه مو
  جلوش باشه؛ رفعش نیاز به مدل Hair Segmentation داره.
- اگه در برخی مرورگرها با خطای GPU مواجه شدید، در
  `src/lib/jewelry-tryon/face-landmarker.ts` مقدار `delegate: "GPU"` رو به
  `delegate: "CPU"` تغییر بدید.
