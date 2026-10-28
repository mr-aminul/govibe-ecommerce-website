import { WebsiteNavigationEditor } from '@/components/admin/WebsiteNavigationEditor'
import { seedNavigationCategoryAssignments } from '@/lib/catalog/nav'
import { createServiceClient } from '@/lib/db/admin'
import { getNavigationContentFresh } from '@/lib/website/queries'

export const metadata = {
  title: 'Navigation · Website Modifier',
  robots: { index: false, follow: false },
}

export default async function WebsiteNavigationAdminPage() {
  const [content, categoriesResult] = await Promise.all([
    getNavigationContentFresh(),
    createServiceClient()
      .from('categories')
      .select('id, name, slug, active')
      .order('sort_order', { ascending: true }),
  ])

  const categories = categoriesResult.data ?? []
  const initial = seedNavigationCategoryAssignments(content, categories)

  return (
    <WebsiteNavigationEditor initial={initial} categories={categories} />
  )
}
