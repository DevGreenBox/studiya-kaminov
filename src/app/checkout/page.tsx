import type { Metadata } from 'next';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Оформление заказа',
  description: 'Оформление заказа на электрокамин: контакты, доставка, промокод и подтверждение.',
  alternates: { canonical: '/checkout' },
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="container-site py-6 lg:py-8">
      <Breadcrumbs
        items={[
          { label: 'Главная', href: '/' },
          { label: 'Корзина', href: '/cart' },
          { label: 'Оформление заказа' },
        ]}
      />
      <h1 className="mt-4 text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-tight">
        Оформление заказа
      </h1>
      <CheckoutForm />
    </div>
  );
}
