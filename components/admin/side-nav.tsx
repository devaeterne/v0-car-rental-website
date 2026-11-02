import Link from 'next/link'
import { CarFront, ExternalLink, FileCode2, LayoutDashboard, LogOut, Plus, Building2, FileText } from 'lucide-react'
import { logoutAdmin } from '@/app/admin/actions'
export function SideNav() {
  return <aside className="flex w-full shrink-0 flex-col bg-[#17191c] text-white md:min-h-screen md:w-64">
    <Link href="/admin" className="flex items-center gap-3 border-b border-white/10 px-6 py-7">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e4c45c] text-[#17191c]"><CarFront /></span>
      <span><strong className="block tracking-[0.18em]">X ROYAL</strong><small className="text-[10px] uppercase tracking-widest text-white/50">Admin Panel By Dasoft</small></span>
    </Link>
    <nav className="flex flex-wrap gap-1 px-3 py-4 md:flex-col" aria-label="Admin menüsü">
      <Link href="/admin" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm hover:bg-white/10"><LayoutDashboard className="h-4 w-4 text-[#e4c45c]" /> Filo yönetimi</Link>
      <Link href="/admin/cars/new" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm hover:bg-white/10"><Plus className="h-4 w-4 text-[#e4c45c]" /> Yeni araç</Link>
      <Link href="/admin/company" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm hover:bg-white/10"><Building2 className="h-4 w-4 text-[#e4c45c]" /> Şirket bilgileri</Link>
      <Link href="/admin/pages" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm hover:bg-white/10"><FileText className="h-4 w-4 text-[#e4c45c]" /> İçerik ve sayfalar</Link>
      <a href="/feeds/cars.xml" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm hover:bg-white/10"><FileCode2 className="h-4 w-4 text-[#e4c45c]" /> XML Feed <ExternalLink className="ml-auto h-3 w-3" /></a>
      <Link href="/cars" target="_blank" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm hover:bg-white/10"><CarFront className="h-4 w-4 text-[#e4c45c]" /> Web sitesi</Link>
    </nav>
    <div className="mt-auto hidden border-t border-white/10 p-4 md:block"><form action={logoutAdmin}><button className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm hover:bg-white/10"><LogOut className="h-4 w-4" /> Çıkış yap</button></form></div>
  </aside>
}