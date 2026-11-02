'use client'

import { t, type SiteLocale } from '@/lib/i18n'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Car, MessageCircle, CheckCircle2 } from 'lucide-react'

export function HeroSection({heading,intro,whatsappPhone,locale}: {heading?:string;intro?:string;whatsappPhone?:string;locale:SiteLocale}) {
  const WHATSAPP_URL = `https://wa.me/${(whatsappPhone || '+905359226099').replace(/\D/g, '')}?text=${encodeURIComponent(t(locale,'Merhaba, araç kiralama hakkında bilgi almak istiyorum.'))}`
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-12 lg:pt-32 lg:pb-20">
      {/* Arka Plan Deseni (Opsiyonel - Daha Soft) */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">

          {/* Sol Taraf: Metin İçeriği */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-secondary mb-6">
              <CheckCircle2 className="h-4 w-4" />
              {t(locale, "Karadağ'ın En Güvenilir Rent A Car Hizmeti")}
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {locale === 'tr' ? heading || 'Karadağ’da Premium Araç Kiralama Deneyimi' : t(locale, 'Karadağ\'da Premium Araç Kiralama Deneyimi')}
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-muted-foreground mx-auto lg:mx-0">
              {locale === 'tr' ? intro || "X Royal Rent A Car ile Budva, Tivat ve Kotor'un tadını çıkarın. Ekonomik şehir araçlarından lüks SUV modellerine kadar geniş filomuzla hizmetinizdeyiz." : t(locale, "X Royal Rent A Car ile Budva, Tivat ve Kotor'un tadını çıkarın. Ekonomik şehir araçlarından lüks SUV modellerine kadar geniş filomuzla hizmetinizdeyiz.")}
            </p>

            {/* CTA Butonları - Tam Ortalanmış (Mobil) / Sola Dayalı (Masaüstü) */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <Link href="/cars" className="w-full sm:w-auto">
                <Button size="lg" className="w-full gap-2 px-8 py-7 text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                  <Car className="h-5 w-5" />
                  {t(locale, 'Araçları İncele')}
                </Button>
              </Link>

              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full gap-2 border-2 border-green-600 px-8 py-7 text-lg text-green-600 hover:bg-green-600 hover:text-white transition-all">
                  <MessageCircle className="h-5 w-5" />
                  {t(locale, 'WhatsApp İletişim')}
                </Button>
              </a>
            </div>

            {/* Stats (Masaüstü için sola yaslı) */}
            <div className="mt-12 grid grid-cols-3 gap-4 border-t pt-8">
              <div>
                <p className="text-2xl font-bold text-primary">10+</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{t(locale, 'Araç Filosu')}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">7/24</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{t(locale, 'Destek')}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">%100</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{t(locale, 'Memnuniyet')}</p>
              </div>
            </div>
          </div>

          {/* Sağ Taraf: Görsel */}
          <div className="relative hidden lg:block">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-primary/20 to-transparent blur-3xl opacity-50" />
            <div className="relative overflow-hidden rounded-2xl border bg-card shadow-2xl transition-transform hover:scale-[1.02] duration-500">
              <Image
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop"
                alt="Karadağ Araç Kiralama"
                width={800}
                height={600}
                className="object-cover transition-transform duration-700 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-sm font-medium opacity-80">{t(locale, "Karadağ'da Lüks ve Hizmetin kesişim Noktası")}</p>
                <p className="text-xl font-bold">X Royal Rent a Car</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}