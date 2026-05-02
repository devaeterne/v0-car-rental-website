import type { Metadata, Viewport } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' })
const poppins = Poppins({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins'
})

export const metadata: Metadata = {
  title: 'X Royal Rent A Car | Karadağ Araç Kiralama',
  description: 'Karadağ Podgorica\'da güvenilir ve uygün fiyatli Araç kiralama hizmeti. Premium Araçlar, 7/24 destek. Hemen rezervasyon yapin!',
  generator: 'v0.app',
  keywords: ['Araç kiralama', 'rent a car', 'Karadağ', 'Montenegro', 'Podgorica', 'X Royal'],
  icons: {
    icon: '/xroyallogo.png',
    apple: '/xroyallogo.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1a1a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" className="bg-background">
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
