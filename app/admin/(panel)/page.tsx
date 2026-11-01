import Image from 'next/image'
import Link from 'next/link'
import { CarFront, FileDown, Pencil, Plus } from 'lucide-react'
import { requireAdmin } from '@/lib/admin/auth'
import { toggleCarStatus } from '@/app/admin/actions'

type CarRow = {
  id: string; brand: string; model: string; year: number; price_per_day: number; available: boolean;
  car_images?: {image_url:string; is_main:boolean}[]
}
export const dynamic = 'force-dynamic'
export default async function AdminHome({searchParams}: {searchParams:Promise<{error?:string}>}) {
  const { error: actionError } = await searchParams
  const {supabase} = await requireAdmin()
  const {data, error} = await supabase.from('cars')
    .select('id,brand,model,year,price_per_day,available,car_images!car_images_car_id_fkey(image_url,is_main)')
    .order('created_at',{ascending:false})
  const cars = (data || []) as CarRow[]
  const active = cars.filter(c => c.available).length
  return <div className="space-y-7">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div><h1 className="text-3xl font-bold">Filo yönetimi</h1><p className="mt-2 text-sm text-slate-500">Araçları yönetin, yayına alın veya pasife çekin.</p></div>
      <Link href="/admin/cars/new" className="inline-flex items-center gap-2 rounded-xl bg-[#17191c] px-5 py-3 text-sm font-semibold text-white"><Plus className="h-4 w-4"/> Yeni araç ekle</Link>
    </div>
    <div className="grid gap-4 sm:grid-cols-3">
      {[['Toplam araç',cars.length],['Aktif araç',active],['Pasif araç',cars.length-active]].map(([label,number]) =>
        <div key={label} className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="text-sm text-slate-500">{label}</span><CarFront className="h-5 w-5 text-amber-600"/></div><div className="mt-2 text-3xl font-bold">{number}</div></div>
      )}
    </div>
    {(error || actionError) && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error ? 'Veritabanından araçlar okunamadı.' : 'İşlem gerçekleştirilemedi.'}</p>}
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
        <div><h2 className="font-bold">Araç listesi</h2><p className="text-xs text-slate-500">Pasif araçlar sitede görünmez.</p></div>
        <a href="/feeds/cars.xml" download="xroyal-cars.xml" className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold"><FileDown className="h-4 w-4"/> XML export</a>
      </div>
      <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-3">Araç</th><th className="px-4 py-3">Fiyat</th><th className="px-4 py-3">Durum</th><th className="px-4 py-3 text-right">İşlemler</th></tr></thead>
        <tbody className="divide-y">
          {cars.map(car => {
            const photo = car.car_images?.find(i=>i.is_main)?.image_url || car.car_images?.[0]?.image_url
            return <tr key={car.id} className="hover:bg-slate-50">
              <td className="px-5 py-4"><div className="flex items-center gap-3">{photo ? <div className="relative h-14 w-20 overflow-hidden rounded-lg"><Image src={photo} alt="" fill unoptimized className="object-cover"/></div> : <div className="grid h-14 w-20 place-items-center rounded-lg bg-slate-100"><CarFront className="text-slate-400"/></div>}<div><b>{car.brand} {car.model}</b><div className="text-xs text-slate-400">{car.year}</div></div></div></td>
              <td className="px-4 py-4 font-semibold">€{Number(car.price_per_day).toFixed(2)}</td>
              <td className="px-4 py-4"><span className={car.available ? 'rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700' : 'rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600'}>{car.available ? 'Aktif' : 'Pasif'}</span></td>
              <td className="px-4 py-4"><div className="flex items-center justify-end gap-2">
                <Link href={'/admin/cars/'+car.id+'/edit'} className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold"><Pencil className="h-3 w-3"/> Düzenle</Link>
                <form action={toggleCarStatus}><input type="hidden" name="id" value={car.id}/><button type="submit" className={car.available ? 'rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900' : 'rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700'}>{car.available ? 'Pasife al' : 'Aktif yap'}</button></form>
              </div></td>
            </tr>
          })}
        </tbody>
      </table></div>
      {!error && cars.length===0 && <p className="p-10 text-center text-sm text-slate-500">Henüz araç bulunmuyor.</p>}
    </div>
  </div>
}