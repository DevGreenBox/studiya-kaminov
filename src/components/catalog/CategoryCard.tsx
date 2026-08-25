import Image from 'next/image';
import Link from 'next/link';
import { SketchIcon } from '@/components/icons/SketchIcon';
import { products } from '@/data/catalog';
import { pluralize } from '@/lib/format';
import type { Category } from '@/types';
import { cn } from '@/lib/cn';

/**
 * Плитка категории: фотография во всю карточку, подпись поверх неё.
 *
 * Раньше снимок был окошком сверху, а текст жил в белой полосе под ним —
 * карточка читалась как строка каталога. Теперь работает сама фотография:
 * ради неё человек и приходит на страницу.
 *
 * Компонент общий для главной и «О нас»: карточки там были свёрстаны
 * отдельно и начали расходиться.
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
    <Link
      href={`/catalog?category=${category.slug}`}
      className={cn(
        'group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-[var(--radius-md)] bg-ink',
        className,
      )}
    >
      <Image
        src={category.image}
        alt={`${category.name} — фотография модели из каталога`}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.05]"
      />

      {/*
        Затемнение снизу. Градиент задан явными остановками, а не парой
        from/to: интерьеры сняты в светлых тонах, и мягкого перехода не
        хватало — белая подпись тонула в кадре.
      */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(28,25,23,0.94)_0%,rgba(28,25,23,0.78)_22%,rgba(28,25,23,0.35)_48%,rgba(28,25,23,0)_72%)]"
      />

      <span className="relative flex items-end justify-between gap-4 p-5">
        <span className="min-w-0">
          <span className="block text-[19px] font-bold leading-snug text-white">
            {category.name}
          </span>
          <span className="mt-1 block text-sm text-white/70">
            {category.summary} · {count} {pluralize(count, ['модель', 'модели', 'моделей'])}
          </span>
        </span>
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/40 text-white transition-[transform,background-color,border-color] duration-200 group-hover:translate-x-0.5 group-hover:border-primary group-hover:bg-primary"
          aria-hidden
        >
          <SketchIcon name="arrow-right" size={19} />
        </span>
      </span>
    </Link>
  );
}
