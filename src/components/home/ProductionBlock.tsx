import Image from 'next/image';
import Link from 'next/link';
import { SketchIcon } from '@/components/icons/SketchIcon';
import { StepsPlate, type Step } from '@/components/ui/StepsPlate';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import { Reveal } from '@/components/ui/Reveal';
import { typo } from '@/lib/typography';

const steps: Step[] = [
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
 * о компании от каталога и даёт огню на фотографии звучать в полную силу.
 *
 * Композиция построена как разворот: короткий текст, широкий кадр очага во всю
 * ширину и лента этапов. Прежняя мозаика из трёх равных квадратов читалась как
 * ещё одна сетка карточек и спорила с этапами ниже.
 */
export function ProductionBlock() {
  return (
    <section id="production" className="bg-ink py-16 text-white sm:py-24">
      <div className="container-site">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:items-end lg:gap-20">
          <Reveal>
            <p className="eyebrow text-white/45">{typo('Собственное производство')}</p>
            <h2 className="display-lg mt-5 max-w-[15ch]">{typo('Мы делаем эти камины сами')}</h2>
          </Reveal>

          <Reveal delay={100}>
            <p className="max-w-[48ch] text-[17px] leading-relaxed text-white/70">
              {typo(
                'Не перепродаём чужую продукцию. Порталы из МДФ с покрытием и декоративным камнем разрабатываем и собираем у себя, комплектуем очагами и проверяем каждое изделие перед отправкой.',
              )}
            </p>
            <Link
              href="/about#production"
              className="group mt-7 inline-flex items-center gap-3 border-b-2 border-white/30 pb-2 text-[16px] font-semibold text-white transition-colors hover:border-primary"
            >
              Подробнее о производстве
              <SketchIcon
                name="arrow-right"
                size={18}
                aria-hidden
                className="text-primary transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        </div>

        {/* Один широкий кадр вместо мозаики: огонь крупно и без соседей */}
        <Reveal className="mt-14 lg:mt-20">
          <div className="relative aspect-[16/9] overflow-hidden bg-white/5 sm:aspect-[21/9]">
            <Image
              src="/images/production/hearth-wide.webp"
              alt="Горящие дрова в очаге крупным планом"
              fill
              sizes="(max-width: 1024px) 100vw, 1240px"
              className="object-cover"
            />
          </div>
          <p className="mt-3 flex items-center gap-2 text-sm text-white/50">
            <span aria-hidden className="h-px w-6 bg-white/30" />
            {typo('Очаг Fobos — проекционное пламя и звук потрескивания дров')}
          </p>
        </Reveal>

        <StepsPlate steps={steps} columns={6} inset />

        <div className="mt-12 flex flex-col gap-5 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:gap-8">
          <PlaceholderImage
            label="Съёмка цеха"
            tone="dark"
            className="h-24 w-full shrink-0 sm:w-44"
          />
          <p className="max-w-[62ch] text-sm leading-relaxed text-white/50">
            {typo(
              'Фотографий цеха и сборки в материалах пока нет. Когда заказчик их пришлёт, они встанут сюда вместо заглушки — вёрстку менять не придётся.',
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
