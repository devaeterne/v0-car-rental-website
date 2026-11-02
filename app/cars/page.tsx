import { getSiteLocale } from '@/lib/i18n-server'
import { t, type SiteLocale } from '@/lib/i18n'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CarCard } from '@/components/car-card'
import { CarsFilter } from '@/components/cars-filter'


import type { Car } from '@/lib/types'

interface CarsPageProps {
  searchParams: Promise<{
    category?: string
    transmission?: string
    fuel?: string
  }>
}
async function CarsList({ locale }: { locale:SiteLocale }) {

  const supabase = await createClient()

  // Araçları ve onlara bağlı görselleri tek sorguda çekiyoruz
  const carQuery = supabase
    .from('cars')
    .select(`
      *,
      car_images!car_images_car_id_fkey (
        image_url,
        is_main
      )
    `)
    .eq('available', true)

  // Filtreler... (aynı kalacak)

  const { data: cars, error: carError } = await carQuery

  if (carError) {
    return <div className="py-12 text-center text-destructive">{t(locale, 'Hata oluştu.')}</div>
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {cars.map((car: Car) => {
        // İlişkili tablodan gelen görselleri kontrol et

        return (
          <CarCard locale={locale}
            key={car.id}
            car={car}
          />
        )
      })}
    </div>
  )
}

export default async function CarsPage({ searchParams }: CarsPageProps) {
  const locale = await getSiteLocale()
  return (
    <div className="relative overflow-hidden bg-background pt-24 pb-12 lg:pt-32 lg:pb-20">
      <Header />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Hero Section for Cars Page */}
          <div className="relative mb-12 pb-8 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  X Royal <span className="text-primary italic">{t(locale, 'Filosu')}</span>
                </h1>
                <p className="mt-4 text-xl text-muted-foreground max-w-2xl leading-relaxed">
                  {t(locale, "Karadağ'ın yollarında konfor ve prestiji keşfedin. Her ihtiyaca uygun, bakımlı ve lüks araç seçeneklerimizle hizmetinizdeyiz.")}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-12 sticky top-20 z-30">
            <Suspense fallback={<div className="h-16 w-full bg-muted animate-pulse rounded-2xl" />}>
              <CarsFilter locale={locale}/>
            </Suspense>
          </div>

          <Suspense
            fallback={
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-[400px] rounded-3xl bg-muted animate-pulse" />
                ))}
              </div>
            }
          >
            <CarsList locale={locale}/>
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  )
}