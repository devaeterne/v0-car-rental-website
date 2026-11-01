'use server'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin/auth'
import { parseCarForm } from '@/lib/admin/car-schema'

const uuid = z.string().uuid()
const BUCKET = 'xroyal-car-images'
const MAX_PHOTO_SIZE = 5 * 1024 * 1024
function refresh(carId?: string) {
  revalidatePath('/')
  revalidatePath('/cars')
  revalidatePath('/admin')
  if (carId) revalidatePath('/cars/' + carId)
}

export async function loginAdmin(form: FormData) {
  const username = String(form.get('username') || '').trim().toLowerCase()
  const password = String(form.get('password') || '')
  const expected = process.env.XROYAL_ADMIN_USERNAME?.trim().toLowerCase()
  const email = process.env.XROYAL_ADMIN_EMAIL
  if (!expected || !email) redirect('/admin/login?error=config')
  if (username !== expected || !password) redirect('/admin/login?error=credentials')
  const client = await createClient()
  const { data, error } = await client.auth.signInWithPassword({ email, password })
  if (error || !data.user) redirect('/admin/login?error=credentials')
  const { data: member, error: accessError } = await client.from('admin_users')
    .select('user_id').eq('user_id', data.user.id).maybeSingle()
  if (accessError || !member) {
    await client.auth.signOut()
    redirect('/admin/login?error=access')
  }
  redirect('/admin')
}

export async function logoutAdmin() {
  const client = await createClient()
  await client.auth.signOut()
  redirect('/admin/login')
}

export async function saveCar(form: FormData) {
  const { supabase } = await requireAdmin()
  const idField = form.get('id')
  const id = typeof idField === 'string' && uuid.safeParse(idField).success ? idField : null
  if (idField && !id) redirect('/admin?error=invalid-id')
  const parsed = parseCarForm(form)
  const back = id ? '/admin/cars/' + id + '/edit' : '/admin/cars/new'
  if (!parsed.success) redirect(back + '?error=validation')
  const payload = { ...parsed.data, name: parsed.data.brand + ' ' + parsed.data.model }
  if (id) {
    const { data, error } = await supabase.from('cars').update(payload)
      .eq('id', id).select('id').single()
    if (error || !data) redirect(back + '?error=save')
    refresh(id)
    redirect(back + '?saved=1')
  }
  const { data, error } = await supabase.from('cars').insert(payload).select('id').single()
  if (error || !data) redirect(back + '?error=save')
  refresh(data.id)
  redirect('/admin/cars/' + data.id + '/edit?created=1')
}

export async function toggleCarStatus(form: FormData) {
  const { supabase } = await requireAdmin()
  const id = String(form.get('id') || '')
  if (!uuid.safeParse(id).success) redirect('/admin?error=invalid-id')
  const { data: car, error: readError } = await supabase.from('cars')
    .select('available').eq('id', id).single()
  if (readError || !car) redirect('/admin?error=save')
  const { error } = await supabase.from('cars')
    .update({ available: !car.available }).eq('id', id)
  if (error) redirect('/admin?error=save')
  refresh(id)
  redirect('/admin')
}

