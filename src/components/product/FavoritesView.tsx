'use client';

import { SketchIcon } from '@/components/icons/SketchIcon';
import { useFavorites } from '@/lib/store/favorites';
import { productById } from '@/data/catalog';
import { ProductCard } from './ProductCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { pluralize } from '@/lib/format';

export function FavoritesView() {
  const hydrated = useFavorites((s) => s.hydrated);
  const ids = useFavorites((s) => s.ids);
  const clear = useFavorites((s) => s.clear);

  if (!hydrated) {
    return (
      <>
        <h1 className="mt-4 text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-tight">Избранное</h1>
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <li key={i}>
              <ProductCardSkeleton />
            </li>
          ))}
        </ul>
      </>
    );
  }

  const items = ids.map((id) => productById.get(id)).filter((p) => p !== undefined);

  return (
    <>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-tight">Избранное</h1>
        {items.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clear}>
            Очистить список
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={<SketchIcon name="heart" size={26} />}
            title="В избранном пока ничего нет"
            text="Нажмите на сердце в карточке товара — модель сохранится здесь и не потеряется после перезагрузки."
            action={{ label: 'Перейти в каталог', href: '/catalog' }}
          />
        </div>
      ) : (
        <>
          <p className="mt-2 text-[15px] text-ink-soft">
            {items.length} {pluralize(items.length, ['модель', 'модели', 'моделей'])}
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {items.map((product, index) => (
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
