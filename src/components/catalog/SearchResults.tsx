'use client';

import { useSearchParams } from 'next/navigation';
import { SketchIcon } from '@/components/icons/SketchIcon';
import { searchProducts } from '@/lib/search';
import { ProductCard } from '@/components/product/ProductCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { pluralize } from '@/lib/format';
import { typo } from '@/lib/typography';

export function SearchResults() {
  const params = useSearchParams();
  const query = params.get('q')?.trim() ?? '';
  const results = query ? searchProducts(query) : [];

  return (
    <>
      <h1 className="mt-4 text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-tight">
        {query ? <>Результаты по запросу «{query}»</> : 'Поиск по каталогу'}
      </h1>

      {!query ? (
        <p className="mt-3 text-[15px] text-ink-soft">
          {typo(
            'Введите запрос через поиск в шапке сайта — например, «Дублин», «венге» или «угловой».',
          )}
        </p>
      ) : results.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={<SketchIcon name="search-x" size={26} />}
            title="Ничего не найдено"
            text="Проверьте написание или попробуйте более короткий запрос — например, название модели."
            action={{ label: 'Перейти в каталог', href: '/catalog' }}
          />
        </div>
      ) : (
        <>
          <p className="mt-3 text-[15px] text-ink-soft">
            Найдено: <strong className="font-semibold text-ink">{results.length}</strong>{' '}
            {pluralize(results.length, ['товар', 'товара', 'товаров'])}
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((product, index) => (
              <li key={product.id} className="flex">
                <ProductCard product={product} priority={index < 4} />
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
