import { PencilIcon, type PencilIconName } from '@/components/icons/PencilIcon';

const items: { icon: PencilIconName; title: string; text: string }[] = [
  {
    icon: 'factory',
    title: 'Напрямую от производителя',
    text: 'Мы сами производим порталы, поэтому вы покупаете без посредников и лишних наценок.',
  },
  {
    icon: 'quality',
    title: 'Контроль на производстве',
    text: 'Каждое изделие проверяем перед упаковкой: геометрия портала, покрытие, работа очага.',
  },
  {
    icon: 'palette',
    title: 'Исполнения под интерьер',
    text: 'Одна модель — несколько цветов портала и вариантов камня. Подберём под вашу обстановку.',
  },
  {
    icon: 'support',
    title: 'Помощь в выборе',
    text: 'Подскажем размер под нишу, площадь обогрева и подходящую модель очага.',
  },
  {
    icon: 'plug',
    title: 'Без дымохода и монтажа',
    text: 'Камин подключается к обычной розетке 220 В. Не нужны дым, зола и разрешения.',
  },
  {
    icon: 'truck',
    title: 'Доставка по России',
    text: 'Отправляем транспортной компанией, стоимость рассчитывается при оформлении заказа.',
  },
];

export function Advantages() {
  return (
    <section className="container-site py-12 sm:py-16">
      <h2 className="mb-8 text-[clamp(1.5rem,1.2rem+1.3vw,2.125rem)] leading-tight">
        Почему покупают у нас
      </h2>
      <ul className="grid grid-cols-1 gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.title} className="flex gap-4">
            <PencilIcon name={item.icon} size={44} className="shrink-0 text-primary" />
            <div className="min-w-0">
              <h3 className="text-[17px] font-bold leading-snug">{item.title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{item.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
