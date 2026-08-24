import type { NextConfig } from 'next';

/**
 * Заголовки заданы здесь, а не в конфиге хостинга: так они одинаково работают
 * и на `next start`, и на любой платформе. Раньше они жили в netlify.toml и
 * при переезде потерялись бы молча.
 */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

/** Логотип и фотографии меняются только вместе с релизом — держим неделю. */
const staticCache = [{ key: 'Cache-Control', value: 'public, max-age=604800' }];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/webp'],
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      { source: '/brand/:path*', headers: staticCache },
      { source: '/images/:path*', headers: staticCache },
    ];
  },
};

export default nextConfig;
