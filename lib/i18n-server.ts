import 'server-only'
import { cookies } from 'next/headers'
import { normalizeLocale, type SiteLocale } from './i18n'

export async function getSiteLocale(): Promise<SiteLocale> {
  const store = await cookies()
  return normalizeLocale(store.get('xroyal_locale')?.value)
}
