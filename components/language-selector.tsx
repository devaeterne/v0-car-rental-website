'use client'

import { useRouter } from 'next/navigation'
import { localeLabels, localeNames, siteLocales, type SiteLocale } from '@/lib/i18n'

export function LanguageSelector({ locale, dark = false }: { locale: SiteLocale; dark?: boolean }) {
  const router = useRouter()
  return <div className="inline-flex items-center gap-1" aria-label="Website language">
    {siteLocales.map(option => (
      <button type="button" key={option} lang={option === 'cnr' ? 'sr-Latn-ME' : option}
        aria-label={localeNames[option]} aria-pressed={locale === option}
        onClick={() => {
          document.cookie = 'xroyal_locale=' + option + '; Path=/; Max-Age=31536000; SameSite=Lax'
          document.documentElement.lang = option === 'cnr' ? 'sr-Latn-ME' : option
          router.refresh()
        }}
        className={'rounded-md px-2 py-1.5 text-[11px] font-extrabold tracking-wider transition-colors ' +
          (locale === option ? 'bg-[#e4c45c] text-black' : dark
            ? 'text-white/70 hover:bg-white/10 hover:text-white'
            : 'text-slate-700 hover:bg-slate-100')}
      >{localeLabels[option]}</button>
    ))}
  </div>
}
