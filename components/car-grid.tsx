import { t, type SiteLocale } from '@/lib/i18n'
import { CarCard } from '@/components/car-card'
import type { Car } from '@/lib/types'

interface CarGridProps {
  cars: Car[]
  title?: string
  description?: string
  locale: SiteLocale
}

export function CarGrid({ cars, title, description, locale }: CarGridProps) {
  if (cars.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-muted-foreground">{t(locale, 'Kriterlere uygün Araç bulunamadi.')}</p>
      </div>
    )
  }

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(title || description) && (
          <div className="mb-10 text-center">
            {title && (
              <h2
                className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {title}
              </h2>
            )}
            {description && (
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} locale={locale}/>
          ))}
        </div>
      </div>
    </section>
  )
}
