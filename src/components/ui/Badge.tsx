import type { BadgeKind } from '@/types';
import { cn } from '@/lib/cn';

/*
 * Метки набраны текстом с разрядкой, а не цветными пилюлями.
 * Цветные плашки над каждой карточкой шумят и перетягивают внимание с
 * фотографии; здесь они читаются как подпись, но остаются заметными.
 */
const config: Record<BadgeKind, { label: string; className: string }> = {
  hit: { label: 'Хит', className: 'text-ink' },
  new: { label: 'Новинка', className: 'text-success' },
  sale: { label: 'Акция', className: 'text-primary' },
};

export function Badge({ kind }: { kind: BadgeKind }) {
  const { label, className } = config[kind];
  return (
    <span
      className={cn(
        'inline-flex items-center bg-canvas/90 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] backdrop-blur',
        className,
      )}
    >
      {label}
    </span>
  );
}

export function DiscountBadge({ percent }: { percent: number }) {
  return (
    <span className="inline-flex items-center bg-primary px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
      −{percent}%
    </span>
  );
}

export function Chip({ children, onRemove }: { children: React.ReactNode; onRemove?: () => void }) {
  return (
    <span className="inline-flex h-8 items-center gap-1.5 rounded-[var(--radius-sm)] border border-line-strong bg-white pl-3 pr-1.5 text-sm text-ink">
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Убрать фильтр"
          className="flex h-5 w-5 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-strong hover:text-ink"
        >
          <svg
            viewBox="0 0 16 16"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </span>
  );
}
