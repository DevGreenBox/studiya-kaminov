import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/data/catalog';
import { pluralize } from '@/lib/format';
import type { Category } from '@/types';
import { cn } from '@/lib/cn';

/**
 * Плитка категории без плашки.
 *
 * Ни рамки, ни тени, ни стрелки в кружке: композицию делает сама фотография,
 * а подпись стоит под ней, как в мебельном каталоге. Прежняя версия была
 * карточкой с рамкой и подписью поверх снимка — из-за контейнера все шесть
 * категорий читались как один повторяющийся блок.
 */
export function CategoryCard({
  category,
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  className,
}: {
  category: Category;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const count = products.filter((p) => p.category === category.slug).length;

  return (
    <Link href={`/catalog?category=${category.slug}`} className={cn('group block', className)}>
      <span className="relative block aspect-[4/5] overflow-hidden bg-surface">
        <Image
          src={category.image}
          alt={`${category.name} — фотография модели из каталога`}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
        />
      </span>

      <span className="mt-4 block">
        <span className="block font-display text-[21px] leading-snug transition-colors group-hover:text-primary">
          {category.name}
        </span>
        <span className="mt-1.5 block text-sm text-ink-muted">
          {category.summary}
          <span aria-hidden className="mx-2 text-line-strong">
            ·
          </span>
          {count} {pluralize(count, ['модель', 'модели', 'моделей'])}
        </span>
      </span>
    </Link>
  );
}
