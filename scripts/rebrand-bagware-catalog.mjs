/**
 * Apply GoVibe urban crossbody catalog via service role.
 * Usage: node scripts/rebrand-bagware-catalog.mjs
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    try {
      const text = readFileSync(resolve(process.cwd(), file), 'utf8')
      for (const line of text.split('\n')) {
        const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
        if (!m || process.env[m[1]]) continue
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
      }
    } catch {
      /* missing file */
    }
  }
}

loadEnv()

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const categories = [
  {
    id: '11111111-1111-4111-8111-111111111101',
    name: 'Hardshell',
    slug: 'hardshell',
    image_path: '/images/categories/cat-tile-hardshell.png',
    sort_order: 10,
    seo_title: 'Hardshell | GoVibe',
    seo_description: 'Rigid boxy hardshell crossbodies.',
  },
  {
    id: '11111111-1111-4111-8111-111111111102',
    name: 'Crossbody',
    slug: 'crossbody',
    image_path: '/images/categories/cat-tile-crossbody.png',
    sort_order: 20,
    seo_title: 'Crossbody | GoVibe',
    seo_description: 'Compact urban crossbody pouches.',
  },
  {
    id: '11111111-1111-4111-8111-111111111103',
    name: 'Textured',
    slug: 'textured',
    image_path: '/images/categories/cat-tile-textured.png',
    sort_order: 30,
    seo_title: 'Textured | GoVibe',
    seo_description: 'Ribbed, woven, and checkered carries.',
  },
  {
    id: '11111111-1111-4111-8111-111111111104',
    name: 'Camera Bags',
    slug: 'camera-bags',
    image_path: '/images/categories/cat-tile-camera.png',
    sort_order: 40,
    seo_title: 'Camera Bags | GoVibe',
    seo_description: 'Novelty camera-shaped crossbodies.',
  },
  {
    id: '11111111-1111-4111-8111-111111111105',
    name: 'Slings',
    slug: 'slings',
    image_path: '/images/categories/cat-tile-slings.png',
    sort_order: 50,
    seo_title: 'Slings | GoVibe',
    seo_description: 'Soft everyday sling pouches.',
  },
  {
    id: '11111111-1111-4111-8111-111111111106',
    name: 'EDC',
    slug: 'edc',
    image_path: '/images/categories/cat-tile-edc.png',
    sort_order: 60,
    seo_title: 'EDC | GoVibe',
    seo_description: 'Everyday carry essentials.',
  },
]

