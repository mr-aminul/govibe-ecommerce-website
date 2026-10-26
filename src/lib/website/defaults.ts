import { BRAND } from '@/lib/brand'
import { DEFAULT_SLIDE_INTERVAL_MS } from '@/lib/website/constants'
import type {
  AboutPageContent,
  HomePageContent,
  MarketingPopupContent,
  SiteContent,
} from '@/lib/website/types'

export const DEFAULT_MARKETING_POPUP: MarketingPopupContent = {
  enabled: false,
  image: '',
  alt: 'Special offer',
  href: '/shop',
  delaySeconds: 3,
  startsAt: '',
  endsAt: '',
  frequency: 'once',
  campaignKey: 'default',
}

export const DEFAULT_HOME_SECTIONS: HomePageContent['sections'] = {
  hero: true,
  categories: true,
  promoDual: true,
  mostPopular: true,
  foamCrocs: true,
  saleBanner: true,
  whatsapp: true,
  brandStrip: true,
  trust: true,
}

export const DEFAULT_HOME_CONTENT: HomePageContent = {
  sections: { ...DEFAULT_HOME_SECTIONS },
  hero: {
    mediaMode: 'image',
    image: '/images/hero.png',
    video: '',
    slides: [
      {
        id: '1',
        src: '/images/hero.png',
        alt: "GoVibe men's bags",
      },
    ],
    slideIntervalMs: DEFAULT_SLIDE_INTERVAL_MS,
    logoSrc: '/logo.png',
    headlineBefore: 'Unleash your',
    headlineEm: 'signature style',
    subcopy:
      'Backpacks, messengers, crossbodies, and everyday carries — built for how men move through Dhaka.',
    primaryCta: { label: 'Shop now', href: '/shop' },
    secondaryCta: {
      label: 'Shop backpacks',
      href: '/shop?category=backpacks',
    },
    usps: ['Countrywide Delivery', 'Easy returns', 'COD available'],
  },
  categories: {
    title: 'Shop by category',
    subtitle: 'Backpacks, messengers, slings, and more for men.',
  },
  promoDual: {
    left: {
      eyebrow: 'New arrivals',
      title: 'Daypacks built for every day',
      cta: { label: 'Shop now', href: '/shop' },
      image: '/images/promos/promo-hardshell.png',
      bgColor: '#0a0a0a',
    },
    right: {
      eyebrow: 'Street energy',
      title: 'Crossbodies made to move',
      cta: { label: 'Shop crossbody', href: '/shop?category=crossbody' },
      image: '/images/promos/promo-crossbody.png',
      bgColor: '#1a1a1a',
    },
  },
  mostPopular: {
    title: 'Most popular',
    subtitle: "What everyone's carrying right now.",
    productIds: [
      '22222222-2222-4222-8222-222222222201',
      '22222222-2222-4222-8222-222222222202',
      '22222222-2222-4222-8222-222222222203',
      '22222222-2222-4222-8222-222222222204',
    ],
  },
  foamCrocs: {
    title: 'Everyday carry',
    subtitle: 'Slings, belt bags, and go-anywhere packs.',
    productIds: [
      '22222222-2222-4222-8222-222222222206',
      '22222222-2222-4222-8222-222222222207',
      '22222222-2222-4222-8222-222222222205',
      '22222222-2222-4222-8222-222222222208',
    ],
  },
  saleBanner: {
    eyebrow: 'Limited drop',
    title: 'Style Sale',
    bodyBefore: 'Up to ',
    highlight: '40% off',
    bodyAfter: ' select backpacks & messengers',
    cta: { label: 'Shop the sale', href: '/shop?sale=1' },
    image: '/images/promo-autumn.png',
    bigText: '40%',
  },
  whatsapp: {
    title: 'Order on WhatsApp',
    body: "Send us the style and colour you want — we'll confirm stock, quote delivery, and take your order in minutes.",
    primaryCtaLabel: 'WhatsApp to order',
    secondaryCta: { label: 'Browse the shop', href: '/shop' },
  },
  brandStrip: {
    eyebrow: 'Our vibe',
    title: 'Built for the way you actually move',
    body: `No bulky handbags. Just men's backpacks, messengers, crossbodies, and street-ready slings — curated for Bangladesh's style-forward crowd. Trusted by ${BRAND.followers}+ on Facebook with a ${BRAND.recommend} recommend rate.`,
    cta: { label: 'Our story', href: '/about' },
    image: '/images/hero.png',
  },
  trust: [
    { title: '100% Authentic', text: 'Direct from GoVibe' },
    { title: 'Fast Delivery', text: 'Across greater Dhaka' },
    { title: 'Pay on delivery', text: 'COD available now' },
    { title: 'WhatsApp Order', text: BRAND.phone },
  ],
}

export const DEFAULT_ABOUT_CONTENT: AboutPageContent = {
  hero: {
    image: '/images/store.jpg',
    eyebrow: 'About us',
    title: 'Crossbodies that keep up with your vibe',
    subcopy:
      'GoVibe is a fashion accessories brand for compact urban carries — hardshell pouches, textured crossbodies, camera bags, and everyday slings that take your look further.',
  },
  whoWeAre: {
    title: 'Who we are',
    body1: `Based in Dhaka, GoVibe exists for people who want accessories without the bulk. We skip oversized handbags — our racks are filled with boxy hardshells, woven pouches, and phone-ready crossbodies you'll actually wear every day.`,
    body2: `With ${BRAND.followers}+ followers on Facebook and a ${BRAND.recommend} recommend rate from real customers, we've become a go-to stop for campus, café, and city-street fits.`,
    stats: [
      { value: BRAND.followers, label: 'Facebook followers' },
      { value: BRAND.recommend, label: 'Would recommend' },
      { value: '100%', label: 'Urban crossbodies' },
      { value: '7-day', label: 'Easy exchange' },
    ],
  },
  sizeGuide: {
    title: 'Bag size guide',
    subtitle:
      'These are compact EDC carries — most fit a phone, cards, and keys. Dimensions are approximate exterior sizes.',
  },
  contact: {
    title: 'Get in touch',
  },
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  brand: {
    name: BRAND.name,
    tagline: BRAND.tagline,
    phone: BRAND.phone,
    whatsapp: BRAND.whatsapp,
    email: BRAND.email,
    instagram: BRAND.instagram,
    instagramHandle: '@govibe',
    facebook: BRAND.facebook,
    city: BRAND.city,
    mapsUrl: BRAND.mapsUrl,
    mapsEmbedUrl: BRAND.mapsEmbedUrl,
    followers: BRAND.followers,
    recommend: BRAND.recommend,
  },
  footer: {
    blurb:
      "Urban crossbodies for Dhaka's style crowd. Hardshell pouches, textured bags, camera carries and everyday slings — designed to elevate your look.",
    dropsTitle: 'Drops & restocks',
    dropsBody:
      'Message us on WhatsApp for early access to new crossbodies and restocks.',
    dropsCtaLabel: 'WhatsApp us',
    dropsPrefill: 'Hi GoVibe — keep me posted on drops & restocks.',
    copyright: '© {year} GoVibe. Shop from Dhaka, deliver across the city.',
  },
  productPromises: {
    deliveryLabel: 'Delivery:',
    deliveryText: '24hrs within Dhaka, 24–72hrs outside Dhaka',
    returnsLabel: '',
    returnsText: '',
    authenticLabel: 'Authentic:',
    authenticText: 'Genuine GoVibe urban crossbodies & pouches',
  },
  marketingPopup: { ...DEFAULT_MARKETING_POPUP },
}
