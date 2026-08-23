import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Хлебные крошки" className="min-w-0">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-ink-muted">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-1.5">
            {index > 0 && (
              <ChevronRight size={14} className="shrink-0 text-line-strong" aria-hidden />
            )}
            {item.href ? (
              <Link href={item.href} className="truncate transition-colors hover:text-primary">
                {item.label}
              </Link>
            ) : (
              <span className="truncate text-ink-soft" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