const products = [
  {
    id: '22222222-2222-4222-8222-222222222201',
    category_id: '11111111-1111-4111-8111-111111111101',
    name: 'Apex Hardshell Crossbody',
    slug: 'apex-hardshell-crossbody',
    description:
      'Matte black rigid box pouch with clean lines. Phone, cards, keys — your everyday GoVibe signature.',
    price: 2490,
    compare_at: null,
    weight_kg: 0.35,
    rating: 4.9,
    reviews_count: 128,
    badge: 'Bestseller',
    featured: true,
    media: '/images/products/product-apex-hardshell.png',
    color: 'Black',
    color_hex: '#0A0A0A',
    sku: 'APEXHARD-OS',
    related: [
      '22222222-2222-4222-8222-222222222206',
      '22222222-2222-4222-8222-222222222209',
    ],
  },
  {
    id: '22222222-2222-4222-8222-222222222202',
    category_id: '11111111-1111-4111-8111-111111111103',
    name: 'Pulse Ribbed Crossbody',
    slug: 'pulse-ribbed-crossbody',
    description:
      'Diagonal-grooved hardshell with luggage energy. Compact, rigid, and built to be seen.',
    price: 2690,
    compare_at: null,
    weight_kg: 0.38,
    rating: 4.8,
    reviews_count: 86,
    badge: 'New',
    featured: true,
    media: '/images/products/product-pulse-ribbed.png',
    color: 'Black',
    color_hex: '#111111',
    sku: 'PULSERIB-OS',
    related: [
      '22222222-2222-4222-8222-222222222201',
      '22222222-2222-4222-8222-222222222204',
    ],
  },
  {
    id: '22222222-2222-4222-8222-222222222203',
    category_id: '11111111-1111-4111-8111-111111111102',
    name: 'Weave Urban Crossbody',
    slug: 'weave-urban-crossbody',
    description:
      'Woven leather-look pouch with soft structure. Street texture without the bulk.',
    price: 2590,
    compare_at: null,
    weight_kg: 0.32,
    rating: 4.7,
    reviews_count: 204,
    badge: 'Bestseller',
    featured: true,
    media: '/images/products/product-weave-crossbody.png',
    color: 'Black',
    color_hex: '#121212',
    sku: 'WEAVEURB-OS',
    related: [],
  },
  {
    id: '22222222-2222-4222-8222-222222222204',
    category_id: '11111111-1111-4111-8111-111111111103',
    name: 'Checker Stealth Crossbody',
    slug: 'checker-stealth-crossbody',
    description:
      'Tonal black checkerboard pouch. Quiet flex for campus and café runs.',
    price: 2790,
    compare_at: 3190,
    weight_kg: 0.34,
    rating: 4.6,
    reviews_count: 61,
    badge: 'Sale',
    featured: true,
    media: '/images/products/product-checker-stealth.png',
    color: 'Stealth',
    color_hex: '#1A1A1A',
    sku: 'CHECKERS-OS',
    related: [],
  },
  {
    id: '22222222-2222-4222-8222-222222222205',
    category_id: '11111111-1111-4111-8111-111111111102',
    name: 'Cognac Box Crossbody',
    slug: 'cognac-box-crossbody',
    description:
      'Warm cognac structured box pouch. Compact colour hit for everyday EDC.',
    price: 2590,
    compare_at: null,
    weight_kg: 0.33,
    rating: 4.8,
    reviews_count: 47,
    badge: 'New',
    featured: true,
    media: '/images/products/product-cognac-box.png',
    color: 'Cognac',
    color_hex: '#8B5A2B',
    sku: 'COGNACBO-OS',
    related: [],
  },
  {
    id: '22222222-2222-4222-8222-222222222206',
    category_id: '11111111-1111-4111-8111-111111111101',
    name: 'Frost Matte Crossbody',
    slug: 'frost-matte-crossbody',
    description:
      'Matte white hardshell with black strap contrast. Clean, loud, unmistakably GoVibe.',
    price: 2490,
    compare_at: null,
    weight_kg: 0.35,
    rating: 4.9,
    reviews_count: 152,
    badge: 'Bestseller',
    featured: true,
    media: '/images/products/product-frost-matte.png',
    color: 'White',
    color_hex: '#F2F2F2',
    sku: 'FROSTMAT-OS',
    related: [],
  },
  {
    id: '22222222-2222-4222-8222-222222222207',
    category_id: '11111111-1111-4111-8111-111111111104',
    name: 'Lens Camera Crossbody',
    slug: 'lens-camera-crossbody',
    description:
      'Novelty camera-shaped hard pouch with circular front lens detail. Conversation piece, daily carry.',
    price: 2890,
    compare_at: null,
    weight_kg: 0.4,
    rating: 4.4,
    reviews_count: 38,
    badge: null,
    featured: true,
    media: '/images/products/product-lens-camera.png',
    color: 'Black',
    color_hex: '#0A0A0A',
    sku: 'LENSCAME-OS',
    related: [],
  },
  {
    id: '22222222-2222-4222-8222-222222222208',
    category_id: '11111111-1111-4111-8111-111111111105',
    name: 'Drift Soft Sling',
    slug: 'drift-soft-sling',
    description:
      'Soft black rectangular sling pouch. Wear it front or side — light, flat, always on.',
    price: 1990,
    compare_at: 2390,
    weight_kg: 0.28,
    rating: 4.7,
    reviews_count: 74,
    badge: 'Sale',
    featured: false,
    media: '/images/products/product-drift-sling.png',
    color: 'Black',
    color_hex: '#0A0A0A',
    sku: 'DRIFTSOF-OS',
    related: [],
  },
  {
    id: '22222222-2222-4222-8222-222222222209',
    category_id: '11111111-1111-4111-8111-111111111101',
    name: 'Capsule Mini Case',
    slug: 'capsule-mini-case',
    description:
      'Mini suitcase-style hardshell with raised front panels. Tiny luggage energy for the city.',
    price: 2990,
    compare_at: null,
    weight_kg: 0.42,
    rating: 4.6,
    reviews_count: 88,
    badge: 'New',
    featured: true,
    media: '/images/products/product-capsule-case.png',
    color: 'Black',
    color_hex: '#0A0A0A',
    sku: 'CAPSULEM-OS',
    related: [],
  },
]

