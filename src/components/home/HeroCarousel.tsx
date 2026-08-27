'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SketchIcon } from '@/components/icons/SketchIcon';
import { heroMedia } from '@/config/site';
import { typo } from '@/lib/typography';
import { usePrefersReducedMotion } from '@/lib/use-client-value';
import type { Promotion } from '@/types';
import { cn } from '@/lib/cn';

const AUTOPLAY_MS = 7000;

const kindLabel: Record<Promotion['kind'], string> = {
  sale: 'Акция',
  new: 'Новинка',
  news: 'Новости',
};

interface CoverBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * Прямоугольник, который занимает фотография внутри контейнера при
 * `object-cover`: часть кадра уходит за края, и в процентах от контейнера
 * точку на снимке уже не задать.
 *
 * Нужно ради живого огня: его координаты заданы в процентах от фотографии, а
 * колонка со снимком подстраивается под высоту экрана, так что её пропорция
 * заранее неизвестна.
 */
function useCoverBox(ref: React.RefObject<HTMLElement | null>, ratio: number) {
  const [box, setBox] = useState<CoverBox | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // ResizeObserver срабатывает и сразу после подписки, отдельного первого
    // замера в теле эффекта не нужно.
    const observer = new ResizeObserver(([entry]) => {
      const { width: cw, height: ch } = entry.contentRect;
      if (!cw || !ch) return;
      const scale = Math.max(cw / ratio, ch);
      const width = ratio * scale;
      setBox({ left: (cw - width) / 2, top: (ch - scale) / 2, width, height: scale });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, ratio]);

  return box;
}

/**
 * Живой огонь поверх реального фото горящего очага.
 *
 * Анимация постоянная, а не по наведению: это единственный элемент страницы,
 * который должен двигаться сам — ради него сюда и приходят.
 */
