import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://aksh-aditi-wedding-invitation.vercel.app'),
  title: 'Jainam & Siddhi — Wedding Invitation',
  description: 'Together with their families, Jainam and Siddhi joyfully invite you to celebrate their wedding · 11–12 December 2026 · Shree Jain Diwakar Tapovan Bhawan, Dungla.',
  openGraph: {
    type: 'website',
    title: 'Jainam & Siddhi — Wedding Invitation',
    description: 'Together with their families, Jainam and Siddhi joyfully invite you to celebrate their wedding · 11–12 December 2026 · Shree Jain Diwakar Tapovan Bhawan, Dungla.',
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
  themeColor: '#dfe5d0',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="C">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Cinzel:wght@400;500;600;700&family=Gilda+Display&family=Pinyon+Script&family=Jost:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Tiro+Devanagari+Hindi:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
