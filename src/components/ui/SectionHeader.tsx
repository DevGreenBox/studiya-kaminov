import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface Props {
  title: string;
  description?: string;
  link?: { href: string; label: string };
  align?: 'left' | 'center';
  as?: 'h2' | 'h3';
  children?: ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  description,
  link,
  align = 'left',
  as: Tag = 'h2',
  children,
  className,
}: Props) {
  return (
    <div
      className={cn(
        'mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between',
        align === 'center' && 'sm:flex-col sm:items-center sm:text-center',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        <Tag className="text-[clamp(1.5rem,1.2rem+1.3vw,2.125rem)] leading-tight">{title}</Tag>
        {description && <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{description}</p>}
      </div>
      {link && (
        <Link
          href={link.href}
          className="group inline-flex shrink-0 items-center gap-1.5 text-[15px] font-semibold text-ink transition-colors hover:text-primary"
        >
          {link.label}
          <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
        </Link>
      )}
      {children}
    </div>
  );
}
