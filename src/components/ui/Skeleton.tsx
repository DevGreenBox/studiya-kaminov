import { cn } from '@/lib/cn';

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('ef-animate-skeleton rounded-[var(--radius-sm)] bg-surface-strong', className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-line bg-white">
      <Skeleton className="aspect-[3/4] rounded-none" />
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="mt-2 h-6 w-2/5" />
        <Skeleton className="mt-2 h-12 w-full" />
      </div>
    </div>
  );
}
