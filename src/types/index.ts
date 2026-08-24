export type CategorySlug =
  | 'kaminy-s-kamnem'
  | 'klassicheskie'
  | 's-bokovymi-tumbami'
  | 'sovremennye'
  | 'tumby-pod-tv'
  | 'uglovye';

export interface Category {
  slug: CategorySlug;
  name: string;
  /** Короткое пояснение под названием в плитке категории. */
  summary: string;
  image: string;
}

export type BadgeKind = 'hit' | 'new' | 'sale';

export interface Specification {
  label: string;
  value: string;
  /**
   * Ключ фильтра, если характеристика участвует в фильтрации.
   * Фильтры строятся только по реально заполненным ключам.
   */
  filterKey?: 'installation' | 'hearth' | 'finish';
}

export interface Product {
  id: string;
  slug: string;
  /** Артикул из материалов заказчика. Указан не у всех позиций. */
  sku?: string;

  name: string;
  /** Название модели без цвета — по нему группируются цветовые исполнения. */
  model: string;
  category: CategorySlug;

  description: string;
  shortDescription: string;

  images: string[];

  price: number;
  oldPrice?: number;

  badges: BadgeKind[];
  inStock: boolean;

  /** Цвет/отделка портала — используется в фильтре и в переключателе исполнений. */
  color: string;
  /** Тип установки — используется в фильтре. */
  installation: 'Напольная' | 'Угловая' | 'Пристенная';
  /** Модель очага. У тумб-витрин очага нет. */
  hearth?: 'Fobos' | 'Flash 36';
  /** Площадь обогрева, м². У товаров без обогрева отсутствует. */
  heatingArea?: number;
  /** Максимальная мощность, Вт. */
  power?: number;

  specifications: Specification[];

  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };

  featured?: boolean;
  bestseller?: boolean;
  isNew?: boolean;

  /** Что в материалах заказчика требует подтверждения по этой позиции. */
  dataNotes?: string[];
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface FavoriteEntry {
  productId: string;
}

export type PromoStatus = 'idle' | 'applied' | 'invalid' | 'expired' | 'already';

export interface AppliedPromo {
  code: string;
  percent: number;
}

export interface DeliveryRequest {
  /** Идентификатор транспортной компании из config/site.ts. */
  carrierId: string;
  originCity: string;
  destinationCity: string;
  /** Суммарный вес заказа, кг. */
  weight: number;
  /** Суммарный объём заказа, м³. */
  volume: number;
  /** Габариты самого крупного места, мм. */
  maxDimensions: { width: number; height: number; depth: number };
  /** Оценочная стоимость груза для страховки, ₽. */
  declaredValue: number;
}

export interface DeliveryQuote {
  carrier: string;
  /** Стоимость доставки, ₽. */
  price: number;
  /** Срок в днях. */
  minDays: number;
  maxDays: number;
  /** true, если расчёт сделан демонстрационным провайдером. */
  isEstimate: boolean;
  note?: string;
}

export interface DeliveryProvider {
  readonly id: string;
  calculate(input: DeliveryRequest): Promise<DeliveryQuote>;
}

export interface DeliveryOption {
  carrierId: string;
  carrierName: string;
  quote: DeliveryQuote;
}

export interface OrderLine {
  productId: string;
  name: string;
  sku?: string;
  color: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  number: string;
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  recipient?: {
    name: string;
    phone: string;
  };
  delivery: {
    method: 'carrier' | 'pickup';
    carrierId?: string;
    carrier?: string;
    city?: string;
    address?: string;
    price: number;
    minDays?: number;
    maxDays?: number;
    isEstimate?: boolean;
  };
  comment?: string;
  lines: OrderLine[];
  itemsTotal: number;
  promo?: AppliedPromo;
  discount: number;
  total: number;
}

export interface Promotion {
  id: string;
  kind: 'sale' | 'new' | 'news';
  title: string;
  text: string;
  image: string;
  href: string;
  cta: string;
}

export interface Review {
  id: string;
  name: string;
  text: string;
  date?: string;
  productSlug?: string;
  /** Демонстрационные отзывы честно помечаются в интерфейсе. */
  demo: boolean;
}
