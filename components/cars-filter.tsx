'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X } from 'lucide-react'

const categories = [
  { value: 'all', label: 'Tüm Kategoriler' },
  { value: 'economy', label: 'Ekonomik' },
  { value: 'compact', label: 'Kompakt' },
  { value: 'suv', label: 'SUV' },
  { value: 'luxury', label: 'lüks' },
  { value: 'sports', label: 'Spor' },
  { value: 'van', label: 'Van' },
]

const transmissions = [
  { value: 'all', label: 'Tüm Vites Türleri' },
  { value: 'automatic', label: 'Otomatik' },
  { value: 'manual', label: 'Manuel' },
]

const fuelTypes = [
  { value: 'all', label: 'Tüm Yakit Türleri' },
  { value: 'petrol', label: 'Benzin' },
  { value: 'diesel', label: 'Dizel' },
  { value: 'electric', label: 'Elektrik' },
  { value: 'hybrid', label: 'Hibrit' },
]

export function CarsFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get('category') || 'all'
  const currentTransmission = searchParams.get('transmission') || 'all'
  const currentFuel = searchParams.get('fuel') || 'all'

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`/cars?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/cars')
  }

  const hasFilters = currentCategory !== 'all' || currentTransmission !== 'all' || currentFuel !== 'all'

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-[160px] flex-1 space-y-2">
          <Label htmlFor="category">Kategori</Label>
          <Select value={currentCategory} onValueChange={(v) => updateFilter('category', v)}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Kategori secin" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[160px] flex-1 space-y-2">
          <Label htmlFor="transmission">Vites</Label>
          <Select value={currentTransmission} onValueChange={(v) => updateFilter('transmission', v)}>
            <SelectTrigger id="transmission">
              <SelectValue placeholder="Vites secin" />
            </SelectTrigger>
            <SelectContent>
              {transmissions.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[160px] flex-1 space-y-2">
          <Label htmlFor="fuel">Yakıt Türü</Label>
          <Select value={currentFuel} onValueChange={(v) => updateFilter('fuel', v)}>
            <SelectTrigger id="fuel">
              <SelectValue placeholder="Yakit turu secin" />
            </SelectTrigger>
            <SelectContent>
              {fuelTypes.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasFilters && (
          <Button variant="outline" onClick={clearFilters} className="gap-2">
            <X className="h-4 w-4" />
            Filtreleri Temizle
          </Button>
        )}
      </div>
    </div>
  )
}
