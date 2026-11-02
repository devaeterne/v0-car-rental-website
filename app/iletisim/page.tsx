import { getSiteLocale } from '@/lib/i18n-server'
import { t } from '@/lib/i18n'
import type { LucideIcon } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Phone, MapPin, Clock, MessageCircle, Mail } from 'lucide-react'
import { getPublicPage, getSiteSettings, telHref, whatsappHref } from '@/lib/site-content'
export const dynamic = 'force-dynamic'

export default async function ContactPage() {
  const locale = await getSiteLocale()
  const [page,company] = await Promise.all([getPublicPage('iletisim'),getSiteSettings()])
  const PHONE_NUMBER = company.phone
  const WHATSAPP_URL = whatsappHref(company.whatsapp_phone) + '?text=' + encodeURIComponent(t(locale,'Merhaba, araç kiralama hakkında bilgi almak istiyorum.'))
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="flex-1 pt-20">
        {/* Modern Hero Section */}
        <section className="relative py-24 bg-slate-900 overflow-hidden">
          {/* Arka plan deseni */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px]" />
          </div>

          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center">
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4 inline-block">
              {t(locale, '7/24 Kesintisiz Destek')}
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase mb-6">
              {locale !== 'tr' ? t(locale,'Bize Ulaşın') : page?.title ?? <>Bize <span className="text-primary">Ulaşın</span></>}
            </h1>
            <p className="mx-auto max-w-2xl text-lg font-medium text-slate-400 leading-relaxed">
              {locale !== 'tr' ? (locale === 'en' ? 'Professional car rental for your journey in Montenegro. Contact us for questions, special requests or reservation support.' : 'Profesionalno iznajmljivanje vozila u Crnoj Gori. Kontaktirajte nas za pitanja, posebne zahtjeve ili rezervacije.') : page?.intro || 'Karadağ seyahatiniz için profesyonel araç kiralama çözümleri. Sorularınız, özel talepleriniz veya rezervasyon desteği için yanınızdayız.'}
            </p>
          </div>
        </section>

        {/* Contact Info Grid */}
        <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid gap-12 lg:grid-cols-12 items-start">

            {/* Sol Taraf: İletişim Kartları */}
            <div className="lg:col-span-7 grid gap-6 sm:grid-cols-2">
              <ContactCard
                icon={Phone}
                title={t(locale,"HIZLI HAT")}
                value={company.phone}
                sub={t(locale,"Doğrudan arama yapın")}
                link={telHref(PHONE_NUMBER)}
              />
              <ContactCard
                icon={MessageCircle}
                title="WHATSAPP"
                value={t(locale,"Mesaj Gönder")}
                sub={t(locale,"Anlık bilgi ve teklif alın")}
                link={WHATSAPP_URL}
                isWhatsApp
              />
              <ContactCard
                icon={MapPin}
                title={t(locale,"LOKASYON")}
                value={company.location_label}
                sub={t(locale,"Havalimanı ve otel teslimatı")}
                link={company.map_url || undefined}
              />
              <ContactCard
                icon={Clock}
                title={t(locale,"ÇALIŞMA SAATLERİ")}
                value={company.opening_hours}
                sub={t(locale,"Haftanın her günü açığız")}
              />
            </div>

            {/* Sağ Taraf: Büyük CTA Kartı */}
            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <Card className="border-none shadow-2xl rounded-[2.5rem] bg-slate-50 overflow-hidden">
                <div className="h-3 bg-primary w-full" />
                <CardContent className="p-10">
                  <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase mb-4 leading-tight">
                    {t(locale, 'Hemen Rezervasyon')} <br /> <span className="text-primary">{t(locale, 'Oluşturun')}</span>
                  </h2>
                  <p className="text-slate-500 font-medium leading-relaxed mb-8">
                    {locale !== 'tr' ? (locale === 'en' ? 'The fastest way to reserve your car is to contact us on WhatsApp. Our team will help you find the right offer.' : 'Najbrži način da rezervišete vozilo je putem WhatsAppa. Naš tim će vam pomoći da pronađete najbolju ponudu.') : page?.body || 'Hayalinizdeki aracı kiralamak için en hızlı yol WhatsApp üzerinden bizimle iletişime geçmektir. Ekibimiz dakikalar içinde size en uygun teklifi sunacaktır.'}
                  </p>

                  <div className="space-y-4">
                    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="block group">
                      <Button className="w-full h-16 rounded-2xl bg-[#25D366] hover:bg-[#1fb355] text-white text-base font-black uppercase tracking-wider shadow-lg shadow-[#25D366]/20 transition-all group-hover:scale-[1.02]">
                        <MessageCircle className="mr-3 h-6 w-6" />
                        {t(locale, 'WHATSAPP İLE BAĞLAN')}
                      </Button>
                    </a>

                    <a href={telHref(PHONE_NUMBER)} className="block group">
                      <Button variant="outline" className="w-full h-16 rounded-2xl border-2 border-slate-900 bg-transparent hover:bg-slate-900 hover:text-white text-slate-900 text-base font-black uppercase tracking-wider transition-all group-hover:scale-[1.02]">
                        <Phone className="mr-3 h-5 w-5" />
                        {t(locale, 'HEMEN ARA')}
                      </Button>
                    </a>
                  </div>

                  <div className="mt-8 flex items-center justify-center gap-2 text-slate-400">
                    <Mail className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-widest italic">Destek: {company.contact_email}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Harita Alanı (Opsiyonel) */}
        <section className="px-6 lg:px-8 pb-24 max-w-7xl mx-auto">
            <div className="h-[450px] w-full rounded-[3rem] overflow-hidden shadow-xl grayscale contrast-125 border border-slate-100">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d5894.460773663363!2d19.243555!3d42.380252!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x134ded5264b976f9%3A0xdb0f0d0aeb8e23e0!2sX%20Royal%20Rent%20a%20Car!5e0!3m2!1str!2str!4v1715000000000!5m2!1str!2str"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

// Özel Kart Bileşeni
function ContactCard({ icon: Icon, title, value, sub, link, isWhatsApp }: {icon:LucideIcon;title:string;value:string;sub:string;link?:string;isWhatsApp?:boolean}) {
  const content = (
    <Card className={cn(
      "group border-none shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1 overflow-hidden",
      isWhatsApp ? "bg-[#25D366]/5" : "bg-slate-50"
    )}>
      <CardContent className="p-8">
        <div className={cn(
          "h-12 w-12 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-500",
          isWhatsApp ? "bg-[#25D366] text-white" : "bg-white text-primary group-hover:bg-primary group-hover:text-white shadow-sm"
        )}>
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase mb-2">
          {title}
        </h3>
        <p className={cn(
          "text-xl font-black tracking-tight mb-1",
          isWhatsApp ? "text-[#25D366]" : "text-slate-900"
        )}>
          {value}
        </p>
        <p className="text-sm font-medium text-slate-500">
          {sub}
        </p>
      </CardContent>
    </Card>
  )

  if (link) {
    return (
      <a href={link} target={link.startsWith('http') ? "_blank" : undefined} rel="noopener noreferrer">
        {content}
      </a>
    )
  }

  return content
}

// Yardımcı fonksiyon
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
