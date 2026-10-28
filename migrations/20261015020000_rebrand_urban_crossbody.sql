-- Pivot catalog imagery + copy to urban crossbody / tech pouch niche.

update public.categories set
  name = 'Hardshell', slug = 'hardshell',
  image_path = '/images/categories/cat-tile-hardshell.png',
  seo_title = 'Hardshell | GoVibe',
  seo_description = 'Rigid boxy hardshell crossbodies.',
  sort_order = 10, active = true
where id = '11111111-1111-4111-8111-111111111101';

update public.categories set
  name = 'Crossbody', slug = 'crossbody',
  image_path = '/images/categories/cat-tile-crossbody.png',
  seo_title = 'Crossbody | GoVibe',
  seo_description = 'Compact urban crossbody pouches.',
  sort_order = 20, active = true
where id = '11111111-1111-4111-8111-111111111102';

update public.categories set
  name = 'Textured', slug = 'textured',
  image_path = '/images/categories/cat-tile-textured.png',
  seo_title = 'Textured | GoVibe',
  seo_description = 'Ribbed, woven, and checkered carries.',
  sort_order = 30, active = true
where id = '11111111-1111-4111-8111-111111111103';

update public.categories set
  name = 'Camera Bags', slug = 'camera-bags',
  image_path = '/images/categories/cat-tile-camera.png',
  seo_title = 'Camera Bags | GoVibe',
  seo_description = 'Novelty camera-shaped crossbodies.',
  sort_order = 40, active = true
where id = '11111111-1111-4111-8111-111111111104';

update public.categories set
  name = 'Slings', slug = 'slings',
  image_path = '/images/categories/cat-tile-slings.png',
  seo_title = 'Slings | GoVibe',
  seo_description = 'Soft everyday sling pouches.',
  sort_order = 50, active = true
where id = '11111111-1111-4111-8111-111111111105';

update public.categories set
  name = 'EDC', slug = 'edc',
  image_path = '/images/categories/cat-tile-edc.png',
  seo_title = 'EDC | GoVibe',
  seo_description = 'Everyday carry essentials.',
  sort_order = 60, active = true
where id = '11111111-1111-4111-8111-111111111106';

update public.products set
  category_id = '11111111-1111-4111-8111-111111111101',
  name = 'Apex Hardshell Crossbody', slug = 'apex-hardshell-crossbody',
  description = 'Matte black rigid box pouch with clean lines. Phone, cards, keys — your everyday GoVibe signature.',
  price = 2490, compare_at = null, weight_kg = 0.35, rating = 4.9, reviews_count = 128,
  badge = 'Bestseller', featured = true, active = true, requires_size = false,
  related_product_ids = array['22222222-2222-4222-8222-222222222206'::uuid, '22222222-2222-4222-8222-222222222209'::uuid],
  seo_title = 'Apex Hardshell Crossbody | GoVibe',
  seo_description = 'Matte black hardshell crossbody pouch.'
where id = '22222222-2222-4222-8222-222222222201';

update public.products set
  category_id = '11111111-1111-4111-8111-111111111103',
  name = 'Pulse Ribbed Crossbody', slug = 'pulse-ribbed-crossbody',
  description = 'Diagonal-grooved hardshell with luggage energy. Compact, rigid, and built to be seen.',
  price = 2690, compare_at = null, weight_kg = 0.38, rating = 4.8, reviews_count = 86,
  badge = 'New', featured = true, active = true, requires_size = false,
  related_product_ids = array['22222222-2222-4222-8222-222222222201'::uuid, '22222222-2222-4222-8222-222222222204'::uuid],
  seo_title = 'Pulse Ribbed Crossbody | GoVibe',
  seo_description = 'Ribbed hardshell urban crossbody.'
where id = '22222222-2222-4222-8222-222222222202';

update public.products set
  category_id = '11111111-1111-4111-8111-111111111102',
  name = 'Weave Urban Crossbody', slug = 'weave-urban-crossbody',
  description = 'Woven leather-look pouch with soft structure. Street texture without the bulk.',
  price = 2590, compare_at = null, weight_kg = 0.32, rating = 4.7, reviews_count = 204,
  badge = 'Bestseller', featured = true, active = true, requires_size = false,
  related_product_ids = '{}',
  seo_title = 'Weave Urban Crossbody | GoVibe',
  seo_description = 'Woven textured compact crossbody.'
where id = '22222222-2222-4222-8222-222222222203';

update public.products set
  category_id = '11111111-1111-4111-8111-111111111103',
  name = 'Checker Stealth Crossbody', slug = 'checker-stealth-crossbody',
  description = 'Tonal black checkerboard pouch. Quiet flex for campus and café runs.',
  price = 2790, compare_at = 3190, weight_kg = 0.34, rating = 4.6, reviews_count = 61,
  badge = 'Sale', featured = true, active = true, requires_size = false,
  related_product_ids = '{}',
  seo_title = 'Checker Stealth Crossbody | GoVibe',
  seo_description = 'Checkerboard patterned crossbody pouch.'
where id = '22222222-2222-4222-8222-222222222204';

update public.products set
  category_id = '11111111-1111-4111-8111-111111111102',
  name = 'Cognac Box Crossbody', slug = 'cognac-box-crossbody',
  description = 'Warm cognac structured box pouch. Compact colour hit for everyday EDC.',
  price = 2590, compare_at = null, weight_kg = 0.33, rating = 4.8, reviews_count = 47,
  badge = 'New', featured = true, active = true, requires_size = false,
  related_product_ids = '{}',
  seo_title = 'Cognac Box Crossbody | GoVibe',
  seo_description = 'Cognac tan compact crossbody pouch.'
where id = '22222222-2222-4222-8222-222222222205';

