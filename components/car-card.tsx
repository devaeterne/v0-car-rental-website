import { t, type SiteLocale } from '@/lib/i18n'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Fuel, Settings2, ImageIcon, ArrowUpRight } from 'lucide-react'
import type { Car } from '@/lib/types'

interface CarCardProps {
  car: Car
  locale: SiteLocale
}

const categoryColors: Record<string, string> = {
  economy: 'bg-emerald-500/10 text-black-600 border-emerald-500/20',
  compact: 'bg-sky-500/10 text-black-600 border-sky-500/20',
  suv: 'bg-amber-500/10 text-black-600 border-amber-500/20',
  luxury: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
  sports: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
  van: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
}

const categoryLabels: Record<string, string> = {
  economy: 'Ekonomik',
  compact: 'Kompakt',
  suv: 'SUV',
  luxury: 'Lüks',
  sports: 'Spor',
  van: 'Van',
}
export function CarCard({ car, locale }: CarCardProps) {
  // car_images içinden is_main olanı bul, yoksa ilk resmi al
  const displayImage = car.car_images?.find((img: {is_main:boolean;image_url:string}) => img.is_main)?.image_url
                    || car.car_images?.[0]?.image_url;

  return (
    <Card className="group relative overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-none bg-white">
      <div className="relative aspect-[16/10] overflow-hidden">
        {displayImage ? (
          <>
            <Image
              src={displayImage} // Artık yeni yakaladığımız resmi kullanıyoruz
              alt={car.name}
              fill
              className="object-cover transition-transform duration-700 scale-100 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 bg-slate-100 text-slate-400">
            <ImageIcon className="h-10 w-10 stroke-[1.5] opacity-20" />
          </div>
        )}

        {/* Floating Category Badge */}
        <Badge className={`absolute left-4 top-4 border backdrop-blur-md shadow-sm px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] ${categoryColors[car.category] || 'bg-slate-800 text-white'}`}>
          {t(locale, categoryLabels[car.category] || car.category)}
        </Badge>
      </div>

      <CardContent className="p-6">
        <div className="flex flex-col gap-1 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 italic">Exclusive Series</span>
            <div className="flex items-center gap-1 text-slate-900 font-black">
              <span className="text-2xl tracking-tighter">€{car.price_per_day}</span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400">{t(locale, '/ Gün')}</span>
            </div>
          </div>
          <h3 className="text-2xl font-black tracking-tight text-slate-900 leading-none mt-1">
            {car.brand} <span className="text-primary">{car.model}</span>
          </h3>
        </div>

        {/* Minimalist Specs Bar */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5" title="Koltuk Sayısı">
              <Users className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-[11px] font-black text-slate-900 uppercase tracking-tighter">{car.seats}</span>
            </div>
            <div className="w-px h-3 bg-slate-200" />
            <div className="flex items-center gap-1.5" title="Şanzıman">
              <Settings2 className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-[11px] font-black text-slate-900 uppercase tracking-tighter">
                {car.transmission === 'automatic' ? 'Auto' : 'Man'}
              </span>
            </div>
            <div className="w-px h-3 bg-slate-200" />
            <div className="flex items-center gap-1.5" title="Yakıt Türü">
              <Fuel className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-[11px] font-black text-slate-900 uppercase tracking-tighter">
                {car.fuel_type?.slice(0, 3)}
              </span>
            </div>
          </div>

          <Link href={`/cars/${car.id}`} className="group/btn">
             <div className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center transition-all group-hover/btn:bg-primary group-hover/btn:border-primary">
                <ArrowUpRight className="h-4 w-4 text-slate-400 transition-colors group-hover/btn:text-white" />
             </div>
          </Link>
        </div>
      </CardContent>

      <CardFooter className="px-6 pb-6 pt-0">
        <Link href={`/cars/${car.id}`} className="w-full">
          <Button className="w-full h-12 bg-slate-900 text-white font-black uppercase tracking-[0.15em] text-[11px] rounded-none transition-all hover:bg-primary border-none shadow-none active:scale-[0.98]">
            {t(locale, 'Detayları İncele')}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
