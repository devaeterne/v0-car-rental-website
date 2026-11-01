-- X Royal content management V1. Additive migration (no changes to cars).
begin;
create table if not exists public.site_settings (
 id integer primary key default 1 check (id = 1),
 brand_name text not null default 'X Royal Rent A Car',
 legal_name text not null default '',
 tax_number text not null default '',
 registration_number text not null default '',
 phone text not null default '+90 535 922 60 99',
 whatsapp_phone text not null default '+905359226099',
 contact_email text not null default 'info@xroyalrentacar.com',
 location_label text not null default 'Podgorica / Karadağ',
 address text not null default '',
 opening_hours text not null default '7 Gün / 24 Saat',
 map_url text not null default 'https://www.google.com/maps/place/X+Royal+Rent+a+Car/data=!4m2!3m1!1s0x0:0xdb0f0d0aeb8e23e0',
 instagram_url text not null default 'https://www.instagram.com/karadag_xroyal_rent_a_car/',
 facebook_url text not null default 'https://www.facebook.com/profile.php?id=61577019140459',
 footer_description text not null default 'Karadağ''ın (Montenegro) her noktasında lüks ve güvenli sürüş deneyimi. Modern filomuz ve VIP hizmet anlayışımızla yolculuğunuzu sanata dönüştürüyoruz.',
 updated_at timestamptz not null default now()
);
insert into public.site_settings(id) values (1) on conflict (id) do nothing;
alter table public.site_settings enable row level security;
grant select on public.site_settings to anon,authenticated;
grant update on public.site_settings to authenticated;
drop policy if exists xroyal_site_settings_public_read on public.site_settings;
create policy xroyal_site_settings_public_read on public.site_settings
for select to anon, authenticated using (true);
drop policy if exists xroyal_site_settings_admin_update on public.site_settings;
create policy xroyal_site_settings_admin_update on public.site_settings
for update to authenticated
using (exists(select 1 from public.admin_users a where a.user_id=(select auth.uid())))
with check (exists(select 1 from public.admin_users a where a.user_id=(select auth.uid())));

create table if not exists public.site_pages (
 id uuid primary key default gen_random_uuid(),
 slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 title text not null check (char_length(trim(title)) between 1 and 160),
 intro text not null default '',
 body text not null default '',
 published boolean not null default false,
 show_in_footer boolean not null default false,
 is_system boolean not null default false,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create or replace function public.xroyal_protect_site_pages()
returns trigger language plpgsql set search_path = public as $$
begin
 if tg_op = 'DELETE' then
   if old.is_system then raise exception 'System page cannot be deleted'; end if;
   return old;
 end if;
 if tg_op = 'UPDATE' and old.is_system and
   (new.slug is distinct from old.slug or new.is_system is distinct from true) then
   raise exception 'System page slug/type cannot be changed';
 end if;
 if new.slug not in ('ana-sayfa','hakkimizda','iletisim') and new.is_system then
   raise exception 'System flag reserved for built-in pages';
 end if;
 if new.slug in ('ana-sayfa','hakkimizda','iletisim') and not new.is_system then
   raise exception 'Reserved page slug';
 end if;
 new.updated_at = now();
 return new;
end $$;
drop trigger if exists xroyal_protect_site_pages on public.site_pages;
create trigger xroyal_protect_site_pages
before insert or update or delete on public.site_pages
for each row execute function public.xroyal_protect_site_pages();

insert into public.site_pages(slug,title,intro,body,published,is_system)
values
 ('ana-sayfa','Karadağ''da Premium Araç Kiralama Deneyimi',
  'X Royal Rent A Car ile Budva, Tivat ve Kotor''un tadını çıkarın. Ekonomik şehir araçlarından lüks SUV modellerine kadar geniş filomuzla hizmetinizdeyiz.','',true,true),
 ('hakkimizda','Yolculuğun Zirve Noktası',
  'X Royal Rent A Car, Karadağ''ın eşsiz coğrafyasını keşfetmeniz için tasarlanmış, prestij ve güveni birleştiren yeni nesil kiralama çözümüdür.',
  'Karadağ''ın büyüleyici başkenti Podgorica merkezli kurulan X Royal Rent A Car, bölgeye gelen misafirlerimizin en büyük ihtiyacı olan "sorunsuz mobilite" kavramını yeniden tanımlamak için yola çıktı.'||E'\n\n'||'Amacımız, ister iş seyahati ister tatil amaçlı olsun, ziyaretçilerimize Karadağ''ın her köşesini (Budva''nın sahillerinden Durmitor''un zirvelerine kadar) en konforlu araçlarla keşfetme imkanı sunmaktır.',true,true),
 ('iletisim','Bize Ulaşın',
  'Karadağ seyahatiniz için profesyonel araç kiralama çözümleri. Sorularınız, özel talepleriniz veya rezervasyon desteği için yanınızdayız.',
  'Hayalinizdeki aracı kiralamak için en hızlı yol WhatsApp üzerinden bizimle iletişime geçmektir. Ekibimiz dakikalar içinde size en uygun teklifi sunacaktır.',true,true)
on conflict(slug) do nothing;

alter table public.site_pages enable row level security;
grant select on public.site_pages to anon,authenticated;
grant insert,update,delete on public.site_pages to authenticated;
drop policy if exists xroyal_site_pages_public_read on public.site_pages;
create policy xroyal_site_pages_public_read on public.site_pages
for select to anon,authenticated using (published = true);
drop policy if exists xroyal_site_pages_admin_read on public.site_pages;
create policy xroyal_site_pages_admin_read on public.site_pages
for select to authenticated using (exists(select 1 from public.admin_users a where a.user_id=(select auth.uid())));
drop policy if exists xroyal_site_pages_admin_insert on public.site_pages;
create policy xroyal_site_pages_admin_insert on public.site_pages
for insert to authenticated
with check (not is_system and slug not in ('ana-sayfa','hakkimizda','iletisim') and
  exists(select 1 from public.admin_users a where a.user_id=(select auth.uid())));
drop policy if exists xroyal_site_pages_admin_update on public.site_pages;
create policy xroyal_site_pages_admin_update on public.site_pages
for update to authenticated
using (exists(select 1 from public.admin_users a where a.user_id=(select auth.uid())))
with check (exists(select 1 from public.admin_users a where a.user_id=(select auth.uid())));
drop policy if exists xroyal_site_pages_admin_delete on public.site_pages;
create policy xroyal_site_pages_admin_delete on public.site_pages
for delete to authenticated using (not is_system and
  exists(select 1 from public.admin_users a where a.user_id=(select auth.uid())));
commit;
