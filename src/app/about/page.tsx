import type { Metadata } from 'next';
import Image from 'next/image';
import { site, carrierNames } from '@/config/site';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ButtonLink } from '@/components/ui/Button';
import { StepsPlate, type Step } from '@/components/ui/StepsPlate';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import { ContactSection } from '@/components/forms/ContactSection';
import { products } from '@/data/catalog';
import { categories } from '@/data/categories';
import { typo } from '@/lib/typography';
import images from '@/data/image-index.json';

export const metadata: Metadata = {
  title: 'О компании',
  description:
    'Мы производим электрокамины сами: проектируем порталы, изготавливаем элементы, собираем и проверяем каждое изделие перед отправкой.',
  alternates: { canonical: '/about' },
  openGraph: { title: `О компании — ${site.name}`, url: '/about' },
};

const shared = images.shared as Record<string, string>;

const stages: Step[] = [
  {
    icon: 'design',
    title: 'Проектируем портал',
    text: typo(
      'Определяем пропорции, рисунок декора и посадочное место под очаг, чтобы камин собирался без подгонки.',
    ),
  },
  {
    icon: 'factory',
    title: 'Изготавливаем элементы',
    text: typo(
      'Раскраиваем МДФ, наносим покрытие — ПВХ, экошпон или эмаль — и формуем декоративный камень.',
    ),
  },
  {
    icon: 'assembly',
    title: 'Собираем и комплектуем',
    text: typo(
      'Соединяем портал, устанавливаем очаг Fobos или Flash 36, добавляем пульт и крепёж.',
    ),
  },
  {
    icon: 'quality',
    title: 'Проверяем каждое изделие',
    text: typo(
      'Смотрим геометрию и покрытие, включаем очаг: пламя, звук, обогрев, яркость и работу пульта.',
    ),
  },
  {
    icon: 'package',
    title: 'Упаковываем',
    text: typo(
      'Раскладываем по коробкам с крепежом и инструкцией — камин доезжает без повреждений.',
    ),
  },
  {
    icon: 'truck',
    title: 'Отправляем',
    text: typo(`Передаём ${carrierNames} и сообщаем данные для отслеживания.`),
  },
];

export default function AboutPage() {
  const models = new Set(products.map((p) => p.model)).size;
  const facts = [
    { value: String(models), label: typo('моделей в производстве') },
    { value: String(products.length), label: typo('исполнений в каталоге') },
    { value: String(categories.length), label: typo('типа каминов') },
  ];

  return (
    <>
      {/* Первый экран: крупная фотография и короткое утверждение */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="container-site relative grid grid-cols-1 items-center gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16 lg:py-20">
          <div>
            <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'О нас' }]} />
            <h1 className="mt-6 text-[clamp(2rem,1.4rem+2.6vw,3.5rem)] leading-[1.06]">
              {typo('Производим электрокамины сами')}
            </h1>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/70 sm:text-lg">
              {typo(
                'Мы не перепродаём чужую продукцию. Порталы разрабатываются и изготавливаются на нашем производстве, комплектуются очагами и проверяются перед отправкой покупателю.',
              )}
            </p>

            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="sr-only">{fact.label}</dt>
                  <dd>
                    <span className="block text-[clamp(1.75rem,1.4rem+1.4vw,2.5rem)] font-bold leading-none text-primary">
                      {fact.value}
                    </span>
                    <span className="mt-2 block text-sm leading-snug text-white/60">
                      {fact.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            <ButtonLink href="/catalog" size="lg" className="mt-9">
              Смотреть каталог
            </ButtonLink>
          </div>

          <div className="relative aspect-[4/5] w-full max-w-[460px] justify-self-center overflow-hidden rounded-[var(--radius-lg)] lg:justify-self-end">
            <Image
              src={images.hero}
              alt="Электрокамин собственного производства в интерьере гостиной"
              fill
              priority
              sizes="(max-width: 1024px) 92vw, 460px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Как создаётся камин */}
      <div className="container-site py-14 sm:py-20">
        <StepsPlate
          id="production"
          title="Как создаётся электрокамин"
          lead="Путь от чертежа до упакованной коробки — шесть этапов, которые проходит каждая модель."
          steps={stages}
          columns={3}
        />
      </div>

      {/* Контроль качества */}
      <section className="border-y border-line bg-surface py-14 sm:py-20">
        <div className="container-site">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">
            <div>
              <h2 className="text-[clamp(1.5rem,1.2rem+1.3vw,2.125rem)] leading-tight">
                {typo('Контроль качества и комплектация')}
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-soft sm:text-base">
                {typo(
                  'Перед упаковкой мы включаем очаг и проверяем все режимы: пламя, звук потрескивания дров, два режима обогрева, регулировку яркости, работу пульта и кнопок на лицевой панели.',
                )}
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                {typo(
                  'В коробку кладём крепёж и инструкцию — большинство моделей собираются примерно за десять минут без инструмента.',
                )}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <figure className="col-span-2">
                <div className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius-md)] bg-white">
                  <Image
                    src="/images/production/hearth-wide.webp"
                    alt="Горящие дрова в очаге крупным планом"
                    fill
                    sizes="(max-width: 1024px) 92vw, 620px"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-2 text-sm text-ink-soft">
                  {typo('Очаг Fobos: пламя и муляж дров')}
                </figcaption>
              </figure>

              <figure>
                <div className="relative aspect-square overflow-hidden rounded-[var(--radius-md)] bg-white">
                  <Image
                    src={shared['control-panel']}
                    alt="Панель управления очагом с кнопками режимов, яркости, звука и таймера"
                    fill
                    sizes="(max-width: 1024px) 45vw, 300px"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-2 text-sm text-ink-soft">
                  {typo('Панель управления')}
                </figcaption>
              </figure>

              <figure>
                <PlaceholderImage
                  label="Съёмка цеха и сборки"
                  className="aspect-square rounded-[var(--radius-md)]"
                />
                <figcaption className="mt-2 text-sm text-ink-muted">
                  {typo('Фотографий производства в материалах пока нет')}
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      <ContactSection
        title="Остались вопросы о производстве?"
        text="Расскажем про материалы, покрытия и комплектацию — и подскажем модель под ваш интерьер."
      />
    </>
  );
}
