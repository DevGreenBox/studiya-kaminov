import Image from 'next/image';
import { PencilIcon, type PencilIconName } from '@/components/icons/PencilIcon';
import { Reveal } from '@/components/ui/Reveal';
import { typo } from '@/lib/typography';

/**
 * Почему покупают у нас.
 *
 * Шесть одинаковых карточек «иконка — заголовок — две строки» заменены на
 * типографическую композицию: главный довод набран крупно и вынесен к
 * фотографии материала, остальные идут списком с тонкими линейками. Смысл и
 * состав доводов прежние, изменился только способ их подать.
 */

const rest: { icon: PencilIconName; title: string; text: string }[] = [
  {
    icon: 'palette',
    title: 'Исполнения под интерьер',
    text: typo('Одна модель — несколько цветов портала и вариантов камня.'),
  },
  {
    icon: 'plug',
    title: 'Без дымохода и монтажа',
    text: typo('Розетка 220 В. Не нужны дым, зола и разрешения.'),
  },
  {
    icon: 'support',
    title: 'Помощь в выборе',
    text: typo('Подскажем размер под нишу и площадь обогрева.'),
  },
  {
    icon: 'truck',
    title: 'Доставка по России',
    text: typo('Стоимость считается при оформлении заказа.'),
  },
];

export function Advantages() {
  return (
    <section className="bg-surface py-16 sm:py-24">
      <div className="container-site">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-20">
          <Reveal>
            <p className="eyebrow">{typo('Почему покупают у нас')}</p>

            <h2 className="display-lg mt-5 max-w-[16ch]">
              {typo('Между вами и нашим цехом никого нет')}
            </h2>

            <p className="mt-7 max-w-[46ch] text-[17px] leading-relaxed text-ink-soft">
              {typo(
                'Мы сами разрабатываем и собираем порталы, комплектуем их очагами и проверяем каждое изделие перед упаковкой: геометрию, покрытие, пламя, обогрев и работу пульта.',
              )}
            </p>

            <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-ink-soft">
              {typo(
                'Поэтому цена не тянет за собой наценку посредника, а за качество отвечает тот, кто камин сделал.',
              )}
            </p>
          </Reveal>

          <Reveal delay={120} className="relative">
            <div className="relative aspect-[4/5] overflow-hidden bg-surface-strong">
              <Image
                src="/images/production/stone-detail.webp"
                alt="Фактура искусственного камня и профиль портала крупным планом"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
            <p className="mt-3 flex items-center gap-2 text-sm text-ink-muted">
              <span aria-hidden className="h-px w-6 bg-line-strong" />
              {typo('Искусственный камень, цельный угловой элемент')}
            </p>
          </Reveal>
        </div>

        {/* Остальные доводы — списком с линейками, а не карточками */}
        <ul className="mt-16 grid grid-cols-1 gap-x-16 border-t border-line sm:grid-cols-2 lg:mt-20">
          {rest.map((item, index) => (
            <Reveal
              as="li"
              key={item.title}
              delay={index * 70}
              className="flex gap-4 border-b border-line py-6"
            >
              <PencilIcon name={item.icon} size={32} className="mt-0.5 shrink-0 text-primary" />
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
