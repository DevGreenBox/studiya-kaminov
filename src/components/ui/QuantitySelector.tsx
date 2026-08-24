'use client';

import { SketchIcon } from '@/components/icons/SketchIcon';
import { cn } from '@/lib/cn';

interface Props {
  value: number;
  onChange: (value: number) => void;
  /** Вызывается при попытке уйти ниже 1 — вместо 0 предлагаем удалить позицию. */
  onMinReached?: () => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  label?: string;
}

export function QuantitySelector({
  value,
  onChange,
  onMinReached,
  min = 1,
  max = 99,
  size = 'md',
  label = 'Количество',
}: Props) {
  const height = size === 'md' ? 'h-12' : 'h-10';
  const btn = size === 'md' ? 'w-11' : 'w-9';

  return (
    <div
      className={cn(
        'inline-flex items-stretch overflow-hidden rounded-[var(--radius-sm)] border border-line-strong bg-white',
        height,
      )}
    >
      <button
        type="button"
        aria-label="Уменьшить количество"
        onClick={() => (value <= min ? onMinReached?.() : onChange(value - 1))}
        disabled={value <= min && !onMinReached}
        className={cn(
          'flex items-center justify-center text-ink transition-colors hover:bg-surface-strong disabled:opacity-40',
          btn,
        )}
      >
        <SketchIcon name="minus" size={16} />
      </button>
      <input
        type="text"
        inputMode="numeric"
        aria-label={label}
        value={value}
        onChange={(event) => {
          const next = Number(event.target.value.replace(/\D/g, ''));
          if (!Number.isNaN(next)) onChange(Math.min(max, Math.max(min, next || min)));
        }}
        className="w-10 border-x border-line-strong bg-white text-center text-[15px] font-semibold text-ink outline-none"
      />
      <button
        type="button"
        aria-label="Увеличить количество"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={cn(
          'flex items-center justify-center text-ink transition-colors hover:bg-surface-strong disabled:opacity-40',
          btn,
        )}
      >
        <SketchIcon name="plus" size={16} />
      </button>
    </div>
  );
}
