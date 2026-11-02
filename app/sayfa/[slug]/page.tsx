import { getSiteLocale } from '@/lib/i18n-server'
import { t } from '@/lib/i18n'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { getPublicPage } from '@/lib/site-content'

type Props = {params:Promise<{slug:string}>}
export const dynamic = 'force-dynamic'

export async function generateMetadata({params}:Props): Promise<Metadata> {
  const {slug} = await params
  const page = await getPublicPage(slug)
  return {title:page ? page.title + ' | X Royal Rent A Car' : 'Sayfa bulunamadı'}
}

export default async function CustomSitePage({params}:Props) {
  const locale = await getSiteLocale()
  const {slug} = await params
  const page = await getPublicPage(slug)
  if (!page || page.is_system) notFound()
  return <div className="flex min-h-screen flex-col bg-white">
    <Header/>
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 pb-24 pt-40">
      <div className="mb-12 border-b pb-10">
        <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-amber-600">X Royal Rent A Car</span>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-6xl">{page.title}</h1>
        {page.intro && <p className="mt-6 text-lg leading-8 text-slate-600">{page.intro}</p>}
      </div>
      <article className="space-y-6 text-base leading-8 text-slate-700">
        {page.body.split(/\n\s*\n/).filter(Boolean).map((paragraph,index) =>
          <p key={index} className="whitespace-pre-line">{paragraph}</p>)}
      </article>
      <Link href="/" className="mt-16 inline-block text-sm font-bold text-amber-700 hover:underline">{t(locale, 'Ana sayfaya dön')}</Link>
    </main>
    <Footer/>
  </div>
}
