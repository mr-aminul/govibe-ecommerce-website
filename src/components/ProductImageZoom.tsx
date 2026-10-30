'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { X, ZoomIn } from 'lucide-react'
import { SafeImage } from '@/components/SafeImage'

const LENS_SIZE = 168
const ZOOM = 2.85

type LensState = {
  left: number
  top: number
  imgLeft: number
  imgTop: number
  boxW: number
  boxH: number
}

/**
 * Product image with a hover magnifying rectangle (desktop) and a
 * click/tap lightbox for a closer look on any device.
 */
export function ProductImageZoom({
  src,
  alt,
  children,
}: {
  src: string
  alt: string
  children?: ReactNode
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [canLoupe, setCanLoupe] = useState(false)
  const [lens, setLens] = useState<LensState | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setCanLoupe(mq.matches && !reduce.matches)
    sync()
    mq.addEventListener('change', sync)
    reduce.addEventListener('change', sync)
    return () => {
      mq.removeEventListener('change', sync)
      reduce.removeEventListener('change', sync)
    }
  }, [])

  useEffect(() => {
    setLightboxOpen(false)
    setLens(null)
  }, [src])

  useEffect(() => {
    if (!lightboxOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [lightboxOpen])

  const updateLens = useCallback((clientX: number, clientY: number) => {
    const frame = frameRef.current
    if (!frame) return

    const rect = frame.getBoundingClientRect()
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width)
    const y = Math.min(Math.max(clientY - rect.top, 0), rect.height)

    const half = LENS_SIZE / 2
    const left = Math.min(Math.max(x - half, 0), Math.max(rect.width - LENS_SIZE, 0))
    const top = Math.min(Math.max(y - half, 0), Math.max(rect.height - LENS_SIZE, 0))

    setLens({
      left,
      top,
      // Center the magnified point under the cursor inside the lens.
      imgLeft: half - x * ZOOM,
      imgTop: half - y * ZOOM,
      boxW: rect.width,
      boxH: rect.height,
    })
  }, [])

  const clearLens = useCallback(() => setLens(null), [])

  return (
    <>
      <div
        ref={frameRef}
        className={[
          'group/zoom relative h-full w-full overflow-hidden',
          canLoupe ? 'cursor-crosshair' : 'cursor-zoom-in',
          'focus-within:outline-none',
        ].join(' ')}
        onMouseEnter={
          canLoupe
            ? (event) => updateLens(event.clientX, event.clientY)
            : undefined
        }
        onMouseMove={
          canLoupe
            ? (event) => updateLens(event.clientX, event.clientY)
            : undefined
        }
        onMouseLeave={canLoupe ? clearLens : undefined}
      >
        <button
          type="button"
          aria-label={`View larger image of ${alt}`}
          className="absolute inset-0 z-[1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 focus-visible:ring-inset"
          onClick={() => setLightboxOpen(true)}
        />

        <SafeImage
          src={src}
          alt={alt}
          maxWidth={1200}
          draggable={false}
          className="pointer-events-none absolute inset-0 h-full w-full object-contain select-none"
        />

        {children}

        {canLoupe && lens ? (
          <div
            aria-hidden
            className="pointer-events-none absolute z-[5] overflow-hidden rounded-md border-2 border-ink/80 bg-white shadow-[0_8px_28px_rgba(10,10,10,0.22)] ring-1 ring-white/80"
            style={{
              width: LENS_SIZE,
              height: LENS_SIZE,
              left: lens.left,
              top: lens.top,
            }}
          >
            <SafeImage
              src={src}
              alt=""
              maxWidth={1600}
              draggable={false}
              className="pointer-events-none absolute max-w-none object-contain select-none"
              style={{
                width: lens.boxW * ZOOM,
                height: lens.boxH * ZOOM,
                left: lens.imgLeft,
                top: lens.imgTop,
              }}
            />
          </div>
        ) : null}

        <span
          className={[
            'pointer-events-none absolute right-3 bottom-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-ink/70 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm transition',
            lens ? 'opacity-0' : 'opacity-0 group-hover/zoom:opacity-100',
          ].join(' ')}
        >
          <ZoomIn className="h-3.5 w-3.5" />
          {canLoupe ? 'Hover to magnify · Click to enlarge' : 'Tap to enlarge'}
        </span>
      </div>

      {lightboxOpen && typeof document !== 'undefined'
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label={`${alt} — enlarged view`}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm md:p-8"
              onClick={() => setLightboxOpen(false)}
            >
              <button
                type="button"
                aria-label="Close enlarged image"
                className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-ink shadow-card transition hover:bg-white"
                onClick={() => setLightboxOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
              <SafeImage
                src={src}
                alt={alt}
                maxWidth={1600}
                className="max-h-full max-w-full object-contain"
                draggable={false}
                onClick={(event) => event.stopPropagation()}
              />
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
