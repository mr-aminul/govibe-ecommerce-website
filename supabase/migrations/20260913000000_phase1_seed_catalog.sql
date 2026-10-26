-- Phase 1 seed: GoVibe men's bag catalog.
-- Safe to re-run: uses fixed UUIDs and ON CONFLICT DO NOTHING.

insert into public.categories (id, name, slug, image_path, sort_order, active, seo_title, seo_description)
values
  ('11111111-1111-4111-8111-111111111101', 'Backpacks', 'backpacks', '/images/categories/cat-tile-backpacks.png', 10, true, 'Backpacks | GoVibe', 'Urban daypacks and everyday backpacks for men.'),
  ('11111111-1111-4111-8111-111111111102', 'Crossbody', 'crossbody', '/images/categories/cat-tile-crossbody.png', 20, true, 'Crossbody | GoVibe', 'Hands-free crossbody bags for men on the move.'),
  ('11111111-1111-4111-8111-111111111103', 'Messenger Bags', 'messenger-bags', '/images/categories/cat-tile-shoulder.png', 30, true, 'Messenger Bags | GoVibe', 'Classic messenger and shoulder bags for work and campus.'),
  ('11111111-1111-4111-8111-111111111104', 'Weekenders', 'weekenders', '/images/categories/cat-tile-lifestyle.png', 40, true, 'Weekenders | GoVibe', 'Duffels and weekender bags for short trips.'),
  ('11111111-1111-4111-8111-111111111105', 'Slings', 'slings', '/images/categories/cat-tile-slings.png', 50, true, 'Slings | GoVibe', 'Lightweight sling bags for everyday carry.'),
  ('11111111-1111-4111-8111-111111111106', 'Belt Bags', 'belt-bags', '/images/categories/cat-tile-edc.png', 60, true, 'Belt Bags | GoVibe', 'Compact belt bags and waist packs for men.')
on conflict (id) do nothing;

insert into public.products (
  id, category_id, name, slug, description, price, compare_at, weight_kg,
  rating, reviews_count, badge, featured, active, related_product_ids,
  seo_title, seo_description
)
values
  (
    '22222222-2222-4222-8222-222222222201',
    '11111111-1111-4111-8111-111111111101',
    'Ridge Daypack',
    'ridge-daypack',
    'Matte black urban daypack with padded back and quick-access pocket. Built for full Dhaka days.',
    4290, null, 0.85, 4.9, 128, 'Bestseller', true, true,
    array['22222222-2222-4222-8222-222222222204'::uuid, '22222222-2222-4222-8222-222222222203'::uuid],
    'Ridge Daypack | GoVibe',
    'Urban black daypack for men from GoVibe.'
  ),
  (
    '22222222-2222-4222-8222-222222222202',
    '11111111-1111-4111-8111-111111111102',
    'Pulse Crossbody',
    'pulse-crossbody',
    'Compact crossbody with adjustable strap and secure zip. Hands-free style for campus and café runs.',
    2890, null, 0.4, 4.8, 86, 'New', true, true,
    array['22222222-2222-4222-8222-222222222205'::uuid, '22222222-2222-4222-8222-222222222206'::uuid],
    'Pulse Crossbody | GoVibe',
    'Compact men''s crossbody bag for everyday motion.'
  ),
  (
    '22222222-2222-4222-8222-222222222203',
    '11111111-1111-4111-8111-111111111103',
    'Forge Messenger',
    'forge-messenger',
    'Structured messenger with flap closure and room for a laptop sleeve. Work-ready without the briefcase energy.',
    3990, 4590, 0.7, 4.7, 204, 'Bestseller', true, true,
    '{}',
    'Forge Messenger | GoVibe',
    'Men''s messenger bag with laptop-ready capacity.'
  ),
  (
    '22222222-2222-4222-8222-222222222204',
    '11111111-1111-4111-8111-111111111104',
    'Ember Weekender',
    'ember-weekender',
    'Overnight duffel with short handles and detachable strap. Weekend energy, weekday polish.',
    5490, null, 1.1, 4.6, 61, 'Sale', true, true,
    '{}',
    'Ember Weekender | GoVibe',
    'Black weekender duffel for short trips.'
  ),
  (
    '22222222-2222-4222-8222-222222222205',
    '11111111-1111-4111-8111-111111111105',
    'Vista Sling',
    'vista-sling',
    'Charcoal sling that sits clean across the body. Lightweight, street-ready, always on.',
    2490, null, 0.35, 4.8, 47, 'New', true, true,
    '{}',
    'Vista Sling | GoVibe',
    'Charcoal sling bag for city streets.'
  ),
  (
    '22222222-2222-4222-8222-222222222206',
    '11111111-1111-4111-8111-111111111106',
    'Drift Belt Bag',
    'drift-belt-bag',
    'Matte black belt bag with silver zip. Wear it front or side — your move.',
    2190, 2590, 0.3, 4.9, 152, 'Bestseller', true, true,
    '{}',
    'Drift Belt Bag | GoVibe',
    'Matte black belt bag — compact everyday carry.'
  ),
  (
    '22222222-2222-4222-8222-222222222207',
    '11111111-1111-4111-8111-111111111102',
    'Apex Tech Crossbody',
    'apex-tech-crossbody',
    'Rigid boxy crossbody for phone, cards, and keys. Clean lines, zero bulk.',
    2690, null, 0.38, 4.4, 38, null, true, true,
    '{}',
    'Apex Tech Crossbody | GoVibe',
    'Compact tech crossbody pouch for men.'
  ),
  (
    '22222222-2222-4222-8222-222222222208',
    '11111111-1111-4111-8111-111111111101',
    'Harbor Canvas Pack',
    'harbor-canvas-pack',
    'Cream-and-black canvas daypack with leather-look handles. Soft structure, hard to miss.',
    3490, null, 0.55, 4.7, 74, 'Sale', false, true,
    '{}',
    'Harbor Canvas Pack | GoVibe',
    'Cream canvas daypack for everyday errands.'
  ),
  (
    '22222222-2222-4222-8222-222222222209',
    '11111111-1111-4111-8111-111111111103',
    'Cognac Field Messenger',
    'cognac-field-messenger',
    'Warm cognac messenger with soft structure. Colour hit for campus and weekend markets.',
    3790, null, 0.6, 4.6, 88, 'New', true, true,
    '{}',
    'Cognac Field Messenger | GoVibe',
    'Cognac tan messenger bag for men.'
  )
