import { requireAdmin } from '@/lib/admin/auth'
import { saveSiteSettings } from '@/app/admin/cms-actions'
import type { CompanyInfo } from '@/lib/site-content'

export const dynamic = 'force-dynamic'
const fields = [
  ['brand_name', 'Sitede görünen marka adı', 'text'],
  ['legal_name', 'Resmî şirket ünvanı', 'text'],
  ['tax_number', 'Vergi numarası', 'text'],
  ['registration_number', 'Şirket kayıt numarası', 'text'],
  ['phone', 'Telefon', 'tel'],
  ['whatsapp_phone', 'WhatsApp numarası', 'tel'],
  ['contact_email', 'İletişim e-postası', 'email'],
  ['location_label', 'Lokasyon etiketi', 'text'],
  ['address', 'Açık adres', 'text'],
  ['opening_hours', 'Çalışma saatleri', 'text'],
  ['map_url', 'Google Maps bağlantısı', 'url'],
  ['instagram_url', 'Instagram bağlantısı', 'url'],
  ['facebook_url', 'Facebook bağlantısı', 'url']
] as const

export default async function CompanyAdmin({searchParams}: {searchParams:Promise<{saved?:string;error?:string}>}) {
  const query = await searchParams
  const {supabase} = await requireAdmin()
  const {data,error} = await supabase.from('site_settings').select('*').eq('id',1).single()
  const company = data as CompanyInfo | null
  return <div className="mx-auto max-w-5xl space-y-6">
    <div><h1 className="text-3xl font-bold">Şirket bilgileri</h1><p className="mt-2 text-sm text-slate-500">İletişim, sosyal medya ve kurumsal bilgileri tek yerden düzenleyin.</p></div>
    {query.saved && <p role="status" className="rounded-xl bg-green-50 p-4 text-sm text-green-700">Şirket bilgileri güncellendi.</p>}
    {(error || query.error) && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700"> {error ? 'Şirket bilgileri okunamadı.' : query.error==='validation' ? 'Bilgileri ve bağlantı biçimlerini kontrol edin.' : 'Değişiklikler kaydedilemedi.'}</p>}
    {company && <form action={saveSiteSettings} className="space-y-6 rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map(([key,label,type]) => <label key={key} className="block text-sm font-semibold text-slate-700">{label}
          <input name={key} type={type} maxLength={type==='url' ? 500 : 250} defaultValue={company[key] ?? ''}
            required={['brand_name','phone','whatsapp_phone','contact_email','location_label'].includes(key)}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-amber-500"/>
        </label>)}
      </div>
      <label className="block text-sm font-semibold text-slate-700">Footer açıklaması
        <textarea name="footer_description" rows={4} maxLength={800} defaultValue={company.footer_description}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-amber-500"/>
      </label>
      <p className="text-xs text-slate-500">Resmî şirket bilgileri boş bırakılabilir. Kaydedilen telefon ve sosyal bağlantılar sitedeki iletişim alanlarında güncellenir.</p>
      <div className="flex justify-end border-t pt-5"><button type="submit" className="rounded-xl bg-[#17191c] px-6 py-3 text-sm font-semibold text-white">Değişiklikleri kaydet</button></div>
    </form>}
  </div>
}
