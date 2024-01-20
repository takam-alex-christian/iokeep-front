import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false


import { NextUiProviderWrapper } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Iokeepv2',
  description: 'A nextgen note taking app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextUiProviderWrapper>{children}</NextUiProviderWrapper>
        </body>
    </html>
  )
}
