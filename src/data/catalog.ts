import type { Product, Specification } from '@/types';
import images from './image-index.json';
import cardImages from './card-images.json';
import { prices } from './prices';
import { typo } from '@/lib/typography';

/**
 * Каталог собран из материалов заказчика (архив «Для сайта.rar» с Яндекс.Диска):
 * описания взяты из .docx рядом с фотографиями, габариты — с инфографики
 * производителя, фотографии — из соответствующих папок.
 *
 * Ничего не выдумано. Всё, что в материалах отсутствует или противоречит само
 * себе, вынесено в поле `dataNotes` и перечислено в README.
 */

type Draft = Omit<Product, 'price' | 'oldPrice' | 'images'> & {
  images?: string[];
};

/**
 * Галерея товара.
 *
 * У части моделей нет ни одного кадра без маркетплейс-надписей. Для них
 * scripts/make-covers.mjs готовит обрезанный кадр без текстовых полос — он
 * встаёт первым и попадает в карточку каталога и в главное фото на странице
 * товара. Исходник остаётся дальше в галерее как инфографика.
 */
const img = (slug: string): string[] => {
  const gallery = (images.products as Record<string, string[]>)[slug] ?? [];
  const card = (cardImages as Record<string, string>)[slug];
  return card ? [card, ...gallery] : gallery;
};

/** Характеристики очага Fobos — общие для всех моделей с этим очагом. */
const fobosSpecs = (heatingArea: number): Specification[] => [
  { label: 'Очаг', value: 'Fobos', filterKey: 'hearth' },
  { label: 'Эффект пламени', value: 'Проекционное пламя, зеркальная задняя стенка' },
  { label: 'Звук', value: 'Имитация потрескивания дров' },
  { label: 'Режимы обогрева', value: '750 Вт / 1500 Вт' },
  { label: 'Площадь обогрева', value: `до ${heatingArea} м²` },
  { label: 'Декоративный режим', value: 'Пламя без обогрева' },
  { label: 'Управление', value: 'Кнопки на очаге и пульт ДУ' },
  { label: 'Подключение', value: 'Розетка 220 В, дымоход не требуется' },
];

const dublinDescription = (color: string, stone: string) =>
  `Электрокамин «Дублин» в античном стиле: портал из МДФ цвета «${color}» с элементами искусственного камня ${stone} оттенка. Строгий рисунок портала одинаково хорошо смотрится и в классическом, и в современном интерьере квартиры или загородного дома.

Внутри — очаг Fobos: проекционное пламя, зеркальная задняя стенка и звук потрескивания дров. Два режима обогрева (750 и 1500 Вт) закрывают комнату до 25 м², а декоративный режим позволяет включать только пламя, без тепла.

Камин не даёт дыма, золы и открытого огня, не требует дымохода и подключается к обычной розетке 220 В. Поставляется в двух упаковках, сборка простая.`;

const maltaDescription = (color: string, stone: string, coating?: string) =>
  `Электрокамин «Мальта» — компактный портал из МДФ цвета «${color}»${
    coating ? ` (покрытие ${coating})` : ''
  } с боковыми панелями из ${stone} искусственного камня. Фактура камня делает камин тёплым и «домашним»: он уместен в гостиной, на даче и в загородном доме в стиле кантри, прованс или сканди.

Очаг Fobos создаёт реалистичное пламя со звуком потрескивания дров и зеркальной задней стенкой. Два режима обогрева — 750 и 1500 Вт, площадь до 25 м², есть режим пламени без нагрева.

Без дыма, золы и открытого огня. Дымоход не нужен, подключение к розетке 220 В. Сборка занимает около 10 минут.`;

const classicDescription = (model: string, color: string) =>
  `Электрический камин «${model}» в цвете «${color}» с ручной золотой патиной. Портал выполнен из МДФ с покрытием эмалью и лаком, отделка сделана под старину — камин выглядит как полноценный классический портал, а не как декорация.

В комплекте очаг Fobos с проекционным пламенем, звуком потрескивания дров и зеркальной задней стенкой, которая визуально углубляет топку. Два режима обогрева — 750 и 1500 Вт, до 25 м². Яркость пламени регулируется, можно включить только декоративный режим.

Установка лицевая, классическая. Комплект приходит в двух упаковках — портал и очаг. Распакуйте, поставьте на пол и включите в розетку: ни дыма, ни сажи, ни монтажа.`;

