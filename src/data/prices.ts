/**
 * ⚠️ ДЕМОНСТРАЦИОННЫЕ ЦЕНЫ
 *
 * В материалах заказчика (архив «Для сайта.rar» с Яндекс.Диска) прайса нет:
 * ни таблиц, ни PDF, ни цен на фотографиях. Значения ниже проставлены только
 * для того, чтобы корзина, промокод, расчёт доставки и оформление заказа
 * работали в демонстрации.
 *
 * Перед публикацией замените цены на реальные — это единственное место в
 * проекте, где они заданы.
 *
 * Ключ — slug товара. Значение — [цена, старая цена?] в рублях.
 */
export const DEMO_PRICES = true;

export const prices: Record<string, { price: number; oldPrice?: number }> = {
  // Камины с камнем — Дублин
  'dublin-white': { price: 44900 },
  'dublin-wenge': { price: 44900 },
  'dublin-votan': { price: 44900 },
  'dublin-italian-nut': { price: 46900 },
  'dublin-ivory': { price: 39900, oldPrice: 46900 },
  'dublin-shimo': { price: 44900 },

  // Камины с камнем — Мальта
  'malta-bleached-oak': { price: 34900 },
  'malta-white': { price: 34900 },
  'malta-wenge': { price: 34900 },
  'malta-votan': { price: 31900, oldPrice: 36900 },
  'malta-italian-nut': { price: 36900 },

  // Камины с камнем — тумбы-витрины
  'stone-cabinets-wenge': { price: 24900 },

  // Классические камины
  'verona-white': { price: 54900 },
  'versal-ivory': { price: 54900 },

  // С боковыми тумбами
  'dublin-premium-white-grey': { price: 89900 },

  // Современные камины
  'modern-white': { price: 74900 },

  // Тумбы под ТВ
  'chester-white': { price: 69900, oldPrice: 78900 },

  // Угловые камины
  'malta-corner-votan': { price: 39900 },
};
