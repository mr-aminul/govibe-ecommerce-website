import { readdirSync, readFileSync, unlinkSync } from 'node:fs'
import path from 'node:path'
import { revalidatePath, revalidateTag } from 'next/cache'

/** Shared tag for all public catalog list/detail caches. */
export const STORE_CATALOG_TAG = 'store-catalog'

/** Per-product tag so a single PDP can be purged precisely. */
export function storeProductTag(slug: string): string {
  return `store-product-${slug}`
}

/**
 * No time-based TTL. Storefront Data Cache stays until admin mutations call
 * `revalidateStorefront` / `revalidateTag`.
 */
export const STORE_CACHE_REVALIDATE = false as const

/** Storefront routes that embed header/nav (layout) data in prerendered HTML. */
const STOREFRONT_PRERENDER_STEMS = [
  'index',
  'shop',
  'about',
  'cart',
  'checkout',
  'orders',
  'wishlist',
  'terms',
  'privacy',
] as const

/**
 * Self-hosted Next can keep Full Route Cache HTML on disk under
 * `.next/server/app/` even after `revalidatePath`. Delete those artifacts so
 * the next request regenerates from fresh data.
 */
export function purgePrerenderArtifacts(routeStems: string[]) {
  const base = path.join(process.cwd(), '.next', 'server', 'app')
  for (const stem of routeStems) {
    for (const ext of ['.html', '.rsc', '.meta'] as const) {
      try {
        unlinkSync(path.join(base, `${stem}${ext}`))
      } catch {
        // Missing file is fine — route may not have been prerendered yet.
      }
    }
  }
}

/**
 * Wipe every storefront Full Route Cache artifact that carries shared layout
 * data (logo, nav, announcement). Also drops product PDPs' HTML when present.
 */
export function purgeStorefrontPrerender() {
  purgePrerenderArtifacts([...STOREFRONT_PRERENDER_STEMS])

  const productDir = path.join(process.cwd(), '.next', 'server', 'app', 'product')
  try {
    for (const slug of readdirSync(productDir, { withFileTypes: true })) {
      if (!slug.isDirectory()) continue
      purgePrerenderArtifacts([path.join('product', slug.name)])
    }
  } catch {
    // product/ may not exist yet
  }
}

/**
 * Delete on-disk `unstable_cache` / fetch-cache entries that carry any of the
 * given tags. Needed on self-hosted Next when tag revalidation leaves stale
 * disk entries that Full Route Cache regenerates from.
 */
export function purgeFetchCacheByTags(tags: string[]) {
  if (tags.length === 0) return
  const wanted = new Set(tags)
  const dir = path.join(process.cwd(), '.next', 'cache', 'fetch-cache')
  let names: string[]
  try {
    names = readdirSync(dir)
  } catch {
    return
  }

  for (const name of names) {
    const file = path.join(dir, name)
    try {
      const raw = readFileSync(file, 'utf8')
      const entry = JSON.parse(raw) as { tags?: unknown }
      if (!Array.isArray(entry.tags)) continue
      if (!entry.tags.some((tag) => typeof tag === 'string' && wanted.has(tag))) {
        continue
      }
      unlinkSync(file)
    } catch {
      // Corrupt / raced — ignore
    }
  }
}

/**
 * Bust storefront Data Cache + route caches after catalog writes.
 * Call this from every admin mutation that changes what shoppers see
 * (products, categories, media, inventory, related products, etc.).
 */
export function revalidateStorefront(
  ...slugs: Array<string | null | undefined>
) {
  revalidateTag(STORE_CATALOG_TAG)
  // `layout` clears nested segments; bare path alone can leave stale HTML.
  revalidatePath('/', 'layout')
  revalidatePath('/shop', 'layout')
  revalidatePath('/shop', 'page')

  const unique = [...new Set(slugs.filter((s): s is string => Boolean(s)))]
  for (const slug of unique) {
    revalidateTag(storeProductTag(slug))
    revalidatePath(`/product/${slug}`, 'page')
    revalidatePath(`/product/${slug}`, 'layout')
  }

  purgePrerenderArtifacts([
    'index',
    'shop',
    ...unique.map((slug) => path.join('product', slug)),
  ])
  purgeFetchCacheByTags([STORE_CATALOG_TAG])
}