const drafts: Draft[] = [
  // ---------------------------------------------------------------- Дублин
  {
    id: 'dublin-white',
    slug: 'dublin-white',
    name: 'Камин электрический Дублин, белый',
    model: 'Дублин',
    category: 'kaminy-s-kamnem',
    color: 'Белый',
    installation: 'Напольная',
    hearth: 'Fobos',
    heatingArea: 25,
    power: 1500,
    shortDescription: 'Античный портал из МДФ с белым искусственным камнем и очагом Fobos.',
    description: dublinDescription('белый', 'белого'),
    badges: ['hit'],
    inStock: true,
    featured: true,
    bestseller: true,
    dimensions: { width: 1020, height: 952, depth: 352 },
    specifications: [
      { label: 'Материал портала', value: 'МДФ, покрытие ПВХ', filterKey: 'finish' },
      { label: 'Цвет портала', value: 'Белый' },
      { label: 'Камень', value: 'Искусственный, белый' },
      { label: 'Тип установки', value: 'Напольная, пристенная', filterKey: 'installation' },
      ...fobosSpecs(25),
      { label: 'Габариты (В×Ш×Г)', value: '952 × 1020 × 352 мм' },
      { label: 'Нагрузка на столешницу', value: 'до 50 кг, телевизор до 50″' },
      { label: 'Комплектация', value: '2 упаковки: портал и очаг' },
    ],
  },
  {
    id: 'dublin-wenge',
    slug: 'dublin-wenge',
    name: 'Камин электрический Дублин, венге',
    model: 'Дублин',
    category: 'kaminy-s-kamnem',
    color: 'Венге',
    installation: 'Напольная',
    hearth: 'Fobos',
    heatingArea: 25,
    power: 1500,
    shortDescription: 'Тёмный портал венге с белым камнем и очагом Fobos.',
    description: dublinDescription('венге', 'белого'),
    badges: [],
    inStock: true,
    dimensions: { width: 1020, height: 952, depth: 352 },
    specifications: [
      { label: 'Материал портала', value: 'МДФ, покрытие ПВХ', filterKey: 'finish' },
      { label: 'Цвет портала', value: 'Венге' },
      { label: 'Камень', value: 'Искусственный, белый' },
      { label: 'Тип установки', value: 'Напольная, пристенная', filterKey: 'installation' },
      ...fobosSpecs(25),
      { label: 'Габариты (В×Ш×Г)', value: '952 × 1020 × 352 мм' },
      { label: 'Нагрузка на столешницу', value: 'до 50 кг' },
      { label: 'Комплектация', value: '2 упаковки: портал и очаг' },
    ],
  },
  {
    id: 'dublin-votan',
    slug: 'dublin-votan',
    name: 'Камин электрический Дублин, дуб вотан',
    model: 'Дублин',
    category: 'kaminy-s-kamnem',
    color: 'Дуб вотан',
    installation: 'Напольная',
    hearth: 'Fobos',
    heatingArea: 25,
    power: 1500,
    shortDescription: 'Портал под светлое дерево с белым камнем и очагом Fobos.',
    description: dublinDescription('дуб вотан', 'белого'),
    badges: [],
    inStock: true,
    dimensions: { width: 1020, height: 952, depth: 352 },
    specifications: [
      { label: 'Материал портала', value: 'МДФ, покрытие ПВХ', filterKey: 'finish' },
      { label: 'Цвет портала', value: 'Дуб вотан' },
      { label: 'Камень', value: 'Искусственный, белый' },
      { label: 'Тип установки', value: 'Напольная, пристенная', filterKey: 'installation' },
      ...fobosSpecs(25),
      { label: 'Габариты (В×Ш×Г)', value: '952 × 1020 × 352 мм' },
      { label: 'Нагрузка на столешницу', value: 'до 50 кг, телевизор до 50″' },
      { label: 'Комплектация', value: '2 упаковки: портал и очаг' },
    ],
  },
  {
    id: 'dublin-italian-nut',
    slug: 'dublin-italian-nut',
    name: 'Камин электрический Дублин, итальянский орех',
    model: 'Дублин',
    category: 'kaminy-s-kamnem',
    color: 'Итальянский орех',
    installation: 'Напольная',
    hearth: 'Fobos',
    heatingArea: 25,
    power: 1500,
    shortDescription: 'Тёплый ореховый портал с бежевым камнем и очагом Fobos.',
    description: dublinDescription('итальянский орех', 'бежевого'),
    badges: [],
    inStock: true,
    dimensions: { width: 1020, height: 952, depth: 352 },
    specifications: [
      { label: 'Материал портала', value: 'МДФ, покрытие ПВХ', filterKey: 'finish' },
      { label: 'Цвет портала', value: 'Итальянский орех' },
      { label: 'Камень', value: 'Искусственный, бежевый' },
      { label: 'Тип установки', value: 'Напольная, пристенная', filterKey: 'installation' },
      ...fobosSpecs(25),
      { label: 'Габариты (В×Ш×Г)', value: '952 × 1020 × 352 мм' },
      { label: 'Нагрузка на столешницу', value: 'до 50 кг, телевизор до 50″' },
      { label: 'Комплектация', value: '2 упаковки: портал и очаг' },
    ],
  },
  {
    id: 'dublin-ivory',
    slug: 'dublin-ivory',
    name: 'Камин электрический Дублин, слоновая кость',
    model: 'Дублин',
    category: 'kaminy-s-kamnem',
    color: 'Слоновая кость',
    installation: 'Напольная',
    hearth: 'Fobos',
    heatingArea: 25,
    power: 1500,
    shortDescription: 'Мягкий кремовый портал с белым камнем и очагом Fobos.',
    description: dublinDescription('слоновая кость', 'белого'),
    badges: ['sale'],
    inStock: true,
    dimensions: { width: 1020, height: 952, depth: 352 },
    specifications: [
      { label: 'Материал портала', value: 'МДФ, покрытие ПВХ', filterKey: 'finish' },
      { label: 'Цвет портала', value: 'Слоновая кость' },
      { label: 'Камень', value: 'Искусственный, белый' },
      { label: 'Тип установки', value: 'Напольная, пристенная', filterKey: 'installation' },
      ...fobosSpecs(25),
      { label: 'Габариты (В×Ш×Г)', value: '952 × 1020 × 352 мм' },
      { label: 'Нагрузка на столешницу', value: 'до 50 кг' },
      { label: 'Комплектация', value: '2 упаковки: портал и очаг' },
    ],
  },
  {
    id: 'dublin-shimo',
    slug: 'dublin-shimo',
    name: 'Камин электрический Дублин, ясень шимо',
    model: 'Дублин',
    category: 'kaminy-s-kamnem',
    color: 'Ясень шимо',
    installation: 'Напольная',
    hearth: 'Fobos',
    heatingArea: 25,
    power: 1500,
    shortDescription: 'Светлый портал под ясень с белым камнем и очагом Fobos.',
    description: dublinDescription('ясень шимо', 'белого'),
    badges: [],
    inStock: true,
    featured: true,
    dimensions: { width: 1020, height: 952, depth: 352 },
    specifications: [
      { label: 'Материал портала', value: 'МДФ, покрытие ПВХ', filterKey: 'finish' },
      { label: 'Цвет портала', value: 'Ясень шимо' },
      { label: 'Камень', value: 'Искусственный, белый' },
      { label: 'Тип установки', value: 'Напольная, пристенная', filterKey: 'installation' },
      ...fobosSpecs(25),
      { label: 'Габариты (В×Ш×Г)', value: '952 × 1020 × 352 мм' },
      { label: 'Нагрузка на столешницу', value: 'до 50 кг, телевизор до 50″' },
      { label: 'Комплектация', value: '2 упаковки: портал и очаг' },
    ],
  },

  // ---------------------------------------------------------------- Мальта
  {
    id: 'malta-bleached-oak',
    slug: 'malta-bleached-oak',
    name: 'Камин электрический Мальта, беленый дуб',
    model: 'Мальта',
    category: 'kaminy-s-kamnem',
    color: 'Беленый дуб',
    installation: 'Напольная',
    hearth: 'Fobos',
    heatingArea: 25,
    power: 1500,
    shortDescription: 'Компактный портал беленый дуб с бежевым камнем.',
    description: maltaDescription('беленый дуб', 'бежевого'),
    badges: [],
    inStock: true,
    dimensions: { width: 900, height: 722, depth: 340 },
    specifications: [
      { label: 'Материал портала', value: 'МДФ, покрытие ПВХ', filterKey: 'finish' },
      { label: 'Цвет портала', value: 'Беленый дуб' },
      { label: 'Камень', value: 'Искусственный, бежевый' },
      { label: 'Тип установки', value: 'Напольная, пристенная', filterKey: 'installation' },
      ...fobosSpecs(25),
      { label: 'Габариты (В×Ш×Г)', value: '722 × 900 × 340 мм' },
      { label: 'Нагрузка на столешницу', value: 'телевизор до 42″' },
      { label: 'Сборка', value: 'Около 10 минут' },
    ],
  },
  {
    id: 'malta-white',
    slug: 'malta-white',
    name: 'Камин электрический Мальта, белый',
    model: 'Мальта',
    category: 'kaminy-s-kamnem',
    color: 'Белый',
    installation: 'Напольная',
    hearth: 'Fobos',
    heatingArea: 25,
    power: 1500,
    shortDescription: 'Компактный белый портал с белым искусственным камнем.',
    description: maltaDescription('белый', 'белого'),
    badges: ['hit'],
    inStock: true,
    featured: true,
    bestseller: true,
    dimensions: { width: 900, height: 722, depth: 340 },
    specifications: [
      { label: 'Материал портала', value: 'МДФ, покрытие ПВХ', filterKey: 'finish' },
      { label: 'Цвет портала', value: 'Белый' },
      { label: 'Камень', value: 'Искусственный, белый' },
      { label: 'Тип установки', value: 'Напольная, пристенная', filterKey: 'installation' },
      ...fobosSpecs(25),
      { label: 'Габариты (В×Ш×Г)', value: '722 × 900 × 340 мм' },
      { label: 'Нагрузка на столешницу', value: 'телевизор до 42″' },
      { label: 'Сборка', value: 'Около 10 минут' },
    ],
  },
  {
    id: 'malta-wenge',
    slug: 'malta-wenge',
    name: 'Камин электрический Мальта, венге',
    model: 'Мальта',
    category: 'kaminy-s-kamnem',
    color: 'Венге',
    installation: 'Напольная',
    hearth: 'Fobos',
    heatingArea: 25,
    power: 1500,
    shortDescription: 'Контрастный портал венге с белым камнем.',
    description: maltaDescription('венге', 'белого'),
    badges: [],
    inStock: true,
    dimensions: { width: 900, height: 722, depth: 340 },
    specifications: [
      { label: 'Материал портала', value: 'МДФ, покрытие ПВХ', filterKey: 'finish' },
      { label: 'Цвет портала', value: 'Венге' },
      { label: 'Камень', value: 'Искусственный, белый' },
      { label: 'Тип установки', value: 'Напольная, пристенная', filterKey: 'installation' },
      ...fobosSpecs(25),
      { label: 'Габариты (В×Ш×Г)', value: '722 × 900 × 340 мм' },
      { label: 'Нагрузка на столешницу', value: 'телевизор до 42″' },
      { label: 'Сборка', value: 'Около 10 минут' },
    ],
  },
  {
    id: 'malta-votan',
    slug: 'malta-votan',
    name: 'Камин электрический Мальта, дуб вотан',
    model: 'Мальта',
    category: 'kaminy-s-kamnem',
    color: 'Дуб вотан',
    installation: 'Напольная',
    hearth: 'Fobos',
    heatingArea: 25,
    power: 1500,
    shortDescription: 'Портал под дерево с белым камнем, покрытие экошпон.',
    description: maltaDescription('дуб вотан', 'белого', 'экошпон'),
    badges: ['sale'],
    inStock: true,
    dimensions: { width: 900, height: 722, depth: 340 },
    specifications: [
      { label: 'Материал портала', value: 'МДФ, покрытие экошпон', filterKey: 'finish' },
      { label: 'Цвет портала', value: 'Дуб вотан' },
      { label: 'Камень', value: 'Искусственный, белый' },
      { label: 'Тип установки', value: 'Напольная, пристенная', filterKey: 'installation' },
      ...fobosSpecs(25),
      { label: 'Габариты (В×Ш×Г)', value: '722 × 900 × 340 мм' },
      { label: 'Глубина столешницы', value: '290 мм' },
      { label: 'Сборка', value: 'Около 10 минут' },
    ],
  },
  {
    id: 'malta-italian-nut',
    slug: 'malta-italian-nut',
    name: 'Камин электрический Мальта, итальянский орех',
    model: 'Мальта',
    category: 'kaminy-s-kamnem',
    color: 'Итальянский орех',
    installation: 'Напольная',
    hearth: 'Fobos',
    heatingArea: 25,
    power: 1500,
    shortDescription: 'Ореховый портал с белым камнем, компактные габариты.',
    description: maltaDescription('итальянский орех', 'белого'),
    badges: [],
    inStock: true,
    dimensions: { width: 900, height: 722, depth: 340 },
    specifications: [
      { label: 'Материал портала', value: 'МДФ, покрытие ПВХ', filterKey: 'finish' },
      { label: 'Цвет портала', value: 'Итальянский орех' },
      { label: 'Камень', value: 'Искусственный, белый' },
      { label: 'Тип установки', value: 'Напольная, пристенная', filterKey: 'installation' },
      ...fobosSpecs(25),
      { label: 'Габариты (В×Ш×Г)', value: '722 × 900 × 340 мм' },
      { label: 'Нагрузка на столешницу', value: 'телевизор до 42″' },
      { label: 'Сборка', value: 'Около 10 минут' },
    ],
  },

  // ------------------------------------------------------ Тумбы-витрины
  {
    id: 'stone-cabinets-wenge',
    slug: 'stone-cabinets-wenge',
    sku: '581820166',
    name: 'Тумбы-витрины к камину, венге с камнем (2 шт)',
    model: 'Тумбы-витрины',
    category: 'kaminy-s-kamnem',
    color: 'Венге',
    installation: 'Напольная',
    shortDescription: 'Пара витрин венге с белым камнем — в один ансамбль с порталом.',
    description: `Тумбы-витрины дополняют электрокамин и собирают гостиную в единый ансамбль. Тёмное дерево цвета венге сочетается с фактурным белым камнем и повторяет рисунок портала, а стеклянные дверцы цвета бронза защищают содержимое от пыли.

Внутри удобно хранить книги, посуду, декор и сувениры. Тумбы можно поставить по бокам от камина или использовать как самостоятельный элемент интерьера — они подходят к любым каминам в классическом стиле с камнем.

Поставляются в разобранном виде, сборка одной тумбы занимает около 10 минут, весь крепёж в комплекте.`,
    badges: [],
    inStock: true,
    dimensions: { width: 470, height: 831, depth: 400 },
    specifications: [
      { label: 'Материал', value: 'МДФ с покрытием под дерево', filterKey: 'finish' },
      { label: 'Цвет', value: 'Венге' },
      { label: 'Камень', value: 'Искусственный, белый' },
      { label: 'Дверцы', value: 'Прозрачное стекло цвета бронза' },
      { label: 'Количество', value: '2 штуки: левая и правая' },
      { label: 'Тип установки', value: 'Напольная, прямая', filterKey: 'installation' },
      { label: 'Габариты одной тумбы (В×Ш×Г)', value: '831 × 470 × 400 мм' },
      { label: 'Сборка', value: 'Около 10 минут на тумбу, крепёж в комплекте' },
    ],
    dataNotes: [
      'Позиция без очага и обогрева — фильтры по очагу и площади обогрева к ней не применяются.',
    ],
  },

  // -------------------------------------------------- Классические камины
  {
    id: 'verona-white',
    slug: 'verona-white',
    name: 'Камин электрический Верона, белый с золотом',
    model: 'Верона',
    category: 'klassicheskie',
    color: 'Белый + золотая патина',
    installation: 'Пристенная',
    hearth: 'Fobos',
    heatingArea: 25,
    power: 1500,
    shortDescription: 'Классический портал из эмалированного МДФ с ручной золотой патиной.',
    description: classicDescription('Верона', 'белый'),
    badges: [],
    inStock: true,
    featured: true,
    dimensions: { width: 1090, height: 1070, depth: 340 },
    specifications: [
      { label: 'Материал портала', value: 'МДФ, эмаль и лак', filterKey: 'finish' },
      { label: 'Цвет портала', value: 'Белый, золотая патина' },
      { label: 'Отделка', value: 'Ручное нанесение патины' },
      { label: 'Тип установки', value: 'Лицевая, классическая', filterKey: 'installation' },
      ...fobosSpecs(25),
      { label: 'Габариты (В×Ш×Г)', value: '1070 × 1090 × 340 мм' },
      { label: 'Нагрузка на столешницу', value: 'до 50 кг' },
      { label: 'Комплектация', value: '2 упаковки: портал и очаг' },
    ],
    dataNotes: [
      'В материалах заказчика эта позиция лежит в папке «Версаль», но и в описании, и на фотографии подписана как «Верона». Название требует подтверждения.',
    ],
  },
  {
    id: 'versal-ivory',
    slug: 'versal-ivory',
    name: 'Камин электрический Версаль, слоновая кость с золотом',
    model: 'Версаль',
    category: 'klassicheskie',
    color: 'Слоновая кость + золотая патина',
    installation: 'Пристенная',
    hearth: 'Fobos',
    heatingArea: 25,
    power: 1500,
    shortDescription: 'Классический портал цвета слоновой кости с золотой патиной.',
    description: classicDescription('Версаль', 'слоновая кость'),
    badges: [],
    inStock: true,
    dimensions: { width: 1090, height: 1070, depth: 340 },
    specifications: [
      { label: 'Материал портала', value: 'МДФ, итальянская эмаль и лак', filterKey: 'finish' },
      { label: 'Цвет портала', value: 'Слоновая кость, золотая патина' },
      { label: 'Отделка', value: 'Ручное нанесение патины' },
      { label: 'Тип установки', value: 'Лицевая, классическая', filterKey: 'installation' },
      ...fobosSpecs(25),
      { label: 'Габариты (В×Ш×Г)', value: '1070 × 1090 × 340 мм' },
      { label: 'Нагрузка на столешницу', value: 'до 50 кг, телевизор допускается' },
      { label: 'Комплектация', value: '2 упаковки: портал и очаг' },
    ],
    dataNotes: [
      'На фотографии позиция подписана «VERSAL», в текстовом описании — «Верона». Название требует подтверждения.',
    ],
  },

  // ------------------------------------------------- Камин с боковыми тумбами
  {
    id: 'dublin-premium-white-grey',
    slug: 'dublin-premium-white-grey',
    name: 'Камин электрический Дублин Премиум с тумбами, белый/серый',
    model: 'Дублин Премиум',
    category: 's-bokovymi-tumbami',
    color: 'Белый / серый камень',
    installation: 'Пристенная',
    hearth: 'Fobos',
    heatingArea: 25,
    power: 1500,
    shortDescription: 'Камин и две открытые секции с полками в одном корпусе, 1750 мм.',
    description: `«Дублин Премиум» — это портал «Дублин» и две боковые секции с открытыми полками в одном корпусе шириной 1750 мм. Он закрывает целую стену и сразу решает две задачи: даёт камин и место для книг, декора и техники.

Портал выполнен из МДФ с эмалевым покрытием, колонны отделаны серым искусственным камнем без видимых швов. Очаг Fobos — с проекционным пламенем, звуком потрескивания дров и двумя режимами обогрева.

Столешница не нагревается: на неё можно поставить телевизор или аквариум. Поставляется в трёх упаковках.`,
    badges: ['new'],
    inStock: true,
    featured: true,
    isNew: true,
    dimensions: { width: 1750, height: 972, depth: 400 },
    specifications: [
      { label: 'Материал портала', value: 'МДФ, покрытие эмаль', filterKey: 'finish' },
      { label: 'Цвет', value: 'Белый корпус, серый камень' },
      { label: 'Камень', value: 'Искусственный, цельный угловой' },
      { label: 'Тип установки', value: 'Пристенная', filterKey: 'installation' },
      ...fobosSpecs(25),
      { label: 'Габариты (В×Ш×Г)', value: '972 × 1750 × 400 мм' },
      { label: 'Габариты портала', value: '831 × 1020 × 380 мм' },
      { label: 'Высота полки', value: '240 мм' },
      { label: 'Нагрузка на столешницу', value: 'до 50 кг' },
      { label: 'Комплектация', value: '3 упаковки' },
    ],
    dataNotes: [
      'Текстового описания к этой позиции в материалах нет. Характеристики собраны с инфографики производителя, описание — по фотографиям. Требуется вычитка заказчиком.',
    ],
  },

  // -------------------------------------------------- Современные камины
  {
    id: 'modern-white',
    slug: 'modern-white',
    name: 'Камин электрический Модерн, белый',
    model: 'Модерн',
    category: 'sovremennye',
    color: 'Белый',
    installation: 'Пристенная',
    shortDescription: 'Лаконичный белый корпус с широким панорамным очагом.',
    description: `«Модерн» — камин для интерьера без лишних деталей: прямой белый корпус, тонкие тёмные вставки по бокам и широкий панорамный очаг во всю ширину топки.

Он не спорит с обстановкой и одинаково уместен в светлой гостиной, спальне и кабинете. Ровная верхняя панель работает как консоль — на неё можно поставить декор.

Как и остальные модели, камин не требует дымохода и подключается к обычной розетке.`,
    badges: ['new'],
    inStock: true,
    featured: true,
    isNew: true,
    specifications: [
      { label: 'Материал корпуса', value: 'МДФ', filterKey: 'finish' },
      { label: 'Цвет', value: 'Белый' },
      { label: 'Очаг', value: 'Панорамный, широкий' },
      { label: 'Тип установки', value: 'Пристенная', filterKey: 'installation' },
      { label: 'Подключение', value: 'Розетка 220 В, дымоход не требуется' },
    ],
    dataNotes: [
      'В материалах по этой модели есть только фотографии: нет описания, габаритов, модели очага и мощности. Характеристики нужно дополнить.',
    ],
  },

  // ------------------------------------------------------- Тумбы под ТВ
  {
    id: 'chester-white',
    slug: 'chester-white',
    name: 'Камин-тумба под ТВ Честер, белый',
    model: 'Честер',
    category: 'tumby-pod-tv',
    color: 'Белый',
    installation: 'Пристенная',
    hearth: 'Flash 36',
    heatingArea: 25,
    power: 2000,
    shortDescription: 'Тумба под телевизор 1600 мм с панорамным очагом Flash 36.',
    description: `«Честер» — это тумба под телевизор и электрокамин одновременно. Корпус шириной 1600 мм выполнен из МДФ с эмалевым покрытием, фасады с диагональным рисунком, петли с доводчиком закрываются тихо, без хлопка.

Очаг Flash 36 даёт панорамное пламя во всю ширину топки, звук потрескивания дров с регулировкой громкости и регулировку яркости. Мощность до 2000 Вт, площадь обогрева до 25 м², есть режим «только пламя» — он потребляет от 15 Вт.

Дымоход не нужен, подключение к розетке 220 В. Камин безопасен для детей и животных: нет открытого огня, дыма и золы.`,
    badges: ['hit', 'sale'],
    inStock: true,
    featured: true,
    bestseller: true,
    dimensions: { width: 1600, height: 675, depth: 300 },
    specifications: [
      { label: 'Материал корпуса', value: 'МДФ, покрытие эмаль', filterKey: 'finish' },
      { label: 'Цвет', value: 'Белый' },
      { label: 'Очаг', value: 'Flash 36', filterKey: 'hearth' },
      { label: 'Эффект пламени', value: 'Панорамное пламя, регулировка яркости' },
      { label: 'Звук', value: 'Потрескивание дров с регулировкой громкости' },
      { label: 'Мощность', value: 'до 2000 Вт' },
      { label: 'Площадь обогрева', value: 'до 25 м²' },
      { label: 'Режим «только пламя»', value: 'от 15 Вт' },
      { label: 'Управление', value: 'Кнопки на лицевой панели и пульт ДУ' },
      { label: 'Тип установки', value: 'Пристенная', filterKey: 'installation' },
      { label: 'Габариты (В×Ш×Г)', value: '675 × 1600 × 300 мм' },
      { label: 'Телевизор', value: 'до 65″' },
      { label: 'Нагрузка на столешницу', value: 'до 30 кг' },
      { label: 'Фурнитура', value: 'Петли с доводчиком' },
      { label: 'Подключение', value: 'Розетка 220 В, дымоход не требуется' },
    ],
    dataNotes: [
      'Расхождение в материалах: в описании указан телевизор до 65″, на инфографике — до 75″. На сайте оставлено значение из описания.',
    ],
  },

  // -------------------------------------------------------- Угловые камины
  {
    id: 'malta-corner-votan',
    slug: 'malta-corner-votan',
    name: 'Угловой камин электрический Мальта, дуб вотан',
    model: 'Мальта угловая',
    category: 'uglovye',
    color: 'Дуб вотан',
    installation: 'Угловая',
    hearth: 'Fobos',
    heatingArea: 20,
    power: 1500,
    shortDescription: 'Угловой портал под дуб вотан с белым камнем, экономит место.',
    description: `Угловой электрокамин «Мальта» ставится в угол и экономит место в квартире, доме или на даче. Портал с фактурой дуба вотана и белым искусственным камнем спокойно вписывается в современный интерьер гостиной, спальни или кабинета.

Очаг Fobos даёт реалистичную имитацию живого пламени со звуком потрескивания дров и регулировкой яркости. Два режима нагрева — 750 и 1500 Вт, площадь обогрева до 20 м², есть декоративный режим без тепла.

Поставляется в разобранном виде, сборка занимает около 10 минут, крепёж в комплекте. Подключение к обычной розетке 220 В, дымоход и монтаж не требуются.`,
    badges: [],
    inStock: true,
    dimensions: { width: 900, height: 722, depth: 630 },
    specifications: [
      { label: 'Материал портала', value: 'МДФ с покрытием под дерево', filterKey: 'finish' },
      { label: 'Цвет портала', value: 'Дуб вотан' },
      { label: 'Камень', value: 'Искусственный, белый' },
      { label: 'Тип установки', value: 'Угловая', filterKey: 'installation' },
      ...fobosSpecs(20),
      { label: 'Габариты (В×Ш×Г)', value: '722 × 900 × 630 мм' },
      { label: 'Столешница', value: '900 × 630 мм, вынос 140 мм' },
      { label: 'Нагрузка на столешницу', value: 'до 30 кг' },
      { label: 'Сборка', value: 'Около 10 минут, крепёж в комплекте' },
    ],
  },
];

