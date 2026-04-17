import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Regcat - Regex Tester & Explainer',
    short_name: 'Regcat',
    description: 'Free regex tester with instant pattern explanations. No API costs, unlimited usage.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#0a0a0a',
    theme_color: '#00ff99',
    categories: ['productivity', 'utilities'],
    icons: [
      {
        src: '/regcat.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/regcat.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/regcat.svg',
        sizes: '540x720',
        form_factor: 'narrow',
        type: 'image/svg+xml',
      },
    ],
  };
}
