import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3001'),
  title: 'Meera & Aarav — Royal Wedding Invitation',
  description: 'Together with their families, Meera and Aarav joyfully invite you to celebrate their wedding · 18–19 December 2026 · The Oberoi Rajvilas, Jaipur.',
  openGraph: {
    type: 'website',
    title: 'Meera & Aarav — Royal Wedding Invitation',
    description: 'Together with their families, Meera and Aarav joyfully invite you to celebrate their wedding · 18–19 December 2026 · The Oberoi Rajvilas, Jaipur.',
    images: [{ url: '/assets/images/og.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#081610',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Pinyon+Script&family=Plus+Jakarta+Sans:wght@300;400;500;600&family=Tiro+Devanagari+Hindi&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}