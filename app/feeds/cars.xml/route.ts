import { createClient } from '@supabase/supabase-js'
import { serializeCars } from '@/lib/admin/cars-xml.mjs'
import type { XmlCar } from '@/lib/admin/cars-xml.mjs'

export const dynamic = 'force-dynamic'
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return new Response('Feed unavailable', {status:503})
  const supabase = createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}})
  const {data,error} = await supabase.from('cars')
    .select('id,name,brand,model,year,category,price_per_day,transmission,fuel_type,seats,available,car_images!car_images_car_id_fkey(image_url,is_main)')
    .eq('available',true).order('brand')
  if (error) return new Response('Feed unavailable', {status:503})
  return new Response(serializeCars((data || []) as XmlCar[],
    process.env.NEXT_PUBLIC_SITE_URL || 'https://xroyalrentacar.me'), {
    headers: {'Content-Type':'application/xml; charset=utf-8',
      'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}
  })
}