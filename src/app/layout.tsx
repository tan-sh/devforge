import { Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/ui/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'DevForge - Developer Tools Hub',
  description: 'All-in-one developer utilities dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <div className="relative flex min-h-screen flex-col">
          <Navigation />
          {children}
        </div>
      </body>
    </html>
  )
}
