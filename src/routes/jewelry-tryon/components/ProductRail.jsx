import { useState } from 'react'
import { PRODUCTS, CATEGORIES } from '../data/products.js'

export default function ProductRail({ onAdd, disabled }) {
  const [activeCategory, setActiveCategory] = useState('all')

  const visible =
    activeCategory === 'all'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory)

  return (
    <aside className="jt-product-rail">
      <div className="jt-product-rail__header">
        <h2>ویترین جواهرات</h2>
        <div className="jt-product-rail__tabs">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={
                'jt-chip' + (activeCategory === c.id ? ' jt-chip--active' : '')
              }
              onClick={() => setActiveCategory(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="jt-product-rail__list">
        {visible.map((product) => (
          <button
            key={product.id}
            className="jt-product-card"
            disabled={disabled}
            onClick={() => onAdd(product)}
            title={disabled ? 'اول یک عکس آپلود کنید' : `افزودن ${product.name}`}
          >
            <div className="jt-product-card__thumb">
              <img src={product.image} alt={product.name} />
            </div>
            <span className="jt-product-card__name">{product.name}</span>
            <span className="jt-product-card__add">+ روی صورت</span>
          </button>
        ))}
      </div>

      {disabled && (
        <p className="jt-product-rail__note">
          برای امتحان کردن جواهرات، اول یک عکس آپلود کنید.
        </p>
      )}
    </aside>
  )
}
