import { Suspense } from 'react';
import type { Metadata } from 'next';
import { SearchResults } from '@/components/catalog/SearchResults';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

export const metadata: Metadata = {
  title: 'Поиск по каталогу',
  description: 'Поиск электрокаминов по названию, модели, цвету портала и характеристикам.',
  alternates: { canonical: '/search' },
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <div className="container-site py-6 lg:py-8">
      <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Поиск' }]} />
      <Suspense
        fallback={
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <li key={i}>
                <ProductCardSkeleton />
              </li>
            ))}
          </ul>
        }
      >
        <SearchResults />
      </Suspense>
    </div>
  );
}
