import type { Metadata } from 'next';
import { FavoritesView } from '@/components/product/FavoritesView';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Избранное',
  description: 'Электрокамины, которые вы отложили, чтобы сравнить и вернуться к выбору позже.',
  alternates: { canonical: '/favorites' },
  robots: { index: false, follow: true },
};

export default function FavoritesPage() {
  return (
    <div className="container-site py-6 lg:py-8">
      <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Избранное' }]} />
      <FavoritesView />
    </div>
  );
}
