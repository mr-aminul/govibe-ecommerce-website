import Link from 'next/link'

type BrandLogoProps = {
  className?: string
  /** `dark` = black mark for light backgrounds; `light` = white mark for dark backgrounds */
  variant?: 'dark' | 'light'
  heightClassName?: string
}

/**
 * Site brand mark using the GoVibe wordmark image.
 */
export function BrandLogo({
  className = '',
  variant = 'dark',
  heightClassName = 'h-8 md:h-9',
}: BrandLogoProps) {
  const src = variant === 'light' ? '/logo.png' : '/logo-dark.png'

  return (
    <Link
      href="/"
      className={`inline-flex items-center ${className}`}
      aria-label="GoVibe home"
      prefetch={false}
    >
      <img
        src={src}
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
