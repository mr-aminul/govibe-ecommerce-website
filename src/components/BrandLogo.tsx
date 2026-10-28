import Link from 'next/link'
import { resolveSiteMediaUrl } from '@/lib/website/media-url'

type BrandLogoProps = {
  className?: string
  /** `dark` = black mark for light backgrounds; `light` = white mark for dark backgrounds */
  variant?: 'dark' | 'light'
  heightClassName?: string
  /** Optional override (e.g. Website → Menu logo). */
  src?: string | null
}

/**
 * Site brand mark using the GoVibe wordmark image.
 */
export function BrandLogo({
  className = '',
  variant = 'dark',
  heightClassName = 'h-8 md:h-9',
  src,
}: BrandLogoProps) {
  const fallback = variant === 'light' ? '/logo.png' : '/logo-dark.png'
  const resolved = resolveSiteMediaUrl(src || fallback, fallback)

  return (
    <Link
      href="/"
      className={`inline-flex items-center ${className}`}
      aria-label="GoVibe home"
      prefetch={false}
    >
      <img
        src={resolved}
        alt="GoVibe"
        className={`w-auto ${heightClassName}`}
        width={714}
        height={536}
        decoding="async"
        fetchPriority="low"
      />
    </Link>
  )
}
