import type { Metadata } from 'next';
import { CartView } from '@/components/cart/CartView';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Корзина',
  description: 'Выбранные электрокамины, промокод и переход к оформлению заказа.',
  alternates: { canonical: '/cart' },
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <div className="container-site py-6 lg:py-8">
      <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Корзина' }]} />
      <CartView />
    </div>
  );
}
