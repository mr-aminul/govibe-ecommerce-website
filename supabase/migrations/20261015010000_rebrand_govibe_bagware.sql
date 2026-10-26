-- Rebrand seed catalog from Viable footwear → GoVibe bagware.
-- Updates fixed-UUID seed rows in place and resets site CMS copy to defaults.

-- Categories
update public.categories set
  name = 'Totes',
  slug = 'totes',
  image_path = '/images/categories/cat-tile-totes.png',
  seo_title = 'Totes | GoVibe',
  seo_description = 'Everyday and structured tote bags.',
  sort_order = 10,
  active = true,
  updated_at = now()
where id = '11111111-1111-4111-8111-111111111101';

update public.categories set
  name = 'Crossbody',
  slug = 'crossbody',
  image_path = '/images/categories/cat-tile-crossbody.png',
  seo_title = 'Crossbody | GoVibe',
  seo_description = 'Hands-free crossbody bags.',
  sort_order = 20,
  active = true,
  updated_at = now()
where id = '11111111-1111-4111-8111-111111111102';

update public.categories set
  name = 'Backpacks',
  slug = 'backpacks',
  image_path = '/images/categories/cat-tile-backpacks.png',
  seo_title = 'Backpacks | GoVibe',
  seo_description = 'Urban daypacks and backpacks.',
  sort_order = 30,
  active = true,
  updated_at = now()
where id = '11111111-1111-4111-8111-111111111103';

update public.categories set
  name = 'Shoulder Bags',
  slug = 'shoulder-bags',
  image_path = '/images/categories/cat-tile-shoulder.png',
  seo_title = 'Shoulder Bags | GoVibe',
  seo_description = 'Statement shoulder bags.',
  sort_order = 40,
  active = true,
  updated_at = now()
where id = '11111111-1111-4111-8111-111111111104';

update public.categories set
  name = 'Clutches',
  slug = 'clutches',
  image_path = '/images/categories/cat-tile-clutches.png',
  seo_title = 'Clutches | GoVibe',
  seo_description = 'Mini clutches and evening bags.',
  sort_order = 50,
  active = true,
  updated_at = now()
where id = '11111111-1111-4111-8111-111111111105';

update public.categories set
  name = 'Lifestyle',
  slug = 'lifestyle',
  image_path = '/images/categories/cat-tile-lifestyle.png',
  seo_title = 'Lifestyle | GoVibe',
  seo_description = 'Belts, slings, and lifestyle carries.',
  sort_order = 60,
  active = true,
  updated_at = now()
where id = '11111111-1111-4111-8111-111111111106';

-- Products (one-size bags)
update public.products set
  category_id = '11111111-1111-4111-8111-111111111101',
  name = 'Midnight City Tote',
  slug = 'midnight-city-tote',
  description = 'Structured black tote with clean lines and room for a laptop. Your everyday GoVibe signature carry.',
  price = 3490,
  compare_at = null,
  weight_kg = 0.65,
  rating = 4.9,
  reviews_count = 128,
  badge = 'Bestseller',
  featured = true,
  active = true,
  requires_size = false,
  related_product_ids = array['22222222-2222-4222-8222-222222222206'::uuid, '22222222-2222-4222-8222-222222222204'::uuid],
  seo_title = 'Midnight City Tote | GoVibe',
  seo_description = 'Structured black tote — bold, roomy, built for Dhaka.',
  updated_at = now()
where id = '22222222-2222-4222-8222-222222222201';

update public.products set
  category_id = '11111111-1111-4111-8111-111111111102',
  name = 'Pulse Crossbody',
  slug = 'pulse-crossbody',
  description = 'Compact crossbody with adjustable strap and secure zip. Hands-free style for campus and café runs.',
  price = 2890,
  compare_at = null,
  weight_kg = 0.4,
  rating = 4.8,
  reviews_count = 86,
  badge = 'New',
  featured = true,
  active = true,
  requires_size = false,
  related_product_ids = array['22222222-2222-4222-8222-222222222207'::uuid, '22222222-2222-4222-8222-222222222208'::uuid],
  seo_title = 'Pulse Crossbody | GoVibe',
  seo_description = 'Compact crossbody bag for everyday motion.',
  updated_at = now()
where id = '22222222-2222-4222-8222-222222222202';

