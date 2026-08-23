'use client';

import { useMemo } from 'react';
import { CheckCircle2, PhoneCall } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Invoice } from './Invoice';
import { formatPrice } from '@/lib/format';
import { contacts } from '@/config/site';
import type { Order } from '@/types';
import { useIsClient } from '@/lib/use-client-value';

export function OrderSuccess() {
  const isClient = useIsClient();

  const order = useMemo<Order | null>(() => {
    if (!isClient) return null;
    try {
      const raw = sessionStorage.getItem('ef-last-order');
      return raw ? (JSON.parse(raw) as Order) : null;
    } catch {
      return null;
    }
  }, [isClient]);

  if (!isClient) {
    return <Skeleton className="mt-8 h-72" />;
  }

  if (!order) {
    return (
      <div className="mt-8">
        <EmptyState
          title="Данные заказа не найдены"
          text="Похоже, страница открыта напрямую или сессия закрыта. Оформите заказ заново — или позвоните нам, мы найдём его по номеру телефона."
          action={{ label: 'Перейти в каталог', href: '/catalog' }}
        />
      </div>
    );
  }

  return (
    <>
      <div className="mt-6 rounded-[var(--radius-lg)] border border-line bg-surface p-6 sm:p-9">
        <CheckCircle2 size={44} className="text-success" aria-hidden />
        <h1 className="mt-4 text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-tight">
          Заказ оформлен
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft sm:text-base">
          Номер заказа <strong className="text-ink">{order.number}</strong>. Подтверждение
          отправлено на {order.customer.email}.
        </p>

        <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-[var(--radius-sm)] border border-line bg-white p-4">
            <dt className="text-sm text-ink-muted">Сумма заказа</dt>
            <dd className="mt-1 text-xl font-bold">{formatPrice(order.total)}</dd>
          </div>
          <div className="rounded-[var(--radius-sm)] border border-line bg-white p-4">
            <dt className="text-sm text-ink-muted">Доставка</dt>
            <dd className="mt-1 font-semibold">
              {order.delivery.method === 'pickup'
                ? 'Самовывоз со склада'
                : `${order.delivery.carrier}, ${order.delivery.city}`}
            </dd>
          </div>
          <div className="rounded-[var(--radius-sm)] border border-line bg-white p-4">
            <dt className="text-sm text-ink-muted">Контакт для связи</dt>
            <dd className="mt-1 font-semibold">{order.customer.phone}</dd>
          </div>
        </dl>

        <div className="mt-6 rounded-[var(--radius-sm)] border border-line bg-white p-4">
          <p className="flex items-start gap-2.5 text-[15px] leading-relaxed text-ink-soft">
            <PhoneCall size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden />
            <span>
              Что дальше: менеджер позвонит по номеру {order.customer.phone}, подтвердит состав
              заказа, окончательную стоимость доставки и сроки отгрузки. Если удобнее, позвоните
              сами —{' '}
              <a href={contacts.phoneHref} className="font-semibold text-primary">
                {contacts.phone}
              </a>
              .
            </span>
          </p>
        </div>

        <div className="mt-7 flex flex-wrap gap-3 print-hidden">
          <ButtonLink href="/catalog">Продолжить покупки</ButtonLink>
          <ButtonLink href="/" variant="secondary">
            На главную
          </ButtonLink>
        </div>
      </div>

      <Invoice order={order} />
    </>
  );
}
