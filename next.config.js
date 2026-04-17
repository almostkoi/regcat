/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Add security headers
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          // Enable HSTS for HTTPS enforcement
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          // SameSite cookie for CSRF protection
          {
            key: 'Set-Cookie',
            value: 'sessionId=; SameSite=Strict; Secure; HttpOnly; Path=/',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=(), payment=()',
          },
        ],
      },
    ];
  },

  poweredByHeader: false,
  compress: true,
};

module.exports = nextConfig;
