import Image from 'next/image';
import { ArrowRight, Factory, Flame, Truck } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { heroMedia } from '@/config/site';
import { typo } from '@/lib/typography';

const points = [
  { icon: Factory, text: 'Собственное производство' },
  { icon: Flame, text: typo('Очаг с живым эффектом пламени') },
  { icon: Truck, text: 'Доставка по России' },
];

/**
 * Первый экран: интерьер с электрокамином и анимацией горящего огня.
 *
 * Если задан heroMedia.video — используется настоящее видео. Пока его нет,
 * пламя на реальной фотографии оживляет CSS-свечение, позиционированное
 * точно по топке. Обе ветки уважают prefers-reduced-motion.
 */
export function Hero() {
  const { flame } = heroMedia;

  return (
    <section className="border-b border-line bg-surface">
      <div className="container-site grid grid-cols-1 items-center gap-8 py-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14 lg:py-16">
        <div className="order-2 lg:order-1">
          <p className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-white px-3.5 py-1.5 text-sm font-medium text-ink-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
            {typo('Производитель электрокаминов')}
          </p>

          <h1 className="mt-5 text-[clamp(2rem,1.3rem+3vw,3.75rem)] leading-[1.08]">
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
              <ArrowRight size={19} aria-hidden />
            </ButtonLink>
            <ButtonLink href="/contacts" size="lg" variant="secondary" className="sm:w-auto">
              Связаться с нами
            </ButtonLink>
          </div>

          <ul className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-7">
            {points.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2.5 text-[15px] text-ink-soft">
                <Icon size={18} className="shrink-0 text-primary" aria-hidden />
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px] overflow-hidden rounded-[var(--radius-lg)] bg-surface-strong shadow-card">
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
                  sizes="(max-width: 1024px) 92vw, 520px"
                  className="object-cover"
                />
                {/*
                  Живой огонь. Фотография уже с горящим очагом, поверх неё
                  идут четыре слоя: ядро пламени, дрожащие языки, искры и
                  общий отсвет на портал. Разные периоды анимации не дают
                  движению зациклиться заметным ритмом.
                */}
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
                {/* Тёплый отсвет на портал и стену */}
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
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
