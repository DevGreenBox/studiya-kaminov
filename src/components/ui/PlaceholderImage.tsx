import { SketchIcon } from '@/components/icons/SketchIcon';
import { cn } from '@/lib/cn';

/**
 * Честная заглушка вместо отсутствующей фотографии.
 *
 * Используется только там, где реальных материалов заказчика нет (например,
 * съёмка производства). Заглушка выглядит как заглушка и не выдаёт себя за
 * настоящее фото — это требование ТЗ, п. 4 и 5.
 */
export function PlaceholderImage({
  label,
  tone = 'light',
  className,
}: {
  label: string;
  /** dark — для тёмных секций, где светлый вариант теряет контраст. */
  tone?: 'light' | 'dark';
  className?: string;
}) {
  const dark = tone === 'dark';
  return (
    <div
      role="img"
      aria-label={`Заглушка: ${label}`}
      className={cn(
        'flex flex-col items-center justify-center gap-2 border border-dashed p-5 text-center',
        dark ? 'border-white/25 bg-white/5' : 'border-line-strong bg-surface-strong',
        className,
      )}
    >
      <SketchIcon
        name="image-off"
        size={26}
        className={dark ? 'text-white/50' : 'text-ink-muted'}
        aria-hidden
      />
      <span className={cn('text-sm font-medium', dark ? 'text-white/80' : 'text-ink-soft')}>
        {label}
      </span>
      <span className={cn('text-xs', dark ? 'text-white/45' : 'text-ink-muted')}>
        Заглушка — заменить реальным фото
      </span>
    </div>
  );
}
