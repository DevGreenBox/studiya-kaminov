'use client';

import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { site, contacts, legal } from '@/config/site';
import { formatPrice, formatDateTime } from '@/lib/format';
import type { Order } from '@/types';

/**
 * Накладная к заказу.
 *
 * Печатается штатным диалогом браузера (Ctrl+P / кнопка) — оттуда же
 * сохраняется в PDF. Отдельная PDF-библиотека не подключалась намеренно:
 * она добавила бы вес, но не дала бы ничего сверх этого.
 */
export function Invoice({ order }: { order: Order }) {
  return (
    <section aria-labelledby="invoice-heading" className="mt-10">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print-hidden">
        <h2 id="invoice-heading" className="text-2xl">
          Накладная к заказу
        </h2>
        <Button variant="secondary" onClick={() => window.print()}>
          <Printer size={17} aria-hidden />
          Распечатать или сохранить в PDF
        </Button>
      </div>

      <div className="print-page rounded-[var(--radius-md)] border border-line bg-white p-5 sm:p-8">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-5">
          <div>
            <p className="text-lg font-bold">{site.legalName}</p>
            <p className="mt-1 text-sm text-ink-soft">{site.tagline}</p>
            <p className="mt-2 text-sm text-ink-soft">
              {contacts.phone} · {contacts.email}
            </p>
            <p className="text-sm text-ink-muted">{legal.requisites}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-ink-muted">Заказ</p>
            <p className="text-xl font-bold">{order.number}</p>
            <p className="mt-1 text-sm text-ink-soft">{formatDateTime(order.createdAt)}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-5 border-b border-line py-5 sm:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-ink-muted">Покупатель</p>
            <p className="mt-2 font-medium">{order.customer.name}</p>
            <p className="text-sm text-ink-soft">{order.customer.phone}</p>
            <p className="text-sm text-ink-soft">{order.customer.email}</p>
            {order.recipient && (
              <>
                <p className="mt-3 text-sm font-bold uppercase tracking-wide text-ink-muted">Получатель</p>
                <p className="mt-1 font-medium">{order.recipient.name}</p>
                <p className="text-sm text-ink-soft">{order.recipient.phone}</p>
              </>
            )}
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-ink-muted">Доставка</p>
            {order.delivery.method === 'pickup' ? (
              <p className="mt-2 font-medium">Самовывоз со склада</p>
            ) : (
              <>
                <p className="mt-2 font-medium">{order.delivery.carrier}</p>
                <p className="text-sm text-ink-soft">{order.delivery.city}</p>
                <p className="text-sm text-ink-soft">{order.delivery.address}</p>
                {order.delivery.minDays && order.delivery.maxDays && (
                  <p className="mt-1 text-sm text-ink-soft">
                    Срок: {order.delivery.minDays}–{order.delivery.maxDays} дн.
                  </p>
                )}
                {order.delivery.isEstimate && (
                  <p className="mt-1 text-sm text-ink-muted">
                    Стоимость доставки предварительная, подтверждается перевозчиком.
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        <div className="overflow-x-auto py-5">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line text-left text-ink-muted">
                <th scope="col" className="py-2 pr-3 font-medium">№</th>
                <th scope="col" className="py-2 pr-3 font-medium">Наименование</th>
                <th scope="col" className="py-2 pr-3 text-right font-medium whitespace-nowrap">Кол-во</th>
                <th scope="col" className="py-2 pr-3 text-right font-medium whitespace-nowrap">Цена</th>
                <th scope="col" className="py-2 text-right font-medium whitespace-nowrap">Сумма</th>
              </tr>
            </thead>
            <tbody>
              {order.lines.map((line, index) => (
                <tr key={line.productId} className="border-b border-line last:border-0 align-top">
                  <td className="py-3 pr-3 text-ink-muted">{index + 1}</td>
                  <td className="py-3 pr-3">
                    <span className="font-medium">{line.name}</span>
                    {line.sku && <span className="block text-xs text-ink-muted">арт. {line.sku}</span>}
                  </td>
                  <td className="py-3 pr-3 text-right whitespace-nowrap">{line.quantity}</td>
                  <td className="py-3 pr-3 text-right whitespace-nowrap">{formatPrice(line.price)}</td>
                  <td className="py-3 text-right font-medium whitespace-nowrap">{formatPrice(line.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <dl className="ml-auto flex max-w-xs flex-col gap-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between gap-6">
            <dt className="text-ink-soft">Товары</dt>
            <dd className="font-medium whitespace-nowrap">{formatPrice(order.itemsTotal)}</dd>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between gap-6">
              <dt className="text-ink-soft">Скидка {order.promo ? `(${order.promo.code})` : ''}</dt>
              <dd className="font-medium whitespace-nowrap">−{formatPrice(order.discount)}</dd>
            </div>
          )}
          <div className="flex justify-between gap-6">
            <dt className="text-ink-soft">Доставка</dt>
            <dd className="font-medium whitespace-nowrap">
              {order.delivery.method === 'pickup'
                ? 'самовывоз'
                : order.delivery.price > 0
                  ? formatPrice(order.delivery.price)
                  : 'рассчитает менеджер'}
            </dd>
          </div>
          <div className="flex justify-between gap-6 border-t border-line pt-2 text-base">
            <dt className="font-bold">Итого</dt>
            <dd className="font-bold whitespace-nowrap">{formatPrice(order.total)}</dd>
          </div>
        </dl>

        {order.comment && (
          <div className="mt-5 border-t border-line pt-4 text-sm">
            <p className="text-ink-muted">Комментарий к заказу</p>
            <p className="mt-1">{order.comment}</p>
          </div>
        )}

        <footer className="mt-6 flex flex-wrap justify-between gap-4 border-t border-line pt-5 text-sm text-ink-muted">
          <p>Документ сформирован автоматически {formatDateTime(order.createdAt)}.</p>
          <p>{site.url.replace(/^https?:\/\//, '')}</p>
        </footer>
      </div>
    </section>
  );
}
