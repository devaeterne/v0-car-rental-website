import { getSiteLocale } from '@/lib/i18n-server'
import { t } from '@/lib/i18n'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { getSiteSettings, telHref, whatsappHref } from '@/lib/site-content'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Users, Fuel, Settings2, ArrowLeft, Phone, Plane, Infinity, Map, ShieldCheck } from 'lucide-react'
import { CarGallery } from '@/components/car-gallery' // Lightbox bileşeni

interface CarDetailPageProps {
  params: Promise<{ id: string }>
}

const categoryColors: Record<string, string> = {
  economy: 'bg-green-100 text-green-800',
  compact: 'bg-blue-100 text-blue-800',
  suv: 'bg-orange-100 text-orange-800',
  luxury: 'bg-purple-100 text-purple-800',
  sports: 'bg-red-100 text-red-800',
  van: 'bg-teal-100 text-teal-800',
}

const categoryLabels: Record<string, string> = {
  economy: 'Ekonomik', compact: 'Kompakt', suv: 'SUV', luxury: 'Lüks', sports: 'Spor', van: 'Van',
}

const transmissionLabels: Record<string, string> = { automatic: 'Otomatik', manual: 'Manuel' }
const fuelLabels: Record<string, string> = { petrol: 'Benzin', diesel: 'Dizel', electric: 'Elektrik', hybrid: 'Hibrit' }

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  const locale = await getSiteLocale()
  const { id } = await params
  const supabase = await createClient()

  const { data: car, error } = await supabase
    .from('cars')
    .select(`
      *,
      car_images!car_images_car_id_fkey (id, image_url, is_main)
    `)
    .eq('id', id)
    .eq('available', true)
    .single()

  if (error || !car) notFound()

  const company = await getSiteSettings()

  const images = car.car_images || []
  const mainImageUrl = images.find((img: {is_main:boolean;image_url:string}) => img.is_main)?.image_url || images[0]?.image_url

  const whatsappMessage = encodeURIComponent(locale === 'en' ? `Hello, I would like to rent the ${car.brand}.` : locale === 'cnr' ? `Poštovani, želim da iznajmim vozilo ${car.brand}.` : `Merhaba, ${car.brand} aracını kiralamak istiyorum.`)
  const whatsappUrl = whatsappHref(company.whatsapp_phone) + '?text=' + whatsappMessage

  return (
    <div className="relative min-h-screen bg-slate-50/50">
      <Header />

      <main className="pt-24 pb-12 lg:pt-32 lg:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* GERİ DÖNÜŞ BUTONU */}
          <Link href="/cars">
            <Button variant="ghost" className="mb-8 gap-2 hover:bg-white text-slate-600 transition-all">
              <ArrowLeft className="h-4 w-4" /> {t(locale, 'Araç Listesine Dön')}
            </Button>
          </Link>

          <div className="grid gap-10 lg:grid-cols-12">

            {/* SOL KOLON: GÖRSEL GALERİSİ VE TEKNİK DETAYLAR (7/12 Genişlik) */}
            <div className="lg:col-span-7 space-y-8">

              {/* LIGHTBOX DESTEKLİ GALERİ */}
              {/* Not: CarGallery bileşeninde "object-contain" kullanarak resimlerin kesilmesini engelledik */}
              <CarGallery
                images={images}
                mainImageUrl={mainImageUrl}
                carName={car.brand}
              />

              {/* ARAÇ TEKNİK ÖZELLİKLERİ GRID */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6">
                <div className="flex flex-col items-center justify-center rounded-3xl bg-white border border-slate-100 p-6 shadow-sm transition-all hover:shadow-md">
                  <div className="bg-blue-50 p-3 rounded-2xl mb-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{t(locale, 'Kapasite')}</span>
                  <span className="text-base font-black text-slate-800">{car.seats} Koltuk</span>
                </div>

                <div className="flex flex-col items-center justify-center rounded-3xl bg-white border border-slate-100 p-6 shadow-sm transition-all hover:shadow-md">
                  <div className="bg-orange-50 p-3 rounded-2xl mb-3">
                    <Settings2 className="h-6 w-6 text-orange-600" />
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{t(locale, 'Şanzıman')}</span>
                  <span className="text-base font-black text-slate-800">{t(locale,transmissionLabels[car.transmission] || car.transmission)}</span>
                </div>

                <div className="flex flex-col items-center justify-center rounded-3xl bg-white border border-slate-100 p-6 shadow-sm transition-all hover:shadow-md">
                  <div className="bg-green-50 p-3 rounded-2xl mb-3">
                    <Fuel className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{t(locale, 'Yakıt')}</span>
                  <span className="text-base font-black text-slate-800">{t(locale,fuelLabels[car.fuel_type] || car.fuel_type)}</span>
                </div>
              </div>
            </div>

            {/* SAĞ KOLON: FİYAT VE REZERVASYON (5/12 Genişlik) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <Badge className={`px-4 py-1.5 rounded-full border-none shadow-sm text-xs font-bold uppercase tracking-wider ${categoryColors[car.category]}`}>
                  {t(locale,categoryLabels[car.category] || car.category)}
                </Badge>

                <h1 className="mt-4 text-5xl font-black tracking-tight text-slate-900 leading-none">
                  {car.brand}
                </h1>
                <p className="mt-2 text-slate-400 font-medium flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  {t(locale, 'X Royal Güvencesiyle Kirala')}
                </p>

                <div className="mt-8 flex items-end gap-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-primary italic">€{car.price_per_day}</span>
                    <span className="text-slate-400 font-bold uppercase text-xs tracking-[0.2em] ml-1">{t(locale, '/ Günlük')}</span>
                  </div>
                </div>
              </div>

              {/* AVANTAJLAR LİSTESİ */}
              <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
                <CardContent className="p-2">
                  <div className="space-y-1">
                    {[
                      { icon: Plane, label: 'Havalimanı Karşılama', desc: 'Podgorica & Tivat havalimanlarında ücretsiz teslimat.', color: 'text-blue-600', bg: 'bg-blue-50' },
                      { icon: Infinity, label: 'Sınırsız Kilometre', desc: 'Karadağ içi tüm seyahatlerinizde mesafe sınırı yok.', color: 'text-green-600', bg: 'bg-green-50' },
                      { icon: Map, label: 'Balkanlar Geçiş İzni', desc: 'Sınır geçiş belgesi ile tüm Balkanlara giriş imkanı.', color: 'text-purple-600', bg: 'bg-purple-50' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                        <div className={`h-12 w-12 shrink-0 rounded-2xl ${item.bg} flex items-center justify-center ${item.color}`}>
                          <item.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-black text-sm text-slate-800">{t(locale,item.label)}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{t(locale,item.desc)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* REZERVASYON AKSİYONLARI */}
              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-slate-200">
                <h3 className="text-2xl font-black mb-2 italic">{t(locale, 'Hızlı Rezervasyon')}</h3>
                <p className="mb-8 text-slate-400 text-sm leading-relaxed">
                  {t(locale, 'Müsaitlik durumunu öğrenmek ve hemen ayırtmak için 7/24 bize ulaşabilirsiniz.')}
                </p>

                <div className="space-y-4">
                  <a href={whatsappUrl} target="_blank" className="block transform transition hover:scale-[1.02] active:scale-[0.98]">
                    <Button size="lg" className="w-full bg-[#25D366] hover:bg-[#1ebd5b] text-white font-black h-16 text-lg rounded-2xl">
                      {t(locale, 'WhatsApp ile Sorgula')}
                    </Button>
                  </a>
                  <a href={telHref(company.phone)} className="block transform transition hover:scale-[1.02] active:scale-[0.98]">
                    <Button size="lg" variant="outline" className="w-full font-bold h-16 text-lg rounded-2xl border-2 border-slate-700 bg-transparent hover:bg-slate-800 text-white hover:text-white">
                      <Phone className="mr-2 h-5 w-5" /> {t(locale, 'Hemen Arayın')}
                    </Button>
                  </a>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  <ShieldCheck className="h-4 w-4 text-primary" /> {t(locale, 'Tam Sigorta & 7/24 Destek Dahildir')}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}