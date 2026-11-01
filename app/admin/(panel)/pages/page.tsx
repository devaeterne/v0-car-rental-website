import Link from 'next/link'
import { FileText, Plus, Pencil, ExternalLink } from 'lucide-react'
import { requireAdmin } from '@/lib/admin/auth'
import type { SitePage } from '@/lib/site-content'
import { deleteSitePage } from '@/app/admin/cms-actions'
import { DeletePageButton } from '@/components/admin/delete-page-button'

export const dynamic = 'force-dynamic'
export default async function AdminPages({searchParams}: {searchParams:Promise<{error?:string;deleted?:string}>}) {
  const query = await searchParams
  const {supabase} = await requireAdmin()
  const {data,error} = await supabase.from('site_pages').select('*').order('is_system',{ascending:false}).order('created_at',{ascending:true})
  const pages = (data || []) as SitePage[]
  const published = pages.filter(p => p.published).length
  return <div className="space-y-7">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div><h1 className="text-3xl font-bold">İçerik ve sayfalar</h1><p className="mt-2 text-sm text-slate-500">Ana sayfa, Hakkımızda, İletişim ve yeni bilgi sayfalarını yönetin.</p></div>
      <Link href="/admin/pages/new" className="inline-flex items-center gap-2 rounded-xl bg-[#17191c] px-5 py-3 text-sm font-semibold text-white"><Plus size={16}/> Yeni sayfa</Link>
    </div>
    <div className="grid gap-4 sm:grid-cols-3">
      {([['Toplam sayfa',pages.length],['Yayında',published],['Taslak',pages.length-published]] as const).map(([name,value])=>
        <div key={name} className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex justify-between"><span className="text-sm text-slate-500">{name}</span><FileText size={20} className="text-amber-600"/></div><div className="mt-2 text-3xl font-bold">{value}</div></div>)}
    </div>
    {query.deleted && <p className="rounded-xl bg-green-50 p-4 text-sm text-green-700">Sayfa silindi.</p>}
    {(error || query.error) && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error ? 'Sayfalar okunamadı.' : 'İşlem tamamlanamadı.'}</p>}
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-4">Sayfa</th><th className="px-4 py-4">Adres</th><th className="px-4 py-4">Durum</th><th className="px-4 py-4 text-right">İşlemler</th></tr></thead>
        <tbody className="divide-y">{pages.map(page => {
          const href = page.slug==='ana-sayfa' ? '/' : page.slug==='hakkimizda' || page.slug==='iletisim' ? '/'+page.slug : '/sayfa/'+page.slug
          return <tr key={page.id}>
            <td className="px-5 py-4"><strong>{page.title}</strong><div className="text-xs text-slate-400">{page.is_system ? 'Sistem sayfası' : 'Özel sayfa'}</div></td>
            <td className="px-4 py-4 font-mono text-xs">{href}</td>
            <td className="px-4 py-4">{page.published ? <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">Yayında</span> : <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">Taslak</span>}</td>
            <td className="px-4 py-4"><div className="flex items-center justify-end gap-2">
              {page.published && <Link href={href} target="_blank" aria-label="Sayfayı görüntüle" className="rounded-lg border px-3 py-2"><ExternalLink size={15}/></Link>}
              <Link href={'/admin/pages/'+page.id+'/edit'} className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold"><Pencil size={14}/> Düzenle</Link>
              {!page.is_system && <form action={deleteSitePage}><input type="hidden" name="id" value={page.id}/><DeletePageButton title={page.title}/></form>}
            </div></td>
          </tr>
        })}</tbody>
      </table></div>
      {!error && pages.length===0 && <p className="p-10 text-center text-sm text-slate-500">Henüz içerik sayfası bulunmuyor.</p>}
    </div>
  </div>
}
