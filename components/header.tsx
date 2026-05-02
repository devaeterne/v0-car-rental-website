'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X, MessageCircle, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const PHONE_NUMBER = '+905359226099'
const WHATSAPP_URL = `https://wa.me/${PHONE_NUMBER.replace(/\+/g, '')}`

const navLinks = [
  { name: 'ANA SAYFA', href: '/' },
  { name: 'FİLOMUZ', href: '/cars' },
  { name: 'HAKKIMIZDA', href: '/hakkimizda' },
  { name: 'İLETİŞİM', href: '/iletisim' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className={cn(
        "fixed top-0 z-[100] w-full transition-all duration-500",
        scrolled 
          ? "bg-white/80 backdrop-blur-xl py-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-b border-slate-100" 
          : "bg-transparent py-5"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
        
        {/* Logo Alanı */}
        <div className="flex-1">
          <Link href="/" className="inline-block transition-transform duration-300 hover:scale-[1.02]">
            <Image
              src="/xroyallogo.png"
              alt="X Royal Rent A Car"
              width={160}
              height={64}
              className={cn(
                "h-12 w-auto object-contain transition-all duration-500",
                scrolled ? "scale-90" : "scale-100"
              )}
              priority
            />
          </Link>
        </div>

        {/* Masaüstü Navigasyon - Mimari ve Dengeli */}
        <nav className="hidden items-center gap-2 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="group relative px-5 py-2"
            >
              <span className="text-[11px] font-black tracking-[0.25em] text-slate-900 transition-colors group-hover:text-primary">
                {link.name}
              </span>
              <span className="absolute inset-x-5 bottom-0 h-[2px] scale-x-0 bg-primary transition-transform duration-500 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        {/* Sağ Taraf - Tek Odak: WhatsApp */}
        <div className="hidden flex-1 items-center justify-end lg:flex">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <Button 
              className="h-12 rounded-none bg-slate-900 px-8 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-primary hover:shadow-xl hover:shadow-primary/20 active:scale-[0.98]"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              WhatsApp
              <ArrowUpRight className="ml-2 h-3 w-3 opacity-50" />
            </Button>
          </a>
        </div>

        {/* Mobil Menü Kontrolü */}
        <div className="lg:hidden">
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg shadow-slate-900/20"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobil Full-Screen Menü Efekti */}
      <div 
        className={cn(
          "fixed inset-0 top-[73px] z-[-1] bg-white transition-all duration-500 lg:hidden",
          mobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        )}
      >
        <div className="flex h-full flex-col justify-between p-8">
          <div className="space-y-6 pt-12">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block text-4xl font-black tracking-tighter text-slate-900 uppercase hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="pb-12">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <Button className="h-16 w-full rounded-none bg-[#25D366] text-[13px] font-black uppercase tracking-[0.2em] text-white">
                WHATSAPP İLE İLETİŞİM
              </Button>
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}