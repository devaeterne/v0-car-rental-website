import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { requireAdmin } from '@/lib/admin/auth'
import { PageForm } from '@/components/admin/page-form'
import type { SitePage } from '@/lib/site-content'
type Props = {params:Promise<{id:string}>;searchParams:Promise<{error?:string;saved?:string;created?:string}>}
export const dynamic = 'force-dynamic'
export default async function EditSitePage({params,searchParams}:Props) {
  const {id}=await params
  const query=await searchParams
  const {supabase}=await requireAdmin()
  const {data:page,error}=await supabase.from('site_pages').select('*').eq('id',id).maybeSingle()
  if (error || !page) notFound()
  return <div className="mx-auto max-w-5xl space-y-6">
    <Link href="/admin/pages" className="inline-flex items-center gap-1 text-sm text-slate-500"><ChevronLeft size={16}/> Sayfalara dön</Link>
    <div><h1 className="text-3xl font-bold">Sayfayı düzenle</h1><p className="mt-1 text-sm text-slate-500">{page.title}</p></div>
    {(query.created || query.saved) && <p role="status" className="rounded-xl bg-green-50 p-4 text-sm text-green-700">{query.created ? 'Sayfa oluşturuldu.' : 'İçerik kaydedildi.'}</p>}
    {query.error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{query.error==='slug' ? 'Bu sayfanın adresi değiştirilemez veya ayrılmış.' : query.error==='validation' ? 'Form bilgilerini kontrol edin.' : 'Değişiklikler kaydedilemedi.'}</p>}
    <PageForm page={page as SitePage}/>
  </div>
}
