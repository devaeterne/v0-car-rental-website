import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { CarForm } from '@/components/admin/car-form'
export default async function NewCarPage({searchParams}: {searchParams:Promise<{error?:string}>}) {
  const {error} = await searchParams
  return <div className="mx-auto max-w-4xl space-y-6">
    <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-slate-500"><ChevronLeft className="h-4 w-4"/> Araç listesine dön</Link>
    <div><h1 className="text-3xl font-bold">Yeni araç ekle</h1><p className="mt-1 text-sm text-slate-500">Kaydettikten sonra fotoğraf ekleyebilirsiniz.</p></div>
    {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error==='validation' ? 'Araç bilgilerini kontrol edin.' : 'Araç kaydedilemedi. Yetki ve veritabanı ayarlarını kontrol edin.'}</p>}
    <CarForm/>
  </div>
}