function Flame({ box }: { box: CoverBox | null }) {
  const { flame } = heroMedia;
  if (!box) return null;

  const px = (percent: number, size: number) => (percent / 100) * size;
  const x = box.left + px(flame.x, box.width);
  const y = box.top + px(flame.y, box.height);
  const w = px(flame.width, box.width);
  const h = px(flame.height, box.height);

  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen [animation:ef-flame-breathe_2.3s_ease-in-out_infinite]"
        style={{
          left: x,
          top: y,
          width: w,
          height: h,
          background:
            'radial-gradient(closest-side, rgba(255,214,130,1), rgba(255,146,38,0.8) 42%, rgba(224,88,10,0.25) 70%, rgba(216,84,10,0) 82%)',
          filter: 'blur(5px)',
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -translate-x-1/2 origin-bottom rounded-full mix-blend-screen [animation:ef-flame-flicker_0.9s_ease-in-out_infinite]"
        style={{
          left: x - w * 0.02,
          top: y - h * 0.35,
          width: w * 0.62,
          height: h * 0.95,
          background:
            'radial-gradient(closest-side, rgba(255,248,214,1), rgba(255,186,72,0.7) 45%, rgba(255,140,20,0) 78%)',
          filter: 'blur(3px)',
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen [animation:ef-flame-spark_1.4s_ease-in-out_infinite]"
        style={{
          left: x + w * 0.15,
          top: y - h * 0.17,
          width: w * 0.4,
          height: h * 0.55,
          background:
            'radial-gradient(closest-side, rgba(255,226,150,0.95), rgba(255,160,40,0.35) 55%, rgba(255,140,20,0) 80%)',
          filter: 'blur(4px)',
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-soft-light [animation:ef-flame-glow_3.7s_ease-in-out_infinite]"
        style={{
          left: x,
          top: y,
          width: w * 3.4,
          height: h * 3,
          background:
            'radial-gradient(closest-side, rgba(255,170,70,0.95), rgba(255,150,50,0) 74%)',
        }}
      />
    </>
  );
}

/*
 * Композиция намеренно несимметричная: текст занимает меньшую долю, фотография
 * уходит в правый край экрана. Отступ слева совпадает с контейнером сайта,
 * поэтому заголовок стоит на общей вертикали с остальными секциями.
 */
const TEXT_INSET =
  'ps-4 pe-4 md:ps-6 md:pe-6 lg:ps-[max(40px,calc((100vw-var(--container-site))/2+40px))] lg:pe-14';

const SLIDE_GRID =
  'grid h-full grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:items-stretch';

const PHOTO_CELL = 'relative aspect-[4/5] lg:aspect-auto lg:min-h-[min(88vh,820px)]';

export function HeroCarousel({ promotions }: { promotions: Promotion[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const coverBox = useCoverBox(photoRef, 4 / 5);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const reduced = usePrefersReducedMotion();

  const total = promotions.length + 1;
  /*
   * Кнопки паузы нет по решению заказчика. Автопрокрутка всё равно
   * останавливается: под курсором, при фокусе внутри ленты, на скрытой вкладке
   * и полностью — если система просит уменьшить движение.
   */
  const running = !hovered && !reduced;

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

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      scrollTo((active + 1) % total);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [active, total, running, scrollTo]);

  const step = (direction: -1 | 1) => scrollTo((active + direction + total) % total);

  return (
    <section
      aria-roledescription="карусель"
      aria-label="Акции, новинки и о компании"
      className="relative bg-canvas"
    >
      <ul
        ref={trackRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setHovered(true)}
        onBlurCapture={() => setHovered(false)}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* Слайд 1 — камин как герой, минимум слов */}
        <li
          className="w-full shrink-0 snap-start"
          aria-roledescription="слайд"
          aria-label={`1 из ${total}`}
        >
          <div className={SLIDE_GRID}>
            <div
              className={cn(
                'order-2 flex flex-col justify-center pb-24 pt-10 lg:order-1 lg:pb-28 lg:pt-0',
                TEXT_INSET,
              )}
            >
              <p className="eyebrow">{typo('Собственное производство')}</p>

              <h1 className="display-xl mt-6 max-w-[13ch]">
                {typo('Электрокамины, которые меняют вечер')}
              </h1>

              <p className="mt-7 max-w-[42ch] text-[17px] leading-relaxed text-ink-soft">
                {typo(
                  'Собираем порталы сами — от чертежа до упаковки. Очаг подключается к обычной розетке: ни дымохода, ни согласований.',
                )}
              </p>

              <Link
                href="/catalog"
                className="group mt-9 inline-flex w-fit items-center gap-3 border-b-2 border-primary pb-2 text-[17px] font-semibold text-ink transition-colors hover:text-primary"
              >
                Смотреть каталог
                <SketchIcon
                  name="arrow-right"
                  size={19}
                  aria-hidden
                  className="text-primary transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </div>

            <div className={cn('order-1 lg:order-2', PHOTO_CELL)}>
              <div ref={photoRef} className="absolute inset-0 overflow-hidden bg-surface">
                <Image
                  src={heroMedia.poster}
                  alt="Электрокамин Дублин с белым порталом и искусственным камнем в светлой гостиной"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover"
                />
                <Flame box={coverBox} />
              </div>

              {/* Подпись у фотографии: какая именно модель в кадре */}
              <Link
                href="/catalog/dublin-white"
                className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-2 bg-canvas/90 px-3 py-1.5 text-xs font-medium text-ink-soft backdrop-blur transition-colors hover:text-primary lg:bottom-6 lg:right-6"
              >
                <span aria-hidden className="h-px w-5 bg-primary" />
                {typo('Дублин, белый')}
              </Link>
            </div>
          </div>
        </li>

        {/* Баннеры акций и новинок — кликабельны целиком */}
        {promotions.map((promo, index) => (
          <li
            key={promo.id}
            className="w-full shrink-0 snap-start"
            aria-roledescription="слайд"
            aria-label={`${index + 2} из ${total}`}
          >
            {/*
              relative обязателен: заголовок растягивает ссылку на всю карточку
              через before:inset-0, и без точки отсчёта она накрывала бы весь
              первый экран, перехватывая клики по соседним слайдам.
            */}
            <article className={cn('group relative', SLIDE_GRID)}>
              <div
                className={cn(
                  'order-2 flex flex-col justify-center pb-24 pt-10 lg:order-1 lg:pb-28 lg:pt-0',
                  TEXT_INSET,
                )}
              >
                <p className="eyebrow flex items-center gap-2.5 text-primary">
                  <span aria-hidden className="h-px w-6 bg-primary" />
                  {kindLabel[promo.kind]}
                </p>

                <h2 className="display-lg mt-6 max-w-[14ch]">
                  <Link
                    href={promo.href}
                    className="before:absolute before:inset-0 before:content-[''] group-hover:text-primary"
                  >
                    {promo.title}
                  </Link>
                </h2>

                <p className="mt-6 max-w-[44ch] text-[17px] leading-relaxed text-ink-soft">
                  {promo.text}
                </p>

                <span className="mt-9 inline-flex w-fit items-center gap-3 border-b-2 border-primary pb-2 text-[17px] font-semibold text-ink transition-colors group-hover:text-primary">
                  {promo.cta}
                  <SketchIcon
                    name="arrow-right"
                    size={19}
                    aria-hidden
                    className="text-primary transition-transform duration-200 group-hover:translate-x-1"
                  />
                </span>
              </div>

              <div className={cn('order-1 lg:order-2', PHOTO_CELL)}>
                <div className="absolute inset-0 overflow-hidden bg-surface">
                  <Image
                    src={promo.image}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.02]"
                  />
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>

      {/*
        Управление лежит поверх нижнего края слайда. Ширина по содержимому:
        растянутая панель перехватывала бы клики по стрелкам.
      */}
      <div
        className={cn(
          'absolute bottom-0 left-0 z-20 flex w-auto items-center gap-6 pb-8 lg:pb-10',
          TEXT_INSET,
        )}
      >
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Навигация по слайдам">
          {Array.from({ length: total }, (_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={`Слайд ${index + 1}`}
              onClick={() => scrollTo(index)}
              className={cn(
                'h-[3px] overflow-hidden transition-[width,background-color] duration-300',
                index === active ? 'w-12 bg-line-strong' : 'w-4 bg-line-strong hover:bg-ink-muted',
              )}
            >
              {index === active && (
                <span
                  // Ключ перезапускает анимацию при каждой смене слайда
                  key={`${active}-${running}`}
                  aria-hidden
                  className="block h-full origin-left bg-primary"
                  style={{
                    animation: `ef-slide-progress ${AUTOPLAY_MS}ms linear forwards`,
                    animationPlayState: running ? 'running' : 'paused',
                    transform: running ? undefined : 'scaleX(1)',
                  }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-1 sm:flex">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Предыдущий слайд"
            className="flex h-10 w-10 items-center justify-center text-ink-muted transition-colors hover:text-ink"
          >
            <SketchIcon name="arrow-left" size={19} />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Следующий слайд"
            className="flex h-10 w-10 items-center justify-center text-ink-muted transition-colors hover:text-ink"
          >
            <SketchIcon name="arrow-right" size={19} />
          </button>
        </div>
      </div>
    </section>
  );
}
