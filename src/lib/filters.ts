import { products } from '@/data/catalog';
import type { CategorySlug, Product } from '@/types';

export type SortKey = 'popular' | 'price-asc' | 'price-desc' | 'new';

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'popular', label: 'По популярности' },
  { value: 'price-asc', label: 'Сначала дешевле' },
  { value: 'price-desc', label: 'Сначала дороже' },
  { value: 'new', label: 'Новинки' },
];

export interface FilterState {
  categories: CategorySlug[];
  colors: string[];
  installations: string[];
  hearths: string[];
  /** Ширина портала, мм. */
  widths: string[];
  priceMin?: number;
  priceMax?: number;
  inStockOnly: boolean;
  saleOnly: boolean;
}

export const emptyFilters: FilterState = {
  categories: [],
  colors: [],
  installations: [],
  hearths: [],
  widths: [],
  inStockOnly: false,
  saleOnly: false,
};

/** Диапазоны ширины строятся по реальным габаритам каталога. */
export const WIDTH_BUCKETS = [
  { id: 'to-1000', label: 'до 1000 мм', test: (w: number) => w <= 1000 },
  { id: '1000-1400', label: '1000–1400 мм', test: (w: number) => w > 1000 && w <= 1400 },
  { id: 'from-1400', label: 'от 1400 мм', test: (w: number) => w > 1400 },
];

const uniqueSorted = (values: string[]) =>
  [...new Set(values)].sort((a, b) => a.localeCompare(b, 'ru'));

/**
 * Доступные значения фильтров. Считаются по переданному набору товаров,
 * поэтому пустые фильтры на странице не показываются.
 */
export function buildFacets(scope: Product[] = products) {
  const widths = WIDTH_BUCKETS.filter((bucket) =>
    scope.some((p) => p.dimensions && bucket.test(p.dimensions.width)),
  );

  return {
    categories: uniqueSorted(scope.map((p) => p.category)) as CategorySlug[],
    colors: uniqueSorted(scope.map((p) => p.color)),
    installations: uniqueSorted(scope.map((p) => p.installation)),
    hearths: uniqueSorted(scope.flatMap((p) => (p.hearth ? [p.hearth] : []))),
    widths,
    priceMin: Math.min(...scope.map((p) => p.price)),
    priceMax: Math.max(...scope.map((p) => p.price)),
    hasSale: scope.some((p) => p.oldPrice),
    hasOutOfStock: scope.some((p) => !p.inStock),
  };
}

export function filterProducts(scope: Product[], filters: FilterState): Product[] {
  return scope.filter((p) => {
    if (filters.categories.length && !filters.categories.includes(p.category)) return false;
    if (filters.colors.length && !filters.colors.includes(p.color)) return false;
    if (filters.installations.length && !filters.installations.includes(p.installation))
      return false;
    if (filters.hearths.length && (!p.hearth || !filters.hearths.includes(p.hearth))) return false;
    if (filters.widths.length) {
      const width = p.dimensions?.width;
      if (width === undefined) return false;
      const matches = filters.widths.some((id) =>
        WIDTH_BUCKETS.find((b) => b.id === id)?.test(width),
      );
      if (!matches) return false;
    }
    if (filters.priceMin !== undefined && p.price < filters.priceMin) return false;
    if (filters.priceMax !== undefined && p.price > filters.priceMax) return false;
    if (filters.inStockOnly && !p.inStock) return false;
    if (filters.saleOnly && !p.oldPrice) return false;
    return true;
  });
}

export function sortProducts(scope: Product[], sort: SortKey): Product[] {
  const list = [...scope];
  switch (sort) {
    case 'price-asc':
      return list.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return list.sort((a, b) => b.price - a.price);
    case 'new':
      return list.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)));
    case 'popular':
    default:
      // Популярность — по явным меткам каталога, без случайных чисел.
      return list.sort(
        (a, b) =>
          Number(Boolean(b.bestseller)) - Number(Boolean(a.bestseller)) ||
          Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
          a.price - b.price,
      );
  }
}

export const countActiveFilters = (filters: FilterState) =>
  filters.categories.length +
  filters.colors.length +
  filters.installations.length +
  filters.hearths.length +
  filters.widths.length +
  (filters.priceMin !== undefined || filters.priceMax !== undefined ? 1 : 0) +
  (filters.inStockOnly ? 1 : 0) +
  (filters.saleOnly ? 1 : 0);
