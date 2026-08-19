import type { Metadata } from 'next';
import Image from 'next/image';
import { site } from '@/config/site';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ButtonLink } from '@/components/ui/Button';
import { PencilIcon, type PencilIconName } from '@/components/icons/PencilIcon';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import { ContactSection } from '@/components/forms/ContactSection';
import images from '@/data/image-index.json';

export const metadata: Metadata = {
  title: 'О компании',
  description:
    'Мы производим электрокамины сами: проектируем порталы, изготавливаем элементы, собираем и проверяем каждое изделие перед отправкой.',
  alternates: { canonical: '/about' },
  openGraph: { title: `О компании — ${site.name}`, url: '/about' },
};

const shared = images.shared as Record<string, string>;

const stages: { icon: PencilIconName; title: string; text: string }[] = [
  {
    icon: 'design',
    title: 'Проектируем портал',
    text: 'Определяем пропорции, рисунок декора и посадочное место под очаг, чтобы камин собирался без подгонки.',
  },
  {
    icon: 'factory',
    title: 'Изготавливаем элементы',
    text: 'Раскраиваем МДФ, наносим покрытие — ПВХ, экошпон или эмаль — и формуем декоративный камень.',
  },
  {
    icon: 'assembly',
    title: 'Собираем и комплектуем',
    text: 'Соединяем портал, устанавливаем очаг Fobos или Flash 36, добавляем пульт и крепёж.',
  },
  {
    icon: 'quality',
    title: 'Проверяем каждое изделие',
    text: 'Смотрим геометрию и покрытие, включаем очаг: пламя, звук, обогрев, яркость и работу пульта.',
  },
  {
    icon: 'package',
    title: 'Упаковываем',
    text: 'Раскладываем по коробкам с крепежом и инструкцией — камин доезжает без повреждений.',
  },
  {
    icon: 'truck',
    title: 'Отправляем',
    text: 'Передаём транспортной компании и сообщаем данные для отслеживания.',
  },
];

export default function AboutPage() {
  return (
    <>
      <div className="container-site py-6">
        <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'О нас' }]} />
      </div>

      <section className="container-site">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14">
          <div>
            <h1 className="text-[clamp(2rem,1.4rem+2.4vw,3.25rem)] leading-[1.1]">
              Производим электрокамины сами
            </h1>
            <p className="mt-5 text-[15px] leading-relaxed text-ink-soft sm:text-lg">
              Мы не перепродаём чужую продукцию. Порталы разрабатываются и изготавливаются на нашем
              производстве, комплектуются очагами и проверяются перед отправкой покупателю.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
              Поэтому мы отвечаем за то, что вы получаете: за геометрию портала, за качество
              покрытия и за то, как работает очаг.
            </p>
            <ButtonLink href="/catalog" size="lg" className="mt-7">
              Смотреть каталог
            </ButtonLink>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] bg-surface">
            <Image
              src={images.hero}
              alt="Электрокамин собственного производства в интерьере гостиной"
              fill
              priority
              sizes="(max-width: 1024px) 92vw, 560px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section id="production" className="mt-16 border-y border-line bg-surface py-12 sm:mt-20 sm:py-16">
        <div className="container-site">
          <h2 className="text-[clamp(1.5rem,1.2rem+1.3vw,2.125rem)] leading-tight">
            Как создаётся электрокамин
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
            Путь от чертежа до упакованной коробки — шесть этапов, которые проходит каждая модель.
          </p>

          <ol className="mt-9 grid grid-cols-1 gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {stages.map((stage, index) => (
              <li key={stage.title} className="flex gap-4">
                <PencilIcon name={stage.icon} size={42} className="mt-0.5 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">
                    Этап {index + 1}
                  </p>
                  <h3 className="mt-1 text-[17px] font-bold leading-snug">{stage.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{stage.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-site py-12 sm:py-16">
        <h2 className="text-[clamp(1.5rem,1.2rem+1.3vw,2.125rem)] leading-tight">
          Контроль качества и комплектация
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
          Перед упаковкой мы включаем очаг и проверяем все режимы: пламя, звук потрескивания дров,
          два режима обогрева, регулировку яркости, работу пульта и кнопок на лицевой панели.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <figure className="flex flex-col gap-2">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-md)] bg-surface">
              <Image
                src={shared['fobos-hearth']}
                alt="Очаг Fobos: имитация пламени и реалистичный муляж дров"
                fill
                sizes="(max-width: 640px) 92vw, 25vw"
                className="object-cover"
              />
            </div>
            <figcaption className="text-sm text-ink-soft">Очаг Fobos крупным планом</figcaption>
          </figure>

          <figure className="flex flex-col gap-2">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-md)] bg-surface">
              <Image
                src={shared['control-panel']}
                alt="Панель управления очагом с кнопками режимов, яркости, звука и таймера"
                fill
                sizes="(max-width: 640px) 92vw, 25vw"
                className="object-cover"
              />
            </div>
            <figcaption className="text-sm text-ink-soft">Панель управления</figcaption>
          </figure>

          <figure className="flex flex-col gap-2">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-md)] bg-surface">
              <Image
                src={shared['modes']}
                alt="Схема режимов работы очага и площади обогрева"
                fill
                sizes="(max-width: 640px) 92vw, 25vw"
                className="object-cover"
              />
            </div>
            <figcaption className="text-sm text-ink-soft">Режимы работы</figcaption>
          </figure>

          <figure className="flex flex-col gap-2">
            <PlaceholderImage
              label="Съёмка цеха и сборки"
              className="aspect-[3/4] rounded-[var(--radius-md)]"
            />
            <figcaption className="text-sm text-ink-muted">
              Фотографий производства в материалах пока нет
            </figcaption>
          </figure>
        </div>
      </section>

      <ContactSection
        title="Остались вопросы о производстве?"
        text="Расскажем про материалы, покрытия и комплектацию — и подскажем модель под ваш интерьер."
      />
    </>
  );
}
