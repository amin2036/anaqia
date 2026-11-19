-- =====================================================================
-- Anaqia store database (Supabase / PostgreSQL)
-- Run this whole file once in Supabase → SQL Editor → New query → Run.
-- Safe to re-run: it only creates things that don't exist yet and
-- replaces functions/policies.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------- Tables ----------------------------------------------------

create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id text primary key check (id ~ '^[a-z0-9-]+$'),
  name_en text not null,
  name_bn text not null,
  emoji text not null default '🛍️',
  hue text not null default '#8B5CF6',
  image_url text,
  sort int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key check (id ~ '^[a-z0-9-]+$'),
  category_id text not null references public.categories (id) on update cascade on delete restrict,
  name_en text not null,
  name_bn text not null,
  description_en text not null default '',
  description_bn text not null default '',
  price int not null check (price >= 0),
  old_price int check (old_price is null or old_price >= 0),
  stock int not null default 0 check (stock >= 0),
  emoji text not null default '🛍️',
  images text[] not null default '{}',
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  badge text check (badge in ('new', 'hot')),
  tags text[] not null default '{}',
  rating numeric(2, 1) not null default 4.5 check (rating between 0 and 5),
  reviews int not null default 0 check (reviews >= 0),
  active boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists products_category_idx on public.products (category_id);

create table if not exists public.coupons (
  code text primary key check (code = upper(code)),
  type text not null check (type in ('percent', 'flat')),
  value int not null check (value > 0),
  min_order int not null default 0 check (min_order >= 0),
  active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  id int primary key default 1 check (id = 1),
  delivery_inside int not null default 60,
  delivery_outside int not null default 120,
  free_over int not null default 3000,
  store_phone text not null default '',
  store_email text not null default '',
  store_address text not null default '',
  bkash_number text not null default '',
  nagad_number text not null default '',
  facebook_url text not null default '',
  instagram_url text not null default '',
  youtube_url text not null default '',
  tiktok_url text not null default ''
);
insert into public.settings (id) values (1) on conflict (id) do nothing;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  user_id uuid references auth.users (id) on delete set null,
  customer_name text not null,
  phone text not null,
  address text not null,
  district text not null,
  note text,
  payment_method text not null check (payment_method in ('cod', 'bkash', 'nagad', 'card')),
  payment_ref text,
  status text not null default 'placed'
    check (status in ('placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled')),
  subtotal int not null,
  discount int not null default 0,
  shipping int not null,
  total int not null,
  coupon_code text,
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_created_idx on public.orders (created_at desc);
create index if not exists orders_user_idx on public.orders (user_id);

create table if not exists public.order_items (
  id bigserial primary key,
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id text references public.products (id) on update cascade on delete set null,
  name text not null,
  image text,
  price int not null,
  qty int not null check (qty > 0),
  size text,
  color text
);
create index if not exists order_items_order_idx on public.order_items (order_id);

-- ---------- Helpers ---------------------------------------------------

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

create or replace function public.touch_updated_at() returns trigger
language plpgsql set search_path = public as $$ begin new.updated_at := now(); return new; end $$;

drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();
drop trigger if exists orders_touch on public.orders;
create trigger orders_touch before update on public.orders
  for each row execute function public.touch_updated_at();

-- ---------- Public functions (called from the shop) -------------------

-- Look up one coupon without exposing the whole coupon list.
create or replace function public.get_coupon(p_code text) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object('code', code, 'type', type, 'value', value, 'min', min_order)
  from public.coupons
  where code = upper(trim(p_code)) and active and (expires_at is null or expires_at > now());
$$;

-- Places an order. Prices, discount and delivery are calculated here on the
-- server from the database, so a customer cannot change them in the browser.
create or replace function public.place_order(p jsonb) returns text
language plpgsql security definer set search_path = public as $$
declare
  v_set public.settings;
  v_coupon public.coupons;
  v_row record;
  v_sub int := 0;
  v_disc int := 0;
  v_ship int;
  v_code text;
  v_order uuid;
  v_phone text := regexp_replace(coalesce(p->>'phone', ''), '\D', '', 'g');
