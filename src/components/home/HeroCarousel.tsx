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
import { usePrefersReducedMotion } from '@/lib/use-client-value';

const AUTOPLAY_MS = 7000;

const points: { icon: PencilIconName; text: string }[] = [
  { icon: 'factory', text: 'Собственное производство' },
  { icon: 'flame', text: typo('Очаг с живым эффектом пламени') },
  { icon: 'truck', text: 'Доставка по России' },
];

const labels: Record<Promotion['kind'], { text: string; className: string }> = {
  sale: { text: 'Акция', className: 'bg-primary text-white' },
  new: { text: 'Новинка', className: 'bg-white text-ink' },
  news: { text: 'Новости', className: 'bg-white/15 text-white backdrop-blur' },
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
 * точку на фотографии уже не задать.
 *
 * Нужно ради живого огня: его координаты заданы в процентах от снимка, а
 * колонка с фотографией тянется по высоте соседней колонки, так что её
 * пропорция заранее неизвестна.
 */
function useCoverBox(ref: React.RefObject<HTMLElement | null>, ratio: number) {
  const [box, setBox] = useState<CoverBox | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // ResizeObserver срабатывает и сразу после подписки, поэтому отдельного
    // первого замера в теле эффекта не нужно.
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

/** Живой огонь поверх реального фото горящего очага. */
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
 * Отступ слева совпадает с контейнером сайта, а правая колонка уходит в край
 * экрана: так фотография читается как разворот, а не как карточка, но текст
 * стоит на общей вертикали с остальными секциями страницы.
 */
const TEXT_INSET =
  'ps-4 pe-4 md:ps-6 md:pe-6 lg:ps-[max(40px,calc((100vw-var(--container-site))/2+40px))] lg:pe-12';

/*
 * На мобильном фотография держит пропорцию исходника, на десктопе тянется по
 * высоте текстовой колонки: иначе под снимком оставалась тёмная полоса.
 */
const PHOTO_CELL = 'relative aspect-[4/5] lg:aspect-auto';
const PHOTO = 'absolute inset-0 overflow-hidden bg-white/5';

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

  const arrow = (direction: -1 | 1) => (
    <button
      type="button"
      onClick={() => step(direction)}
      aria-label={direction === -1 ? 'Предыдущий слайд' : 'Следующий слайд'}
      className={cn(
        // Обе стрелки лежат на фотографии: слева они наезжали бы на заголовок
        'absolute bottom-8 z-20 hidden h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-ink/45 text-white backdrop-blur transition-colors hover:border-white/60 hover:bg-ink/75 lg:flex',
        direction === -1 ? 'right-28' : 'right-8',
      )}
    >
      <SketchIcon name={direction === -1 ? 'arrow-left' : 'arrow-right'} size={22} />
    </button>
  );

  return (
    <section
      aria-roledescription="карусель"
      aria-label="Акции, новинки и о компании"
      className="relative bg-ink text-white"
    >
      <ul
        ref={trackRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setHovered(true)}
        onBlurCapture={() => setHovered(false)}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* Слайд 1 — производитель и живой огонь */}
        <li
          className="w-full shrink-0 snap-start"
          aria-roledescription="слайд"
          aria-label={`1 из ${total}`}
        >
          <div className="grid h-full grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.62fr)] lg:items-stretch">
            <div
              className={cn(
                'order-2 flex flex-col justify-center pb-28 pt-12 lg:order-1 lg:pb-32',
                TEXT_INSET,
              )}
            >
              <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 px-3.5 py-1.5 text-sm font-medium text-white/75">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                {typo('Производитель электрокаминов')}
              </p>

              <h1 className="mt-6 max-w-[15ch] text-[clamp(2.25rem,1.4rem+3.4vw,4rem)] font-bold leading-[1.03]">
                {typo('Электрокамины собственного производства')}
              </h1>

              <p className="mt-6 max-w-xl text-[clamp(1rem,0.95rem+0.3vw,1.1875rem)] leading-relaxed text-white/70">
                {typo(
                  'Живое пламя, тепло и тишина — без дымохода и согласований. Собираем порталы сами и отправляем по всей России.',
                )}
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink href="/catalog" size="lg" className="sm:w-auto">
                  Выбрать камин
                  <SketchIcon name="arrow-right" size={19} aria-hidden />
                </ButtonLink>
                <ButtonLink
                  href="/about"
                  size="lg"
                  variant="ghost"
                  className="border border-white/25 bg-white/5 text-white hover:border-white/50 hover:bg-white/10 sm:w-auto"
                >
                  О производстве
                </ButtonLink>
              </div>

              <ul className="mt-10 flex flex-col gap-3.5 border-t border-white/10 pt-7 sm:flex-row sm:flex-wrap sm:gap-x-8">
                {points.map((point) => (
                  <li
                    key={point.text}
                    className="flex items-center gap-2.5 text-[15px] text-white/75"
                  >
                    <PencilIcon name={point.icon} size={28} className="shrink-0 text-primary" />
                    {point.text}
                  </li>
                ))}
              </ul>
            </div>

            <div className={cn('order-1 lg:order-2', PHOTO_CELL)}>
              <div ref={photoRef} className={PHOTO}>
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
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                    />
                    <Flame box={coverBox} />
                  </>
                )}
                {/* Смягчает стык тёмного текстового поля и фотографии */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/4 bg-gradient-to-r from-ink to-transparent lg:block"
                />
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
            {/* relative обязателен: заголовок растягивает ссылку на всю карточку
                через before:inset-0, и без точки отсчёта она накрывала бы
                весь первый экран, перехватывая клики по соседним слайдам */}
            <article className="group relative grid h-full grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.62fr)] lg:items-stretch">
              <div
                className={cn(
                  'order-2 flex flex-col justify-center pb-28 pt-12 lg:order-1 lg:pb-32',
                  TEXT_INSET,
                )}
              >
                <span
                  className={cn(
                    'inline-flex h-7 w-fit items-center rounded-full px-3.5 text-sm font-bold',
                    labels[promo.kind].className,
                  )}
                >
                  {labels[promo.kind].text}
                </span>

                <h2 className="mt-6 max-w-[15ch] text-[clamp(2rem,1.3rem+3vw,3.5rem)] font-bold leading-[1.05]">
                  <Link
                    href={promo.href}
                    className="before:absolute before:inset-0 before:content-[''] group-hover:text-primary"
                  >
                    {promo.title}
                  </Link>
                </h2>

                <p className="mt-6 max-w-xl text-[clamp(1rem,0.95rem+0.3vw,1.1875rem)] leading-relaxed text-white/70">
                  {promo.text}
                </p>

                <span className="mt-9 inline-flex h-14 w-fit items-center gap-2 rounded-[var(--radius-sm)] bg-primary px-7 font-semibold text-white transition-colors group-hover:bg-primary-hover">
                  {promo.cta}
                  <SketchIcon
                    name="arrow-right"
                    size={19}
                    aria-hidden
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </span>
              </div>

              <div className={cn('order-1 lg:order-2', PHOTO_CELL)}>
                <div className={PHOTO}>
                  <Image
                    src={promo.image}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/4 bg-gradient-to-r from-ink to-transparent lg:block"
                  />
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>

      {arrow(-1)}
      {arrow(1)}

      {/*
        Управление лежит поверх нижнего края слайда, а не под ним: иначе
        фотография обрывалась выше конца секции и выглядела подрезанной.
        Место под него зарезервировано нижним отступом текстовой колонки.

        Ширина по содержимому, а не во всю строку: растянутая панель
        перехватывала клики по стрелкам, которые лежат в том же нижнем поясе.
      */}
      <div
        className={cn(
          'absolute bottom-0 left-0 z-20 flex w-auto items-center gap-3 pb-8 lg:pb-10',
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
                'h-1.5 overflow-hidden rounded-full transition-[width,background-color] duration-300',
                index === active ? 'w-14 bg-white/25' : 'w-4 bg-white/25 hover:bg-white/45',
              )}
            >
              {index === active && (
                <span
                  // Ключ перезапускает анимацию при каждой смене слайда
                  key={`${active}-${running}`}
                  aria-hidden
                  className="block h-full origin-left rounded-full bg-primary"
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
      </div>
    </section>
  );
}
