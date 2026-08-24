'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SketchIcon } from '@/components/icons/SketchIcon';
import { products } from '@/data/catalog';
import { categories, categoryBySlug } from '@/data/categories';
import {
  buildFacets,
  countActiveFilters,
  emptyFilters,
  filterProducts,
  sortProducts,
  SORT_OPTIONS,
  WIDTH_BUCKETS,
  type FilterState,
  type SortKey,
} from '@/lib/filters';
import { ProductCard } from '@/components/product/ProductCard';
import { FilterPanel } from './FilterPanel';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Drawer } from '@/components/ui/Modal';
import { pluralize } from '@/lib/format';
import type { CategorySlug } from '@/types';

const facets = buildFacets(products);

/** Разбор фильтров из query-параметров, чтобы ссылки на каталог работали. */
function parseFilters(params: URLSearchParams): FilterState {
  const list = (key: string) => params.get(key)?.split(',').filter(Boolean) ?? [];
  const number = (key: string) => {
    const raw = params.get(key);
    const value = raw ? Number(raw) : NaN;
    return Number.isFinite(value) ? value : undefined;
  };
  return {
    categories: list('category') as CategorySlug[],
    colors: list('color'),
    installations: list('installation'),
    hearths: list('hearth'),
    widths: list('width'),
    priceMin: number('priceMin'),
    priceMax: number('priceMax'),
    inStockOnly: params.get('inStock') === '1',
    saleOnly: params.get('sale') === '1',
  };
}

function serialize(filters: FilterState, sort: SortKey): string {
  const params = new URLSearchParams();
  const push = (key: string, values: string[]) => {
    if (values.length) params.set(key, values.join(','));
  };
  push('category', filters.categories);
  push('color', filters.colors);
  push('installation', filters.installations);
  push('hearth', filters.hearths);
  push('width', filters.widths);
  if (filters.priceMin !== undefined) params.set('priceMin', String(filters.priceMin));
  if (filters.priceMax !== undefined) params.set('priceMax', String(filters.priceMax));
  if (filters.inStockOnly) params.set('inStock', '1');
  if (filters.saleOnly) params.set('sale', '1');
  if (sort !== 'popular') params.set('sort', sort);
  return params.toString();
}

