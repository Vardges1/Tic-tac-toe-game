import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Крестики-Нолики | Играй и выигрывай промокоды!',
  description: 'Красивая игра в крестики-нолики с промокодами на скидку. Выиграй и получи промокод на скидку прямо в Telegram!',
  keywords: 'крестики-нолики, игра, промокод, скидка, telegram',
  openGraph: {
    title: 'Крестики-Нолики | Играй и выигрывай промокоды!',
    description: 'Красивая игра в крестики-нолики с промокодами на скидку',
    type: 'website',
    locale: 'ru_RU',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Крестики-Нолики | Играй и выигрывай промокоды!',
    description: 'Красивая игра в крестики-нолики с промокодами на скидку',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ec4899',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}

