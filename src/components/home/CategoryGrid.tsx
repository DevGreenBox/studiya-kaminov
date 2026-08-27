import Link from 'next/link';
import { SketchIcon } from '@/components/icons/SketchIcon';
import { categories } from '@/data/categories';
import { CategoryCard } from '@/components/catalog/CategoryCard';
import { Reveal } from '@/components/ui/Reveal';
import { typo } from '@/lib/typography';
import { cn } from '@/lib/cn';

/**
 * Шесть типов каминов.
 *
 * Сетка со смещением средней колонки: пропорции снимков одинаковые (4:3 —
 * родной кадр обложек, кадрировать нечего), а ряд не выстраивается в ровную
 * линейку. Это дешёвый и честный способ уйти от ощущения таблицы, не обрезая
 * фотографии ради разных форматов.
 */
export function CategoryGrid() {
  return (
    <section className="container-site pb-16 pt-16 sm:pb-24 sm:pt-24">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5 border-b border-line pb-7">
        <div>
          <p className="eyebrow">{typo('Каталог')}</p>
          <h2 className="display-lg mt-4 max-w-[18ch]">{typo('Шесть типов каминов')}</h2>
        </div>
        <p className="max-w-[38ch] text-[15px] leading-relaxed text-ink-soft">
          {typo(
            'Отличаются порталом: материалом, отделкой и тем, как камин встаёт в комнату. Очаг во всех — с эффектом живого пламени.',
          )}
        </p>
      </div>

      <ul className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10">
        {categories.map((category, index) => (
          <Reveal
            as="li"
            key={category.slug}
            delay={(index % 3) * 90}
            // Средняя колонка опущена: ряд перестаёт читаться как таблица
            className={cn(index % 3 === 1 && 'lg:mt-16')}
          >
            <CategoryCard category={category} priority={index < 3} />
          </Reveal>
        ))}
      </ul>

      <Link
        href="/catalog"
        className="group mt-14 inline-flex items-center gap-3 border-b-2 border-line-strong pb-2 text-[16px] font-semibold text-ink transition-colors hover:border-primary hover:text-primary lg:mt-20"
      >
        Весь каталог
        <SketchIcon
          name="arrow-right"
          size={18}
          aria-hidden
          className="text-primary transition-transform duration-200 group-hover:translate-x-1"
        />
      </Link>
    </section>
  );
}
