import type { MetadataRoute } from 'next';
import { products } from '@/data/catalog';
import { site } from '@/config/site';

const staticRoutes = ['', '/catalog', '/about', '/reviews', '/delivery', '/contacts', '/privacy'];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    ...staticRoutes.map((route) => ({
      url: `${site.url}${route}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.7,
    })),
    ...products.map((product) => ({
      url: `${site.url}/catalog/${product.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
