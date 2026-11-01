import 'server-only'
import { createClient } from '@/lib/supabase/server'

export type CompanyInfo = {
  brand_name: string; legal_name: string; tax_number: string; registration_number: string;
  phone: string; whatsapp_phone: string; contact_email: string; location_label: string;
  address: string; opening_hours: string; map_url: string; instagram_url: string;
  facebook_url: string; footer_description: string
}
export type SitePage = {
  id: string; slug: string; title: string; intro: string; body: string;
  published: boolean; show_in_footer: boolean; is_system: boolean
}

const defaults: CompanyInfo = {
  brand_name: 'X Royal Rent A Car', legal_name: '', tax_number: '',
  registration_number: '', phone: '+90 535 922 60 99',
  whatsapp_phone: '+905359226099', contact_email: 'info@xroyalrentacar.com',
  location_label: 'Podgorica / Karadağ', address: '', opening_hours: '7 Gün / 24 Saat',
  map_url: 'https://www.google.com/maps/place/X+Royal+Rent+a+Car/data=!4m2!3m1!1s0x0:0xdb0f0d0aeb8e23e0',
  instagram_url: 'https://www.instagram.com/karadag_xroyal_rent_a_car/',
  facebook_url: 'https://www.facebook.com/profile.php?id=61577019140459',
  footer_description: "Karadağ'ın (Montenegro) her noktasında lüks ve güvenli sürüş deneyimi. Modern filomuz ve VIP hizmet anlayışımızla yolculuğunuzu sanata dönüştürüyoruz."
}

export async function getSiteSettings(): Promise<CompanyInfo> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle()
  if (error) console.error('[site-content] Company settings read failed', error.code)
  return data ? { ...defaults, ...data } as CompanyInfo : defaults
}

export async function getPublicPage(slug: string): Promise<SitePage | null> {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return null
  const supabase = await createClient()
  const { data, error } = await supabase.from('site_pages')
    .select('id,slug,title,intro,body,published,show_in_footer,is_system')
    .eq('slug',slug).eq('published',true).maybeSingle()
  if (error) console.error('[site-content] Page read failed', error.code)
  return data as SitePage | null
}

export async function getFooterPages(): Promise<Pick<SitePage, 'slug'|'title'>[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('site_pages')
    .select('slug,title')
    .eq('published',true).eq('show_in_footer',true).eq('is_system',false)
    .order('created_at',{ascending:true}).limit(20)
  if (error) console.error('[site-content] Footer pages read failed', error.code)
  return data ?? []
}

/** Encode only telephone digits, allowing a single leading international +. */
export function telHref(phone: string): string {
  const digits = phone.replace(/\D/g,'')
  return digits ? 'tel:+' + digits : 'tel:'
}

export function whatsappHref(phone: string): string {
  const digits = phone.replace(/\D/g,'')
  return digits ? 'https://wa.me/' + digits : ''
}
