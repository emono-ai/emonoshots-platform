// src/app/layout.tsx — Root Layout
import type { Metadata, Viewport } from 'next';
import { Bebas_Neue, DM_Sans, DM_Mono } from 'next/font/google';
import { Providers } from '@/components/layout/Providers';
import { CinematicCursor } from '@/components/ui/CinematicCursor';
import '@/styles/globals.css';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const dmMono = DM_Mono({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-dm-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'EMONOSHOTS — Frames That Hit Different.',
    template: '%s | EMONOSHOTS',
  },
  description:
    'Cinematic automotive, drift, architecture, street, and portrait photography from Casablanca, Morocco.',
  keywords: [
    'EMONOSHOTS', 'photography', 'Casablanca', 'Morocco', 'automotive photography',
    'drift photography', 'motorsports', 'architecture', 'cinematic portraits', 'street photography',
  ],
  authors: [{ name: 'EMONOSHOTS', url: 'https://emonoshots.ma' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://emonoshots.ma',
    siteName: 'EMONOSHOTS',
    title: 'EMONOSHOTS — Frames That Hit Different.',
    description: 'Cinematic photography from the streets of Casablanca.',
    images: [
      { url: '/og-image.jpg', width: 1200, height: 630, alt: 'EMONOSHOTS' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EMONOSHOTS',
    description: 'Frames That Hit Different.',
    images: ['/og-image.jpg'],
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://emonoshots.ma'),
};

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${dmSans.variable} ${dmMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-brand-black text-white antialiased overflow-x-hidden cursor-none">
        <Providers>
          <CinematicCursor />
          {children}
        </Providers>
      </body>
    </html>
  );
}
