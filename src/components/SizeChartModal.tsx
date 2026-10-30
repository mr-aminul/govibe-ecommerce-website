'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { createPortal } from 'react-dom'
import { Loader2, Upload, X } from 'lucide-react'
import {
  clearProductSizeChart,
  uploadProductSizeChart,
} from '@/lib/catalog/actions/media'
import { prepareMediaFileForUpload } from '@/lib/catalog/compress-image-client'

type SizeChartModalProps = {
  open: boolean
  onClose: () => void
  imageUrl?: string | null
  /** When set, the modal shows upload / replace / remove controls. */
  productId?: string
  onImageChange?: (url: string | null) => void
}

export function SizeChartModal({
  open,
  onClose,
  imageUrl,
  productId,
  onImageChange,
}: SizeChartModalProps) {
  const isAdmin = Boolean(productId)
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(imageUrl ?? null)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    if (open) setPreviewUrl(imageUrl ?? null)
  }, [open, imageUrl])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !pending) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose, pending])

  if (typeof document === 'undefined' || !open) return null

  const runUpload = (file: File | undefined) => {
    if (!productId || !file) return
    setError(null)
    startTransition(async () => {
      const prepared = await prepareMediaFileForUpload(file, { square: false })
      const formData = new FormData()
      formData.set('file', prepared.file)
      const result = await uploadProductSizeChart(productId, formData)
      if (!result.ok) {
        setError(result.error)
        return
      }
      const nextUrl = result.data?.url ?? null
      setPreviewUrl(nextUrl)
      onImageChange?.(nextUrl)
    })
  }

  const runClear = () => {
    if (!productId) return
    setError(null)
    startTransition(async () => {
      const result = await clearProductSizeChart(productId)
      if (!result.ok) {
        setError(result.error)
        return
      }
      setPreviewUrl(null)
      onImageChange?.(null)
    })
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="size-chart-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
        onClick={pending ? undefined : onClose}
        aria-label="Close size chart"
        disabled={pending}
      />

      <div
        className="relative z-10 flex max-h-[min(92vh,900px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-cloud bg-white shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 border-b border-cloud px-5 py-4">
          <h2
            id="size-chart-title"
            className="font-display text-xl font-extrabold tracking-tight text-ink"
          >
            Size chart
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            disabled={pending}
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-mist disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Size chart"
              className="mx-auto max-h-[min(70vh,720px)] w-auto max-w-full object-contain"
            />
          ) : (
            <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-cloud bg-mist/40 px-6 py-10 text-center">
              <p className="text-[14px] font-medium text-ink">
                {isAdmin ? 'No size chart yet' : 'Size chart unavailable'}
              </p>
              <p className="mt-1 max-w-sm text-[13px] text-mute">
                {isAdmin
                  ? 'Upload a JPEG of your size chart. Shoppers will see it when they tap Size chart.'
                  : 'This product does not have a size chart yet.'}
              </p>
            </div>
          )}

          {error ? (
            <p className="mt-4 text-[13px] font-medium text-spark" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        {isAdmin ? (
          <div className="flex flex-wrap items-center gap-3 border-t border-cloud px-5 py-4">
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,.jpg,.jpeg"
              className="sr-only"
              onChange={(e) => {
                runUpload(e.target.files?.[0])
                e.target.value = ''
              }}
            />
            <button
              type="button"
              disabled={pending}
              onClick={() => inputRef.current?.click()}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-navy px-5 text-[13px] font-semibold text-white transition hover:bg-navy-deep disabled:opacity-60"
            >
              {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {previewUrl ? 'Replace image' : 'Upload image'}
            </button>
            {previewUrl ? (
              <button
                type="button"
                disabled={pending}
                onClick={runClear}
                className="inline-flex h-11 items-center justify-center rounded-full border border-cloud px-5 text-[13px] font-semibold text-ink transition hover:bg-mist disabled:opacity-60"
              >
                Remove
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  )
}
