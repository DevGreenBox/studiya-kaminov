'use client';

import { useState } from 'react';
import { SketchIcon } from '@/components/icons/SketchIcon';
import { Button } from '@/components/ui/Button';
import { formatPrice, pluralize } from '@/lib/format';
import { carriers } from '@/config/site';
import type { CartItem, DeliveryOption } from '@/types';
import { cn } from '@/lib/cn';

interface Props {
  city: string;
  items: CartItem[];
  options: DeliveryOption[];
  selectedCarrierId: string;
  onOptions: (options: DeliveryOption[]) => void;
  onSelect: (carrierId: string) => void;
}

/**
 * Расчёт доставки сразу по обеим транспортным компаниям.
 * Покупатель видит цену и срок рядом и выбирает, а не гадает.
 */
export function DeliveryCalculator({
  city,
  items,
  options,
  selectedCarrierId,
  onOptions,
  onSelect,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    onOptions([]);
    try {
      const response = await fetch('/api/delivery/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city, items }),
      });
      const data = (await response.json()) as { options?: DeliveryOption[]; error?: string };
      if (!response.ok || !data.options?.length) {
        throw new Error(data.error ?? 'Не удалось рассчитать доставку');
      }
      onOptions(data.options);
      // Если выбранной компании нет в ответе, переключаемся на первую доступную.
      if (!data.options.some((o) => o.carrierId === selectedCarrierId)) {
        onSelect(data.options[0].carrierId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось рассчитать доставку');
    } finally {
      setLoading(false);
    }
  };

  const cityReady = city.trim().length >= 2;

  return (
    <div className="rounded-[var(--radius-sm)] border border-line bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[15px] font-medium">Транспортная компания</p>
        <Button
          variant="secondary"
          size="sm"
          onClick={calculate}
          loading={loading}
          disabled={!cityReady}
        >
          {!loading && <SketchIcon name="calculator" size={16} aria-hidden />}
          {options.length ? 'Пересчитать' : 'Рассчитать'}
        </Button>
      </div>

      {!cityReady && !options.length && (
        <p className="mt-2 text-sm text-ink-muted">
          Укажите город получателя, чтобы рассчитать доставку.
        </p>
      )}

      {error && (
        <p
          className="mt-3 rounded-[var(--radius-xs)] bg-danger-soft px-3 py-2 text-sm text-danger"
          role="alert"
        >
          {error}
        </p>
      )}

      <ul className="mt-3 flex flex-col gap-2" role="radiogroup" aria-label="Транспортная компания">
        {carriers.map((carrier) => {
          const option = options.find((o) => o.carrierId === carrier.id);
          const active = selectedCarrierId === carrier.id;
          return (
            <li key={carrier.id}>
              <label
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-[var(--radius-sm)] border bg-white px-4 py-3 transition-colors',
                  active
                    ? 'border-primary bg-primary-soft'
                    : 'border-line-strong hover:border-ink-muted',
                )}
              >
                <input
                  type="radio"
                  name="carrier"
                  value={carrier.id}
                  checked={active}
                  onChange={() => onSelect(carrier.id)}
                  className="ef-radio mt-1 h-4 w-4 shrink-0"
                />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <span className="font-semibold">{carrier.name}</span>
                    {option ? (
                      <span className="font-bold whitespace-nowrap">
                        {formatPrice(option.quote.price)}
                      </span>
                    ) : (
                      <span className="text-sm text-ink-muted">не рассчитано</span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-sm text-ink-soft">
                    {option
                      ? `Срок: ${
                          option.quote.minDays === option.quote.maxDays
                            ? option.quote.minDays
                            : `${option.quote.minDays}–${option.quote.maxDays}`
                        } ${pluralize(option.quote.maxDays, ['день', 'дня', 'дней'])}`
                      : carrier.note}
                  </span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      {options.some((o) => o.quote.isEstimate) && (
        <p className="mt-3 flex items-start gap-2 text-sm text-ink-muted">
          <SketchIcon name="info" size={15} className="mt-0.5 shrink-0" aria-hidden />
          Предварительный расчёт по весу, объёму и городу. Точную сумму подтверждает менеджер.
        </p>
      )}

      {options.map(
        (option) =>
          option.quote.note && (
            <p key={option.carrierId} className="mt-2 text-sm text-ink-muted">
              {option.carrierName}: {option.quote.note}
            </p>
          ),
      )}

      {options.length > 0 && (
        <p className="mt-3 flex items-center gap-2 text-sm text-success">
          <SketchIcon name="check" size={15} aria-hidden />
          Выбрано: {carriers.find((c) => c.id === selectedCarrierId)?.name}
        </p>
      )}
    </div>
  );
}