update public.products set
  category_id = '11111111-1111-4111-8111-111111111103',
  name = 'Ridge Daypack',
  slug = 'ridge-daypack',
  description = 'Matte black urban daypack with padded back and quick-access pocket. Built for full Dhaka days.',
  price = 4290,
  compare_at = null,
  weight_kg = 0.85,
  rating = 4.7,
  reviews_count = 204,
  badge = 'Bestseller',
  featured = true,
  active = true,
  requires_size = false,
  related_product_ids = '{}',
  seo_title = 'Ridge Daypack | GoVibe',
  seo_description = 'Urban black daypack from GoVibe.',
  updated_at = now()
where id = '22222222-2222-4222-8222-222222222203';

update public.products set
  category_id = '11111111-1111-4111-8111-111111111104',
  name = 'Noir Shoulder Bag',
  slug = 'noir-shoulder-bag',
  description = 'Sculptural shoulder bag with chain strap. Evening-ready polish with daytime edge.',
  price = 3990,
  compare_at = 4590,
  weight_kg = 0.55,
  rating = 4.6,
  reviews_count = 61,
  badge = 'Sale',
  featured = true,
  active = true,
  requires_size = false,
  related_product_ids = '{}',
  seo_title = 'Noir Shoulder Bag | GoVibe',
  seo_description = 'Statement shoulder bag with chain strap.',
  updated_at = now()
where id = '22222222-2222-4222-8222-222222222204';

update public.products set
  category_id = '11111111-1111-4111-8111-111111111105',
  name = 'Skyline Mini Clutch',
  slug = 'skyline-mini-clutch',
  description = 'Minimal mini clutch for nights out — phone, cards, lipstick, done.',
  price = 1990,
  compare_at = null,
  weight_kg = 0.25,
  rating = 4.8,
  reviews_count = 47,
  badge = 'New',
  featured = true,
  active = true,
  requires_size = false,
  related_product_ids = '{}',
  seo_title = 'Skyline Mini Clutch | GoVibe',
  seo_description = 'Minimal black mini clutch from GoVibe.',
  updated_at = now()
where id = '22222222-2222-4222-8222-222222222205';

update public.products set
  category_id = '11111111-1111-4111-8111-111111111101',
  name = 'Harbor Canvas Tote',
  slug = 'harbor-canvas-tote',
  description = 'Cream-and-black canvas shopper with leather handles. Soft structure, hard to miss.',
  price = 2690,
  compare_at = null,
  weight_kg = 0.5,
  rating = 4.9,
  reviews_count = 152,
  badge = 'Bestseller',
  featured = true,
  active = true,
  requires_size = false,
  related_product_ids = '{}',
  seo_title = 'Harbor Canvas Tote | GoVibe',
  seo_description = 'Cream canvas tote for everyday errands.',
  updated_at = now()
where id = '22222222-2222-4222-8222-222222222206';

update public.products set
  category_id = '11111111-1111-4111-8111-111111111106',
  name = 'Vista Sling Bag',
  slug = 'vista-sling-bag',
  description = 'Charcoal sling that sits clean across the body. Lightweight, street-ready, always on.',
  price = 2490,
  compare_at = null,
  weight_kg = 0.35,
  rating = 4.4,
  reviews_count = 38,
  badge = null,
  featured = true,
  active = true,
  requires_size = false,
  related_product_ids = '{}',
  seo_title = 'Vista Sling Bag | GoVibe',
  seo_description = 'Charcoal sling bag for city streets.',
  updated_at = now()
where id = '22222222-2222-4222-8222-222222222207';

update public.products set
  category_id = '11111111-1111-4111-8111-111111111106',
  name = 'Drift Belt Bag',
  slug = 'drift-belt-bag',
  description = 'Matte black belt bag with silver zip. Wear it front or side — your move.',
  price = 2190,
  compare_at = 2590,
  weight_kg = 0.3,
  rating = 4.7,
  reviews_count = 74,
  badge = 'Sale',
  featured = false,
  active = true,
  requires_size = false,
  related_product_ids = '{}',
  seo_title = 'Drift Belt Bag | GoVibe',
  seo_description = 'Matte black belt bag — compact everyday carry.',
  updated_at = now()
where id = '22222222-2222-4222-8222-222222222208';

