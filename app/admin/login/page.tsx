import Link from 'next/link'
import { CarFront, LockKeyhole } from 'lucide-react'
import { loginAdmin } from '@/app/admin/actions'
export const dynamic = 'force-dynamic'
export default async function LoginPage({searchParams}: {searchParams:Promise<{error?:string}>}) {
  const {error} = await searchParams
  const message = error === 'config' ? 'Admin yapılandırması eksik.'
    : error === 'access' ? 'Bu hesabın yönetici yetkisi yok.'
    : error === 'auth' ? 'Supabase giriş doğrulaması başarısız. Şifrenizi kontrol edin.'
    : error ? 'Kullanıcı adı veya şifre hatalı.' : null
  return <div className="flex min-h-screen items-center justify-center bg-[#15171a] px-4 py-10">
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl sm:p-10">
      <div className="mb-8 text-center">
        <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-[#e4c45c]"><CarFront className="h-8 w-8 text-black"/></span>
        <h1 className="text-3xl font-extrabold tracking-wide">X ROYAL</h1>
        <p className="mt-2 text-sm text-slate-500">Filo yönetim paneli</p>
      </div>
      {message && <p role="alert" className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{message}</p>}
      <form action={loginAdmin} className="space-y-5">
        <div><label htmlFor="username" className="mb-2 block text-sm font-semibold">Kullanıcı adı veya e-posta</label><input id="username" name="username" required autoComplete="username" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-500"/></div>
        <div><label htmlFor="password" className="mb-2 block text-sm font-semibold">Şifre</label><input id="password" name="password" type="password" required autoComplete="current-password" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-500"/></div>
        <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#17191c] px-5 py-3.5 font-semibold text-white hover:bg-slate-700"><LockKeyhole className="h-4 w-4"/> Giriş yap</button>
      </form>
      <p className="mt-8 text-center text-xs text-slate-400">Yalnızca yetkili personel • <Link href="/" className="underline">Siteye dön</Link></p>
    </div>
  </div>
}