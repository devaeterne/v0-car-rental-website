import { z } from 'zod'

export const categoryOptions = [
  ['economy', 'Ekonomik'], ['compact', 'Kompakt'], ['suv', 'SUV'],
  ['luxury', 'Lüks'], ['sports', 'Spor'], ['van', 'Van'],
] as const
export const transmissionOptions = [['automatic', 'Otomatik'], ['manual', 'Manuel']] as const
export const fuelOptions = [
  ['petrol', 'Benzin'], ['diesel', 'Dizel'], ['hybrid', 'Hibrit'], ['electric', 'Elektrik']
] as const

export const carSchema = z.object({
  brand: z.string().trim().min(1).max(80),
  model: z.string().trim().min(1).max(100),
  year: z.coerce.number().int().min(1990).max(2100),
  category: z.enum(['economy', 'compact', 'suv', 'luxury', 'sports', 'van']),
  price_per_day: z.coerce.number().finite().positive().max(100000),
  seats: z.coerce.number().int().min(1).max(30),
  transmission: z.enum(['automatic', 'manual']),
  fuel_type: z.enum(['petrol', 'diesel', 'hybrid', 'electric']),
  features: z.array(z.string().trim().min(1).max(120)).max(30),
  available: z.boolean()
})

export function parseCarForm(form: FormData) {
  return carSchema.safeParse({
    brand: form.get('brand'), model: form.get('model'), year: form.get('year'),
    category: form.get('category'), price_per_day: form.get('price_per_day'),
    seats: form.get('seats'), transmission: form.get('transmission'),
    fuel_type: form.get('fuel_type'), available: form.get('available') === 'on',
    features: String(form.get('features') || '').split('\n').map(x => x.trim()).filter(Boolean)
  })
}