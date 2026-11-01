export type CarNameFields = { name?: string | null; brand?: string | null; model?: string | null }

/** Prefer the legacy display name; prepend brand only when the name omits it. */
export function getCarDisplayName(car: CarNameFields): string {
  const brand = car.brand?.trim() ?? ''
  const name = car.name?.trim() ?? ''
  const model = car.model?.trim() ?? ''
  if (!name) return [brand, model].filter(Boolean).join(' ') || 'İsimsiz araç'
  const normalized = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  return brand && !normalized(name).startsWith(normalized(brand) + ' ') && normalized(name) !== normalized(brand)
    ? brand + ' ' + name
    : name
}
