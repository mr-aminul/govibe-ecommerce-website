import { Suspense } from 'react'
import { ShopPage } from '@/components/pages/ShopPage'
import {
  listStoreCategories,
  listStoreProducts,
} from '@/lib/catalog/queries'

export const metadata = {
  title: 'Shop',
  description:
    "Men's bags for every Dhaka day — backpacks, crossbodies, messengers, weekenders & slings.",
}

export default async function Shop() {
  const [products, categories] = await Promise.all([
    listStoreProducts(),
    listStoreCategories(),
  ])

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-20 text-center text-mute">
          Loading shop…
        </div>
      }
    >
      <ShopPage products={products} categories={categories} />
    </Suspense>
  )
}
