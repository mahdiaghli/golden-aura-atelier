import { useState, useRef, useCallback } from 'react'
import UploadPanel from './components/UploadPanel.jsx'
import ProductRail from './components/ProductRail.jsx'
import StageCanvas from './components/StageCanvas.jsx'
import { detectFace, computeAnchors } from './utils/faceLandmarker.js'
import './styles.css'

// این کامپوننت یک صفحه‌ی کامل و مستقل است — کافیست آن را به یک مسیر (route) در
// App.tsx یا هر جایی که مسیرهای سایت تعریف شده، وصل کنید. توضیحات کامل در
// INTEGRATION.md آمده است.
export default function JewelryTryOnPage() {
  const [imageURL, setImageURL] = useState(null)
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 })
  const [anchors, setAnchors] = useState(null)
  const [placedItems, setPlacedItems] = useState([])
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const stageRef = useRef(null)

  const handleImageSelected = useCallback(async (file) => {
    setError('')
    setPlacedItems([])
    setAnchors(null)
    const url = URL.createObjectURL(file)
    setImageURL(url)
    setStatus('در حال تشخیص چهره...')

    const img = new Image()
    img.onload = async () => {
      setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight })
      try {
        const landmarks = await detectFace(img)
        if (!landmarks) {
          setError('چهره‌ای در عکس پیدا نشد. لطفاً عکسی روبه‌رو و واضح‌تر امتحان کنید.')
          setStatus('')
          return
        }
        const computed = computeAnchors(landmarks, img.naturalWidth, img.naturalHeight)
        setAnchors(computed)
        setStatus('')
      } catch (err) {
        console.error(err)
        setError('مشکلی در بارگذاری مدل تشخیص چهره پیش آمد. اتصال اینترنت را بررسی کنید.')
        setStatus('')
      }
    }
    img.src = url
  }, [])

  const addProduct = useCallback(
    (product) => {
      if (!anchors || !naturalSize.w) return
      const tiltDeg = (anchors.tiltAngle * 180) / Math.PI
      const makeItem = (anchorPoint, extra = {}) => ({
        placementId: `${product.id}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        product,
        xFrac: anchorPoint.x / naturalSize.w,
        yFrac: anchorPoint.y / naturalSize.h,
        widthFrac: (product.widthRatio * anchors.faceWidth) / naturalSize.w,
        rotationDeg: tiltDeg,
        mirror: false,
        ...extra,
      })

      if (product.anchor === 'ears') {
        setPlacedItems((prev) => [
          ...prev,
          makeItem(anchors.leftEar),
          makeItem(anchors.rightEar, { mirror: true }),
        ])
      } else if (product.anchor === 'forehead') {
        const foreheadPoint = {
          x: anchors.forehead.x,
          y: anchors.forehead.y - anchors.faceHeight * 0.12,
        }
        setPlacedItems((prev) => [...prev, makeItem(foreheadPoint)])
      } else {
        setPlacedItems((prev) => [...prev, makeItem(anchors.neck)])
      }
    },
    [anchors, naturalSize]
  )

  const handleDownload = async () => {
    if (!stageRef.current) return
    const dataUrl = await stageRef.current.exportImage()
    if (!dataUrl) return
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = 'jewelry-tryon.png'
    a.click()
  }

  const handleReset = () => {
    setPlacedItems([])
  }

  return (
    <div className="jewelry-tryon-page">
      <header className="jt-header">
        <span className="jt-header__mark">⟡</span>
        <div>
          <h1>جواهر آینه‌ای</h1>
          <p>عکس بگذارید، جواهر مورد نظرتان را روی صورتتان ببینید</p>
        </div>
      </header>

      <main className="jt-main">
        <section className="jt-stage-col">
          {!imageURL ? (
            <UploadPanel onImageSelected={handleImageSelected} />
          ) : (
            <>
              <StageCanvas
                ref={stageRef}
                imageURL={imageURL}
                naturalWidth={naturalSize.w}
                naturalHeight={naturalSize.h}
                placedItems={placedItems}
                setPlacedItems={setPlacedItems}
                statusMessage={status}
              />
              {error && <p className="jt-error">{error}</p>}
              <div className="jt-actions">
                <label className="jt-btn jt-btn--ghost jt-file-label">
                  عکس دیگر
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => e.target.files[0] && handleImageSelected(e.target.files[0])}
                  />
                </label>
                <button className="jt-btn jt-btn--ghost" onClick={handleReset} disabled={!placedItems.length}>
                  پاک‌کردن جواهرات
                </button>
                <button className="jt-btn jt-btn--gold" onClick={handleDownload} disabled={!placedItems.length}>
                  دانلود تصویر نهایی
                </button>
              </div>
            </>
          )}
        </section>

        <ProductRail onAdd={addProduct} disabled={!anchors} />
      </main>
    </div>
  )
}
