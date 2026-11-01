-- XROYALPROJECT (mfsszpjbuikwbzwpwchp) — Admin V1 schema/authorization.
-- Verified baseline 2026-11-01: cars + car_images exist, no public RLS policies, zero rows.
-- Preserve existing cars, car_images, XroyalImage bucket, and old is_available column.
begin;

alter table public.cars
  add column if not exists model text not null default '',
  add column if not exists features text[] not null default '{}',
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists available boolean not null default true;
update public.cars set available=coalesce(is_available,true)
where available is distinct from coalesce(is_available,true);

create or replace function public.xroyal_sync_available_columns()
returns trigger language plpgsql set search_path=public as $$
begin
  if TG_OP='INSERT' then
    new.is_available := new.available;
  elsif new.available is distinct from old.available then
    new.is_available := new.available;
  elsif new.is_available is distinct from old.is_available then
    new.available := coalesce(new.is_available,true);
  end if;
  return new;
end;
$$;
drop trigger if exists xroyal_sync_available_columns on public.cars;
create trigger xroyal_sync_available_columns
before insert or update on public.cars for each row
execute function public.xroyal_sync_available_columns();

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create index if not exists car_images_car_id_idx on public.car_images(car_id);

alter table public.cars enable row level security;
alter table public.car_images enable row level security;
alter table public.admin_users enable row level security;
revoke all on public.admin_users from anon,authenticated;
grant select on public.admin_users to authenticated;
grant select on public.cars to anon,authenticated;
grant insert,update on public.cars to authenticated;
grant select on public.car_images to anon,authenticated;
grant insert,update,delete on public.car_images to authenticated;

drop policy if exists "xroyal_admin_read_self" on public.admin_users;
create policy "xroyal_admin_read_self" on public.admin_users
for select to authenticated using (user_id=(select auth.uid()));

drop policy if exists "Anyone can view available cars" on public.cars;
drop policy if exists "xroyal_public_cars" on public.cars;
create policy "xroyal_public_cars" on public.cars
for select to anon,authenticated using (available=true);
drop policy if exists "xroyal_admin_cars_select" on public.cars;
create policy "xroyal_admin_cars_select" on public.cars
for select to authenticated using (
  exists (select 1 from public.admin_users a where a.user_id=(select auth.uid()))
);
drop policy if exists "xroyal_admin_cars_insert" on public.cars;
create policy "xroyal_admin_cars_insert" on public.cars
for insert to authenticated with check (
  exists (select 1 from public.admin_users a where a.user_id=(select auth.uid()))
);
drop policy if exists "xroyal_admin_cars_update" on public.cars;
create policy "xroyal_admin_cars_update" on public.cars
for update to authenticated
using (exists (select 1 from public.admin_users a where a.user_id=(select auth.uid())))
with check (exists (select 1 from public.admin_users a where a.user_id=(select auth.uid())));

drop policy if exists "xroyal_public_car_images" on public.car_images;
create policy "xroyal_public_car_images" on public.car_images
for select to anon,authenticated using (
 exists (select 1 from public.cars c where c.id=car_id and c.available=true)
);
drop policy if exists "xroyal_admin_car_images_select" on public.car_images;
create policy "xroyal_admin_car_images_select" on public.car_images
for select to authenticated using (
 exists (select 1 from public.admin_users a where a.user_id=(select auth.uid()))
);
drop policy if exists "xroyal_admin_car_images_insert" on public.car_images;
create policy "xroyal_admin_car_images_insert" on public.car_images
for insert to authenticated with check (
 exists (select 1 from public.admin_users a where a.user_id=(select auth.uid()))
);
drop policy if exists "xroyal_admin_car_images_update" on public.car_images;
create policy "xroyal_admin_car_images_update" on public.car_images
for update to authenticated
using (exists (select 1 from public.admin_users a where a.user_id=(select auth.uid())))
with check (exists (select 1 from public.admin_users a where a.user_id=(select auth.uid())));
drop policy if exists "xroyal_admin_car_images_delete" on public.car_images;
create policy "xroyal_admin_car_images_delete" on public.car_images
for delete to authenticated using (
 exists (select 1 from public.admin_users a where a.user_id=(select auth.uid()))
);

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('xroyal-car-images','xroyal-car-images',true,5242880,ARRAY['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

drop policy if exists "xroyal_admin_storage_insert" on storage.objects;
create policy "xroyal_admin_storage_insert" on storage.objects
for insert to authenticated with check (
 bucket_id='xroyal-car-images'
 and exists (select 1 from public.admin_users a where a.user_id=(select auth.uid()))
);
drop policy if exists "xroyal_admin_storage_select" on storage.objects;
create policy "xroyal_admin_storage_select" on storage.objects
for select to authenticated using (
 bucket_id='xroyal-car-images'
 and exists (select 1 from public.admin_users a where a.user_id=(select auth.uid()))
);
drop policy if exists "xroyal_admin_storage_delete" on storage.objects;
create policy "xroyal_admin_storage_delete" on storage.objects
for delete to authenticated using (
 bucket_id='xroyal-car-images'
 and exists (select 1 from public.admin_users a where a.user_id=(select auth.uid()))
);

-- Grant the explicitly selected verified user. No password stored.
insert into public.admin_users(user_id)
select id from auth.users where lower(email)=lower('info@dasoft.me')
on conflict (user_id) do nothing;

commit;
