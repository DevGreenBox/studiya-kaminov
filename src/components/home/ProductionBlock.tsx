import Image from 'next/image';
import { ButtonLink } from '@/components/ui/Button';
import { PencilIcon, type PencilIconName } from '@/components/icons/PencilIcon';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import { typo } from '@/lib/typography';

const steps: { icon: PencilIconName; title: string; text: string }[] = [
  {
    icon: 'design',
    title: 'Проектирование',
    text: typo('Пропорции портала, рисунок декора и посадочное место под очаг.'),
  },
  {
    icon: 'factory',
    title: 'Производство',
    text: typo('Раскрой МДФ, покрытие и формовка декоративного камня.'),
  },
  {
    icon: 'assembly',
    title: 'Сборка',
    text: typo('Собираем портал, ставим очаг, проверяем геометрию.'),
  },
  {
    icon: 'quality',
    title: 'Контроль',
    text: typo('Покрытие, пламя, обогрев, пульт и звук — каждое изделие.'),
  },
  {
    icon: 'package',
    title: 'Упаковка',
    text: typo('Коробки с крепежом и инструкцией по сборке.'),
  },
  {
    icon: 'truck',
    title: 'Отправка',
    text: typo('Передаём перевозчику и сообщаем данные для отслеживания.'),
  },
];

/**
 * Собственное производство.
 *
 * Тёмная секция намеренно выбивается из светлой страницы: она отделяет рассказ
 * о компании от каталога и даёт огню на фотографиях звучать в полную силу.
 */
export function ProductionBlock() {
  return (
    <section id="production" className="bg-ink py-14 text-white sm:py-20">
      <div className="container-site">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-1.5 text-sm font-medium text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
              {typo('Наше производство')}
            </p>

            <h2 className="mt-5 text-[clamp(1.75rem,1.3rem+2vw,2.75rem)] leading-[1.1]">
              {typo('Мы делаем эти камины сами')}
            </h2>

            <p className="mt-5 text-[15px] leading-relaxed text-white/70 sm:text-lg">
              {typo(
                'Не перепродаём чужую продукцию. Порталы из МДФ с покрытием и декоративным камнем разрабатываем и собираем у себя, комплектуем очагами и проверяем каждое изделие перед отправкой.',
              )}
            </p>

            <p className="mt-4 text-[15px] leading-relaxed text-white/70">
              {typo(
                'Поэтому мы отвечаем за то, что вы получаете: за геометрию портала, за качество покрытия и за то, как работает очаг.',
              )}
            </p>

            <ButtonLink
              href="/about#production"
              className="mt-8 border border-white/20 bg-white/5 text-white hover:border-white/40 hover:bg-white/10"
              variant="ghost"
            >
              Подробнее о производстве
            </ButtonLink>
          </div>

          {/* Мозаика: крупный кадр очага и три детали */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-[var(--radius-md)] bg-white/5">
              <Image
                src="/images/production/hearth-wide.webp"
                alt="Горящие дрова в очаге крупным планом"
                fill
                sizes="(max-width: 1024px) 92vw, 620px"
                className="object-cover"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent"
              />
              <p className="absolute bottom-4 left-5 text-sm font-medium text-white/85">
                {typo('Очаг Fobos — проекционное пламя и звук потрескивания дров')}
              </p>
            </div>

            <div className="relative aspect-square overflow-hidden rounded-[var(--radius-md)] bg-white/5">
              <Image
                src="/images/production/stone-detail.webp"
                alt="Фактура искусственного камня и профиль портала крупным планом"
                fill
                sizes="(max-width: 1024px) 45vw, 300px"
                className="object-cover"
              />
            </div>

            <div className="relative aspect-square overflow-hidden rounded-[var(--radius-md)] bg-white/5">
              <Image
                src="/images/production/firebox-detail.webp"
                alt="Край топки и пламя очага крупным планом"
                fill
                sizes="(max-width: 1024px) 45vw, 300px"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Этапы — компактной лентой */}
        <ol className="mt-14 grid grid-cols-1 gap-x-6 gap-y-8 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-6">
          {steps.map((step, index) => (
            <li key={step.title}>
              <div className="flex items-center gap-3">
                <PencilIcon name={step.icon} size={34} className="shrink-0 text-primary" />
                <span className="text-xs font-bold tabular-nums text-white/40">0{index + 1}</span>
              </div>
              <h3 className="mt-3 text-[16px] font-bold leading-snug">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/60">{step.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col gap-4 rounded-[var(--radius-md)] border border-dashed border-white/15 p-5 sm:flex-row sm:items-center sm:gap-6">
          <PlaceholderImage
            label="Съёмка цеха"
            tone="dark"
            className="h-24 w-full shrink-0 rounded-[var(--radius-sm)] sm:w-44"
          />
          <p className="text-sm leading-relaxed text-white/55">
            {typo(
              'Фотографий цеха и сборки в материалах пока нет. Когда заказчик их пришлёт, они встанут сюда вместо заглушки — вёрстку менять не придётся.',
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
