import { getSiteSettings } from '@/lib/site-content'
import { HeaderClient } from '@/components/header-client'

export async function Header() {
  const company = await getSiteSettings()
  return <HeaderClient whatsappPhone={company.whatsapp_phone}/>
}