export function CatalogView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [drawerOpen, setDrawerOpen] = useState(false);

  // Единственный источник правды — URL. Ссылки вида /catalog?category=uglovye
  // работают, состояние не дублируется и не рассинхронизируется.
  const query = searchParams.toString();
  const filters = useMemo(() => parseFilters(new URLSearchParams(query)), [query]);
  const sort = useMemo<SortKey>(() => {
    const value = new URLSearchParams(query).get('sort');
    return SORT_OPTIONS.some((option) => option.value === value) ? (value as SortKey) : 'popular';
  }, [query]);

  const apply = useCallback(
    (nextFilters: FilterState, nextSort: SortKey) => {
      const next = serialize(nextFilters, nextSort);
      router.replace(next ? `/catalog?${next}` : '/catalog', { scroll: false });
    },
    [router],
  );

  const visible = useMemo(
    () => sortProducts(filterProducts(products, filters), sort),
    [filters, sort],
  );

  const activeCount = countActiveFilters(filters);

  const chips: { key: string; label: string; clear: () => void }[] = [];
  filters.categories.forEach((slug) =>
    chips.push({
      key: `c-${slug}`,
      label: categoryBySlug.get(slug)?.name ?? slug,
      clear: () =>
        apply({ ...filters, categories: filters.categories.filter((v) => v !== slug) }, sort),
    }),
  );
  filters.installations.forEach((value) =>
    chips.push({
      key: `i-${value}`,
      label: value,
      clear: () =>
        apply(
          { ...filters, installations: filters.installations.filter((v) => v !== value) },
          sort,
        ),
    }),
  );
  filters.widths.forEach((id) =>
    chips.push({
      key: `w-${id}`,
      label: WIDTH_BUCKETS.find((b) => b.id === id)?.label ?? id,
      clear: () => apply({ ...filters, widths: filters.widths.filter((v) => v !== id) }, sort),
    }),
  );
  filters.hearths.forEach((value) =>
    chips.push({
      key: `h-${value}`,
      label: `Очаг ${value}`,
      clear: () => apply({ ...filters, hearths: filters.hearths.filter((v) => v !== value) }, sort),
    }),
  );
  filters.colors.forEach((value) =>
    chips.push({
      key: `col-${value}`,
      label: value,
      clear: () => apply({ ...filters, colors: filters.colors.filter((v) => v !== value) }, sort),
    }),
  );
  if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
    chips.push({
      key: 'price',
      label: `Цена: ${filters.priceMin ?? facets.priceMin}–${filters.priceMax ?? facets.priceMax} ₽`,
      clear: () => apply({ ...filters, priceMin: undefined, priceMax: undefined }, sort),
    });
  }
  if (filters.saleOnly) {
    chips.push({
      key: 'sale',
      label: 'Со скидкой',
      clear: () => apply({ ...filters, saleOnly: false }, sort),
    });
  }
  if (filters.inStockOnly) {
    chips.push({
      key: 'stock',
      label: 'В наличии',
      clear: () => apply({ ...filters, inStockOnly: false }, sort),
    });
  }

  const title =
    filters.categories.length === 1
      ? (categoryBySlug.get(filters.categories[0])?.name ?? 'Каталог')
      : 'Каталог электрокаминов';

  return (
    <div className="container-site py-8 lg:py-10">
      <h1 className="text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-tight">{title}</h1>

      {/* Быстрые ссылки по категориям — вместо «слепого» списка фильтров */}
      <ul className="mt-5 flex flex-wrap gap-2">
        <li>
          <button
            type="button"
            onClick={() => apply({ ...filters, categories: [] }, sort)}
            aria-pressed={filters.categories.length === 0}
            className={
              filters.categories.length === 0
                ? 'inline-flex h-9 items-center rounded-full bg-ink px-4 text-sm font-medium text-white'
                : 'inline-flex h-9 items-center rounded-full border border-line-strong bg-white px-4 text-sm font-medium text-ink-soft transition-colors hover:border-ink-muted hover:text-ink'
            }
          >
            Все модели
          </button>
        </li>
        {categories.map((category) => {
          const active = filters.categories.includes(category.slug);
          return (
            <li key={category.slug}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() =>
                  apply(
                    {
                      ...filters,
                      categories: active
                        ? filters.categories.filter((c) => c !== category.slug)
                        : [...filters.categories, category.slug],
                    },
                    sort,
                  )
                }
                className={
                  active
                    ? 'inline-flex h-9 items-center rounded-full bg-primary px-4 text-sm font-medium text-white'
                    : 'inline-flex h-9 items-center rounded-full border border-line-strong bg-white px-4 text-sm font-medium text-ink-soft transition-colors hover:border-ink-muted hover:text-ink'
                }
              >
                {category.name}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-7 grid grid-cols-1 gap-8 lg:grid-cols-[264px_minmax(0,1fr)] lg:gap-10">
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Фильтры</h2>
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={() => apply(emptyFilters, sort)}
                  className="text-sm font-medium text-primary transition-colors hover:text-primary-hover"
                >
                  Сбросить всё
                </button>
              )}
            </div>
            <FilterPanel facets={facets} filters={filters} onChange={(next) => apply(next, sort)} />
          </div>
        </aside>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[15px] text-ink-soft">
              Найдено: <strong className="font-semibold text-ink">{visible.length}</strong>{' '}
              {pluralize(visible.length, ['товар', 'товара', 'товаров'])}
            </p>

            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="lg:hidden"
                onClick={() => setDrawerOpen(true)}
              >
                <SketchIcon name="sliders" size={16} aria-hidden />
                Фильтры
                {activeCount > 0 && (
                  <span className="ml-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-white">
                    {activeCount}
                  </span>
                )}
              </Button>

              <label className="flex min-w-0 items-center gap-2 text-sm text-ink-soft">
                <span className="hidden sm:inline">Сортировка</span>
                <select
                  value={sort}
                  onChange={(event) => apply(filters, event.target.value as SortKey)}
                  className="ef-select h-10 min-w-0 max-w-[220px] truncate rounded-[var(--radius-sm)] border border-line-strong bg-white pl-3 text-sm text-ink outline-none hover:border-ink-muted"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {chips.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {chips.map((chip) => (
                <Chip key={chip.key} onRemove={chip.clear}>
                  {chip.label}
                </Chip>
              ))}
              <button
                type="button"
                onClick={() => apply(emptyFilters, sort)}
                className="text-sm font-medium text-primary transition-colors hover:text-primary-hover"
              >
                Сбросить всё
              </button>
            </div>
          )}

          {visible.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                icon={<SketchIcon name="package-search" size={26} />}
                title="По выбранным параметрам ничего не найдено"
                text="Попробуйте убрать часть фильтров — возможно, условия слишком узкие."
                secondaryAction={
                  <Button variant="secondary" onClick={() => apply(emptyFilters, sort)}>
                    Сбросить фильтры
                  </Button>
                }
              />
            </div>
          ) : (
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3 2xl:grid-cols-4">
              {visible.map((product, index) => (
                <li key={product.id} className="flex">
                  <ProductCard
                    product={product}
                    priority={index < 4}
                    sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Фильтры"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                apply(emptyFilters, sort);
              }}
            >
              Сбросить
            </Button>
            <Button fullWidth onClick={() => setDrawerOpen(false)}>
              Показать {visible.length}
            </Button>
          </div>
        }
      >
        <FilterPanel facets={facets} filters={filters} onChange={(next) => apply(next, sort)} />
      </Drawer>
    </div>
  );
}
