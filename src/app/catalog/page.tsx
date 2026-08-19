import { Suspense } from 'react';
import type { Metadata } from 'next';
import { CatalogView } from '@/components/catalog/CatalogView';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

export const metadata: Metadata = {
  title: 'Каталог электрокаминов',
  description:
    'Каталог электрокаминов собственного производства: классические, современные, угловые, с искусственным камнем и тумбы под телевизор.',
  alternates: { canonical: '/catalog' },
  openGraph: { title: 'Каталог электрокаминов', url: '/catalog' },
};

function CatalogSkeleton() {
  return (
    <div className="container-site py-8">
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <li key={i}>
            <ProductCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <>
      <div className="container-site pt-6">
        <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Каталог' }]} />
      </div>
      <Suspense fallback={<CatalogSkeleton />}>
        <CatalogView />
      </Suspense>
    </>
  );
}
