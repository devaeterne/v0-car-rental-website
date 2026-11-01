# X Royal Admin V1 — Setup and release gates

## Scope
- Same app, same domain: /admin/login, /admin, /admin/cars/new, /admin/cars/[id]/edit.
- Public XML: /feeds/cars.xml, generated fresh from active cars.
- Supabase Auth email/password; server-only username to email mapping.
- Admin writes protected by admin_users membership, RLS, and server-side auth.
- Images in a public Supabase Storage bucket (photos' URLs remain public).
- Studio Admin / Geist-inspired styling, no copied commercial theme files.

## Configuration
1. Review CURRENT live X Royal Supabase tables, especially cars and car_images.
2. Audit all existing RLS policies: multiple policies combine permissively.
3. Review scripts/003_xroyal_admin.sql, run it ONLY against the correct X Royal database after schema validation. This commit does not run SQL.
4. Create an admin via Supabase Dashboard > Authentication > Users (strong password).
5. Add the user to admin_users via trusted SQL:
   insert into public.admin_users(user_id)
   select id from auth.users where email='admin@example.com'
   on conflict(user_id) do nothing;
6. Set XROYAL_ADMIN_USERNAME and XROYAL_ADMIN_EMAIL as **server-only** Vercel env vars; no NEXT_PUBLIC prefix. Keep NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from the existing site.
7. Use strong authentication, disable public signup if not required, enable rate limits and configure Vercel WAF as appropriate.
8. Run npm ci, node --test tests/cars-xml.test.mjs, npx tsc --noEmit, npm run build.
9. Perform anonymous/non-admin/admin REST+UI acceptance tests before production release.

## Verify before release
- Anonymous /admin redirects to login; incorrect login cannot access pages or server actions.
- A valid Supabase user not in admin_users cannot insert or update cars.
- Admin can create/edit/activate/deactivate, upload/remove/change cover image.
- Inactive vehicles disappear from /, /cars, /cars/[id] and XML, with no public API bypass.
- XML special-character escaping and feed URLs are correct.
- Existing cars and car_images data preserved after migration.
- Images: JPEG, PNG, WebP <= 5 MB, 8 per car. Existing public images may remain directly accessible.
- Check Vercel Git integration automatic deployment before merging branch to main.

## Limitations
- Only one admin username configured by environment variables (user count extendable later).
- XML is a generic format, not guaranteed to satisfy a specific third-party importer.
- No bookings management or date-based availability in V1.
- Rate limiting/WAF are operational configuration, not supplied by this code.
- Audit database migration and existing policies before any live SQL. Do not use the DASOFT or ModuleX database.

## Verified XROYALPROJECT schema (2026-11-01)
Supabase project ref mfsszpjbuikwbzwpwchp: cars originally used is_available and lacked available/model/created_at/features. car_images.id is bigint identity, not uuid. Migration scripts/003_xroyal_admin.sql adds compatibility columns while preserving the original layout and syncs is_available with available. Admin image actions validate numeric identity IDs.
