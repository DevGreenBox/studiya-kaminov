'use client';

import { useState } from 'react';
import { Calculator, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatPrice, pluralize } from '@/lib/format';
import { deliveryConfig } from '@/config/site';
import type { CartItem, DeliveryQuote } from '@/types';
import { cn } from '@/lib/cn';
import { typo } from '@/lib/typography';

interface Props {
  city: string;
  items: CartItem[];
  quote: DeliveryQuote | null;
  onQuote: (quote: DeliveryQuote | null) => void;
  disabled?: boolean;
}

export function DeliveryCalculator({ city, items, quote, onQuote, disabled }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    onQuote(null);
    try {
      const response = await fetch('/api/delivery/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city, items }),
      });
      const data = (await response.json()) as { quote?: DeliveryQuote; error?: string };
      if (!response.ok || !data.quote)
        throw new Error(data.error ?? 'Не удалось рассчитать доставку');
      onQuote(data.quote);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось рассчитать доставку');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[var(--radius-sm)] border border-line bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[15px] font-medium">Стоимость доставки «{deliveryConfig.carrier}»</p>
        <Button
          variant="secondary"
          size="sm"
          onClick={calculate}
          loading={loading}
          disabled={disabled || city.trim().length < 2}
        >
          {!loading && <Calculator size={16} aria-hidden />}
          {quote ? 'Пересчитать' : 'Рассчитать'}
        </Button>
      </div>

      {city.trim().length < 2 && !quote && (
        <p className="mt-2 text-sm text-ink-muted">
          {typo('Укажите город получателя, чтобы рассчитать доставку.')}
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

      {quote && (
        <div className={cn('mt-3 flex flex-col gap-1')} role="status">
          <p className="text-xl font-bold">{formatPrice(quote.price)}</p>
          <p className="text-sm text-ink-soft">
            Срок:{' '}
            {quote.minDays === quote.maxDays ? quote.minDays : `${quote.minDays}–${quote.maxDays}`}{' '}
            {pluralize(quote.maxDays, ['день', 'дня', 'дней'])}
          </p>
          {quote.isEstimate && (
            <p className="mt-1 flex items-start gap-2 text-sm text-ink-muted">
              <Info size={15} className="mt-0.5 shrink-0" aria-hidden />
              {typo(
                'Предварительный расчёт по весу, объёму и городу. Точную сумму подтверждает менеджер.',
              )}
            </p>
          )}
          {quote.note && <p className="text-sm text-ink-muted">{quote.note}</p>}
        </div>
      )}
    </div>
  );
}
