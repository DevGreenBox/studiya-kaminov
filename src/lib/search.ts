import { products } from '@/data/catalog';
import { categoryBySlug } from '@/data/categories';
import type { Product } from '@/types';

const normalize = (value: string) => value.toLowerCase().replace(/ё/g, 'е').trim();

/** Поле поиска: название, модель, категория, цвет, артикул, характеристики. */
const haystack = (product: Product) =>
  normalize(
    [
      product.name,
      product.model,
      product.color,
      product.sku ?? '',
      categoryBySlug.get(product.category)?.name ?? '',
      product.shortDescription,
      ...product.specifications.map((s) => `${s.label} ${s.value}`),
    ].join(' '),
  );

const index = new Map(products.map((p) => [p.id, haystack(p)]));

export function searchProducts(query: string, limit?: number): Product[] {
  const q = normalize(query);
  if (q.length < 2) return [];

  const terms = q.split(/\s+/).filter(Boolean);
  const scored: { product: Product; score: number }[] = [];

  for (const product of products) {
    const text = index.get(product.id) ?? '';
    if (!terms.every((term) => text.includes(term))) continue;

    // Совпадение в начале названия важнее совпадения в характеристиках.
    const name = normalize(product.name);
    let score = 0;
    if (name.startsWith(q)) score += 100;
    if (name.includes(q)) score += 50;
    if (normalize(product.model).includes(q)) score += 30;
    if (product.sku && normalize(product.sku).includes(q)) score += 80;
    score += product.bestseller ? 5 : 0;

    scored.push({ product, score });
  }

  scored.sort((a, b) => b.score - a.score || a.product.price - b.product.price);
  const result = scored.map((s) => s.product);
  return limit ? result.slice(0, limit) : result;
}
