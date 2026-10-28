'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  ChevronDown,
  Heart,
  Menu,
  Package,
  Search,
  ShoppingBag,
  X,
} from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { useOrders } from '@/context/OrdersContext'
import { BrandLogo } from '@/components/BrandLogo'
import { drawerTransition } from '@/lib/motion'
import type { CategoryView } from '@/lib/catalog/types'
import {
  resolveStorefrontNav,
  type StorefrontNavLink,
} from '@/lib/catalog/nav'
import type { NavigationContent } from '@/lib/website/types'

function isNavLinkActive(
  href: string,
  pathname: string,
  searchParams: URLSearchParams,
) {
  const [path, query] = href.split('?')
  if (pathname !== path) return false
  if (!query) {
    return (
      !searchParams.get('category') &&
      !searchParams.get('department') &&
      !searchParams.get('sale')
    )
  }
  const wanted = new URLSearchParams(query)
  for (const [key, value] of wanted.entries()) {
    if (searchParams.get(key) !== value) return false
  }
  return true
}

function isParentActive(
  link: StorefrontNavLink,
  pathname: string,
  searchParams: URLSearchParams,
) {
  if (isNavLinkActive(link.to, pathname, searchParams)) return true
  if (pathname !== '/shop') return false
  const category = searchParams.get('category')
  if (!category || !link.children?.length) return false
  return link.children.some((child) => child.slug === category)
}