function validSignature(bytes: Uint8Array, mime: string) {
  if (mime === 'image/jpeg') return bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
  if (mime === 'image/png') return [137,80,78,71,13,10,26,10].every((v,i) => bytes[i] === v)
  if (mime === 'image/webp') return String.fromCharCode(...bytes.slice(0,4)) === 'RIFF'
    && String.fromCharCode(...bytes.slice(8,12)) === 'WEBP'
  return false
}
export async function uploadCarPhoto(form: FormData) {
  const { supabase } = await requireAdmin()
  const carId = String(form.get('car_id') || '')
  if (!uuid.safeParse(carId).success) redirect('/admin?error=invalid-id')
  const back = '/admin/cars/' + carId + '/edit'
  const file = form.get('image')
  if (!(file instanceof File) || !file.size || file.size > MAX_PHOTO_SIZE) redirect(back + '?error=image')
  const ext = ({ 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' } as Record<string,string>)[file.type]
  if (!ext) redirect(back + '?error=image')
  const bytes = new Uint8Array(await file.arrayBuffer())
  if (!validSignature(bytes, file.type)) redirect(back + '?error=image')
  const { data: car } = await supabase.from('cars').select('id').eq('id', carId).single()
  if (!car) redirect('/admin?error=invalid-id')
  const { data: photos, error: photoError } = await supabase.from('car_images')
    .select('id,is_main').eq('car_id', carId)
  if (photoError || (photos?.length || 0) >= 8) redirect(back + '?error=image-limit')
  const path = carId + '/' + randomUUID() + '.' + ext
  const { error: uploadError } = await supabase.storage.from(BUCKET)
    .upload(path, bytes, {contentType: file.type, upsert: false})
  if (uploadError) redirect(back + '?error=upload')
  const { data: url } = supabase.storage.from(BUCKET).getPublicUrl(path)
  const { error: insertError } = await supabase.from('car_images').insert({
    car_id: carId, image_url: url.publicUrl,
    is_main: !photos?.some(x => x.is_main)
  })
  if (insertError) {
    await supabase.storage.from(BUCKET).remove([path])
    redirect(back + '?error=upload')
  }
  refresh(carId)
  redirect(back + '?image=added')
}
export async function setMainPhoto(form: FormData) {
  const { supabase } = await requireAdmin()
  const carId = String(form.get('car_id') || '')
  const imageId = String(form.get('image_id') || '')
  if (!uuid.safeParse(carId).success || !/^[1-9]\d{0,18}$/.test(imageId))
    redirect('/admin?error=invalid-id')
  const back = '/admin/cars/' + carId + '/edit'
  const { data: found } = await supabase.from('car_images')
    .select('id').eq('car_id', carId).eq('id', imageId).single()
  if (!found) redirect(back + '?error=image')
  const { error: clearError } = await supabase.from('car_images')
    .update({is_main:false}).eq('car_id', carId).eq('is_main', true)
  if (clearError) redirect(back + '?error=image')
  const { error } = await supabase.from('car_images')
    .update({is_main:true}).eq('id', imageId).eq('car_id', carId)
  if (error) redirect(back + '?error=image')
  refresh(carId)
  redirect(back + '?image=main')
}
export async function removeCarPhoto(form: FormData) {
  const { supabase } = await requireAdmin()
  const carId = String(form.get('car_id') || '')
  const imageId = String(form.get('image_id') || '')
  if (!uuid.safeParse(carId).success || !/^[1-9]\d{0,18}$/.test(imageId))
    redirect('/admin?error=invalid-id')
  const back = '/admin/cars/' + carId + '/edit'
  const { data: photo } = await supabase.from('car_images')
    .select('image_url,is_main').eq('car_id',carId).eq('id',imageId).single()
  if (!photo) redirect(back + '?error=image')
  const origin = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (origin) {
    let url: URL | null = null
    try { url = new URL(photo.image_url) } catch { url = null }
    const prefix = '/storage/v1/object/public/' + BUCKET + '/'
    if (url && url.origin === new URL(origin).origin && url.pathname.startsWith(prefix)) {
      const path = decodeURIComponent(url.pathname.slice(prefix.length))
      if (path.startsWith(carId + '/')) {
        const { error } = await supabase.storage.from(BUCKET).remove([path])
        if (error) redirect(back + '?error=image')
      }
    }
  }
  const { error } = await supabase.from('car_images').delete().eq('car_id',carId).eq('id',imageId)
  if (error) redirect(back + '?error=image')
  if (photo.is_main) {
    const {data: next} = await supabase.from('car_images').select('id')
      .eq('car_id',carId).order('id').limit(1).maybeSingle()
    if (next) await supabase.from('car_images').update({is_main:true}).eq('id',next.id)
  }
  refresh(carId)
  redirect(back + '?image=removed')
}