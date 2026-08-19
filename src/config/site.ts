/**
 * Единая точка правки бренда, контактов и юридических текстов.
 *
 * ВАЖНО: значения, помеченные PLACEHOLDER, в исходных материалах заказчика
 * отсутствуют. Их нужно заменить перед публикацией — больше нигде в коде эти
 * данные не продублированы.
 */

export const site = {
  /** Название и логотип взяты из брифа заказчика. */
  name: 'Студия каминов',
  /** PLACEHOLDER — юридическое наименование в материалах не указано. */
  legalName: 'Студия каминов',
  tagline: 'Электрокамины собственного производства',
  description:
    'Производим электрокамины для дома и интерьера: классические, современные, угловые, с камнем и тумбы под ТВ. Продажа напрямую от производителя.',
  /** Меняется на боевой домен через NEXT_PUBLIC_SITE_URL. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  locale: 'ru_RU',
  /** Логотип из брифа. Прозрачный PNG, рассчитан на светлый фон. */
  logo: '/brand/logo.png',
  /** Знак пламени из логотипа — для компактных мест и иконки вкладки. */
  mark: '/brand/mark.png',
} as const;

/**
 * Живой огонь в hero-блоке.
 *
 * В материалах заказчика видео нет, поэтому по умолчанию пламя оживляется
 * лёгкой CSS-анимацией поверх реального фото горящего очага — без тяжёлого JS.
 *
 * Когда появится ролик, положите его в /public/video/ и укажите путь ниже:
 * компонент сам переключится на <video autoplay muted loop playsInline>
 * с постером из hero-фотографии.
 */
export const heroMedia = {
  video: null as string | null,
  poster: '/images/hero/hero.webp',
  /** Положение топки на фотографии, % — по нему позиционируется свечение. */
  flame: { x: 47.5, y: 66, width: 26, height: 23 },
} as const;

/**
 * Фирменные цвета из логотипа.
 * В интерфейсе используются как акценты бренда; основной цвет действия —
 * оранжевый --color-primary (пожелание заказчика «жёлто-оранжевый, ближе к огню»).
 */
export const brandColors = {
  grey: '#9b9b9b',
  red: '#a23131',
  flame: '#e97821',
} as const;

export const contacts = {
  /** PLACEHOLDER — номер не указан в материалах заказчика. */
  phone: '+7 (000) 000-00-00',
  phoneHref: 'tel:+70000000000',
  /** PLACEHOLDER */
  email: 'info@example.ru',
  /** PLACEHOLDER */
  address: 'Адрес производства уточняется',
  /** PLACEHOLDER */
  workHours: 'Пн–Пт 9:00–18:00, Сб 10:00–16:00',
  /** Мессенджеры и соцсети. null — блок не отображается. */
  messengers: [
    { label: 'WhatsApp', href: null as string | null },
    { label: 'Telegram', href: null as string | null },
  ],
  socials: [] as { label: string; href: string }[],
} as const;

/**
 * Демонстрационный промокод. Заменить/дополнить реальными правилами акции.
 * Используется в корзине и в checkout.
 */
export const promoCodes = [
  {
    code: 'FIRE10',
    /** Скидка в процентах от суммы товаров. */
    percent: 10,
    /** Демо: код действует всегда. Для реальной акции задайте дату. */
    expiresAt: null as string | null,
    demo: true,
  },
  {
    code: 'EXPIRED',
    percent: 15,
    /** Специально просроченный код — нужен, чтобы показать состояние «истёк». */
    expiresAt: '2024-12-31',
    demo: true,
  },
] as const;

/**
 * Настройки доставки. Реальные тарифы приходят из провайдера
 * (src/lib/delivery). Здесь только то, что показывается в интерфейсе.
 */
export const deliveryConfig = {
  carrier: 'Деловые Линии',
  /** PLACEHOLDER — город отправления со склада производства. */
  originCity: process.env.DELIVERY_ORIGIN_CITY ?? 'Москва',
  /** Порог бесплатной доставки. null — акции нет. */
  freeFrom: null as number | null,
  pickupAvailable: true,
} as const;

export const legal = {
  privacyUrl: '/privacy',
  consentUrl: '/privacy#consent',
  /** PLACEHOLDER — реквизиты не предоставлены. */
  requisites: 'Реквизиты уточняются',
} as const;
