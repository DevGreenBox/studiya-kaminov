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

/**
 * Кэш картинок.
 *
 * Неделя жёсткого кэша здесь была ошибкой: имена файлов не меняются при замене
 * фотографии, поэтому браузер и оптимизатор Vercel продолжали отдавать старый
 * снимок до истечения срока — замена фото была не видна.
 *
 * Теперь свежесть ограничена пятью минутами, а `stale-while-revalidate`
 * оставляет прежнюю скорость: браузер сразу показывает кэш и обновляет его
 * в фоне.
 */
const staticCache = [
  { key: 'Cache-Control', value: 'public, max-age=300, stale-while-revalidate=604800' },
];

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
