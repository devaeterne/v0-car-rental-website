import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/hero-section'
import { FeaturesSection } from '@/components/features-section'
import { CarGrid } from '@/components/car-grid'
import type { Car } from '@/lib/types'

export default async function HomePage() {
  const supabase = await createClient()

  // Veritabanından araçları ve onlara bağlı resimleri çekiyoruz
  const { data: featuredCars, error } = await supabase
    .from('cars')
    .select(`
      *,
      car_images!car_images_car_id_fkey (
        id,
        image_url,
        is_main
      )
    `)
    .eq('available', true)
    .order('created_at', { ascending: false })
    .limit(3) // Ana sayfada daha temiz bir görünüm için 3 adet (isteğe bağlı 6 yapabilirsin)

  if (error) {
    console.error('Ana sayfa veri hatası:', error)
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FDFDFD]">
      <Header />
      
      <main className="flex-1">
        {/* Modern Karşılama Alanı */}
        <HeroSection />

        {/* Kurumsal Avantajlar (Karşılama, Sınırsız KM vb.) */}
        <div className="bg-white">
          <FeaturesSection />
        </div>

        {/* Öne Çıkan Araçlar Bölümü */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-2">
              <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px] italic">
                Exclusive Selection
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase">
                Öne Çıkan <span className="text-primary/10 stroke-primary text-transparent [-webkit-text-stroke:1px_theme(colors.primary)]">Filomuz</span>
              </h2>
              <div className="h-1 w-20 bg-primary rounded-full" />
            </div>
            
            <p className="max-w-md text-slate-500 font-medium text-sm leading-relaxed">
              Karadağ'ın en genç ve bakımlı araç filosuyla tanışın. Size özel lüks ve konfor seçeneklerini keşfedin.
            </p>
          </div>

          <CarGrid
            cars={(featuredCars as Car[]) || []}
            // Title ve Description zaten yukarıda özel tasarlandığı için Grid içindekileri boş geçebiliriz
          />

          <div className="mt-16 text-center">
            <a href="/cars">
              <button className="group relative px-12 py-4 bg-slate-900 text-white font-black uppercase tracking-widest text-xs transition-all hover:bg-primary overflow-hidden">
                <span className="relative z-10">Tüm Filoyu Görüntüle</span>
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}