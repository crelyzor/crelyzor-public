import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#111110' },
    { media: '(prefers-color-scheme: light)', color: '#F0ECE5' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? 'https://crelyzor.app'
  ),
  title: {
    default: 'Crelyzor',
    template: '%s | Crelyzor',
  },
  description:
    'Crelyzor is your all-in-one professional identity platform. Create a digital card, record and transcribe meetings with AI, schedule calls — all connected.',
  keywords: [
    'digital business card',
    'AI meeting transcription',
    'scheduling',
    'professional profile',
    'contact sharing',
    'meeting summary AI',
  ],
  robots: { index: true, follow: true },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/assets/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/assets/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/assets/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Crelyzor',
  },
  openGraph: {
    type: 'website',
    siteName: 'Crelyzor',
    images: [
      {
        url: '/assets/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Crelyzor',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@crelyzor',
    creator: '@crelyzor',
    images: ['/assets/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
