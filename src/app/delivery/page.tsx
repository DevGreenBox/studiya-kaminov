import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ButtonLink } from '@/components/ui/Button';
import { PencilIcon, type PencilIconName } from '@/components/icons/PencilIcon';
import { ContactSection } from '@/components/forms/ContactSection';
import { carriers, carrierNames, site, contacts } from '@/config/site';
import { typo } from '@/lib/typography';

export const metadata: Metadata = {
  title: 'Оплата и доставка',
  description: `Как оформить заказ, как рассчитывается доставка ${carrierNames} и какие есть способы оплаты.`,
  alternates: { canonical: '/delivery' },
  openGraph: { title: `Оплата и доставка — ${site.name}`, url: '/delivery' },
};

/**
 * Единая цепочка заказа — от оформления до получения.
 *
 * Оплата встроена сюда четвёртым шагом: раньше она дублировалась отдельным
 * списком с теми же иконками и теми же формулировками.
 */
const steps: { icon: PencilIconName; title: string; text: string }[] = [
  {
    icon: 'design',
    title: 'Оформите заказ на сайте',
    text: typo('Добавьте камин в корзину и заполните форму. Регистрация не нужна.'),
  },
  {
    icon: 'support',
    title: typo('Дождитесь звонка менеджера'),
    text: typo('Подтвердит состав заказа, стоимость доставки и сроки отгрузки.'),
  },
  {
    icon: 'package',
    title: 'Оплатите заказ',
    text: typo('Менеджер пришлёт реквизиты. После оплаты передаём камин перевозчику.'),
  },
  {
    icon: 'truck',
    title: 'Получите камин',
    text: typo('Компанию выбираете при оформлении. Либо забираете сами со склада.'),
  },
];

const faq = [
  {
    q: 'Какую транспортную компанию выбрать?',
    a: typo(
      'СДЭК — основной перевозчик: пунктов выдачи больше, срок обычно короче. «Деловые Линии» выгоднее на крупногабаритных моделях вроде «Дублин Премиум» и «Честер». При оформлении заказа сайт покажет цену и срок обеих компаний — выбирайте, что удобнее.',
    ),
  },
  {
    q: 'Как рассчитывается стоимость доставки?',
    a: typo(
      'На странице оформления заказа укажите город получателя и нажмите «Рассчитать». Расчёт учитывает город, вес и габариты заказа и показывает обе компании сразу. Это предварительная оценка — точную сумму подтверждает менеджер.',
    ),
  },
  {
    q: 'Нужен ли монтаж и дымоход?',
    a: typo(
      'Нет. Электрокамин подключается к обычной розетке 220 В. Дымоход, вытяжка и согласования не требуются.',
    ),
  },
  {
    q: 'В каком виде приезжает камин?',
    a: typo(
      'В заводских коробках. Большинство моделей поставляются в двух упаковках — портал и очаг, у моделей с тумбами упаковок больше. Крепёж и инструкция в комплекте.',
    ),
  },
  {
    q: 'Сложно ли собрать камин?',
    a: typo('Сборка занимает около 10 минут по инструкции, специальный инструмент не нужен.'),
  },
  {
    q: 'Можно ли забрать заказ самостоятельно?',
    a: typo(
      'Да, самовывоз со склада возможен. Дату и адрес согласует менеджер после оформления заказа.',
    ),
  },
];

const carrierDetails: Record<string, string[]> = {
  cdek: [
    'Пункты выдачи по всей России и курьер до двери.',
    'Обычно самый короткий срок среди доступных вариантов.',
    'Удобен для моделей средних габаритов — «Мальта», «Дублин», угловые.',
  ],
  dellin: [
    'Доставка до терминала или до адреса.',
    'Выгоднее на крупногабаритных моделях — «Дублин Премиум», «Честер».',
    'Срок обычно на день-два больше, чем у СДЭК.',
  ],
};

