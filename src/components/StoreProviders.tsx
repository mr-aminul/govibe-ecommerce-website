'use client'

import { Suspense, type ReactNode } from 'react'
import { CartProvider } from '@/context/CartContext'
import { OrdersProvider } from '@/context/OrdersContext'
import { SiteSettingsProvider } from '@/context/SiteSettingsContext'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { PageTransition } from '@/components/PageTransition'
import { ToastHost } from '@/components/ToastHost'
import { MarketingPopup } from '@/components/MarketingPopup'
import { VisitorBeacon } from '@/components/VisitorBeacon'
import { WhatsAppBubble } from '@/components/WhatsAppBubble'
import type { CategoryView } from '@/lib/catalog/types'
import type { NavigationContent, SiteContent } from '@/lib/website/types'

export function StoreProviders({
  children,
  announcement,
  categories = [],
  navigation,
  site,
}: {
  children: ReactNode
  announcement?: string | null
  categories?: CategoryView[]
  navigation: NavigationContent
  site: SiteContent
}) {
  return (
    <SiteSettingsProvider value={site}>
      <CartProvider>
        <OrdersProvider>
          <Suspense fallback={null}>
            <Header
              announcement={announcement}
              categories={categories}
              navigation={navigation}
            />
          </Suspense>
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <WhatsAppBubble />
          <MarketingPopup />
          <VisitorBeacon />
          <ToastHost />
        </OrdersProvider>
      </CartProvider>
    </SiteSettingsProvider>
  )
}
