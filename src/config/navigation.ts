export interface NavItem {
  href: string;
  label: string;
}

/** Дерево меню из брифа заказчика. */
export const mainNav: NavItem[] = [
  { href: '/', label: 'Главная' },
  { href: '/about', label: 'О нас' },
  { href: '/catalog', label: 'Каталог' },
  { href: '/reviews', label: 'Отзывы' },
  { href: '/delivery', label: 'Оплата и доставка' },
  { href: '/contacts', label: 'Контакты' },
];

export const footerNav = {
  buyers: [
    { href: '/catalog', label: 'Каталог' },
    { href: '/favorites', label: 'Избранное' },
    { href: '/cart', label: 'Корзина' },
    { href: '/delivery', label: 'Оплата и доставка' },
    { href: '/reviews', label: 'Отзывы' },
  ] satisfies NavItem[],
  company: [
    { href: '/about', label: 'О нас' },
    { href: '/about#production', label: 'Производство' },
    { href: '/contacts', label: 'Контакты' },
  ] satisfies NavItem[],
};
