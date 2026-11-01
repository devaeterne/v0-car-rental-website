import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { PageForm } from '@/components/admin/page-form'
export default async function NewSitePage({searchParams}: {searchParams:Promise<{error?:string}>}) {
  const {error} = await searchParams
  return <div className="mx-auto max-w-5xl space-y-6">
    <Link href="/admin/pages" className="inline-flex items-center gap-1 text-sm text-slate-500"><ChevronLeft size={16}/> Sayfalara dön</Link>
    <div><h1 className="text-3xl font-bold">Yeni içerik sayfası</h1><p className="mt-1 text-sm text-slate-500">Yeni sayfalar /sayfa/slug adresinde yayımlanır. Önce taslak olarak oluşturabilirsiniz.</p></div>
    {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error==='slug' ? 'Bu adres sistem sayfalarına ayrılmış.' : error==='validation' ? 'Başlık, adres ve metin uzunluklarını kontrol edin.' : 'Sayfa kaydedilemedi. Adres başka bir sayfada kullanılıyor olabilir.'}</p>}
    <PageForm/>
  </div>
}
