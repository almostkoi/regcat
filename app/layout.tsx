/**
 * Root layout for the application
 */

import type { Metadata, Viewport } from 'next';
import '@/app/globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#00ff99',
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  title: 'Regcat - Regex Tester & AI Explainer',
  description: 'Production-ready regex tester with instant pattern explanations. Test, debug, and understand regex patterns with zero API costs.',
  keywords: ['regex', 'tester', 'explainer', 'regex101', 'pattern matching', 'javascript'],
  authors: [{ name: 'Regcat' }],

  // OpenGraph
  openGraph: {
    title: 'Regcat - Regex Tester & Explainer',
    description: 'Test regex patterns and get instant explanations. Free and fast.',
    url: 'https://regcat.shusui.dev',
    siteName: 'Regcat',
    images: [
      {
        url: 'https://regcat.shusui.dev/regcat.png',
        width: 512,
        height: 512,
        alt: 'Regcat - Regex Tester',
        type: 'image/png',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Regcat - Regex Tester & Explainer',
    description: 'Free regex tester with instant pattern explanations. No API costs, unlimited usage.',
    images: ['https://regcat.shusui.dev/regcat.png'],
    creator: '@regcat',
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Regcat',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-regcat-bg text-regcat-text font-mono">
        {children}
      </body>
    </html>
  );
}
