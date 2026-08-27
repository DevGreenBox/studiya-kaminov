import Link from 'next/link';
import { SketchIcon } from '@/components/icons/SketchIcon';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { typo } from '@/lib/typography';

interface Props {
  title: string;
  /** Надзаголовок капителью — вместо цветного бейджа. */
  eyebrow?: string;
  description?: string;
  link?: { href: string; label: string };
  align?: 'left' | 'center';
  as?: 'h2' | 'h3';
  children?: ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  eyebrow,
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
        // Линейка под заголовком вместо подложки: разделяет секции, ничего не
        // добавляя в макет
        'mb-8 flex flex-col gap-4 border-b border-line pb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-10',
        align === 'center' && 'sm:flex-col sm:items-center sm:text-center',
        className,
      )}
    >
      <div className={cn('max-w-[34ch]', align === 'center' && 'mx-auto')}>
        {eyebrow && <p className="eyebrow mb-4">{typo(eyebrow)}</p>}
        <Tag className="display-md">{typo(title)}</Tag>
      </div>
      {description && (
        <p className="max-w-[40ch] text-[15px] leading-relaxed text-ink-soft">
          {typo(description)}
        </p>
      )}
      {link && (
        <Link
          href={link.href}
          className="group inline-flex shrink-0 items-center gap-2.5 border-b-2 border-line-strong pb-1.5 text-[15px] font-semibold text-ink transition-colors hover:border-primary hover:text-primary"
        >
          {link.label}
          <SketchIcon
            name="arrow-right"
            size={17}
            className="text-primary transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden
          />
        </Link>
      )}
      {children}
    </div>
  );
}
