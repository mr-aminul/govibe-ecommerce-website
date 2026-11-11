import { getStorefrontAnnouncement } from '@/lib/campaigns/queries'
import { listStoreCategories } from '@/lib/catalog/queries'
import { getPublicMarketingConfig } from '@/lib/integrations/marketing-settings'
import {
  getNavigationContent,
  getSiteContent,
} from '@/lib/website/queries'
import { MarketingTags } from '@/components/MarketingTags'
import { StoreProviders } from '@/components/StoreProviders'

/**
 * Always render from live Postgres/PostgREST on the VPS.
 * Static prerender previously baked empty defaults when the API was unreachable
 * during `next build`, which made the storefront look "empty" after migration.
 */
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [marketing, announcement, site, categories, navigation] =
    await Promise.all([
      getPublicMarketingConfig(),
      getStorefrontAnnouncement(),
      getSiteContent(),
      listStoreCategories(),
      getNavigationContent(),
    ])

  return (
    <>
      <MarketingTags config={marketing} />
      <StoreProviders
        announcement={announcement}
        categories={categories}
        navigation={navigation}
        site={site}
      >
        {children}
      </StoreProviders>
    </>
  )
}
