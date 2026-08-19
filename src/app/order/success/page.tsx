import type { Metadata } from 'next';
import { OrderSuccess } from '@/components/checkout/OrderSuccess';

export const metadata: Metadata = {
  title: 'Заказ оформлен',
  robots: { index: false, follow: false },
};

export default function OrderSuccessPage() {
  return (
    <div className="container-site py-8 lg:py-10">
      <OrderSuccess />
    </div>
  );
}
