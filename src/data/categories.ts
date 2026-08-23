import type { Category } from '@/types';
import images from './image-index.json';
import { typo } from '@/lib/typography';

/**
 * Категории повторяют структуру папок в материалах заказчика.
 * Обложки — реальные фотографии продукции без маркетплейс-надписей.
 */
const rawCategories: Category[] = [
  {
    slug: 'kaminy-s-kamnem',
    name: 'Камины с камнем',
    summary: 'Порталы из МДФ с искусственным камнем',
    image: images.categories['kaminy-s-kamnem'],
  },
  {
    slug: 'klassicheskie',
    name: 'Классические камины',
    summary: 'Эмаль и ручная золотая патина',
    image: images.categories['klassicheskie'],
  },
  {
    slug: 'sovremennye',
    name: 'Современные камины',
    summary: 'Панорамный очаг, лаконичный корпус',
    image: images.categories['sovremennye'],
  },
  {
    slug: 's-bokovymi-tumbami',
    name: 'С боковыми тумбами',
    summary: 'Камин и открытые полки в одном корпусе',
    image: images.categories['s-bokovymi-tumbami'],
  },
  {
    slug: 'uglovye',
    name: 'Угловые камины',
    summary: 'Компактное решение для угла комнаты',
    image: images.categories['uglovye'],
  },
  {
    slug: 'tumby-pod-tv',
    name: 'Тумбы под ТВ',
    summary: 'Широкий очаг и место под телевизор',
    image: images.categories['tumby-pod-tv'],
  },
];

export const categories: Category[] = rawCategories.map((category) => ({
  ...category,
  name: typo(category.name),
  summary: typo(category.summary),
}));

export const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));
