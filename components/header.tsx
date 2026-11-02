import { getSiteLocale } from '@/lib/i18n-server'
import { getSiteSettings } from '@/lib/site-content'
import { HeaderClient } from '@/components/header-client'

export async function Header() {
  const [company, locale] = await Promise.all([getSiteSettings(),getSiteLocale()])
  return <HeaderClient whatsappPhone={company.whatsapp_phone} locale={locale}/>
}
