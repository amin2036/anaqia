-- Real customer reviews (verified buyers only) and live order alerts.
-- Already included in schema.sql for new installs.

create table if not exists public.product_reviews (
  id bigserial primary key,
  product_id text not null references public.products (id) on update cascade on delete cascade,
  order_id uuid references public.orders (id) on delete set null,
  name text not null check (char_length(name) between 1 and 60),
  rating int not null check (rating between 1 and 5),
  comment text not null default '' check (char_length(comment) <= 1000),
  approved boolean not null default true,
  created_at timestamptz not null default now(),
  unique (order_id, product_id)
);
create index if not exists product_reviews_product_idx on public.product_reviews (product_id, created_at desc);

alter table public.product_reviews enable row level security;
drop policy if exists "reviews public read" on public.product_reviews;
create policy "reviews public read" on public.product_reviews for select using (approved or public.is_admin());
drop policy if exists "reviews admin update" on public.product_reviews;
create policy "reviews admin update" on public.product_reviews for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists "reviews admin delete" on public.product_reviews;
create policy "reviews admin delete" on public.product_reviews for delete using (public.is_admin());

-- Keep products.rating / products.reviews equal to the real, visible reviews.
create or replace function public.refresh_product_rating() returns trigger
language plpgsql security definer set search_path = public as $$
declare pid text := coalesce(new.product_id, old.product_id);
begin
  update public.products set
    rating = coalesce((select round(avg(rating)::numeric, 1) from public.product_reviews where product_id = pid and approved), 0),
    reviews = (select count(*) from public.product_reviews where product_id = pid and approved)
  where id = pid;
  return null;
end $$;
drop trigger if exists product_reviews_rating on public.product_reviews;
create trigger product_reviews_rating after insert or update or delete on public.product_reviews
  for each row execute function public.refresh_product_rating();
revoke execute on function public.refresh_product_rating() from public, anon, authenticated;

-- A review needs the order code + phone of a (non-cancelled) order that contains the product.
-- One review per product per order; sending again updates it.
create or replace function public.submit_review(p_code text, p_phone text, p_product text, p_name text, p_rating int, p_comment text)
returns text language plpgsql security definer set search_path = public as $$
declare v_order uuid;
begin
  if p_rating is null or p_rating not between 1 and 5 then raise exception 'invalid_rating'; end if;
  if coalesce(trim(p_name), '') = '' then raise exception 'missing_fields'; end if;
  select o.id into v_order
  from public.orders o join public.order_items i on i.order_id = o.id
  where o.code = upper(trim(p_code))
    and right(o.phone, 10) = right(regexp_replace(coalesce(p_phone, ''), '\D', '', 'g'), 10)
    and i.product_id = p_product and o.status <> 'cancelled'
  limit 1;
  if v_order is null then raise exception 'not_verified'; end if;
  insert into public.product_reviews (product_id, order_id, name, rating, comment)
  values (p_product, v_order, left(trim(p_name), 60), p_rating, left(trim(coalesce(p_comment, '')), 1000))
  on conflict (order_id, product_id) do update
    set name = excluded.name, rating = excluded.rating, comment = excluded.comment, created_at = now();
  return 'ok';
end $$;
revoke all on function public.submit_review(text, text, text, text, int, text) from public;
grant execute on function public.submit_review(text, text, text, text, int, text) to anon, authenticated;

-- Remove the made-up demo ratings: ratings now come only from real reviews.
alter table public.products alter column rating set default 0;
update public.products p set
  rating = coalesce((select round(avg(rating)::numeric, 1) from public.product_reviews r where r.product_id = p.id and r.approved), 0),
  reviews = (select count(*) from public.product_reviews r where r.product_id = p.id and r.approved);

-- Live "new order" alerts in the admin panel (row security still applies).
do $$ begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'orders') then
    alter publication supabase_realtime add table public.orders;
  end if;
exception when undefined_object then null;
end $$;
