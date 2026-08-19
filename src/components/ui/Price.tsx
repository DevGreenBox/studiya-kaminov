import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/cn';

interface Props {
  value: number;
  oldValue?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-[28px] leading-9',
};

export function Price({ value, oldValue, size = 'md', className }: Props) {
  return (
    <span className={cn('flex flex-wrap items-baseline gap-x-2 gap-y-0.5', className)}>
      <span className={cn('font-bold tracking-tight whitespace-nowrap', sizes[size])}>
        {formatPrice(value)}
      </span>
      {oldValue && oldValue > value && (
        <span className="whitespace-nowrap text-sm text-ink-muted line-through">
          {formatPrice(oldValue)}
        </span>
      )}
    </span>
  );
}
