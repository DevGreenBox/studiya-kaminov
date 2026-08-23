'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Menu, Phone, Search, ShoppingCart, X } from 'lucide-react';
import { site, contacts } from '@/config/site';
import { mainNav } from '@/config/navigation';
import { useCart } from '@/lib/store/cart';
import { useFavorites } from '@/lib/store/favorites';
import { useScrollLock } from '@/components/ui/Modal';
import { SearchOverlay } from './SearchOverlay';
import { cn } from '@/lib/cn';
import { useScrolled } from '@/lib/use-client-value';

function CountBadge({ value }: { value: number }) {
  if (value <= 0) return null;
  return (
    <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold leading-none text-white">
      {value > 99 ? '99+' : value}
    </span>
  );
}

export function Header() {
  const pathname = usePathname();
  const scrolled = useScrolled(8);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  const [searchOpen, setSearchOpen] = useState(false);

  const cartItems = useCart((s) => s.items);
  const cartHydrated = useCart((s) => s.hydrated);
  const favoriteIds = useFavorites((s) => s.ids);
  const favHydrated = useFavorites((s) => s.hydrated);

  const cartCount = cartHydrated ? cartItems.reduce((sum, i) => sum + i.quantity, 0) : 0;
  const favCount = favHydrated ? favoriteIds.length : 0;

  // При переходе на другую страницу мобильное меню закрывается.
  // Корректировка состояния прямо в рендере — рекомендованный React способ
  // вместо setState внутри эффекта.
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    if (menuOpen) setMenuOpen(false);
  }

  useScrollLock(menuOpen);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-[var(--radius-sm)] focus:bg-white focus:px-4 focus:py-2 focus:shadow-raised"
      >
        Перейти к содержимому
      </a>

      <header
        className={cn(
          'sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-200',
          scrolled
            ? 'border-line bg-white/95 shadow-header backdrop-blur'
            : 'border-transparent bg-white',
        )}
      >
        {/* Высота фиксирована, чтобы при скролле не было скачка макета */}
        <div className="container-site flex h-16 items-center gap-3 lg:h-20 lg:gap-6">
          <Link
            href="/"
            className="flex shrink-0 items-center"
            aria-label={`${site.name} — на главную`}
          >
            <Image
              src={site.logo}
              alt={site.name}
              width={1002}
              height={436}
              priority
              className="h-8 w-auto lg:h-10"
            />
          </Link>

          <nav aria-label="Основное меню" className="mx-auto hidden lg:block">
            <ul className="flex items-center gap-1">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={cn(
                      'relative flex h-10 items-center rounded-[var(--radius-sm)] px-3 text-[15px] font-medium transition-colors',
                      isActive(item.href)
                        ? 'text-primary'
                        : 'text-ink-soft hover:bg-surface-strong hover:text-ink',
                    )}
                  >
                    {item.label}
                    {isActive(item.href) && (
                      <span
                        className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary"
                        aria-hidden
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-0.5 lg:ml-0 lg:gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Поиск по сайту"
              className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] text-ink transition-colors hover:bg-surface-strong"
            >
              <Search size={21} />
            </button>

            <Link
              href="/favorites"
              aria-label={`Избранное${favCount ? `, ${favCount}` : ''}`}
              className={cn(
                'relative flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] transition-colors hover:bg-surface-strong',
                isActive('/favorites') ? 'text-primary' : 'text-ink',
              )}
            >
              <Heart size={21} />
              <CountBadge value={favCount} />
            </Link>

            <Link
              href="/cart"
              aria-label={`Корзина${cartCount ? `, ${cartCount}` : ''}`}
              className={cn(
                'relative flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] transition-colors hover:bg-surface-strong',
                isActive('/cart') ? 'text-primary' : 'text-ink',
              )}
            >
              <ShoppingCart size={21} />
              <CountBadge value={cartCount} />
            </Link>

            <a
              href={contacts.phoneHref}
              className="ml-2 hidden items-center gap-2 rounded-[var(--radius-sm)] border border-line-strong px-3.5 py-2 text-[15px] font-semibold text-ink transition-colors hover:border-ink-muted xl:inline-flex"
            >
              <Phone size={16} className="text-primary" aria-hidden />
              {contacts.phone}
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Открыть меню"
              aria-expanded={menuOpen}
              className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] text-ink transition-colors hover:bg-surface-strong lg:hidden"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Мобильное меню: полноэкранное, со всеми разделами */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/45 ef-animate-fade-in"
            onClick={() => setMenuOpen(false)}
            aria-hidden
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Меню"
            className="relative ml-auto flex h-full w-full max-w-sm flex-col bg-white ef-animate-slide-in-right"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-4">
              <Image
                src={site.logo}
                alt={site.name}
                width={1002}
                height={436}
                className="h-8 w-auto"
              />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Закрыть меню"
                className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] text-ink transition-colors hover:bg-surface-strong"
              >
                <X size={22} />
              </button>
            </div>

            <nav
              aria-label="Меню"
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-3"
            >
              <ul className="flex flex-col">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? 'page' : undefined}
                      className={cn(
                        'flex min-h-12 items-center rounded-[var(--radius-sm)] px-4 text-[17px] font-medium transition-colors',
                        isActive(item.href)
                          ? 'bg-primary-soft text-primary'
                          : 'text-ink hover:bg-surface',
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <hr className="my-3 border-line" />

              <ul className="flex flex-col">
                <li>
                  <Link
                    href="/favorites"
                    className="flex min-h-12 items-center gap-3 rounded-[var(--radius-sm)] px-4 text-[17px] text-ink transition-colors hover:bg-surface"
                  >
                    <Heart size={19} className="text-ink-muted" aria-hidden />
                    Избранное
                    {favCount > 0 && (
                      <span className="ml-auto text-sm text-ink-muted">{favCount}</span>
                    )}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cart"
                    className="flex min-h-12 items-center gap-3 rounded-[var(--radius-sm)] px-4 text-[17px] text-ink transition-colors hover:bg-surface"
                  >
                    <ShoppingCart size={19} className="text-ink-muted" aria-hidden />
                    Корзина
                    {cartCount > 0 && (
                      <span className="ml-auto text-sm text-ink-muted">{cartCount}</span>
                    )}
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="shrink-0 border-t border-line p-4 pb-[max(16px,env(safe-area-inset-bottom))]">
              <a
                href={contacts.phoneHref}
                className="flex h-12 items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-primary font-semibold text-white"
              >
                <Phone size={17} aria-hidden />
                {contacts.phone}
              </a>
            </div>
          </div>
        </div>
      )}

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}