export function Header({
  announcement = null,
  categories = [],
  navigation,
}: {
  announcement?: string | null
  categories?: CategoryView[]
  navigation: NavigationContent
}) {
  const { cartCount, wishlist, hydrated: cartHydrated } = useCart()
  const { orderCount, hydrated: ordersHydrated } = useOrders()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [desktopOpen, setDesktopOpen] = useState<string | null>(null)
  const reduceMotion = useReducedMotion()
  // Providers sit outside <Suspense>; their hydrate effects can commit before
  // Header finishes hydrating. Gate client-only UI on a local mount flag so the
  // first client render always matches SSR HTML.
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const showOrdersLink = mounted && ordersHydrated && orderCount > 0
  const showCartBadge = mounted && cartHydrated && cartCount > 0
  const showWishlistBadge = mounted && cartHydrated && wishlist.length > 0

  const navLinks = useMemo(() => {
    const links = resolveStorefrontNav(navigation, categories)
    if (!showOrdersLink) return links
    return [
      ...links,
      { id: 'orders', to: '/orders', label: 'Your Orders' },
    ]
  }, [navigation, categories, showOrdersLink])

  const iconBtnClass =
    'flex h-10 w-10 items-center justify-center rounded-full text-navy/70 transition hover:bg-navy/8 hover:text-navy'

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setOpen(false)
    setDesktopOpen(null)
  }, [pathname, searchParams])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {announcement ? (
        <div className="bg-navy px-4 py-2 text-center text-[12px] font-medium tracking-wide text-white md:text-[13px]">
          {announcement}
        </div>
      ) : null}
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${scrolled
          ? 'border-navy/15 bg-paper/90 shadow-soft backdrop-blur-md'
          : 'border-navy/10 bg-paper/95'
          }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:h-[4.5rem] md:px-6 lg:px-8">
          <button
            type="button"
            className={`${iconBtnClass} lg:hidden`}
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <BrandLogo src={navigation.logoSrc} />

          <nav className="hidden items-center gap-6 lg:flex xl:gap-7">
            {navLinks.map((link) => {
              const hasChildren = Boolean(link.children?.length)
              const active = isParentActive(link, pathname, searchParams)
              const menuOpen = desktopOpen === link.id

              if (!hasChildren) {
                return (
                  <Link
                    key={link.id}
                    href={link.to}
                    className={`relative text-[13px] tracking-wide transition ${link.accent
                      ? 'font-semibold text-ink underline decoration-ink/40 underline-offset-4 hover:decoration-ink'
                      : active
                        ? 'font-semibold text-navy'
                        : 'font-medium text-ink/70 hover:text-navy'
                      }`}
                  >
                    {link.label}
                    {active && !link.accent ? (
                      <span
                        aria-hidden
                        className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-navy"
                      />
                    ) : null}
                  </Link>
                )
              }

              return (
                <div
                  key={link.id}
                  className="relative"
                  onMouseEnter={() => setDesktopOpen(link.id)}
                  onMouseLeave={() => setDesktopOpen(null)}
                >
                  <Link
                    href={link.to}
                    className={`relative inline-flex items-center gap-1 text-[13px] tracking-wide transition ${
                      active
                        ? 'font-semibold text-navy'
                        : 'font-medium text-ink/70 hover:text-navy'
                    }`}
                    aria-expanded={menuOpen}
                    aria-haspopup="true"
                  >
                    {link.label}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition ${menuOpen ? 'rotate-180' : ''}`}
                      aria-hidden
                    />
                    {active ? (
                      <span
                        aria-hidden
                        className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-navy"
                      />
                    ) : null}
                  </Link>
                  <AnimatePresence>
                    {menuOpen ? (
                      <motion.div
                        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduceMotion ? undefined : { opacity: 0, y: 6 }}
                        transition={
                          reduceMotion
                            ? { duration: 0 }
                            : { duration: 0.16, ease: 'easeOut' }
                        }
                        className="absolute left-0 top-full z-50 min-w-[11rem] pt-3"
                      >
                        <div className="rounded-xl border border-navy/10 bg-white py-2 shadow-lift">
                          {link.children!.map((child) => {
                            const childActive = isNavLinkActive(
                              child.to,
                              pathname,
                              searchParams,
                            )
                            return (
                              <Link
                                key={child.slug}
                                href={child.to}
                                className={`block px-4 py-2 text-[13px] transition ${
                                  childActive
                                    ? 'bg-navy/8 font-semibold text-navy'
                                    : 'font-medium text-ink/75 hover:bg-navy/5 hover:text-navy'
                                }`}
                              >
                                {child.label}
                              </Link>
                            )
                          })}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              )
            })}
          </nav>

          <div className="flex items-center gap-0.5 md:gap-1">
            <Link
              href="/shop?focus=search"
              className={`${iconBtnClass} hidden sm:flex`}
              aria-label="Search"
            >
              <Search className="h-[18px] w-[18px]" />
            </Link>
            {showOrdersLink ? (
              <Link
                href="/orders"
                className={`relative ${iconBtnClass}`}
                aria-label="Your orders"
              >
                <Package className="h-[18px] w-[18px]" />
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-navy px-1 text-[10px] font-bold text-white">
                  {orderCount}
                </span>
              </Link>
            ) : null}
            <Link
              href="/wishlist"
              className={`relative ${iconBtnClass}`}
              aria-label="Wishlist"
            >
              <Heart className="h-[18px] w-[18px]" />
              {showWishlistBadge && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-navy px-1 text-[10px] font-bold text-white">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              className={`relative ${iconBtnClass}`}
              aria-label="Cart"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {showCartBadge && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-navy px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm lg:hidden"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={reduceMotion ? { duration: 0 } : undefined}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-[70] flex w-[min(88vw,320px)] flex-col bg-white shadow-lift lg:hidden"
              initial={reduceMotion ? false : { x: '-100%' }}
              animate={{ x: 0 }}
              exit={reduceMotion ? undefined : { x: '-100%' }}
              transition={reduceMotion ? { duration: 0 } : drawerTransition}
            >
              <div className="flex items-center justify-between border-b border-navy/10 px-5 py-4">
                <BrandLogo src={navigation.logoSrc} heightClassName="h-7" />
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className={iconBtnClass}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-0.5 overflow-y-auto p-4">
                {navLinks.map((link) => {
                  const active = isParentActive(link, pathname, searchParams)
                  return (
                    <div key={link.id} className="flex flex-col">
                      <Link
                        href={link.to}
                        className={`rounded-xl px-4 py-3 text-[15px] ${link.accent
                          ? 'font-semibold text-ink underline decoration-ink/40 underline-offset-4'
                          : active
                            ? 'bg-navy/8 font-semibold text-navy'
                            : 'font-medium text-ink hover:bg-navy/5 hover:text-navy'
                          }`}
                      >
                        {link.label}
                      </Link>
                      {link.children?.map((child) => {
                        const childActive = isNavLinkActive(
                          child.to,
                          pathname,
                          searchParams,
                        )
                        return (
                          <Link
                            key={child.slug}
                            href={child.to}
                            className={`rounded-xl py-2.5 pl-10 pr-4 text-[14px] ${
                              childActive
                                ? 'bg-navy/8 font-semibold text-navy'
                                : 'font-medium text-ink/70 hover:bg-navy/5 hover:text-navy'
                            }`}
                          >
                            {child.label}
                          </Link>
                        )
                      })}
                    </div>
                  )
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