begin
  if coalesce(trim(p->>'name'), '') = '' or coalesce(trim(p->>'address'), '') = ''
     or coalesce(trim(p->>'district'), '') = '' then
    raise exception 'missing_fields';
  end if;
  if v_phone !~ '^(880)?01[3-9]\d{8}$' then raise exception 'invalid_phone'; end if;
  if coalesce(p->>'method', '') not in ('cod', 'bkash', 'nagad', 'card') then raise exception 'invalid_method'; end if;
  if jsonb_typeof(p->'items') <> 'array' or jsonb_array_length(p->'items') = 0 then raise exception 'empty_cart'; end if;
  if jsonb_array_length(p->'items') > 50 then raise exception 'too_many_items'; end if;

  -- validate quantities and stock (summed per product, sizes combined)
  for v_row in
    select i->>'id' as id, sum((i->>'qty')::int) as qty
    from jsonb_array_elements(p->'items') i group by 1
  loop
    if v_row.qty is null or v_row.qty < 1 or v_row.qty > 100 then raise exception 'invalid_qty'; end if;
    perform 1 from public.products where id = v_row.id and active and stock >= v_row.qty for update;
    if not found then raise exception 'out_of_stock:%', v_row.id; end if;
  end loop;

  select coalesce(sum(pr.price * (i->>'qty')::int), 0) into v_sub
  from jsonb_array_elements(p->'items') i join public.products pr on pr.id = i->>'id';

  if coalesce(p->>'coupon', '') <> '' then
    select * into v_coupon from public.coupons
    where code = upper(trim(p->>'coupon')) and active and (expires_at is null or expires_at > now());
    if found and v_sub >= v_coupon.min_order then
      v_disc := case when v_coupon.type = 'percent' then round(v_sub * v_coupon.value / 100.0)::int
                     else least(v_coupon.value, v_sub) end;
    end if;
  end if;

  select * into v_set from public.settings where id = 1;
  v_ship := case
    when v_sub - v_disc >= v_set.free_over then 0
    when p->>'district' = 'Dhaka' then v_set.delivery_inside
    else v_set.delivery_outside end;

  loop
    v_code := 'ANQ-' || (100000 + floor(random() * 900000))::int;
    exit when not exists (select 1 from public.orders where code = v_code);
  end loop;

  insert into public.orders (code, user_id, customer_name, phone, address, district, note,
      payment_method, payment_ref, subtotal, discount, shipping, total, coupon_code)
  values (v_code, auth.uid(), left(trim(p->>'name'), 120), v_phone, left(trim(p->>'address'), 500),
      left(p->>'district', 60), nullif(left(trim(coalesce(p->>'note', '')), 500), ''),
      p->>'method', nullif(left(trim(coalesce(p->>'payment_ref', '')), 120), ''),
      v_sub, v_disc, v_ship, v_sub - v_disc + v_ship,
      case when v_disc > 0 then upper(trim(p->>'coupon')) end)
  returning id into v_order;

  insert into public.order_items (order_id, product_id, name, image, price, qty, size, color)
  select v_order, pr.id, pr.name_en, pr.images[1], pr.price, (i->>'qty')::int,
         nullif(left(coalesce(i->>'size', ''), 30), ''), nullif(left(coalesce(i->>'color', ''), 30), '')
  from jsonb_array_elements(p->'items') i join public.products pr on pr.id = i->>'id';

  update public.products pr set stock = pr.stock - x.qty
  from (select i->>'id' as id, sum((i->>'qty')::int) as qty
        from jsonb_array_elements(p->'items') i group by 1) x
  where pr.id = x.id;

  return v_code;
end $$;

-- Order tracking needs the order code AND the phone number used for it.
create or replace function public.track_order(p_code text, p_phone text) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object('code', code, 'status', status, 'created_at', created_at,
                            'total', total, 'method', payment_method)
  from public.orders
  where code = upper(trim(p_code))
    and right(phone, 10) = right(regexp_replace(coalesce(p_phone, ''), '\D', '', 'g'), 10);
$$;

