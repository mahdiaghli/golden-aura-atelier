import { forwardRef, useImperativeHandle, useRef, useCallback } from 'react'

const StageCanvas = forwardRef(function StageCanvas(
  { imageURL, naturalWidth, naturalHeight, placedItems, setPlacedItems, statusMessage },
  ref
) {
  const containerRef = useRef(null)
  const imgRef = useRef(null)

  const updateItem = useCallback(
    (placementId, patch) => {
      setPlacedItems((prev) =>
        prev.map((it) => (it.placementId === placementId ? { ...it, ...patch } : it))
      )
    },
    [setPlacedItems]
  )

  const removeItem = (placementId) => {
    setPlacedItems((prev) => prev.filter((it) => it.placementId !== placementId))
  }

  // درگ‌کردن یک جواهر برای جابه‌جایی
  const startDrag = (e, item) => {
    e.stopPropagation()
    e.preventDefault()
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()

    const onMove = (moveEvt) => {
      const clientX = moveEvt.touches ? moveEvt.touches[0].clientX : moveEvt.clientX
      const clientY = moveEvt.touches ? moveEvt.touches[0].clientY : moveEvt.clientY
      let xFrac = (clientX - rect.left) / rect.width
      let yFrac = (clientY - rect.top) / rect.height
      xFrac = Math.min(1, Math.max(0, xFrac))
      yFrac = Math.min(1, Math.max(0, yFrac))
      updateItem(item.placementId, { xFrac, yFrac })
    }
    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  // درگ‌کردن دستگیره گوشه برای تغییر اندازه و چرخش
  const startResize = (e, item) => {
    e.stopPropagation()
    e.preventDefault()
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const centerX = rect.left + item.xFrac * rect.width
    const centerY = rect.top + item.yFrac * rect.height

    const onMove = (moveEvt) => {
      const clientX = moveEvt.touches ? moveEvt.touches[0].clientX : moveEvt.clientX
      const clientY = moveEvt.touches ? moveEvt.touches[0].clientY : moveEvt.clientY
      const dx = clientX - centerX
      const dy = clientY - centerY
      const dist = Math.hypot(dx, dy)
      const widthFrac = Math.min(0.9, Math.max(0.03, (dist * 2) / rect.width))
      const angleRad = Math.atan2(dy, dx)
      const rotationDeg = (angleRad * 180) / Math.PI - 45
      updateItem(item.placementId, { widthFrac, rotationDeg })
    }
    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  // رندر نهایی روی یک canvas مخفی با کیفیت کامل عکس اصلی، برای دانلود
  const exportImage = useCallback(async () => {
    if (!imgRef.current || !naturalWidth || !naturalHeight) return null
    const canvas = document.createElement('canvas')
    canvas.width = naturalWidth
    canvas.height = naturalHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(imgRef.current, 0, 0, naturalWidth, naturalHeight)

    const loadImg = (src) =>
      new Promise((resolve, reject) => {
        const im = new Image()
        im.crossOrigin = 'anonymous'
        im.onload = () => resolve(im)
        im.onerror = reject
        im.src = src
      })

    for (const item of placedItems) {
      const jewelImg = await loadImg(item.product.image)
      const w = item.widthFrac * naturalWidth
      const h = w / item.product.aspect
      const cx = item.xFrac * naturalWidth
      const cy = item.yFrac * naturalHeight

      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate((item.rotationDeg * Math.PI) / 180)
      if (item.mirror) ctx.scale(-1, 1)
      ctx.drawImage(jewelImg, -w / 2, -h / 2, w, h)
      ctx.restore()
    }

    return canvas.toDataURL('image/png')
  }, [placedItems, naturalWidth, naturalHeight])

  useImperativeHandle(ref, () => ({ exportImage }), [exportImage])

  return (
    <div className="jt-stage">
      <div
        className="jt-stage__frame"
        ref={containerRef}
        style={{ aspectRatio: naturalWidth && naturalHeight ? `${naturalWidth} / ${naturalHeight}` : '3 / 4' }}
      >
        <img ref={imgRef} src={imageURL} alt="عکس آپلود شده" className="jt-stage__photo" crossOrigin="anonymous" />

        {placedItems.map((item) => (
          <div
            key={item.placementId}
            className="jt-stage__item"
            style={{
              left: `${item.xFrac * 100}%`,
              top: `${item.yFrac * 100}%`,
              width: `${item.widthFrac * 100}%`,
              transform: `translate(-50%, -50%) rotate(${item.rotationDeg}deg) ${
                item.mirror ? 'scaleX(-1)' : ''
              }`,
            }}
            onPointerDown={(e) => startDrag(e, item)}
          >
            <img src={item.product.image} alt={item.product.name} draggable={false} />
            <button
              className="jt-stage__item-remove"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => removeItem(item.placementId)}
              aria-label={`حذف ${item.product.name}`}
              title="حذف"
            >
              ×
            </button>
            <span
              className="jt-stage__item-handle"
              onPointerDown={(e) => startResize(e, item)}
              title="تغییر اندازه / چرخش"
            />
          </div>
        ))}

        {statusMessage && (
          <div className="jt-stage__status">
            <span className="jt-stage__status-dot" />
            {statusMessage}
          </div>
        )}
      </div>
      <p className="jt-stage__hint">
        هر جواهر را می‌توانید بکشید تا جابه‌جا شود، یا از دستگیره گوشه برای بزرگ/کوچک کردن و چرخاندن استفاده کنید.
      </p>
    </div>
  )
})

export default StageCanvas
