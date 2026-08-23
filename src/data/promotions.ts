import type { Promotion } from '@/types';
import images from './image-index.json';
import { products } from './catalog';
import { typo } from '@/lib/typography';

const cover = (slug: string, index = 0) =>
  (images.products as Record<string, string[]>)[slug]?.[index] ?? '';

const priceOf = (slug: string) => products.find((p) => p.slug === slug);

/**
 * Акции и новости для карусели на главной.
 * Тексты опираются только на то, что реально задано в каталоге: если у товара
 * есть старая цена — это акция, если помечен как новинка — это новинка.
 */
const rawPromotions: Promotion[] = [
  {
    id: 'sale-dublin-ivory',
    kind: 'sale',
    title: 'Дублин «слоновая кость» со скидкой',
    text: `Античный портал с белым камнем и очагом Fobos — ${
      priceOf('dublin-ivory')?.oldPrice?.toLocaleString('ru-RU') ?? ''
    } ₽ → ${priceOf('dublin-ivory')?.price.toLocaleString('ru-RU') ?? ''} ₽.`,
    image: cover('dublin-ivory'),
    href: '/catalog/dublin-ivory',
    cta: 'Смотреть камин',
  },
  {
    id: 'new-dublin-premium',
    kind: 'new',
    title: 'Новинка: Дублин Премиум с тумбами',
    text: 'Камин и две секции с открытыми полками в одном корпусе шириной 1750 мм.',
    image: cover('dublin-premium-white-grey'),
    href: '/catalog/dublin-premium-white-grey',
    cta: 'Открыть модель',
  },
  {
    id: 'sale-chester',
    kind: 'sale',
    title: 'Честер: тумба под ТВ и камин',
    text: 'Корпус 1600 мм, панорамный очаг Flash 36 и телевизор сверху. Сейчас со скидкой.',
    image: cover('chester-white'),
    href: '/catalog/chester-white',
    cta: 'Смотреть предложение',
  },
  {
    id: 'new-modern',
    kind: 'new',
    title: 'Новинка: Модерн',
    text: 'Прямой белый корпус и широкий панорамный очаг для интерьера без лишних деталей.',
    image: cover('modern-white'),
    href: '/catalog/modern-white',
    cta: 'Открыть модель',
  },
  {
    id: 'news-promo',
    kind: 'news',
    title: 'Промокод FIRE10',
    text: 'Демонстрационный промокод: −10% на товары в корзине. Применяется в корзине или при оформлении.',
    image: cover('malta-white'),
    href: '/catalog',
    cta: 'Перейти в каталог',
  },
];

export const promotions: Promotion[] = rawPromotions.map((promotion) => ({
  ...promotion,
  title: typo(promotion.title),
  text: typo(promotion.text),
  cta: typo(promotion.cta),
}));
