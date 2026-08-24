'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SketchIcon } from '@/components/icons/SketchIcon';
import { categories } from '@/data/categories';
import { products } from '@/data/catalog';
import { pluralize } from '@/lib/format';
import { typo } from '@/lib/typography';
import { cn } from '@/lib/cn';

/**
 * Карусель шести видов каминов.
 *
 * Автопрокрутки нет намеренно: на главной карусель — первый экран и должна
 * себя показывать, а здесь читатель уже внутри рассказа о производстве и
 * листает сам.
 *
 * Видно сразу несколько карточек, поэтому стрелки не зацикливаются, а гаснут
 * на краях: иначе непонятно, докуда долистал.
 */
export function CategoryCarousel() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const slides = Array.from(track.children) as HTMLElement[];
    const base = slides[0]?.offsetLeft ?? 0;

    let closest = 0;
    let min = Infinity;
    slides.forEach((slide, index) => {
      const distance = Math.abs(slide.offsetLeft - base - track.scrollLeft);
      if (distance < min) {
        min = distance;
        closest = index;
      }
    });
    setActive(closest);

    // Единица запаса: дробные значения scrollLeft не дают точного равенства
    setAtStart(track.scrollLeft <= 1);
    setAtEnd(track.scrollLeft >= track.scrollWidth - track.clientWidth - 1);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    sync();
    track.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      track.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [sync]);

  const scrollTo = (index: number) => {
    const track = trackRef.current;
    const slides = track ? (Array.from(track.children) as HTMLElement[]) : [];
    const target = slides[Math.min(slides.length - 1, Math.max(0, index))];
    if (!track || !target) return;
    // Отсчёт от первого слайда: сама лента может иметь собственный отступ
    track.scrollTo({ left: target.offsetLeft - slides[0].offsetLeft, behavior: 'smooth' });
  };

  return (
    <section aria-roledescription="карусель" aria-label="Виды каминов" className="py-14 sm:py-20">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-[clamp(1.5rem,1.2rem+1.3vw,2.125rem)] leading-tight">
              {typo('Шесть видов каминов')}
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
              {typo(
                'Все они собираются на одном производстве и отличаются порталом: материалом, отделкой и тем, как камин встаёт в комнату.',
              )}
            </p>
          </div>

          {/* На мобильном листают пальцем, стрелки только с планшета */}
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollTo(active - 1)}
              disabled={atStart}
              aria-label="Предыдущие камины"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong bg-white text-ink transition-colors hover:border-ink-muted disabled:cursor-default disabled:border-line disabled:text-line-strong"
            >
              <SketchIcon name="arrow-left" size={19} />
            </button>
            <button
              type="button"
              onClick={() => scrollTo(active + 1)}
              disabled={atEnd}
              aria-label="Следующие камины"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong bg-white text-ink transition-colors hover:border-ink-muted disabled:cursor-default disabled:border-line disabled:text-line-strong"
            >
              <SketchIcon name="arrow-right" size={19} />
            </button>
          </div>
        </div>

        <ul
          ref={trackRef}
          className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((category, index) => {
            const count = products.filter((p) => p.category === category.slug).length;
            return (
              <li
                key={category.slug}
                aria-roledescription="слайд"
                aria-label={`${index + 1} из ${categories.length}`}
                className="w-[78%] shrink-0 snap-start sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]"
              >
                <Link
                  href={`/catalog?category=${category.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-md)] border border-line bg-white transition-[border-color,box-shadow] duration-200 hover:border-line-strong hover:shadow-card"
                >
                  <span className="relative block aspect-[4/3] overflow-hidden bg-surface">
                    <Image
                      src={category.image}
                      alt={`${category.name} — фотография модели из каталога`}
                      fill
                      sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 31vw"
                      className="object-cover transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
                    />
                  </span>

                  <span className="flex flex-1 items-center justify-between gap-4 p-4 sm:p-5">
                    <span className="min-w-0">
                      <span className="block text-lg font-bold leading-snug">{category.name}</span>
                      <span className="mt-1 block text-sm text-ink-muted">
                        {category.summary} · {count}{' '}
                        {pluralize(count, ['модель', 'модели', 'моделей'])}
                      </span>
                    </span>
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line-strong text-ink transition-[transform,border-color,color] duration-200 group-hover:translate-x-0.5 group-hover:border-primary group-hover:text-primary"
                      aria-hidden
                    >
                      <SketchIcon name="arrow-right" size={18} />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 flex justify-center gap-1.5 sm:hidden">
          {categories.map((category, index) => (
            <button
              key={category.slug}
              type="button"
              aria-label={`Показать «${category.name}»`}
              aria-current={index === active}
              onClick={() => scrollTo(index)}
              className={cn(
                'h-2 rounded-full transition-[width,background-color] duration-200',
                index === active ? 'w-7 bg-primary' : 'w-2 bg-line-strong',
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
