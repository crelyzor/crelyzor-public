import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

export const viewport: Viewport = {
    themeColor: '#0a0a0a',
};

export const metadata: Metadata = {
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_BASE_URL ?? 'https://cards.crelyzor.com'
    ),
    title: {
        default: 'Crelyzor Cards',
        template: '%s | Crelyzor',
    },
    description: 'Share your professional identity with a single link.',
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'Crelyzor',
        startupImage: '/api/icon?size=512',
    },
    openGraph: {
        type: 'website',
        siteName: 'Crelyzor Cards',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={inter.variable}>
            <head>
                <link rel="apple-touch-icon" sizes="192x192" href="/api/icon?size=192" />
                <link rel="apple-touch-icon" sizes="512x512" href="/api/icon?size=512" />
                <meta name="mobile-web-app-capable" content="yes" />
            </head>
            <body className="antialiased" suppressHydrationWarning>{children}</body>
        </html>
    );
}
