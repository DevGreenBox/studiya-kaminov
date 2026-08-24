import type { Promotion } from '@/types';
import { products } from './catalog';
import { typo } from '@/lib/typography';

/**
 * Баннеры карусели собираются отдельным скриптом: у части фотографий есть
 * маркетплейс-надписи, и окно кадрирования подобрано так, чтобы они остались
 * за рамкой — node scripts/make-covers.mjs
 */
const banner = (id: string) => `/images/promos/${id}.webp`;

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
    image: banner('sale-dublin-ivory'),
    href: '/catalog/dublin-ivory',
    cta: 'Смотреть камин',
  },
  {
    id: 'new-dublin-premium',
    kind: 'new',
    title: 'Новинка: Дублин Премиум с тумбами',
    text: 'Камин и две секции с открытыми полками в одном корпусе шириной 1750 мм.',
    image: banner('new-dublin-premium'),
    href: '/catalog/dublin-premium-white-grey',
    cta: 'Открыть модель',
  },
  {
    id: 'sale-chester',
    kind: 'sale',
    title: 'Честер: тумба под ТВ и камин',
    text: 'Корпус 1600 мм, панорамный очаг Flash 36 и телевизор сверху. Сейчас со скидкой.',
    image: banner('sale-chester'),
    href: '/catalog/chester-white',
    cta: 'Смотреть предложение',
  },
  {
    id: 'new-modern',
    kind: 'new',
    title: 'Новинка: Модерн',
    text: 'Прямой белый корпус и широкий панорамный очаг для интерьера без лишних деталей.',
    image: banner('new-modern'),
    href: '/catalog/modern-white',
    cta: 'Открыть модель',
  },
  {
    id: 'news-promo',
    kind: 'news',
    title: 'Промокод FIRE10',
    text: 'Демонстрационный промокод: −10% на товары в корзине. Применяется в корзине или при оформлении.',
    image: banner('news-promo'),
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
