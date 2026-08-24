'use client';

import { useState } from 'react';
import { SketchIcon } from '@/components/icons/SketchIcon';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/lib/store/cart';
import { applyPromoCode } from '@/lib/promo';
import { formatPrice } from '@/lib/format';
import type { PromoStatus } from '@/types';
import { cn } from '@/lib/cn';

export function PromoField({ discount }: { discount: number }) {
  const promo = useCart((s) => s.promo);
  const setPromo = useCart((s) => s.setPromo);
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<PromoStatus>('idle');
  const [message, setMessage] = useState('');

  if (promo) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-success/25 bg-success-soft px-4 py-3">
        <p className="flex min-w-0 items-center gap-2 text-sm">
          <SketchIcon name="check" size={17} className="shrink-0 text-success" aria-hidden />
          <span className="truncate">
            Промокод <strong>{promo.code}</strong> · −{promo.percent}%
            {discount > 0 && ` (${formatPrice(discount)})`}
          </span>
        </p>
        <button
          type="button"
          onClick={() => {
            setPromo(null);
            setStatus('idle');
            setMessage('');
            setValue('');
          }}
          aria-label="Отменить промокод"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-white hover:text-ink"
        >
          <SketchIcon name="x" size={16} />
        </button>
      </div>
    );
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const result = applyPromoCode(value, promo);
    setStatus(result.status);
    setMessage(result.message);
    if (result.promo) {
      setPromo(result.promo);
      setValue('');
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            if (status !== 'idle') setStatus('idle');
          }}
          placeholder="Промокод"
          aria-label="Промокод"
          aria-invalid={status === 'invalid' || status === 'expired' ? true : undefined}
          className={cn(
            'h-12 min-w-0 flex-1 rounded-[var(--radius-sm)] border bg-white px-3.5 text-[15px] uppercase outline-none placeholder:normal-case placeholder:text-ink-muted',
            status === 'invalid' || status === 'expired'
              ? 'border-danger'
              : 'border-line-strong hover:border-ink-muted',
          )}
        />
        <Button type="submit" variant="secondary" className="shrink-0">
          Применить
        </Button>
      </div>
      {message && (
        <p
          className={cn('text-sm', status === 'applied' ? 'text-success' : 'text-danger')}
          role="status"
        >
          {message}
        </p>
      )}
    </form>
  );
}
