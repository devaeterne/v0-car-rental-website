import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'

const read = (path) => readFileSync(new URL('../'+path, import.meta.url), 'utf8')

test('CMS RLS is admin-only for writes; public reads require published', () => {
  const sql=read('scripts/004_xroyal_content_cms.sql')
  assert.match(sql,/alter table public\.site_settings enable row level security/)
  assert.match(sql,/alter table public\.site_pages enable row level security/)
  assert.match(sql,/site_pages_public_read[\s\S]*published = true/)
  for(const action of ['insert','update','delete']) assert.match(sql,new RegExp('site_pages_admin_'+action))
  assert.match(sql,/not is_system/)
  assert.match(sql,/System page cannot be deleted/)
})

test('admin forms check role on all content mutations', () => {
  const actions=read('app/admin/cms-actions.ts')
  for(const action of ['saveSiteSettings','saveSitePage','deleteSitePage']) {
    const from=actions.indexOf('export async function '+action)
    assert.ok(from>=0)
    assert.ok(actions.slice(from,from+190).includes('requireAdmin'))
  }
  const schema=read('lib/admin/cms-schema.ts')
  assert.match(schema,/systemSlugs/)
  assert.match(schema,/httpUrl/)
})

test('public pages use approved reads and plain text rendering', () => {
  for (const page of ['app/page.tsx','app/hakkimizda/page.tsx','app/iletisim/page.tsx','app/sayfa/[slug]/page.tsx']) {
    const source=read(page)
    assert.match(source,/getPublicPage/)
    assert.doesNotMatch(source,/dangerouslySetInnerHTML/)
  }
  for (const path of ['app/admin/(panel)/company/page.tsx','app/admin/(panel)/pages/page.tsx','app/admin/(panel)/pages/new/page.tsx','app/admin/(panel)/pages/[id]/edit/page.tsx'])
    assert.ok(existsSync(new URL('../'+path,import.meta.url)),path)
})
