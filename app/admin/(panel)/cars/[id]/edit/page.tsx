import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { requireAdmin } from '@/lib/admin/auth'
import { CarForm, type EditableCar } from '@/components/admin/car-form'
import { PhotoManager, type ManagedImage } from '@/components/admin/photo-manager'
import { getCarDisplayName } from '@/lib/admin/car-display'
type Props = {params:Promise<{id:string}>; searchParams:Promise<{error?:string;saved?:string;created?:string;image?:string}>}
export default async function EditCarPage({params,searchParams}:Props) {
  const {id} = await params
  const query = await searchParams
  const {supabase} = await requireAdmin()
  const {data:car,error} = await supabase.from('cars')
    .select('id,name,brand,model,year,category,price_per_day,seats,transmission,fuel_type,available,features,car_images!car_images_car_id_fkey(id,image_url,is_main)')
    .eq('id',id).single()
  if (error || !car) notFound()
  const message = query.created ? 'Araç oluşturuldu; şimdi fotoğraf ekleyebilirsiniz.'
    : query.saved ? 'Değişiklikler kaydedildi.' : query.image ? 'Fotoğraf işlemi tamamlandı.' : null
  const failure = query.error==='image-limit' ? 'En fazla 8 fotoğraf yüklenebilir.'
    : query.error==='image' ? 'Fotoğraf geçersiz.'
    : query.error==='upload' ? 'Fotoğraf yüklenemedi. Storage/RLS ayarlarını kontrol edin.'
    : query.error ? 'İşlem tamamlanamadı.' : null
  return <div className="mx-auto max-w-4xl space-y-6">
    <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-slate-500"><ChevronLeft className="h-4 w-4"/> Araç listesine dön</Link>
    <div><h1 className="text-3xl font-bold">{getCarDisplayName(car)}</h1><p className="mt-1 text-sm text-slate-500">Araç bilgileri ve görsel galerisi</p></div>
    {message && <p role="status" className="rounded-xl bg-green-50 p-4 text-sm text-green-700">{message}</p>}
    {failure && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{failure}</p>}
    <CarForm car={car as EditableCar}/>
    <PhotoManager carId={id} photos={(car.car_images || []) as ManagedImage[]}/>
  </div>
}