update public.products set
  category_id = '11111111-1111-4111-8111-111111111103',
  name = 'Ember Weekender',
  slug = 'ember-weekender',
  description = 'Overnight duffel with short handles and detachable strap. Weekend energy, weekday polish.',
  price = 5490,
  compare_at = null,
  weight_kg = 1.1,
  rating = 4.6,
  reviews_count = 88,
  badge = 'New',
  featured = true,
  active = true,
  requires_size = false,
  related_product_ids = '{}',
  seo_title = 'Ember Weekender | GoVibe',
  seo_description = 'Black weekender duffel for short trips.',
  updated_at = now()
where id = '22222222-2222-4222-8222-222222222209';

-- Media paths
update public.product_media set storage_path = '/images/products/product-midnight-tote.png', alt = 'Midnight City Tote'
where id = '33333333-3333-4333-8333-333333333301';
update public.product_media set storage_path = '/images/products/product-pulse-crossbody.png', alt = 'Pulse Crossbody'
where id = '33333333-3333-4333-8333-333333333302';
update public.product_media set storage_path = '/images/products/product-ridge-daypack.png', alt = 'Ridge Daypack'
where id = '33333333-3333-4333-8333-333333333303';
update public.product_media set storage_path = '/images/products/product-noir-shoulder.png', alt = 'Noir Shoulder Bag'
where id = '33333333-3333-4333-8333-333333333304';
update public.product_media set storage_path = '/images/products/product-skyline-clutch.png', alt = 'Skyline Mini Clutch'
where id = '33333333-3333-4333-8333-333333333305';
update public.product_media set storage_path = '/images/products/product-harbor-tote.png', alt = 'Harbor Canvas Tote'
where id = '33333333-3333-4333-8333-333333333306';
update public.product_media set storage_path = '/images/products/product-vista-sling.png', alt = 'Vista Sling Bag'
where id = '33333333-3333-4333-8333-333333333307';
update public.product_media set storage_path = '/images/products/product-drift-belt.png', alt = 'Drift Belt Bag'
where id = '33333333-3333-4333-8333-333333333308';
update public.product_media set storage_path = '/images/products/product-ember-weekender.png', alt = 'Ember Weekender'
where id = '33333333-3333-4333-8333-333333333309';

-- Replace footwear size variants with one-size colourways
delete from public.product_variants
where product_id in (
  '22222222-2222-4222-8222-222222222201',
  '22222222-2222-4222-8222-222222222202',
  '22222222-2222-4222-8222-222222222203',
  '22222222-2222-4222-8222-222222222204',
  '22222222-2222-4222-8222-222222222205',
  '22222222-2222-4222-8222-222222222206',
  '22222222-2222-4222-8222-222222222207',
  '22222222-2222-4222-8222-222222222208',
  '22222222-2222-4222-8222-222222222209'
);

insert into public.product_variants (product_id, size_eu, color, color_hex, sku, stock, active)
values
  ('22222222-2222-4222-8222-222222222201', 0, 'Black', '#0A0A0A', 'MIDNIGHT-OS', 18, true),
  ('22222222-2222-4222-8222-222222222202', 0, 'Black', '#111111', 'PULSECRO-OS', 18, true),
  ('22222222-2222-4222-8222-222222222203', 0, 'Black', '#0A0A0A', 'RIDGEDAY-OS', 18, true),
  ('22222222-2222-4222-8222-222222222204', 0, 'Noir', '#121212', 'NOIRSHOU-OS', 18, true),
  ('22222222-2222-4222-8222-222222222205', 0, 'Black', '#0A0A0A', 'SKYLINEM-OS', 18, true),
  ('22222222-2222-4222-8222-222222222206', 0, 'Cream', '#E8E4DC', 'HARBORCA-OS', 18, true),
  ('22222222-2222-4222-8222-222222222207', 0, 'Charcoal', '#3A3A3A', 'VISTASLI-OS', 18, true),
  ('22222222-2222-4222-8222-222222222208', 0, 'Black', '#0A0A0A', 'DRIFTBEL-OS', 18, true),
  ('22222222-2222-4222-8222-222222222209', 0, 'Black', '#0A0A0A', 'EMBERWEE-OS', 18, true)
on conflict (product_id, size_eu, color) do update set
  color_hex = excluded.color_hex,
  sku = excluded.sku,
  stock = excluded.stock,
  active = excluded.active;

-- Clear CMS overrides so app defaults (GoVibe bagware copy) take effect
update public.site_pages
set content = '{}'::jsonb,
    updated_at = now()
where page_key in ('home', 'about', 'site');
