'use client';

import { SketchIcon } from '@/components/icons/SketchIcon';
import { useFavorites } from '@/lib/store/favorites';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/cn';

interface Props {
  productId: string;
  productName: string;
  variant?: 'overlay' | 'inline';
  className?: string;
}

export function FavoriteButton({ productId, productName, variant = 'overlay', className }: Props) {
  const hydrated = useFavorites((s) => s.hydrated);
  const ids = useFavorites((s) => s.ids);
  const toggle = useFavorites((s) => s.toggle);
  const toast = useToast();

  const active = hydrated && ids.includes(productId);

  const onClick = () => {
    toggle(productId);
    toast.show(
      active ? `«${productName}» убран из избранного` : `«${productName}» добавлен в избранное`,
      active ? undefined : { action: { label: 'Открыть', href: '/favorites' } },
    );
  };

  if (variant === 'inline') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        aria-label={active ? 'Убрать из избранного' : 'Добавить в избранное'}
        className={cn(
          'inline-flex h-12 items-center justify-center gap-2 rounded-[var(--radius-sm)] border px-4 text-[15px] font-semibold transition-colors',
          active
            ? 'border-primary bg-primary-soft text-primary'
            : 'border-line-strong bg-white text-ink hover:border-ink-muted',
          className,
        )}
      >
        <SketchIcon name={active ? 'heart-filled' : 'heart'} size={18} aria-hidden />
        {active ? 'В избранном' : 'В избранное'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={
        active ? `Убрать «${productName}» из избранного` : `Добавить «${productName}» в избранное`
      }
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-150',
        active
          ? 'border-primary bg-primary text-white'
          : 'border-line bg-white/90 text-ink-soft backdrop-blur hover:border-primary hover:text-primary',
        className,
      )}
    >
      <SketchIcon name={active ? 'heart-filled' : 'heart'} size={17} aria-hidden />
    </button>
  );
}