const mediaIds = [
  '33333333-3333-4333-8333-333333333301',
  '33333333-3333-4333-8333-333333333302',
  '33333333-3333-4333-8333-333333333303',
  '33333333-3333-4333-8333-333333333304',
  '33333333-3333-4333-8333-333333333305',
  '33333333-3333-4333-8333-333333333306',
  '33333333-3333-4333-8333-333333333307',
  '33333333-3333-4333-8333-333333333308',
  '33333333-3333-4333-8333-333333333309',
]

async function main() {
  for (const cat of categories) {
    const { error } = await supabase
      .from('categories')
      .update({
        name: cat.name,
        slug: cat.slug,
        image_path: cat.image_path,
        sort_order: cat.sort_order,
        seo_title: cat.seo_title,
        seo_description: cat.seo_description,
        active: true,
      })
      .eq('id', cat.id)
    if (error) throw new Error(`category ${cat.slug}: ${error.message}`)
  }
  console.log('Updated categories')

  for (let i = 0; i < products.length; i++) {
    const p = products[i]
    const { error } = await supabase
      .from('products')
      .update({
        category_id: p.category_id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        compare_at: p.compare_at,
        weight_kg: p.weight_kg,
        rating: p.rating,
        reviews_count: p.reviews_count,
        badge: p.badge,
        featured: p.featured,
        active: true,
        requires_size: false,
        related_product_ids: p.related,
        seo_title: `${p.name} | GoVibe`,
        seo_description: p.description.slice(0, 120),
      })
      .eq('id', p.id)
    if (error) throw new Error(`product ${p.slug}: ${error.message}`)

    const { error: mediaError } = await supabase
      .from('product_media')
      .update({ storage_path: p.media, alt: p.name })
      .eq('id', mediaIds[i])
    if (mediaError) throw new Error(`media ${p.slug}: ${mediaError.message}`)
  }
  console.log('Updated products + media')

  const productIds = products.map((p) => p.id)
  const { error: delError } = await supabase
    .from('product_variants')
    .delete()
    .in('product_id', productIds)
  if (delError) throw new Error(`delete variants: ${delError.message}`)

  const { error: varError } = await supabase.from('product_variants').insert(
    products.map((p) => ({
      product_id: p.id,
      size_eu: 0,
      color: p.color,
      color_hex: p.color_hex,
      sku: p.sku,
      stock: 18,
      active: true,
    })),
  )
  if (varError) throw new Error(`insert variants: ${varError.message}`)
  console.log('Replaced variants')

  for (const key of ['home', 'about', 'site']) {
    const { error } = await supabase
      .from('site_pages')
      .update({ content: {} })
      .eq('page_key', key)
    if (error) throw new Error(`site_pages ${key}: ${error.message}`)
  }
  console.log('Cleared site CMS overrides')
  console.log('Done')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
