import Link from 'next/link'
import { saveCar } from '@/app/admin/actions'
import { categoryOptions, fuelOptions, transmissionOptions } from '@/lib/admin/car-schema'

export type EditableCar = {
  id: string; brand: string; model: string; year: number; category: string;
  price_per_day: number; seats: number; transmission: string;
  fuel_type: string; available: boolean; features: string[] | null
}
const input = 'mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200'
const label = 'block text-sm font-semibold text-slate-700'
export function CarForm({ car }: { car?: EditableCar }) {
  return (
    <form action={saveCar} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      {car && <input type="hidden" name="id" value={car.id}/>}
      <div><h2 className="text-lg font-bold">Araç bilgileri</h2><p className="mt-1 text-xs text-slate-500">Zorunlu alanları doldurun. Görseller kayıt sonrasında eklenebilir.</p></div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div><label className={label} htmlFor="brand">Marka *</label><input className={input} id="brand" name="brand" required maxLength={80} defaultValue={car?.brand} placeholder="BMW"/></div>
        <div><label className={label} htmlFor="model">Model *</label><input className={input} id="model" name="model" required maxLength={100} defaultValue={car?.model} placeholder="320d"/></div>
        <div><label className={label} htmlFor="year">Model yılı *</label><input className={input} id="year" name="year" type="number" min={1990} max={2100} required defaultValue={car?.year ?? new Date().getFullYear()}/></div>
        <div><label className={label} htmlFor="price">Günlük fiyat (€) *</label><input className={input} id="price" name="price_per_day" type="number" min="0.01" max="100000" step="0.01" required defaultValue={car?.price_per_day ?? ''}/></div>
        <div><label className={label} htmlFor="category">Kategori *</label><select className={input} id="category" name="category" defaultValue={car?.category ?? 'economy'}>{categoryOptions.map(([value,title]) => <option key={value} value={value}>{title}</option>)}</select></div>
        <div><label className={label} htmlFor="seats">Koltuk *</label><input className={input} id="seats" name="seats" type="number" min={1} max={30} required defaultValue={car?.seats ?? 5}/></div>
        <div><label className={label} htmlFor="transmission">Vites *</label><select className={input} id="transmission" name="transmission" defaultValue={car?.transmission ?? 'automatic'}>{transmissionOptions.map(([value,title]) => <option key={value} value={value}>{title}</option>)}</select></div>
        <div><label className={label} htmlFor="fuel_type">Yakıt *</label><select className={input} id="fuel_type" name="fuel_type" defaultValue={car?.fuel_type ?? 'petrol'}>{fuelOptions.map(([value,title]) => <option key={value} value={value}>{title}</option>)}</select></div>
        <div className="sm:col-span-2"><label className={label} htmlFor="features">Özellikler</label><textarea className={input} id="features" name="features" rows={4} defaultValue={(car?.features || []).join('\n')} placeholder={'Bluetooth\nKlima\nGeri görüş kamerası'}/><p className="mt-1 text-xs text-slate-400">Her satıra bir özellik (maksimum 30).</p></div>
      </div>
      <label className="flex items-center gap-3 rounded-xl border bg-slate-50 p-4 text-sm font-semibold">
        <input type="checkbox" name="available" className="h-5 w-5 accent-amber-500" defaultChecked={car?.available ?? false}/>
        <span><strong className="block">Araç aktif</strong><small className="font-normal text-slate-500">Aktif araç sitede ve XML'de görünür.</small></span>
      </label>
      <div className="flex justify-end gap-3 border-t pt-5">
        <Link href="/admin" className="rounded-xl border px-5 py-3 text-sm font-semibold">Vazgeç</Link>
        <button type="submit" className="rounded-xl bg-[#17191c] px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700">{car ? 'Değişiklikleri kaydet' : 'Araç oluştur'}</button>
      </div>
    </form>
  )
}