import Link from 'next/link';
import { PencilIcon, type PencilIconName } from '@/components/icons/PencilIcon';
import { SketchIcon } from '@/components/icons/SketchIcon';
import { Reveal } from '@/components/ui/Reveal';
import { carrierNames } from '@/config/site';
import { typo } from '@/lib/typography';

const items: { icon: PencilIconName; title: string; text: string }[] = [
  {
    icon: 'truck',
    title: typo(`Доставка ${carrierNames}`),
    text: typo('Компанию выбираете при оформлении заказа. СДЭК — основной перевозчик.'),
  },
  {
    icon: 'package',
    title: 'Заводская упаковка',
    text: typo('Коробки с крепежом и инструкцией по сборке.'),
  },
  {
    icon: 'assembly',
    title: 'Сборка за 10 минут',
    text: typo('Без инструмента и монтажа, по инструкции из коробки.'),
  },
];

/**
 * Доставка на главной.
 *
 * Плашки нет: три довода идут списком с линейками, как в печатном каталоге.
 * Подробности живут на отдельной странице, здесь только то, что нужно знать
 * до перехода в каталог.
 */
export function DeliveryBlock() {
  return (
    <section className="container-site pb-16 sm:pb-24">
      <div className="grid grid-cols-1 gap-10 border-t border-line pt-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-20 lg:pt-16">
        <Reveal>
          <p className="eyebrow">{typo('Доставка и оплата')}</p>
          <h2 className="display-md mt-5 max-w-[16ch]">{typo('Довезём в любой город')}</h2>
          <p className="mt-6 max-w-[42ch] text-[16px] leading-relaxed text-ink-soft">
            {typo(
              'Стоимость считается прямо при оформлении заказа — по городу получателя, весу и габаритам. Точную сумму подтверждает менеджер.',
            )}
          </p>
          <Link
            href="/delivery"
            className="group mt-7 inline-flex items-center gap-3 border-b-2 border-line-strong pb-1.5 text-[16px] font-semibold text-ink transition-colors hover:border-primary hover:text-primary"
          >
            Условия доставки
            <SketchIcon
              name="arrow-right"
              size={18}
              aria-hidden
              className="text-primary transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </Reveal>

        <ul className="lg:pt-2">
          {items.map((item, index) => (
            <Reveal
              as="li"
              key={item.title}
              delay={index * 80}
              className="flex gap-5 border-b border-line py-5 first:border-t"
            >
              <PencilIcon name={item.icon} size={34} className="mt-0.5 shrink-0 text-primary" />
              <div className="min-w-0">
                <h3 className="font-sans text-[16px] font-semibold leading-snug">{item.title}</h3>
                <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