on conflict (id) do nothing;

insert into public.product_media (id, product_id, media_type, storage_path, alt, sort_order)
values
  ('33333333-3333-4333-8333-333333333301', '22222222-2222-4222-8222-222222222201', 'image', '/images/products/product-ridge-daypack.png', 'Ridge Daypack', 0),
  ('33333333-3333-4333-8333-333333333302', '22222222-2222-4222-8222-222222222202', 'image', '/images/products/product-pulse-crossbody.png', 'Pulse Crossbody', 0),
  ('33333333-3333-4333-8333-333333333303', '22222222-2222-4222-8222-222222222203', 'image', '/images/products/product-noir-shoulder.png', 'Forge Messenger', 0),
  ('33333333-3333-4333-8333-333333333304', '22222222-2222-4222-8222-222222222204', 'image', '/images/products/product-ember-weekender.png', 'Ember Weekender', 0),
  ('33333333-3333-4333-8333-333333333305', '22222222-2222-4222-8222-222222222205', 'image', '/images/products/product-vista-sling.png', 'Vista Sling', 0),
  ('33333333-3333-4333-8333-333333333306', '22222222-2222-4222-8222-222222222206', 'image', '/images/products/product-drift-belt.png', 'Drift Belt Bag', 0),
  ('33333333-3333-4333-8333-333333333307', '22222222-2222-4222-8222-222222222207', 'image', '/images/products/product-apex-hardshell.png', 'Apex Tech Crossbody', 0),
  ('33333333-3333-4333-8333-333333333308', '22222222-2222-4222-8222-222222222208', 'image', '/images/products/product-harbor-tote.png', 'Harbor Canvas Pack', 0),
  ('33333333-3333-4333-8333-333333333309', '22222222-2222-4222-8222-222222222209', 'image', '/images/products/product-cognac-box.png', 'Cognac Field Messenger', 0)
on conflict (id) do nothing;

insert into public.product_variants (product_id, size_eu, color, color_hex, sku, stock, active)
values
  ('22222222-2222-4222-8222-222222222201', 0, 'Black', '#0A0A0A', 'RIDGEDAY-OS', 18, true),
  ('22222222-2222-4222-8222-222222222202', 0, 'Black', '#111111', 'PULSECRO-OS', 18, true),
  ('22222222-2222-4222-8222-222222222203', 0, 'Noir', '#121212', 'FORGEMES-OS', 18, true),
  ('22222222-2222-4222-8222-222222222204', 0, 'Black', '#0A0A0A', 'EMBERWEE-OS', 18, true),
  ('22222222-2222-4222-8222-222222222205', 0, 'Charcoal', '#3A3A3A', 'VISTASLI-OS', 18, true),
  ('22222222-2222-4222-8222-222222222206', 0, 'Black', '#0A0A0A', 'DRIFTBEL-OS', 18, true),
  ('22222222-2222-4222-8222-222222222207', 0, 'Black', '#0A0A0A', 'APEXTECH-OS', 18, true),
  ('22222222-2222-4222-8222-222222222208', 0, 'Cream', '#E8E4DC', 'HARBORCA-OS', 18, true),
  ('22222222-2222-4222-8222-222222222209', 0, 'Cognac', '#8B5A2B', 'COGNACFI-OS', 18, true)
on conflict (product_id, size_eu, color) do nothing;
