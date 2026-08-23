import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/cn';
import { typo } from '@/lib/typography';

/**
 * Честная заглушка вместо отсутствующей фотографии.
 *
 * Используется только там, где реальных материалов заказчика нет (например,
 * съёмка производства). Заглушка выглядит как заглушка и не выдаёт себя за
 * настоящее фото — это требование ТЗ, п. 4 и 5.
 */
export function PlaceholderImage({ label, className }: { label: string; className?: string }) {
  return (
    <div
      role="img"
      aria-label={`Заглушка: ${label}`}
      className={cn(
        'flex flex-col items-center justify-center gap-2 border border-dashed border-line-strong bg-surface-strong p-5 text-center',
        className,
      )}
    >
      <ImageOff size={26} className="text-ink-muted" aria-hidden />
      <span className="text-sm font-medium text-ink-soft">{label}</span>
      <span className="text-xs text-ink-muted">{typo('Заглушка — заменить реальным фото')}</span>
    </div>
  );
}
