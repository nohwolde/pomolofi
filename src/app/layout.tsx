import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PomoLofi',
  description: 'A peaceful productivity app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <script defer src="https://cloud.umami.is/script.js" data-website-id="e2e5fb42-7329-49ae-a205-f217743f69c3"></script>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
