import type { MetadataRoute } from 'next';
import { site } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/cart', '/checkout', '/order/', '/favorites', '/search', '/api/'],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
