import type { BadgeKind } from '@/types';
import { cn } from '@/lib/cn';

const config: Record<BadgeKind, { label: string; className: string }> = {
  hit: { label: 'Хит', className: 'bg-ink text-white' },
  new: { label: 'Новинка', className: 'bg-success-soft text-success' },
  sale: { label: 'Акция', className: 'bg-primary text-white' },
};

export function Badge({ kind }: { kind: BadgeKind }) {
  const { label, className } = config[kind];
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center rounded-[var(--radius-xs)] px-2 text-xs font-bold tracking-wide',
        className,
      )}
    >
      {label}
    </span>
  );
}

export function DiscountBadge({ percent }: { percent: number }) {
  return (
    <span className="inline-flex h-6 items-center rounded-[var(--radius-xs)] bg-primary px-2 text-xs font-bold text-white">
      −{percent}%
    </span>
  );
}

export function Chip({ children, onRemove }: { children: React.ReactNode; onRemove?: () => void }) {
  return (
    <span className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line-strong bg-white pl-3 pr-1.5 text-sm text-ink">
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
