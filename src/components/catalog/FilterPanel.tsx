'use client';

import { useId } from 'react';
import { categories } from '@/data/categories';
import { WIDTH_BUCKETS, type FilterState } from '@/lib/filters';
import { formatPrice } from '@/lib/format';
import type { buildFacets } from '@/lib/filters';
import type { CategorySlug } from '@/types';

type Facets = ReturnType<typeof buildFacets>;

interface Props {
  facets: Facets;
  filters: FilterState;
  onChange: (next: FilterState) => void;
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t border-line py-5 first:border-t-0 first:pt-0">
      <legend className="mb-3 text-sm font-bold uppercase tracking-wide text-ink-muted">{title}</legend>
      {children}
    </fieldset>
  );
}

function Option({
  checked,
  onToggle,
  label,
  count,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
  count?: number;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1.5 text-[15px] text-ink-soft transition-colors hover:text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="h-[18px] w-[18px] shrink-0 cursor-pointer rounded-[5px] border-2 border-line-strong accent-[var(--color-primary)]"
      />
      <span className="min-w-0 flex-1">{label}</span>
      {count !== undefined && <span className="shrink-0 text-sm text-ink-muted">{count}</span>}
    </label>
  );
}

export function FilterPanel({ facets, filters, onChange }: Props) {
  const minId = useId();
  const maxId = useId();

  const toggle = <K extends 'categories' | 'colors' | 'installations' | 'hearths' | 'widths'>(
    key: K,
    value: string,
  ) => {
    const list = filters[key] as string[];
    const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
    onChange({ ...filters, [key]: next } as FilterState);
  };

  return (
    <div>
      {facets.categories.length > 1 && (
        <Group title="Категория">
          {categories
            .filter((c) => facets.categories.includes(c.slug))
            .map((category) => (
              <Option
                key={category.slug}
                label={category.name}
                checked={filters.categories.includes(category.slug as CategorySlug)}
                onToggle={() => toggle('categories', category.slug)}
              />
            ))}
        </Group>
      )}

      <Group title="Цена">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label htmlFor={minId} className="sr-only">
              Цена от
            </label>
            <input
              id={minId}
              type="number"
              inputMode="numeric"
              placeholder={String(facets.priceMin)}
              value={filters.priceMin ?? ''}
              min={0}
              onChange={(event) =>
                onChange({
                  ...filters,
                  priceMin: event.target.value ? Number(event.target.value) : undefined,
                })
              }
              className="h-11 w-full rounded-[var(--radius-sm)] border border-line-strong px-3 text-[15px] outline-none hover:border-ink-muted"
            />
          </div>
          <span className="text-ink-muted" aria-hidden>
            —
          </span>
          <div className="flex-1">
            <label htmlFor={maxId} className="sr-only">
              Цена до
            </label>
            <input
              id={maxId}
              type="number"
              inputMode="numeric"
              placeholder={String(facets.priceMax)}
              value={filters.priceMax ?? ''}
              min={0}
              onChange={(event) =>
                onChange({
                  ...filters,
                  priceMax: event.target.value ? Number(event.target.value) : undefined,
                })
              }
              className="h-11 w-full rounded-[var(--radius-sm)] border border-line-strong px-3 text-[15px] outline-none hover:border-ink-muted"
            />
          </div>
        </div>
        <p className="mt-2 text-sm text-ink-muted">
          В каталоге от {formatPrice(facets.priceMin)} до {formatPrice(facets.priceMax)}
        </p>
      </Group>

      {facets.installations.length > 1 && (
        <Group title="Тип установки">
          {facets.installations.map((value) => (
            <Option
              key={value}
              label={value}
              checked={filters.installations.includes(value)}
              onToggle={() => toggle('installations', value)}
            />
          ))}
        </Group>
      )}

      {facets.widths.length > 1 && (
        <Group title="Ширина портала">
          {facets.widths.map((bucket) => (
            <Option
              key={bucket.id}
              label={bucket.label}
              checked={filters.widths.includes(bucket.id)}
              onToggle={() => toggle('widths', bucket.id)}
            />
          ))}
        </Group>
      )}

      {facets.hearths.length > 1 && (
        <Group title="Очаг">
          {facets.hearths.map((value) => (
            <Option
              key={value}
              label={value}
              checked={filters.hearths.includes(value)}
              onToggle={() => toggle('hearths', value)}
            />
          ))}
        </Group>
      )}

      {facets.colors.length > 1 && (
        <Group title="Цвет портала">
          {facets.colors.map((value) => (
            <Option
              key={value}
              label={value}
              checked={filters.colors.includes(value)}
              onToggle={() => toggle('colors', value)}
            />
          ))}
        </Group>
      )}

      {(facets.hasSale || facets.hasOutOfStock) && (
        <Group title="Дополнительно">
          {facets.hasSale && (
            <Option
              label="Только со скидкой"
              checked={filters.saleOnly}
              onToggle={() => onChange({ ...filters, saleOnly: !filters.saleOnly })}
            />
          )}
          {facets.hasOutOfStock && (
            <Option
              label="Только в наличии"
              checked={filters.inStockOnly}
              onToggle={() => onChange({ ...filters, inStockOnly: !filters.inStockOnly })}
            />
          )}
        </Group>
      )}
    </div>
  );
}

export { WIDTH_BUCKETS };
