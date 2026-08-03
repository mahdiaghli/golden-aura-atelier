import { useRef, useCallback } from 'react'

export default function UploadPanel({ onImageSelected }) {
  const inputRef = useRef(null)

  const handleFiles = useCallback(
    (files) => {
      const file = files && files[0]
      if (!file || !file.type.startsWith('image/')) return
      onImageSelected(file)
    },
    [onImageSelected]
  )

  const onDrop = (e) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div
      className="jt-upload-panel"
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
      }}
    >
      <div className="jt-upload-panel__frame">
        <span className="jt-upload-panel__icon" aria-hidden="true">
          ⟡
        </span>
        <p className="jt-upload-panel__title">عکس خود را اینجا بکشید یا کلیک کنید</p>
        <p className="jt-upload-panel__hint">
          برای بهترین نتیجه، عکسی روبه‌رو و با نور کافی از صورت انتخاب کنید
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}
