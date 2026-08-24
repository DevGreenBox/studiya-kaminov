'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SketchIcon } from '@/components/icons/SketchIcon';
import { ButtonLink } from '@/components/ui/Button';
import { PencilIcon, type PencilIconName } from '@/components/icons/PencilIcon';
import { heroMedia } from '@/config/site';
import { typo } from '@/lib/typography';
import type { Promotion } from '@/types';
import { cn } from '@/lib/cn';

const AUTOPLAY_MS = 7000;

const points: { icon: PencilIconName; text: string }[] = [
  { icon: 'factory', text: 'Собственное производство' },
  { icon: 'flame', text: typo('Очаг с живым эффектом пламени') },
  { icon: 'truck', text: 'Доставка по России' },
];

const labels: Record<Promotion['kind'], { text: string; className: string }> = {
  sale: { text: 'Акция', className: 'bg-primary text-white' },
  new: { text: 'Новинка', className: 'bg-success-soft text-success' },
  news: { text: 'Новости', className: 'bg-white text-ink-soft' },
};

/** Живой огонь поверх реального фото горящего очага. */
function Flame() {
  const { flame } = heroMedia;
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen [animation:ef-flame-breathe_2.3s_ease-in-out_infinite]"
        style={{
          left: `${flame.x}%`,
          top: `${flame.y}%`,
          width: `${flame.width}%`,
          height: `${flame.height}%`,
          background:
            'radial-gradient(closest-side, rgba(255,214,130,1), rgba(255,146,38,0.8) 42%, rgba(224,88,10,0.25) 70%, rgba(216,84,10,0) 82%)',
          filter: 'blur(5px)',
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -translate-x-1/2 origin-bottom rounded-full mix-blend-screen [animation:ef-flame-flicker_0.9s_ease-in-out_infinite]"
        style={{
          left: `${flame.x - 0.5}%`,
          top: `${flame.y - flame.height * 0.35}%`,
          width: `${flame.width * 0.62}%`,
          height: `${flame.height * 0.95}%`,
          background:
            'radial-gradient(closest-side, rgba(255,248,214,1), rgba(255,186,72,0.7) 45%, rgba(255,140,20,0) 78%)',
          filter: 'blur(3px)',
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen [animation:ef-flame-spark_1.4s_ease-in-out_infinite]"
        style={{
          left: `${flame.x + 4}%`,
          top: `${flame.y - 4}%`,
          width: `${flame.width * 0.4}%`,
          height: `${flame.height * 0.55}%`,
          background:
            'radial-gradient(closest-side, rgba(255,226,150,0.95), rgba(255,160,40,0.35) 55%, rgba(255,140,20,0) 80%)',
          filter: 'blur(4px)',
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-soft-light [animation:ef-flame-glow_3.7s_ease-in-out_infinite]"
        style={{
          left: `${flame.x}%`,
          top: `${flame.y}%`,
          width: `${flame.width * 3.4}%`,
          height: `${flame.height * 3}%`,
          background:
            'radial-gradient(closest-side, rgba(255,170,70,0.95), rgba(255,150,50,0) 74%)',
        }}
      />
    </>
  );
}

/**
 * Первый экран — карусель баннеров.
 *
 * Первый слайд представляет производителя и показывает живой огонь в реальном
 * камине, дальше идут акции и новинки: каждый баннер кликабелен целиком.
 *
 * Автопрокрутка спокойная (7 с) и останавливается, когда пользователь наводит
 * курсор, ставит фокус внутрь, уходит на другую вкладку или просит систему
 * уменьшить движение.
 */
export function HeroCarousel({ promotions }: { promotions: Promotion[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [paused, setPaused] = useState(false);

  const total = promotions.length + 1;

  const scrollTo = useCallback((index: number) => {
    const track = trackRef.current;
    const slide = track?.children[index] as HTMLElement | undefined;
    if (!track || !slide) return;
    const base = (track.children[0] as HTMLElement).offsetLeft;
    track.scrollTo({ left: slide.offsetLeft - base, behavior: 'smooth' });
  }, []);

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

  // Автопрокрутка. Выключается сама, если система просит меньше движения.
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches || !playing || paused) return;

    const id = window.setInterval(() => {
      if (document.hidden) return;
      scrollTo((active + 1) % total);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [active, total, playing, paused, scrollTo]);

  const step = (direction: -1 | 1) => scrollTo((active + direction + total) % total);

  return (
    <section
      aria-roledescription="карусель"
      aria-label="Акции, новинки и о компании"
      className="relative border-b border-line bg-surface"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <ul
        ref={trackRef}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* Слайд 1 — производитель и живой огонь */}
        <li
          className="w-full shrink-0 snap-start"
          aria-roledescription="слайд"
          aria-label={`1 из ${total}`}
        >
          <div className="container-site grid grid-cols-1 items-center gap-8 py-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14 lg:py-14">
            <div className="order-2 lg:order-1">
              <p className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-white px-3.5 py-1.5 text-sm font-medium text-ink-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                {typo('Производитель электрокаминов')}
              </p>

              <h1 className="mt-5 text-[clamp(2rem,1.3rem+3vw,3.5rem)] leading-[1.08]">
                {typo('Электрокамины собственного производства')}
              </h1>

              <p className="mt-5 max-w-xl text-[clamp(1rem,0.95rem+0.3vw,1.125rem)] leading-relaxed text-ink-soft">
                {typo(
                  'Современные электрокамины для дома и интерьера напрямую от производителя: классические и современные порталы, угловые модели и тумбы под телевизор.',
                )}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink href="/catalog" size="lg" className="sm:w-auto">
                  Перейти в каталог
                  <SketchIcon name="arrow-right" size={19} aria-hidden />
                </ButtonLink>
                <ButtonLink href="/contacts" size="lg" variant="secondary" className="sm:w-auto">
                  Связаться с нами
                </ButtonLink>
              </div>

              <ul className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-7">
                {points.map((point) => (
                  <li
                    key={point.text}
                    className="flex items-center gap-2.5 text-[15px] text-ink-soft"
                  >
                    <PencilIcon name={point.icon} size={26} className="shrink-0 text-primary" />
                    {point.text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-[460px] overflow-hidden rounded-[var(--radius-lg)] bg-surface-strong shadow-card">
                {heroMedia.video ? (
                  <video
                    src={heroMedia.video}
                    poster={heroMedia.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label="Электрокамин с горящим пламенем в интерьере"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <>
                    <Image
                      src={heroMedia.poster}
                      alt="Электрокамин с белым порталом и искусственным камнем в светлой гостиной"
                      fill
                      priority
                      sizes="(max-width: 1024px) 92vw, 460px"
                      className="object-cover"
                    />
                    <Flame />
                  </>
                )}
              </div>
            </div>
          </div>
        </li>

        {/* Слайды акций и новинок — кликабельны целиком */}
        {promotions.map((promo, index) => (
          <li
            key={promo.id}
            className="w-full shrink-0 snap-start"
            aria-roledescription="слайд"
            aria-label={`${index + 2} из ${total}`}
          >
            <div className="container-site py-10 lg:py-14">
              <article className="group relative grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14">
                <div className="order-2 lg:order-1">
                  <span
                    className={cn(
                      'inline-flex h-7 items-center rounded-full px-3.5 text-sm font-bold',
                      labels[promo.kind].className,
                    )}
                  >
                    {labels[promo.kind].text}
                  </span>

                  <h2 className="mt-5 text-[clamp(1.75rem,1.2rem+2.4vw,3rem)] leading-[1.1]">
                    <Link
                      href={promo.href}
                      className="before:absolute before:inset-0 before:content-[''] group-hover:text-primary"
                    >
                      {promo.title}
                    </Link>
                  </h2>

                  <p className="mt-5 max-w-xl text-[clamp(1rem,0.95rem+0.3vw,1.125rem)] leading-relaxed text-ink-soft">
                    {promo.text}
                  </p>

                  <span className="mt-8 inline-flex h-14 items-center gap-2 rounded-[var(--radius-sm)] bg-primary px-7 font-semibold text-white transition-colors group-hover:bg-primary-hover">
                    {promo.cta}
                    <SketchIcon
                      name="arrow-right"
                      size={19}
                      aria-hidden
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </span>
                </div>

                <div className="order-1 lg:order-2">
                  <div className="relative mx-auto aspect-[4/5] w-full max-w-[460px] overflow-hidden rounded-[var(--radius-lg)] bg-surface-strong shadow-card">
                    <Image
                      src={promo.image}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 92vw, 460px"
                      className="object-cover transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
                    />
                  </div>
                </div>
              </article>
            </div>
          </li>
        ))}
      </ul>

      {/* Управление каруселью */}
      <div className="container-site pb-6">
        <div className="flex items-center justify-center gap-3 lg:justify-between">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Предыдущий слайд"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line-strong bg-white text-ink transition-colors hover:border-ink-muted"
          >
            <SketchIcon name="arrow-left" size={19} />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex gap-1.5" role="tablist" aria-label="Навигация по слайдам">
              {Array.from({ length: total }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  role="tab"
                  aria-selected={index === active}
                  aria-label={`Слайд ${index + 1}`}
                  onClick={() => scrollTo(index)}
                  className={cn(
                    'h-2 rounded-full transition-[width,background-color] duration-200',
                    index === active ? 'w-7 bg-primary' : 'w-2 bg-line-strong hover:bg-ink-muted',
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => setPlaying((value) => !value)}
              aria-label={playing ? 'Остановить автопрокрутку' : 'Включить автопрокрутку'}
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-white hover:text-ink"
            >
              {playing ? (
                <SketchIcon name="pause" size={15} />
              ) : (
                <SketchIcon name="play" size={15} />
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Следующий слайд"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line-strong bg-white text-ink transition-colors hover:border-ink-muted"
          >
            <SketchIcon name="arrow-right" size={19} />
          </button>
        </div>
      </div>
    </section>
  );
}