export default function DeliveryPage() {
  return (
    <>
      <div className="container-site py-6">
        <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Оплата и доставка' }]} />

        <h1 className="mt-4 text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-tight">
          Оплата и доставка
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-soft sm:text-base">
          {typo(
            `Отправляем электрокамины по всей России — ${carrierNames}. Стоимость обеих компаний считается при оформлении заказа, вы выбираете подходящую.`,
          )}
        </p>

        <ol className="mt-10 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <PencilIcon name={step.icon} size={42} className="mt-0.5 shrink-0 text-primary" />
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">
                  Шаг {index + 1}
                </p>
                <h2 className="mt-1 text-[17px] font-bold leading-snug">{step.title}</h2>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Оплата — только то, чего нет в шагах выше */}
        <section aria-labelledby="payment-heading" className="mt-14 border-t border-line pt-10">
          <h2 id="payment-heading" className="text-2xl">
            Оплата
          </h2>

          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-soft sm:text-base">
            {typo(
              'Сумму заказа вместе с доставкой подтверждает менеджер — он же присылает реквизиты. Актуальный порядок расчётов уточняйте при подтверждении заказа.',
            )}
          </p>

          <p className="mt-4 text-[15px] text-ink-soft">
            {typo('Вопросы по оплате: ')}
            <a href={contacts.phoneHref} className="font-semibold text-primary">
              {contacts.phone}
            </a>
          </p>

          <p className="mt-5 max-w-2xl border-l-2 border-line-strong pl-4 text-sm leading-relaxed text-ink-muted">
            {typo(
              'Конкретные способы оплаты в исходных материалах не указаны. Когда заказчик их подтвердит, текст меняется в одном месте — src/app/delivery/page.tsx',
            )}
          </p>
        </section>

        {/* Плашки о транспортных компаниях */}
        <section aria-labelledby="carriers-heading" className="mt-14">
          <h2 id="carriers-heading" className="text-2xl">
            Транспортные компании
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
            {typo(
              'При оформлении заказа сайт рассчитывает обе компании и показывает цену и срок рядом.',
            )}
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {carriers.map((carrier) => (
              <div
                key={carrier.id}
                className="flex flex-col rounded-[var(--radius-md)] border border-line bg-surface p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-bold">{carrier.name}</h3>
                  <span
                    className={
                      carrier.primary
                        ? 'inline-flex h-6 shrink-0 items-center rounded-[var(--radius-xs)] bg-primary px-2 text-xs font-bold text-white'
                        : 'inline-flex h-6 shrink-0 items-center rounded-[var(--radius-xs)] bg-white px-2 text-xs font-bold text-ink-soft'
                    }
                  >
                    {carrier.primary ? 'Основная' : 'Дополнительно'}
                  </span>
                </div>
                <ul className="mt-4 flex list-disc flex-col gap-2.5 pl-5 text-[15px] leading-relaxed text-ink-soft">
                  {carrierDetails[carrier.id]?.map((line) => (
                    <li key={line}>{typo(line)}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <ButtonLink href="/catalog" className="mt-6">
            Выбрать камин
          </ButtonLink>
        </section>
      </div>

      {/* Форма обратной связи — сразу после плашек о ТК */}
      <ContactSection
        title="Нужна помощь с доставкой?"
        text="Подскажем срок и стоимость для вашего города и подберём удобный способ получения."
      />

      {/* Частые вопросы — ниже формы */}
      <section aria-labelledby="faq-heading" className="container-site pb-4">
        <h2 id="faq-heading" className="text-[clamp(1.5rem,1.2rem+1.3vw,2.125rem)] leading-tight">
          Частые вопросы
        </h2>
        <dl className="mt-6 flex flex-col divide-y divide-line border-y border-line">
          {faq.map((item) => (
            <div key={item.q} className="py-5">
              <dt className="text-[17px] font-bold">{typo(item.q)}</dt>
              <dd className="mt-2 max-w-3xl text-[15px] leading-relaxed text-ink-soft">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
