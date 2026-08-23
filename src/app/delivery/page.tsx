import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ButtonLink } from '@/components/ui/Button';
import { PencilIcon, type PencilIconName } from '@/components/icons/PencilIcon';
import { ContactSection } from '@/components/forms/ContactSection';
import { deliveryConfig, site, contacts } from '@/config/site';
import { typo } from '@/lib/typography';

export const metadata: Metadata = {
  title: 'Оплата и доставка',
  description: `Как оформить заказ, как рассчитывается доставка «${deliveryConfig.carrier}» и какие есть способы оплаты.`,
  alternates: { canonical: '/delivery' },
  openGraph: { title: `Оплата и доставка — ${site.name}`, url: '/delivery' },
};

const steps: { icon: PencilIconName; title: string; text: string }[] = [
  {
    icon: 'design',
    title: 'Оформите заказ на сайте',
    text: typo(
      'Добавьте камин в корзину и заполните форму оформления. Логин и регистрация не нужны.',
    ),
  },
  {
    icon: 'support',
    title: typo('Дождитесь звонка менеджера'),
    text: typo(
      'Менеджер подтвердит состав заказа, окончательную стоимость доставки и сроки отгрузки.',
    ),
  },
  {
    icon: 'truck',
    title: 'Получите камин',
    text: typo(
      `Отправляем транспортной компанией «${deliveryConfig.carrier}» либо передаём при самовывозе.`,
    ),
  },
];

const faq = [
  {
    q: typo('Как рассчитывается стоимость доставки?'),
    a: typo(
      'На странице оформления заказа укажите город получателя и нажмите «Рассчитать». Расчёт учитывает город, вес и габариты заказа. Это предварительная оценка — точную сумму подтверждает менеджер.',
    ),
  },
  {
    q: typo('Нужен ли монтаж и дымоход?'),
    a: typo(
      'Нет. Электрокамин подключается к обычной розетке 220 В. Дымоход, вытяжка и согласования не требуются.',
    ),
  },
  {
    q: typo('В каком виде приезжает камин?'),
    a: typo(
      'В заводских коробках. Большинство моделей поставляются в двух упаковках — портал и очаг, у моделей с тумбами упаковок больше. Крепёж и инструкция в комплекте.',
    ),
  },
  {
    q: 'Сложно ли собрать камин?',
    a: typo('Сборка занимает около 10 минут по инструкции, специальный инструмент не нужен.'),
  },
  {
    q: typo('Можно ли забрать заказ самостоятельно?'),
    a: typo(
      'Да, самовывоз со склада возможен. Дату и адрес согласует менеджер после оформления заказа.',
    ),
  },
];

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
            'Отправляем электрокамины по всей России. Стоимость доставки считается при оформлении заказа — по городу получателя, весу и габаритам.',
          )}
        </p>

        <ol className="mt-10 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-3">
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

        <section className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-[var(--radius-md)] border border-line bg-surface p-6">
            <h2 className="text-xl font-bold">{typo(`Доставка «${deliveryConfig.carrier}»`)}</h2>
            <ul className="mt-4 flex list-disc flex-col gap-2.5 pl-5 text-[15px] leading-relaxed text-ink-soft">
              <li>{typo('Отправка по всей России до терминала или до адреса.')}</li>
              <li>{typo('Стоимость рассчитывается автоматически при оформлении заказа.')}</li>
              <li>{typo('Расчёт учитывает город получателя, вес и объём отправления.')}</li>
              <li>{typo('Сроки зависят от региона: от 1–2 дней по ближайшим городам.')}</li>
              <li>{typo('Точную стоимость и сроки подтверждает менеджер до отгрузки.')}</li>
            </ul>
            <ButtonLink href="/catalog" variant="secondary" className="mt-6">
              Выбрать камин
            </ButtonLink>
          </div>

          <div className="rounded-[var(--radius-md)] border border-line bg-surface p-6">
            <h2 className="text-xl font-bold">Оплата</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
              {typo(
                'Способы оплаты и условия предоплаты уточняйте у менеджера при подтверждении заказа — он назовёт актуальный порядок расчётов и пришлёт реквизиты.',
              )}
            </p>
            <p className="mt-4 rounded-[var(--radius-sm)] border border-dashed border-line-strong bg-white px-4 py-3 text-sm leading-relaxed text-ink-muted">
              {typo(
                'Конкретные способы оплаты в исходных материалах не указаны. Когда заказчик их подтвердит, текст меняется в одном месте —',
              )}
              <code>src/app/delivery/page.tsx</code>.
            </p>
            <p className="mt-4 text-[15px] text-ink-soft">
              Вопросы по оплате:{' '}
              <a href={contacts.phoneHref} className="font-semibold text-primary">
                {contacts.phone}
              </a>
            </p>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-[clamp(1.5rem,1.2rem+1.3vw,2.125rem)] leading-tight">
            Частые вопросы
          </h2>
          <dl className="mt-6 flex flex-col divide-y divide-line border-y border-line">
            {faq.map((item) => (
              <div key={item.q} className="py-5">
                <dt className="text-[17px] font-bold">{item.q}</dt>
                <dd className="mt-2 max-w-3xl text-[15px] leading-relaxed text-ink-soft">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <ContactSection
        title="Нужна помощь с доставкой?"
        text="Подскажем срок и стоимость для вашего города и подберём удобный способ получения."
      />
    </>
  );
}
