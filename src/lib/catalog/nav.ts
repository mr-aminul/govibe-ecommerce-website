import type { CategoryView } from '@/lib/catalog/types'
import type {
  NavigationContent,
  NavigationItemContent,
} from '@/lib/website/types'

export type StorefrontNavChild = {
  to: string
  label: string
  slug: string
}

export type StorefrontNavLink = {
  id: string
  to: string
  label: string
  accent?: boolean
  children?: StorefrontNavChild[]
}

/** Guess a department when a nav item has no assigned categories yet. */
export function guessCategoryDepartment(cat: {
  slug: string
  name: string
}): 'shoes' | 'bags' | 'accessories' {
  const hay = `${cat.slug} ${cat.name}`.toLowerCase()
  if (
    /shoe|sneaker|loafer|sandal|boot|footwear|runner|clog|mule|slipper/.test(
      hay,
    )
  ) {
    return 'shoes'
  }
  if (
    /accessor|wallet|scarf|keychain|charm|sock|beanie|cap\b|hat\b/.test(hay)
  ) {
    return 'accessories'
  }
  return 'bags'
}

export function categoryHref(slug: string) {
  return `/shop?category=${slug}`
}

export function departmentHref(itemId: string) {
  return `/shop?department=${itemId}`
}

function resolvedCategorySlugs(
  item: NavigationItemContent,
  categories: CategoryView[],
  claimed: Set<string>,
): string[] {
  if (item.categorySlugs.length > 0) {
    return item.categorySlugs.filter((slug) => {
      if (claimed.has(slug)) return false
      return categories.some((c) => c.slug === slug)
    })
  }

  // Seed defaults for Shoes / Bags / Accessories until the admin assigns.
  if (item.id !== 'shoes' && item.id !== 'bags' && item.id !== 'accessories') {
    return []
  }

  return categories
    .filter(
      (c) =>
        !claimed.has(c.slug) && guessCategoryDepartment(c) === item.id,
    )
    .map((c) => c.slug)
}

/**
 * Build the storefront header menu from Website → Navigation + live categories.
 */
export function resolveStorefrontNav(
  navigation: NavigationContent,
  categories: CategoryView[],
): StorefrontNavLink[] {
  const bySlug = new Map(categories.map((c) => [c.slug, c]))
  const claimed = new Set<string>()
  const links: StorefrontNavLink[] = []

  for (const item of navigation.items) {
    if (!item.enabled) continue

    const slugs = resolvedCategorySlugs(item, categories, claimed)
    for (const slug of slugs) claimed.add(slug)

    const children: StorefrontNavChild[] = []
    for (const slug of slugs) {
      const cat = bySlug.get(slug)
      if (!cat) continue
      children.push({
        to: categoryHref(slug),
        label: cat.name,
        slug,
      })
    }

    const href =
      item.href.trim() ||
      (children.length > 0 ? departmentHref(item.id) : '/shop')

    links.push({
      id: item.id,
      to: href,
      label: item.label,
      accent: item.accent || undefined,
      children: children.length > 0 ? children : undefined,
    })
  }

  return links
}

/** Category slugs belonging to a department nav item (for shop filters). */
export function departmentCategorySlugs(
  navigation: NavigationContent,
  categories: CategoryView[],
  departmentId: string,
): string[] {
  const item = navigation.items.find((row) => row.id === departmentId)
  if (!item || !item.enabled) return []
  const claimed = new Set<string>()
  // Claim slugs from earlier items so auto-assign doesn't double-count.
  for (const row of navigation.items) {
    if (row.id === departmentId) break
    if (!row.enabled) continue
    for (const slug of resolvedCategorySlugs(row, categories, claimed)) {
      claimed.add(slug)
    }
  }
  return resolvedCategorySlugs(item, categories, claimed)
}

export function findDepartmentLabel(
  navigation: NavigationContent,
  departmentId: string,
): string | null {
  const item = navigation.items.find(
    (row) => row.id === departmentId && row.enabled,
  )
  return item?.label ?? null
}

/**
 * Fill empty Shoes / Bags / Accessories slots with guessed categories so the
 * admin editor matches the storefront auto-seed until they save.
 */
export function seedNavigationCategoryAssignments(
  navigation: NavigationContent,
  categories: { slug: string; name: string }[],
): NavigationContent {
  const claimed = new Set(
    navigation.items.flatMap((item) => item.categorySlugs),
  )
  return {
    ...navigation,
    items: navigation.items.map((item) => {
      if (item.categorySlugs.length > 0) return item
      if (
        item.id !== 'shoes' &&
        item.id !== 'bags' &&
        item.id !== 'accessories'
      ) {
        return item
      }
      const slugs = categories
        .filter(
          (c) =>
            !claimed.has(c.slug) && guessCategoryDepartment(c) === item.id,
        )
        .map((c) => c.slug)
      for (const slug of slugs) claimed.add(slug)
      return { ...item, categorySlugs: slugs }
    }),
  }
}
