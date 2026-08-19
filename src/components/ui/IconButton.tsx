import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface Props extends ComponentPropsWithoutRef<'button'> {
  /** Обязателен: у кнопки-иконки нет текста. */
  label: string;
  children: ReactNode;
  variant?: 'plain' | 'surface';
  size?: 'sm' | 'md';
}

export function IconButton({
  label,
  children,
  className,
  variant = 'plain',
  size = 'md',
  ...rest
}: Props) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...rest}
      className={cn(
        'inline-flex items-center justify-center rounded-[var(--radius-sm)] text-ink',
        'transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
        size === 'md' ? 'h-11 w-11' : 'h-9 w-9',
        variant === 'plain' ? 'hover:bg-surface-strong' : 'bg-white border border-line hover:border-ink-muted',
        className,
      )}
    >
      {children}
    </button>
  );
}