update public.products set
  category_id = '11111111-1111-4111-8111-111111111101',
  name = 'Frost Matte Crossbody', slug = 'frost-matte-crossbody',
  description = 'Matte white hardshell with black strap contrast. Clean, loud, unmistakably GoVibe.',
  price = 2490, compare_at = null, weight_kg = 0.35, rating = 4.9, reviews_count = 152,
  badge = 'Bestseller', featured = true, active = true, requires_size = false,
  related_product_ids = '{}',
  seo_title = 'Frost Matte Crossbody | GoVibe',
  seo_description = 'Matte white hardshell crossbody.'
where id = '22222222-2222-4222-8222-222222222206';

update public.products set
  category_id = '11111111-1111-4111-8111-111111111104',
  name = 'Lens Camera Crossbody', slug = 'lens-camera-crossbody',
  description = 'Novelty camera-shaped hard pouch with circular front lens detail. Conversation piece, daily carry.',
  price = 2890, compare_at = null, weight_kg = 0.4, rating = 4.4, reviews_count = 38,
  badge = null, featured = true, active = true, requires_size = false,
  related_product_ids = '{}',
  seo_title = 'Lens Camera Crossbody | GoVibe',
  seo_description = 'Camera-shaped novelty crossbody bag.'
where id = '22222222-2222-4222-8222-222222222207';

update public.products set
  category_id = '11111111-1111-4111-8111-111111111105',
  name = 'Drift Soft Sling', slug = 'drift-soft-sling',
  description = 'Soft black rectangular sling pouch. Wear it front or side — light, flat, always on.',
  price = 1990, compare_at = 2390, weight_kg = 0.28, rating = 4.7, reviews_count = 74,
  badge = 'Sale', featured = false, active = true, requires_size = false,
  related_product_ids = '{}',
  seo_title = 'Drift Soft Sling | GoVibe',
  seo_description = 'Soft black everyday sling pouch.'
where id = '22222222-2222-4222-8222-222222222208';

update public.products set
  category_id = '11111111-1111-4111-8111-111111111101',
  name = 'Capsule Mini Case', slug = 'capsule-mini-case',
  description = 'Mini suitcase-style hardshell with raised front panels. Tiny luggage energy for the city.',
  price = 2990, compare_at = null, weight_kg = 0.42, rating = 4.6, reviews_count = 88,
  badge = 'New', featured = true, active = true, requires_size = false,
  related_product_ids = '{}',
  seo_title = 'Capsule Mini Case | GoVibe',
  seo_description = 'Mini suitcase-style hardshell crossbody.'
where id = '22222222-2222-4222-8222-222222222209';

update public.product_media set storage_path = '/images/products/product-apex-hardshell.png', alt = 'Apex Hardshell Crossbody'
where id = '33333333-3333-4333-8333-333333333301';
update public.product_media set storage_path = '/images/products/product-pulse-ribbed.png', alt = 'Pulse Ribbed Crossbody'
where id = '33333333-3333-4333-8333-333333333302';
update public.product_media set storage_path = '/images/products/product-weave-crossbody.png', alt = 'Weave Urban Crossbody'
where id = '33333333-3333-4333-8333-333333333303';
update public.product_media set storage_path = '/images/products/product-checker-stealth.png', alt = 'Checker Stealth Crossbody'
where id = '33333333-3333-4333-8333-333333333304';
update public.product_media set storage_path = '/images/products/product-cognac-box.png', alt = 'Cognac Box Crossbody'
where id = '33333333-3333-4333-8333-333333333305';
update public.product_media set storage_path = '/images/products/product-frost-matte.png', alt = 'Frost Matte Crossbody'
where id = '33333333-3333-4333-8333-333333333306';
update public.product_media set storage_path = '/images/products/product-lens-camera.png', alt = 'Lens Camera Crossbody'
where id = '33333333-3333-4333-8333-333333333307';
update public.product_media set storage_path = '/images/products/product-drift-sling.png', alt = 'Drift Soft Sling'
where id = '33333333-3333-4333-8333-333333333308';
update public.product_media set storage_path = '/images/products/product-capsule-case.png', alt = 'Capsule Mini Case'
where id = '33333333-3333-4333-8333-333333333309';

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
  ('22222222-2222-4222-8222-222222222201', 0, 'Black', '#0A0A0A', 'APEXHARD-OS', 18, true),
  ('22222222-2222-4222-8222-222222222202', 0, 'Black', '#111111', 'PULSERIB-OS', 18, true),
  ('22222222-2222-4222-8222-222222222203', 0, 'Black', '#121212', 'WEAVEURB-OS', 18, true),
  ('22222222-2222-4222-8222-222222222204', 0, 'Stealth', '#1A1A1A', 'CHECKERS-OS', 18, true),
  ('22222222-2222-4222-8222-222222222205', 0, 'Cognac', '#8B5A2B', 'COGNACBO-OS', 18, true),
  ('22222222-2222-4222-8222-222222222206', 0, 'White', '#F2F2F2', 'FROSTMAT-OS', 18, true),
  ('22222222-2222-4222-8222-222222222207', 0, 'Black', '#0A0A0A', 'LENSCAME-OS', 18, true),
  ('22222222-2222-4222-8222-222222222208', 0, 'Black', '#0A0A0A', 'DRIFTSOF-OS', 18, true),
  ('22222222-2222-4222-8222-222222222209', 0, 'Black', '#0A0A0A', 'CAPSULEM-OS', 18, true)
on conflict (product_id, size_eu, color) do update set
  color_hex = excluded.color_hex,
  sku = excluded.sku,
  stock = excluded.stock,
  active = excluded.active;

-- Force CMS to pick up new crossbody defaults (content version 3 in app)
update public.site_pages
set content = '{}'::jsonb
where page_key in ('home', 'about', 'site');
