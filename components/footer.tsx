import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin, ArrowRight, Instagram, Facebook } from 'lucide-react'

const PHONE_NUMBER = '+905359226099'
const WHATSAPP_URL = `https://wa.me/${PHONE_NUMBER.replace(/\+/g, '')}`

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0A0A0A] text-white border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="inline-block transition-transform hover:scale-105">
              <Image
                src="/xroyallogo.png"
                alt="X Royal Rent A Car"
                width={160}
                height={60}
                className="h-14 w-auto brightness-0 invert"
                priority
              />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm font-medium">
              Karadağ'ın (Montenegro) her noktasında lüks ve güvenli sürüş deneyimi. 
              Modern filomuz ve VIP hizmet anlayışımızla yolculuğunuzu sanata dönüştürüyoruz.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/karadag_xroyal_rent_a_car/" className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all group">
                <Instagram className="h-4 w-4 text-slate-400 group-hover:text-white" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61577019140459" className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all group">
                <Facebook className="h-4 w-4 text-slate-400 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Navigation Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            
            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Kurumsal</h3>
              <ul className="space-y-4">
                {['Ana Sayfa', 'Filomuz', 'Hakkımızda', 'İletişim'].map((item) => (
                  <li key={item}>
                    <Link href={`/${item.toLowerCase().replace('ı', 'i').replace(' ', '')}`} className="text-sm text-slate-400 hover:text-white transition-colors flex items-center group">
                      <ArrowRight className="h-3 w-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-primary" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div className="space-y-6">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Kategoriler</h3>
              <ul className="space-y-4">
                {[
                  { name: 'Lüks Araçlar', slug: 'luxury' },
                  { name: 'SUV & 4x4', slug: 'suv' },
                  { name: 'Ekonomik', slug: 'economy' },
                  { name: 'Spor', slug: 'sports' }
                ].map((cat) => (
                  <li key={cat.slug}>
                    <Link href={`/cars?category=${cat.slug}`} className="text-sm text-slate-400 hover:text-white transition-colors">
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-6 col-span-2 md:col-span-1">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Lokasyon</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-sm text-slate-400 leading-snug">
                    Podgorica Airport & Tivat Airport Deliveries, Montenegro
                  </span>
                </li>
                <li>
                  <a href={WHATSAPP_URL} className="flex items-center gap-3 group">
                    <div className="h-10 w-10 rounded-full bg-[#25D366]/10 flex items-center justify-center group-hover:bg-[#25D366] transition-colors">
                      <Phone className="h-4 w-4 text-[#25D366] group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">7/24 Destek</p>
                      <p className="text-sm font-bold text-white tracking-tight">+90 535 922 60 99</p>
                    </div>
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[11px] font-medium text-slate-500 tracking-wide uppercase">
            © {currentYear} X ROYAL RENT A CAR. ALL RIGHTS RESERVED.
          </p>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-600 tracking-[0.2em] uppercase">Crafted by</span>
            <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <span className="text-[11px] font-black tracking-tighter text-white">
                Da<span className="text-primary">Soft</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}