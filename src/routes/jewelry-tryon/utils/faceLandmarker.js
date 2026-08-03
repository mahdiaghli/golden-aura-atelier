import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

let landmarkerInstance = null
let loadingPromise = null

// این تابع مدل تشخیص صورت گوگل (MediaPipe) را یک‌بار از CDN بارگذاری می‌کند.
// بار اول کمی طول می‌کشد (چند صد کیلوبایت)، دفعات بعد از کش مرورگر می‌آید.
export async function getFaceLandmarker() {
  if (landmarkerInstance) return landmarkerInstance
  if (loadingPromise) return loadingPromise

  loadingPromise = (async () => {
    const filesetResolver = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
    )
    landmarkerInstance = await FaceLandmarker.createFromOptions(filesetResolver, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
        delegate: 'GPU',
      },
      outputFaceBlendshapes: false,
      outputFacialTransformationMatrixes: false,
      runningMode: 'IMAGE',
      numFaces: 1,
    })
    return landmarkerInstance
  })()

  return loadingPromise
}

// تصویر آپلود شده را به مدل می‌دهد و لندمارک‌های خام (نرمال‌شده بین ۰ تا ۱) را برمی‌گرداند
export async function detectFace(imageElement) {
  const landmarker = await getFaceLandmarker()
  const result = landmarker.detect(imageElement)
  if (!result.faceLandmarks || result.faceLandmarks.length === 0) {
    return null
  }
  return result.faceLandmarks[0]
}

// اندیس‌های کلیدی در توپولوژی ۴۶۸ نقطه‌ای MediaPipe Face Mesh
const IDX = {
  leftEyeOuter: 33,
  rightEyeOuter: 263,
  leftFaceEdge: 234, // نزدیک‌ترین نقطه به گوش چپ کاربر (سمت راست تصویر)
  rightFaceEdge: 454, // نزدیک‌ترین نقطه به گوش راست کاربر (سمت چپ تصویر)
  chin: 152,
  foreheadTop: 10,
  noseBridge: 6,
}

// لندمارک‌های نرمال‌شده را به نقاط لنگر (anchor) بر حسب پیکسل تصویر اصلی تبدیل می‌کند
export function computeAnchors(landmarks, imgWidth, imgHeight) {
  const p = (i) => ({
    x: landmarks[i].x * imgWidth,
    y: landmarks[i].y * imgHeight,
  })

  const leftEye = p(IDX.leftEyeOuter)
  const rightEye = p(IDX.rightEyeOuter)
  const leftEar = p(IDX.leftFaceEdge)
  const rightEar = p(IDX.rightFaceEdge)
  const chin = p(IDX.chin)
  const forehead = p(IDX.foreheadTop)

  const faceWidth = Math.hypot(rightEar.x - leftEar.x, rightEar.y - leftEar.y)
  const faceHeight = Math.hypot(forehead.x - chin.x, forehead.y - chin.y)

  // زاویه کج‌شدگی سر، بر اساس خط بین دو چشم
  const tiltAngle = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x)

  // نقطه گردن: کمی پایین‌تر از چانه، به فاصله متناسب با ارتفاع صورت
  const neck = {
    x: chin.x + Math.sin(tiltAngle) * faceHeight * 0.15,
    y: chin.y + faceHeight * 0.32,
  }

  return { leftEar, rightEar, chin, forehead, faceWidth, faceHeight, tiltAngle, neck }
}
