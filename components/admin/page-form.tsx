import Link from 'next/link'
import type { SitePage } from '@/lib/site-content'
import { saveSitePage, deleteSitePage } from '@/app/admin/cms-actions'
import { DeletePageButton } from '@/components/admin/delete-page-button'

const input = 'mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-amber-500'
const label = 'block text-sm font-semibold text-slate-700'
export function PageForm({page}: {page?:SitePage}) {
  return <div className="space-y-5">
    <form action={saveSitePage} className="space-y-6 rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
      {page && <input type="hidden" name="id" value={page.id}/>}
      <div className="grid gap-5 sm:grid-cols-2">
        <label className={label}>Sayfa adı *
          <input className={input} name="title" maxLength={160} required defaultValue={page?.title} placeholder="Örn. Sıkça Sorulan Sorular"/>
        </label>
        <label className={label}>URL (slug) *
          <input className={input} name="slug" maxLength={80} required
            pattern="[a-z0-9]+(-[a-z0-9]+)*" readOnly={page?.is_system}
            defaultValue={page?.slug} placeholder="ornek-sayfa"/>
          {page?.is_system && <span className="mt-1 block text-xs text-slate-400">Sistem sayfalarının adresi değiştirilemez.</span>}
        </label>
      </div>
      <label className={label}>Kısa açıklama / giriş metni
        <textarea className={input} name="intro" maxLength={700} rows={3} defaultValue={page?.intro ?? ''}/>
      </label>
      <label className={label}>Sayfa içeriği
        <textarea className={input} name="body" maxLength={12000} rows={12} defaultValue={page?.body ?? ''}/>
        <span className="mt-1 block text-xs font-normal text-slate-500">Düz metin; paragraf ayrımı için boş satır kullanın. HTML çalıştırılmaz.</span>
      </label>
      {!page?.is_system && <div className="flex flex-wrap gap-6 rounded-xl bg-slate-50 p-4">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" name="published" defaultChecked={page?.published ?? false} className="h-4 w-4 accent-amber-600"/> Yayımla
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" name="show_in_footer" defaultChecked={page?.show_in_footer ?? false} className="h-4 w-4 accent-amber-600"/> Footer&apos;da göster
        </label>
      </div>}
      {page?.is_system && <div className="rounded-xl bg-slate-50 p-4 text-xs text-slate-600">Bu sistem sayfası yayımlanmaya devam eder; sayfa başlığı, giriş metni ve ana içeriği düzenlenebilir.</div>}
      <div className="flex flex-wrap justify-end gap-3 border-t pt-5">
        <Link href="/admin/pages" className="rounded-xl border px-5 py-3 text-sm font-semibold">Vazgeç</Link>
        <button type="submit" className="rounded-xl bg-[#17191c] px-6 py-3 text-sm font-semibold text-white">{page ? 'Değişiklikleri kaydet' : 'Sayfayı oluştur'}</button>
      </div>
    </form>
    {page && !page.is_system && <form action={deleteSitePage} className="flex justify-end">
      <input type="hidden" name="id" value={page.id}/>
      <DeletePageButton title={page.title}/>
    </form>}
  </div>
}
