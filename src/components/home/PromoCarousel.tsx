'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Promotion } from '@/types';
import { cn } from '@/lib/cn';

const labels: Record<Promotion['kind'], { text: string; className: string }> = {
  sale: { text: 'Акция', className: 'bg-primary text-white' },
  new: { text: 'Новинка', className: 'bg-success-soft text-success' },
  news: { text: 'Новости', className: 'bg-info-soft text-ink-soft' },
};

/**
 * Карусель акций и новостей.
 * Прокрутка нативная (scroll-snap) — стрелки, свайп и клавиатура работают
 * без внешних библиотек. Автоскролла нет: он мешает читать.
 */
export function PromoCarousel({ items }: { items: Promotion[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const sync = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const { scrollLeft, scrollWidth, clientWidth } = track;
    setCanPrev(scrollLeft > 4);
    setCanNext(scrollLeft + clientWidth < scrollWidth - 4);

    const slides = Array.from(track.children) as HTMLElement[];
    const base = slides[0]?.offsetLeft ?? 0;
    let closest = 0;
    let min = Infinity;
    slides.forEach((slide, index) => {
      const distance = Math.abs(slide.offsetLeft - base - scrollLeft);
      if (distance < min) {
        min = distance;
        closest = index;
      }
    });
    setActive(closest);
  }, []);

  useEffect(() => {
    sync();
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      track.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [sync]);

  const scrollTo = (index: number) => {
    const track = trackRef.current;
    const slide = track?.children[index] as HTMLElement | undefined;
    if (!track || !slide) return;
    const base = (track.children[0] as HTMLElement).offsetLeft;
    track.scrollTo({ left: slide.offsetLeft - base, behavior: 'smooth' });
  };

  const step = (direction: -1 | 1) => scrollTo(Math.min(items.length - 1, Math.max(0, active + direction)));

  return (
    <section aria-label="Акции и новости" className="container-site py-12 sm:py-16">
      <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
        <h2 className="text-[clamp(1.5rem,1.2rem+1.3vw,2.125rem)] leading-tight">Акции и новости</h2>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={!canPrev}
            aria-label="Предыдущий слайд"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong bg-white text-ink transition-colors hover:border-ink-muted disabled:opacity-35"
          >
            <ArrowLeft size={19} />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={!canNext}
            aria-label="Следующий слайд"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong bg-white text-ink transition-colors hover:border-ink-muted disabled:opacity-35"
          >
            <ArrowRight size={19} />
          </button>
        </div>
      </div>

      <ul
        ref={trackRef}
        tabIndex={0}
        aria-label="Слайды с акциями и новостями"
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            step(1);
          }
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            step(-1);
          }
        }}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2 [scrollbar-width:none] scroll-pl-4 sm:-mx-6 sm:px-6 sm:scroll-pl-6 lg:-mx-10 lg:px-10 lg:scroll-pl-10 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, index) => (
          <li
            key={item.id}
            className="w-[85%] shrink-0 snap-start sm:w-[55%] lg:w-[calc((100%-2rem)/3)]"
            aria-roledescription="слайд"
            aria-label={`${index + 1} из ${items.length}`}
          >
            <article className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-md)] border border-line bg-white transition-[border-color,box-shadow] duration-200 hover:border-line-strong hover:shadow-card">
              <div className="relative aspect-[16/10] overflow-hidden bg-surface">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 85vw, (max-width: 1024px) 55vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
                />
                <span
                  className={cn(
                    'absolute left-3 top-3 inline-flex h-6 items-center rounded-[var(--radius-xs)] px-2 text-xs font-bold',
                    labels[item.kind].className,
                  )}
                >
                  {labels[item.kind].text}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-bold leading-snug">{item.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{item.text}</p>
                <Link
                  href={item.href}
                  className="mt-auto inline-flex items-center gap-1.5 pt-4 font-semibold text-primary transition-colors hover:text-primary-hover"
                >
                  {item.cta}
                  <ArrowRight size={17} aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex justify-center gap-1.5" role="tablist" aria-label="Навигация по слайдам">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={index === active}
            aria-label={`Слайд ${index + 1}`}
            onClick={() => scrollTo(index)}
            className={cn(
              'h-2 rounded-full transition-[width,background-color] duration-200',
              index === active ? 'w-6 bg-primary' : 'w-2 bg-line-strong hover:bg-ink-muted',
            )}
          />
        ))}
      </div>
    </section>
  );
}
