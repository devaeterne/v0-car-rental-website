import Image from 'next/image'
import { ImagePlus, Star, Trash2 } from 'lucide-react'
import { removeCarPhoto, setMainPhoto, uploadCarPhoto } from '@/app/admin/actions'
export type ManagedImage = {id: number; image_url: string; is_main: boolean}
export function PhotoManager({carId, photos}: {carId: string; photos: ManagedImage[]}) {
  return <section className="space-y-5 rounded-2xl border bg-white p-5 shadow-sm sm:p-8">
    <div><h2 className="text-lg font-bold">Fotoğraf galerisi</h2><p className="mt-1 text-xs text-slate-500">JPEG / PNG / WebP • Maksimum 5 MB • En fazla 8 fotoğraf</p></div>
    {photos.length > 0 && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {photos.map(photo => <div key={photo.id} className="overflow-hidden rounded-xl border">
        <div className="relative aspect-[16/10] bg-slate-100"><Image src={photo.image_url} alt="Araç görseli" fill unoptimized className="object-cover"/></div>
        <div className="flex items-center justify-between gap-2 p-3">
          {photo.is_main ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700"><Star className="h-3 w-3"/> Kapak</span>
            : <form action={setMainPhoto}><input name="car_id" type="hidden" value={carId}/><input name="image_id" type="hidden" value={photo.id}/><button className="text-xs underline">Kapak yap</button></form>}
          <form action={removeCarPhoto}><input name="car_id" type="hidden" value={carId}/><input name="image_id" type="hidden" value={photo.id}/><button aria-label="Fotoğrafı sil" className="rounded-lg bg-red-50 p-2 text-red-600"><Trash2 className="h-4 w-4"/></button></form>
        </div>
      </div>)}
    </div>}
    {photos.length < 8 && <form action={uploadCarPhoto} encType="multipart/form-data" className="flex flex-wrap items-end gap-3 rounded-xl border border-dashed p-4">
      <input name="car_id" type="hidden" value={carId}/>
      <div className="min-w-0 flex-1"><label htmlFor="image" className="mb-2 block text-sm font-semibold">Yeni fotoğraf</label><input id="image" name="image" type="file" accept="image/jpeg,image/png,image/webp" required className="block w-full text-sm"/></div>
      <button className="inline-flex items-center gap-2 rounded-xl bg-[#17191c] px-4 py-3 text-xs font-semibold text-white"><ImagePlus className="h-4 w-4"/> Yükle</button>
    </form>}
  </section>
}