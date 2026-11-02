import { getSiteLocale } from '@/lib/i18n-server'
import { t } from '@/lib/i18n'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

import { Shield, Clock, Users, Award, MapPin, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'
import { getPublicPage, getSiteSettings } from '@/lib/site-content'
export const dynamic = 'force-dynamic'

const values = [
  {
    icon: Shield,
    title: 'GÜVENİRLİLİK',
    description: 'Tüm filomuz düzenli teknik denetimlerden geçer. Karadağ yollarında maksimum güvenlik için en genç araç parkuruna sahibiz.',
  },
  {
    icon: Clock,
    title: 'TAM ESNEKLİK',
    description: 'Değişen planlarınıza uyum sağlıyoruz. Havalimanı, otel veya dilediğiniz adrese teslimat seçenekleriyle zamanınız size kalsın.',
  },
  {
    icon: Users,
    title: 'MÜŞTERİ ODAKLI',
    description: 'Sadece bir araç değil, yerel rota danışmanlığı ve 7/24 kesintisiz destek ile tam bir seyahat deneyimi sunuyoruz.',
  },
  {
    icon: Award,
    title: 'PREMIUM KALİTE',
    description: 'Ekonomik modellerden lüks segment araçlara kadar her kategoride en yüksek temizlik ve konfor standartlarını sağlıyoruz.',
  },
]

export default async function AboutPage() {
  const locale = await getSiteLocale()
  const [page,company] = await Promise.all([getPublicPage('hakkimizda'),getSiteSettings()])
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      
      <main className="flex-1 pt-24">
        {/* Minimalist Hero Section */}
        <section className="relative py-24 overflow-hidden border-b border-slate-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center">
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4 inline-block">
              PREMIUM RENT A CAR
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 uppercase leading-none">
              {locale !== 'tr' ? t(locale,'Yolculuğun Zirve Noktası') : page?.title ?? <>Yolculuğun <br />
              <span className="text-primary/20 stroke-primary text-transparent [-webkit-text-stroke:1px_theme(colors.primary)]">Zirve Noktası</span></>}
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-base md:text-lg font-medium text-slate-500 leading-relaxed">
              {locale === 'tr' ? page?.intro || 'X Royal Rent A Car, Karadağ’ın eşsiz coğrafyasını keşfetmeniz için tasarlanmış, prestij ve güveni birleştiren yeni nesil kiralama çözümüdür.' : locale === 'en' ? 'Discover Montenegro with our reliable and comfortable car rental service.' : 'Otkrijte Crnu Goru uz pouzdanu i udobnu uslugu iznajmljivanja automobila.'}
            </p>
          </div>
          
          {/* Arka Plan Dekoratif Yazı */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[15vw] font-black text-slate-50/50 select-none pointer-events-none whitespace-nowrap leading-none">
            X ROYAL EXPERIENCE
          </div>
        </section>

        {/* Story Section - Modern Split Layout */}
        <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-square lg:aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-2xl">
                <div className="absolute inset-0 bg-slate-900/10 z-10" />
                <Image 
                    src="https://images.unsplash.com/photo-1777015558094-f92d538f9c80?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Buraya şık bir Karadağ manzarası veya araç görseli koyabilirsin
                    alt="Karadağ Araç Kiralama"
                    fill
                    className="object-cover"
                />
            </div>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl font-black tracking-tight text-slate-900 uppercase">
                  Karadağ&apos;da <span className="text-primary">{t(locale, 'Hikayemiz')}</span>
                </h2>
                <div className="h-1.5 w-20 bg-primary rounded-full" />
              </div>
              
              <div className="space-y-6 text-slate-600 font-medium leading-relaxed">
                {((locale === 'en' ? 'Based in Podgorica, X Royal Rent A Car delivers a comfortable and reliable car rental experience in Montenegro.\n\nExplore the Adriatic coast, mountain routes and historic towns with flexible vehicle pickup and dedicated support.' : locale === 'cnr' ? 'X Royal Rent A Car sa sjedištem u Podgorici pruža udobno i pouzdano iznajmljivanje vozila u Crnoj Gori.\n\nOtkrijte primorje, planine i istorijske gradove uz fleksibilno preuzimanje vozila i posvećenu podršku.' : page?.body) || "Karadağ'ın büyüleyici başkenti Podgorica merkezli kurulan X Royal Rent A Car, bölgeye gelen misafirlerimizin en büyük ihtiyacı olan sorunsuz mobilite kavramını yeniden tanımlamak için yola çıktı.\n\nAmacımız, ister iş seyahati ister tatil amaçlı olsun, ziyaretçilerimize Karadağ'ın her köşesini en konforlu araçlarla keşfetme imkanı sunmaktır.")
                  .split(/\n\s*\n/).filter(Boolean).map((paragraph,index) => <p key={index} className="whitespace-pre-line">{paragraph}</p>)}
                
                <ul className="grid gap-3 pt-4">
                    {['Resmi Havalimanı Teslimatı', 'Gizli Ücret Yok', 'Yeni Model Araç Filosu'].map((item) => (
                        <li key={item} className="flex items-center gap-3 text-slate-900 font-bold text-sm">
                            <CheckCircle2 className="h-5 w-5 text-primary" /> {item}
                        </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section - Dark Contrast */}
        <section className="bg-slate-900 py-32 overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white uppercase italic">
                {t(locale, 'Bizi Farklı Kılan')} <span className="text-primary">{t(locale, 'Standartlarımız')}</span>
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <div key={t(locale,value.title)} className="group relative p-8 rounded-[2rem] bg-white/5 border border-white/10 transition-all hover:bg-white/10">
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-[13px] font-black tracking-widest text-white uppercase italic">
                    {t(locale,value.title)}
                  </h3>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed">
                    {t(locale,value.description)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
{/* Detailed Location & Contact Section */}
<section className="py-24 bg-slate-50">
  <div className="mx-auto max-w-7xl px-6 lg:px-8">
    <div className="rounded-[3rem] bg-white p-8 md:p-16 shadow-xl border border-slate-100 flex flex-col md:flex-row gap-12 items-center">
      <div className="flex-1 space-y-6 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase">
            <MapPin className="h-3 w-3" /> {t(locale, 'Lokasyon Bilgisi')}
        </div>
        <h2 className="text-4xl font-black tracking-tight text-slate-900 uppercase leading-none">
          {company.location_label}
        </h2>
        <p className="text-slate-500 font-medium leading-relaxed">
          Podgorica ve Tivat Havalimanları başta olmak üzere, Karadağ genelinde 7/24 araç teslimatı ve iadesi gerçekleştiriyoruz. Ofisimize gelmenize gerek kalmadan, aracınızı terminal çıkışında teslim alabilirsiniz.
        </p>
        
        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a 
              href={company.map_url || "/iletisim"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-4 bg-primary text-white font-black uppercase tracking-[0.2em] text-[11px] inline-flex items-center justify-center hover:bg-slate-900 transition-all rounded-none shadow-lg shadow-primary/20"
            >
                <MapPin className="mr-2 h-4 w-4" /> Haritada Görüntüle
            </a>
            <a href="/iletisim" className="px-8 py-4 bg-slate-900 text-white font-black uppercase tracking-[0.2em] text-[11px] inline-flex items-center justify-center hover:bg-primary transition-all rounded-none shadow-lg shadow-slate-900/20">
                Bize Ulaşın
            </a>
        </div>
      </div>
      
      {/* İnteraktif Harita Önizleme Alanı */}
      <div className="w-full md:w-[45%] relative group overflow-hidden rounded-[2.5rem] shadow-2xl">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d5894.460773663363!2d19.243555!3d42.380252!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x134ded5264b976f9%3A0xdb0f0d0aeb8e23e0!2sX%20Royal%20Rent%20a%20Car!5e0!3m2!1str!2str!4v1715000000000!5m2!1str!2str"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="grayscale hover:grayscale-0 transition-all duration-700 contrast-125"
        ></iframe>
        
        {/* Harita Üzeri Overlay (Mobil Kullanıcı Deneyimi İçin) */}
        <div className="absolute inset-0 pointer-events-none border-[12px] border-white/10 rounded-[2.5rem]"></div>
      </div>
    </div>
  </div>
</section>
      </main>
      
      <Footer />
    </div>
  )
}