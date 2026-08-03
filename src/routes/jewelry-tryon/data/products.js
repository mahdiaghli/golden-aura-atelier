// هر محصول یک نوع "anchor" دارد که مشخص می‌کند روی کدام نقطه از صورت/گردن قرار می‌گیرد:
//   - "neck"   : یک تصویر، وسط زیر چانه (گردنبند)
//   - "ears"   : یک تصویر که برای هر دو گوش (چپ/راست با آینه) تکرار می‌شود
//   - "forehead": یک تصویر روی بالای پیشانی (تاج / جواهر سر)
//
// widthRatio: عرض پیش‌فرض تصویر به‌نسبت عرض صورت کاربر (برای مقیاس خودکار)

export const PRODUCTS = [
  {
    id: 'necklace_pendant',
    name: 'گردنبند آویز طلا',
    category: 'necklace',
    anchor: 'neck',
    image: '/jewelry-tryon-products/necklace_pendant.svg',
    aspect: 300 / 260,
    widthRatio: 1.35,
  },
  {
    id: 'necklace_choker',
    name: 'گردنبند چوکر طلا',
    category: 'necklace',
    anchor: 'neck',
    image: '/jewelry-tryon-products/necklace_choker.svg',
    aspect: 300 / 140,
    widthRatio: 1.25,
  },
  {
    id: 'earring_hoop',
    name: 'گوشواره حلقه‌ای طلا',
    category: 'earring',
    anchor: 'ears',
    image: '/jewelry-tryon-products/earring_hoop.svg',
    aspect: 80 / 120,
    widthRatio: 0.34,
  },
  {
    id: 'earring_stud',
    name: 'گوشواره آویزدار طلا',
    category: 'earring',
    anchor: 'ears',
    image: '/jewelry-tryon-products/earring_stud.svg',
    aspect: 60 / 110,
    widthRatio: 0.26,
  },
  {
    id: 'tiara_gold',
    name: 'تاج جواهر طلا',
    category: 'other',
    anchor: 'forehead',
    image: '/jewelry-tryon-products/tiara_gold.svg',
    aspect: 320 / 140,
    widthRatio: 1.7,
  },
]

export const CATEGORIES = [
  { id: 'all', label: 'همه' },
  { id: 'necklace', label: 'گردنبند' },
  { id: 'earring', label: 'گوشواره' },
  { id: 'other', label: 'سایر طلاجات' },
]
