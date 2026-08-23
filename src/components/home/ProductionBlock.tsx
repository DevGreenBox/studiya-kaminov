import Image from 'next/image';
import { ButtonLink } from '@/components/ui/Button';
import { PencilIcon, type PencilIconName } from '@/components/icons/PencilIcon';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import images from '@/data/image-index.json';
import { typo } from '@/lib/typography';

const steps: { icon: PencilIconName; title: string; text: string }[] = [
  {
    icon: 'design',
    title: 'Проектирование',
    text: typo('Разрабатываем портал: пропорции, рисунок, посадочное место под очаг.'),
  },
  {
    icon: 'factory',
    title: 'Производство элементов',
    text: typo('Раскрой МДФ, покрытие, формовка декоративного камня.'),
  },
  {
    icon: 'assembly',
    title: 'Сборка',
    text: typo('Собираем портал и устанавливаем очаг, проверяем геометрию.'),
  },
  {
    icon: 'quality',
    title: 'Контроль',
    text: typo('Проверяем покрытие, работу пламени, обогрева, пульта и звука.'),
  },
  {
    icon: 'package',
    title: 'Упаковка',
    text: typo('Комплектуем в коробки с крепежом и инструкцией по сборке.'),
  },
  {
    icon: 'truck',
    title: 'Отправка',
    text: typo('Передаём транспортной компании и сообщаем трек-номер.'),
  },
];

const shared = images.shared as Record<string, string>;

export function ProductionBlock() {
  return (
    <section id="production" className="border-y border-line bg-surface py-12 sm:py-16">
      <div className="container-site">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-14">
          <div>
            <h2 className="text-[clamp(1.5rem,1.2rem+1.3vw,2.125rem)] leading-tight">
              {typo('Собственное производство электрокаминов')}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft sm:text-base">
              {typo(
                'Мы производим электрокамины сами, а не перепродаём чужую продукцию. Порталы делаем из МДФ с покрытием и декоративным искусственным камнем, комплектуем очагами и проверяем каждое изделие перед отправкой.',
              )}
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft sm:text-base">
              {typo(
                'Поэтому мы отвечаем за то, что вы получаете: за геометрию портала, за качество покрытия и за то, как работает очаг.',
              )}
            </p>

            <ButtonLink href="/about#production" variant="secondary" className="mt-7">
              Подробнее о производстве
            </ButtonLink>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-md)] bg-white">
              <Image
                src={shared['fobos-hearth']}
                alt="Очаг Fobos крупным планом: имитация пламени и муляж дров"
                fill
                sizes="(max-width: 1024px) 45vw, 260px"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-md)] bg-white">
              <Image
                src={shared['control-panel']}
                alt="Панель управления очагом: кнопки режимов, яркости, звука и таймера"
                fill
                sizes="(max-width: 1024px) 45vw, 260px"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-md)] bg-white">
              <Image
                src={shared['packaging-2']}
                alt="Камин в упаковке: портал и очаг в двух коробках"
                fill
                sizes="(max-width: 1024px) 45vw, 260px"
                className="object-cover"
              />
            </div>
            <PlaceholderImage
              label="Фотография цеха и сборки"
              className="aspect-[4/5] rounded-[var(--radius-md)]"
            />
          </div>
        </div>

        <ol className="mt-12 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <PencilIcon name={step.icon} size={40} className="mt-0.5 shrink-0 text-primary" />
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">
                  Шаг {index + 1}
                </p>
                <h3 className="mt-1 text-[17px] font-bold leading-snug">{step.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
