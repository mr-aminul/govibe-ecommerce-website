-- Per-product toggle: auto “You may also like” (bestsellers → rest)
-- vs manual related_product_ids picks.

alter table public.products
  add column if not exists related_products_auto boolean not null default false;

comment on column public.products.related_products_auto is
  'When true, You May Also Like ignores related_product_ids and shows top sellers then remaining catalog.';