-- Dashboard numbers for the admin panel.
create or replace function public.admin_stats() returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare r jsonb;
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  select jsonb_build_object(
    'today_sales', coalesce(sum(total) filter (where created_at >= date_trunc('day', now() at time zone 'Asia/Dhaka') at time zone 'Asia/Dhaka' and status <> 'cancelled'), 0),
    'today_orders', count(*) filter (where created_at >= date_trunc('day', now() at time zone 'Asia/Dhaka') at time zone 'Asia/Dhaka'),
    'week_sales', coalesce(sum(total) filter (where created_at >= now() - interval '7 days' and status <> 'cancelled'), 0),
    'month_sales', coalesce(sum(total) filter (where created_at >= now() - interval '30 days' and status <> 'cancelled'), 0),
    'month_orders', count(*) filter (where created_at >= now() - interval '30 days'),
    'pending', count(*) filter (where status in ('placed', 'confirmed', 'packed')),
    'by_status', (select coalesce(jsonb_object_agg(status, n), '{}') from (select status, count(*) n from public.orders group by status) s)
  ) into r from public.orders;
  return r || jsonb_build_object(
    'products', (select count(*) from public.products),
    'low_stock', (select coalesce(jsonb_agg(jsonb_build_object('id', id, 'name', name_bn, 'stock', stock) order by stock), '[]')
                  from (select id, name_bn, stock from public.products where stock <= 5 and active order by stock limit 10) l)
  );
end $$;

-- If an admin cancels an order, put its items back in stock.
create or replace function public.restock_on_cancel() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'cancelled' and old.status <> 'cancelled' then
    update public.products pr set stock = pr.stock + x.qty
    from (select product_id, sum(qty) qty from public.order_items where order_id = new.id group by 1) x
    where pr.id = x.product_id;
  elsif old.status = 'cancelled' and new.status <> 'cancelled' then
    update public.products pr set stock = greatest(pr.stock - x.qty, 0)
    from (select product_id, sum(qty) qty from public.order_items where order_id = new.id group by 1) x
    where pr.id = x.product_id;
  end if;
  return new;
end $$;
drop trigger if exists orders_restock on public.orders;
create trigger orders_restock after update of status on public.orders
  for each row execute function public.restock_on_cancel();

revoke all on function public.place_order(jsonb) from public;
revoke all on function public.admin_stats() from public;
grant execute on function public.get_coupon(text) to anon, authenticated;
grant execute on function public.place_order(jsonb) to anon, authenticated;
grant execute on function public.track_order(text, text) to anon, authenticated;
grant execute on function public.admin_stats() to authenticated;
revoke execute on function public.admin_stats() from anon;
revoke execute on function public.restock_on_cancel() from public, anon, authenticated;
revoke execute on function public.touch_updated_at() from public, anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------- Row Level Security ----------------------------------------

alter table public.admins enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.coupons enable row level security;
alter table public.settings enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "admins read own" on public.admins;
create policy "admins read own" on public.admins for select using (user_id = auth.uid());

drop policy if exists "categories public read" on public.categories;
create policy "categories public read" on public.categories for select using (active or public.is_admin());
drop policy if exists "categories admin write" on public.categories;
create policy "categories admin write" on public.categories for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "products public read" on public.products;
create policy "products public read" on public.products for select using (active or public.is_admin());
drop policy if exists "products admin write" on public.products;
create policy "products admin write" on public.products for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "coupons admin" on public.coupons;
create policy "coupons admin" on public.coupons for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "settings public read" on public.settings;
create policy "settings public read" on public.settings for select using (true);
drop policy if exists "settings admin update" on public.settings;
create policy "settings admin update" on public.settings for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "orders own or admin read" on public.orders;
create policy "orders own or admin read" on public.orders for select
  using (public.is_admin() or (auth.uid() is not null and user_id = auth.uid()));
drop policy if exists "orders admin update" on public.orders;
create policy "orders admin update" on public.orders for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists "orders admin delete" on public.orders;
create policy "orders admin delete" on public.orders for delete using (public.is_admin());

drop policy if exists "order items own or admin read" on public.order_items;
create policy "order items own or admin read" on public.order_items for select using (
  exists (select 1 from public.orders o where o.id = order_id
          and (public.is_admin() or (auth.uid() is not null and o.user_id = auth.uid()))));

-- ---------- Image storage ---------------------------------------------

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "product images public read" on storage.objects;
create policy "product images public read" on storage.objects for select
  using (bucket_id = 'product-images');
drop policy if exists "product images admin insert" on storage.objects;
create policy "product images admin insert" on storage.objects for insert
  with check (bucket_id = 'product-images' and public.is_admin());
drop policy if exists "product images admin update" on storage.objects;
create policy "product images admin update" on storage.objects for update
  using (bucket_id = 'product-images' and public.is_admin());
drop policy if exists "product images admin delete" on storage.objects;
create policy "product images admin delete" on storage.objects for delete
  using (bucket_id = 'product-images' and public.is_admin());
