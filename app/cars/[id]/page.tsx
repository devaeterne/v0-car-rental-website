import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Users, Fuel, Settings2, ArrowLeft, Phone, Plane, Infinity, Map, ShieldCheck } from 'lucide-react'

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

const PHONE_NUMBER = '+905359226099'

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: car, error } = await supabase
    .from('cars')
    .select(`
      *,
      car_images (id, image_url, is_main)
    `)
    .eq('id', id)
    .single()

  if (error || !car) notFound()

  const images = car.car_images || []
  const mainImageUrl = images.find((img: any) => img.is_main)?.image_url || images[0]?.image_url
  const galleryImages = images.filter((img: any) => img.image_url !== mainImageUrl)

  const whatsappMessage = encodeURIComponent(`Merhaba, ${car.brand} aracını kiralamak istiyorum.`)
  const whatsappUrl = `https://wa.me/${PHONE_NUMBER.replace(/\+/g, '')}?text=${whatsappMessage}`

  return (
    <div className="relative overflow-hidden bg-background pt-24 pb-12 lg:pt-32 lg:pb-20">s
      <Header />
      <main className="flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/cars">
            <Button variant="ghost" className="mb-6 gap-2 hover:bg-white">
              <ArrowLeft className="h-4 w-4" /> Araçlara Dön
            </Button>
          </Link>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* SOL KOLON: GÖRSELLER VE ÖZELLİKLER */}
            <div className="space-y-6">
              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-200">
                {mainImageUrl ? (
                  <Image src={mainImageUrl} alt={car.name} fill className="object-cover" priority />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">Görsel Yok</div>
                )}
              </div>

              {galleryImages.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                  {galleryImages.map((img: any) => (
                    <div key={img.id} className="relative aspect-square overflow-hidden rounded-xl border bg-white shadow-sm">
                      <Image src={img.image_url} alt="Galeri" fill className="object-cover hover:opacity-80 transition-opacity cursor-pointer" />
                    </div>
                  ))}
                </div>
              )}

              {/* ARAÇ TEKNİK ÖZELLİKLERİ */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
                  <Users className="mb-2 h-5 w-5 text-primary" />
                  <span className="text-xs text-slate-500 uppercase font-bold">Kapasite</span>
                  <span className="text-sm font-black">{car.seats} Koltuk</span>
                </div>
                <div className="flex flex-col items-center rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
                  <Settings2 className="mb-2 h-5 w-5 text-primary" />
                  <span className="text-xs text-slate-500 uppercase font-bold">Şanzıman</span>
                  <span className="text-sm font-black">{transmissionLabels[car.transmission] || car.transmission}</span>
                </div>
                <div className="flex flex-col items-center rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
                  <Fuel className="mb-2 h-5 w-5 text-primary" />
                  <span className="text-xs text-slate-500 uppercase font-bold">Yakıt</span>
                  <span className="text-sm font-black">{fuelLabels[car.fuel_type] || car.fuel_type}</span>
                </div>
              </div>
            </div>

            {/* SAĞ KOLON: FİYAT, AVANTAJLAR VE İLETİŞİM */}
            <div className="space-y-6">
              <div>
                <Badge className={`px-4 py-1 rounded-full border-none shadow-sm ${categoryColors[car.category]}`}>
                  {categoryLabels[car.category]}
                </Badge>
                <h1 className="mt-3 text-5xl font-black tracking-tight text-slate-900">{car.brand}</h1>
                <p className="mt-1 text-slate-500 font-medium"> X Royal Güvencesiyle</p>

                <div className="mt-6 flex items-baseline gap-2 bg-white w-fit px-6 py-3 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-4xl font-black text-primary">€{car.price_per_day}</span>
                  <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">/ GÜNLÜK</span>
                </div>
              </div>

              {/* YENİ EKLENEN ÖZELLİKLER (AVANTAJLAR) */}
              <Card className="border-none shadow-sm overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 divide-y divide-slate-100">
                    <div className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <Plane className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">Havalimanı Karşılama</p>
                        <p className="text-xs text-slate-500">Podgorica ve Tivat havalimanlarında ücretsiz teslimat.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                        <Infinity className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">Sınırsız Kilometre</p>
                        <p className="text-xs text-slate-500">Karadağ içi tüm seyahatlerinizde mesafe sınırı yok.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                        <Map className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">Tüm Balkanlara Geçiş</p>
                        <p className="text-xs text-slate-500">Sınır geçiş belgesi ile tüm Balkan ülkelerine giriş izni.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* REZERVASYON KARTI */}
              <Card className="border-2 border-primary bg-white shadow-xl shadow-primary/5 rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-black mb-2 italic">Hemen Rezerve Et</h3>
                  <p className="mb-8 text-slate-500 text-sm leading-relaxed">
                    Aracınızın müsaitlik durumunu sorgulamak ve hızlı rezervasyon yapmak için bizimle iletişime geçin.
                  </p>
                  <div className="space-y-4">
                    <a href={whatsappUrl} target="_blank" className="block transform transition hover:scale-[1.02] active:scale-[0.98]">
                      <Button size="lg" className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-black h-16 text-lg rounded-2xl shadow-lg shadow-green-200">
                        WhatsApp ile Yazın
                      </Button>
                    </a>
                    <a href={`tel:${PHONE_NUMBER}`} className="block transform transition hover:scale-[1.02] active:scale-[0.98]">
                      <Button size="lg" variant="outline" className="w-full font-bold h-16 text-lg rounded-2xl border-2 border-slate-200 hover:bg-slate-50">
                        <Phone className="mr-2 h-5 w-5" /> Hemen Arayın
                      </Button>
                    </a>
                  </div>
                  <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    <ShieldCheck className="h-3 w-3" /> 7/24 Yol Yardım Desteği Dahildir
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}