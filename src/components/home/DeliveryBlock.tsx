import { PencilIcon, type PencilIconName } from '@/components/icons/PencilIcon';
import { ButtonLink } from '@/components/ui/Button';
import { deliveryConfig } from '@/config/site';
import { typo } from '@/lib/typography';

const items: { icon: PencilIconName; title: string; text: string }[] = [
  {
    icon: 'truck',
    title: `Доставка «${deliveryConfig.carrier}»`,
    text: typo(
      'Отправляем транспортной компанией по всей России. Стоимость считается при оформлении заказа.',
    ),
  },
  {
    icon: 'package',
    title: 'Надёжная упаковка',
    text: typo('Камин приезжает в заводских коробках с крепежом и инструкцией по сборке.'),
  },
  {
    icon: 'assembly',
    title: 'Простая сборка',
    text: typo(
      'Большинство моделей собираются примерно за 10 минут по инструкции, без инструмента и монтажа.',
    ),
  },
];

export function DeliveryBlock() {
  return (
    <section className="container-site py-12 sm:py-16">
      <div className="rounded-[var(--radius-lg)] border border-line bg-surface-warm p-6 sm:p-9 lg:p-11">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-12">
          <div>
            <h2 className="text-[clamp(1.5rem,1.2rem+1.3vw,2.125rem)] leading-tight">
              Доставка и оплата
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft sm:text-base">
              {typo(
                'Рассчитываем стоимость доставки прямо при оформлении заказа — по городу получателя, весу и габаритам. Точную сумму подтверждает менеджер.',
              )}
            </p>
            <ButtonLink href="/delivery" variant="secondary" className="mt-6">
              Условия доставки
            </ButtonLink>
          </div>

          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-5">
            {items.map((item) => (
              <li key={item.title}>
                <PencilIcon name={item.icon} size={40} className="text-primary" />
                <h3 className="mt-3 text-[16px] font-bold leading-snug">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
