-- Per-product size chart image (JPEG/PNG/WebP) shown in a modal on the PDP.

alter table public.products
  add column if not exists size_chart_path text;

comment on column public.products.size_chart_path is
  'Object-store path for the product size chart image (null = none).';
