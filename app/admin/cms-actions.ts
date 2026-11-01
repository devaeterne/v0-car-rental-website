'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { requireAdmin } from '@/lib/admin/auth'
import { parseCompanyForm, parseSitePage, systemSlugs } from '@/lib/admin/cms-schema'

const uuid = z.string().uuid()
const systemSlugSet = new Set<string>(systemSlugs)

function invalidatePage(slug: string) {
  revalidatePath('/')
  revalidatePath('/hakkimizda')
  revalidatePath('/iletisim')
  revalidatePath('/sayfa/' + slug)
  revalidatePath('/admin/pages')
  revalidatePath('/admin/company')
}

export async function saveSiteSettings(form: FormData) {
  const { supabase } = await requireAdmin()
  const parsed = parseCompanyForm(form)
  if (!parsed.success) redirect('/admin/company?error=validation')
  const { data, error } = await supabase.from('site_settings')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id',1).select('id').single()
  if (error || !data) redirect('/admin/company?error=save')
  invalidatePage('ana-sayfa')
  redirect('/admin/company?saved=1')
}

export async function saveSitePage(form: FormData) {
  const { supabase } = await requireAdmin()
  const id = String(form.get('id') ?? '')
  const editing = Boolean(id)
  const back = editing && uuid.safeParse(id).success ? '/admin/pages/' + id + '/edit' : '/admin/pages/new'
  if (editing && !uuid.safeParse(id).success) redirect('/admin/pages?error=invalid-id')
  const parsed = parseSitePage(form)
  if (!parsed.success) redirect(back + '?error=validation')
  if (!editing && systemSlugSet.has(parsed.data.slug)) redirect(back + '?error=slug')
  if (editing) {
    const { data: existing } = await supabase.from('site_pages')
      .select('slug,is_system').eq('id',id).maybeSingle()
    if (!existing) redirect('/admin/pages?error=not-found')
    if (existing.is_system && existing.slug !== parsed.data.slug) redirect(back + '?error=slug')
    if (!existing.is_system && systemSlugSet.has(parsed.data.slug)) redirect(back + '?error=slug')
    const payload = {
      ...parsed.data,
      published: existing.is_system ? true : parsed.data.published,
      show_in_footer: existing.is_system ? false : parsed.data.show_in_footer,
      updated_at: new Date().toISOString()
    }
    const { error } = await supabase.from('site_pages').update(payload).eq('id',id)
    if (error) redirect(back + '?error=save')
    invalidatePage(existing.slug)
    invalidatePage(payload.slug)
    redirect(back + '?saved=1')
  }
  const { data, error } = await supabase.from('site_pages')
    .insert({ ...parsed.data, is_system:false }).select('id,slug').single()
  if (error || !data) redirect(back + '?error=save')
  invalidatePage(data.slug)
  redirect('/admin/pages/' + data.id + '/edit?created=1')
}

export async function deleteSitePage(form: FormData) {
  const { supabase } = await requireAdmin()
  const id = String(form.get('id') ?? '')
  if (!uuid.safeParse(id).success) redirect('/admin/pages?error=invalid-id')
  const { data: page } = await supabase.from('site_pages')
    .select('slug,is_system').eq('id',id).maybeSingle()
  if (!page || page.is_system) redirect('/admin/pages?error=protected')
  const {data,error} = await supabase.from('site_pages').delete()
    .eq('id',id).eq('is_system',false).select('id').single()
  if (error || !data) redirect('/admin/pages?error=delete')
  invalidatePage(page.slug)
  redirect('/admin/pages?deleted=1')
}
