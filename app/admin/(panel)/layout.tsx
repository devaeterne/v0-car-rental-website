import { SideNav } from '@/components/admin/side-nav'
import { requireAdmin } from '@/lib/admin/auth'
import { logoutAdmin } from '@/app/admin/actions'
export const dynamic = 'force-dynamic'
export default async function AdminPanelLayout({children}: {children:React.ReactNode}) {
  await requireAdmin()
  return <div className="min-h-screen bg-[#f5f6f8] text-slate-900 md:flex">
    <SideNav/>
    <main className="min-w-0 flex-1">
      <header className="flex items-center justify-between border-b bg-white px-5 py-4 md:px-9">
        <div><span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ad8f28]">X Royal Admin</span><div className="text-sm text-slate-500">Araç filosu yönetimi</div></div>
        <form action={logoutAdmin} className="md:hidden"><button className="rounded-lg border px-3 py-2 text-sm">Çıkış</button></form>
        <span className="hidden rounded-full bg-slate-100 px-3 py-2 text-xs md:block">Yönetici paneli</span>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-7 lg:px-10">{children}</div>
    </main>
  </div>
}