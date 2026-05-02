import { Shield, Clock, MapPin, Headphones, ArrowUpRight } from 'lucide-react'

const features = [
  {
    icon: MapPin,
    title: 'Havalimanı Teslimat',
    description: 'Podgorica ve Tivat Havalimanlarında sizi isminizle karşılıyoruz. Evrak işleriyle uğraşmadan aracınızı kapıda teslim alın.',
    highlight: 'Hızlı Karşılama'
  },
  {
    icon: Shield,
    title: 'Full Kasko Güvencesi',
    description: 'Tüm araçlarımız Karadağ yollarına tam uyumlu ve kapsamlı sigorta altındadır. Sürpriz maliyetlerle karşılaşmazsınız.',
    highlight: 'Güvenli Sürüş'
  },
  {
    icon: Clock,
    title: 'Esnek Teslimat',
    description: 'Aracınızı otelinize veya bulunduğunuz adrese getiriyoruz. Kiralama bitiminde farklı bir noktada teslim etme kolaylığı.',
    highlight: '7/24 Esneklik'
  },
  {
    icon: Headphones,
    title: 'Yerel Uzman Desteği',
    description: 'Sadece araç değil, Karadağ hakkında rota önerileri ve 7/24 yol yardımı ile her zaman yanınızdayız.',
    highlight: 'Anlık Destek'
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-white">
      {/* Arka Plan Dekorasyonu */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-[0.03]">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center mb-20">
          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4 bg-primary/5 px-4 py-1 rounded-full">
            Neden Biz?
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase">
            X Royal <span className="text-primary">Farkını</span> Yaşayın
          </h2>
          <div className="mt-4 h-1.5 w-24 bg-primary rounded-full" />
          <p className="mt-6 max-w-2xl text-base font-medium text-slate-500 leading-relaxed">
            Karadağ seyahatinizde araç kiralamanın ötesinde, konforlu ve prestijli bir karşılama deneyimi sunuyoruz.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-8 transition-all duration-500 hover:-translate-y-2"
            >
              {/* Kart Arka Planı */}
              <div className="absolute inset-0 bg-slate-50 rounded-[2rem] transition-all duration-500 group-hover:bg-white group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-transparent group-hover:border-slate-100" />

              <div className="relative z-10">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:rotate-[10deg]">
                  <feature.icon className="h-7 w-7" />
                </div>
                
                <span className="block text-[10px] font-black text-primary/40 uppercase tracking-widest mb-2">
                  {feature.highlight}
                </span>
                
                <h3 className="mb-3 text-xl font-black tracking-tight text-slate-900">
                  {feature.title}
                </h3>
                
                <p className="text-sm font-medium leading-relaxed text-slate-500 mb-6">
                  {feature.description}
                </p>

                <div className="flex items-center text-[11px] font-bold text-slate-900 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                  Detayları Keşfet <ArrowUpRight className="ml-1 h-3 w-3 text-primary" />
                </div>
              </div>

              {/* Köşe Numarası */}
              <div className="absolute top-8 right-8 text-4xl font-black text-slate-200/40 group-hover:text-primary/10 transition-colors pointer-events-none">
                0{index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}