export const products: Product[] = drafts.map((draft) => {
  const price = prices[draft.slug];
  if (!price) throw new Error(`Не задана цена для товара «${draft.slug}» (src/data/prices.ts)`);
  const gallery = img(draft.slug);
  if (gallery.length === 0) {
    throw new Error(
      `Нет изображений для товара «${draft.slug}». Запустите: node scripts/prepare-images.mjs <путь к материалам>`,
    );
  }
  return {
    ...draft,
    // Типографика применяется один раз здесь — компонентам достаётся готовый текст
    name: typo(draft.name),
    shortDescription: typo(draft.shortDescription),
    description: typo(draft.description),
    specifications: draft.specifications.map((spec) => ({ ...spec, value: typo(spec.value) })),
    dataNotes: draft.dataNotes?.map(typo),
    images: gallery,
    price: price.price,
    oldPrice: price.oldPrice,
  };
});

export const productBySlug = new Map(products.map((p) => [p.slug, p]));
export const productById = new Map(products.map((p) => [p.id, p]));

export const getProduct = (slug: string) => productBySlug.get(slug);

/** Другие цветовые исполнения той же модели. */
export const getColorVariants = (product: Product) =>
  products.filter((p) => p.model === product.model);

/** Похожие модели: сначала та же категория, затем близкие по цене. */
export const getSimilar = (product: Product, limit = 4) => {
  const sameCategory = products.filter(
    (p) => p.id !== product.id && p.category === product.category && p.model !== product.model,
  );
  const rest = products.filter((p) => p.id !== product.id && p.category !== product.category);
  const byPrice = [...rest].sort(
    (a, b) => Math.abs(a.price - product.price) - Math.abs(b.price - product.price),
  );
  return [...sameCategory, ...byPrice].slice(0, limit);
};

export const discountPercent = (product: Product) =>
  product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
