import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { SketchIcon } from '@/components/icons/SketchIcon';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-[var(--radius-sm)] ' +
  'transition-[background-color,color,border-color,box-shadow] duration-150 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed select-none text-center';

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-hover active:bg-primary-active shadow-[0_1px_2px_rgb(28_25_23/0.08)]',
  secondary:
    'bg-white text-ink border border-line-strong hover:bg-surface hover:border-ink-muted active:bg-surface-strong',
  ghost: 'bg-transparent text-ink hover:bg-surface-strong active:bg-surface-strong',
  danger: 'bg-danger-soft text-danger border border-transparent hover:bg-danger hover:text-white',
};

// Высота ≥ 44px на всех размерах, кроме sm — требование к touch-target.
const sizes: Record<Size, string> = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-5 text-[15px]',
  lg: 'h-14 px-7 text-base',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
  children: ReactNode;
  className?: string;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  loading,
  children,
  className,
  disabled,
  ...rest
}: CommonProps & ComponentPropsWithoutRef<'button'>) {
  return (
    <button
      type="button"
      {...rest}
      disabled={disabled || loading}
      className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
    >
      {loading && <SketchIcon name="loader" size={18} className="animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  fullWidth,
  children,
  className,
  href,
  ...rest
}: CommonProps & { href: string } & Omit<ComponentPropsWithoutRef<typeof Link>, 'href'>) {
  return (
    <Link
      href={href}
      {...rest}
      className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
    >
      {children}
    </Link>
  );
}
