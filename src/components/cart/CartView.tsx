'use client';

import Image from 'next/image';
import Link from 'next/link';
import { SketchIcon } from '@/components/icons/SketchIcon';
import { useCart } from '@/lib/store/cart';
import { useFavorites } from '@/lib/store/favorites';
import { resolveCartLines, cartItemsTotal, cartCount } from '@/lib/cart-lines';
import { categoryBySlug } from '@/data/categories';
import { formatPrice, pluralize } from '@/lib/format';
import { promoDiscount } from '@/lib/promo';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { Button, ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { PromoField } from './PromoField';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/cn';
import { typo } from '@/lib/typography';

export function CartView() {
  const hydrated = useCart((s) => s.hydrated);
  const items = useCart((s) => s.items);
  const promo = useCart((s) => s.promo);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const favorites = useFavorites((s) => s.ids);
  const toggleFavorite = useFavorites((s) => s.toggle);
  const toast = useToast();

  if (!hydrated) {
    return (
      <>
        <h1 className="mt-4 text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-tight">Корзина</h1>
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-64" />
        </div>
      </>
    );
  }

  const lines = resolveCartLines(items);
  const itemsTotal = cartItemsTotal(lines);
  const discount = promoDiscount(itemsTotal, promo);
  const total = itemsTotal - discount;
  const count = cartCount(lines);

  if (lines.length === 0) {
    return (
      <>
        <h1 className="mt-4 text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-tight">Корзина</h1>
        <div className="mt-8">
          <EmptyState
            icon={<SketchIcon name="cart" size={26} />}
            title="Корзина пока пуста"
            text="Выберите камин в каталоге — он сохранится здесь, даже если вы закроете страницу."
            action={{ label: 'Перейти в каталог', href: '/catalog' }}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-tight">Корзина</h1>
        <Button variant="ghost" size="sm" onClick={clear}>
          Очистить корзину
        </Button>
      </div>
      <p className="mt-2 text-[15px] text-ink-soft">
        {count} {pluralize(count, ['товар', 'товара', 'товаров'])}
      </p>

      <div className="mt-7 grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10">
        <ul className="flex flex-col gap-3">
          {lines.map(({ product, quantity }) => {
            const isFavorite = favorites.includes(product.id);
            return (
              <li
                key={product.id}
                className="grid grid-cols-[72px_minmax(0,1fr)] gap-3 rounded-[var(--radius-md)] border border-line bg-white p-3 sm:grid-cols-[112px_minmax(0,1fr)] sm:gap-4 sm:p-4"
              >
                <Link
                  href={`/catalog/${product.slug}`}
                  className="relative block aspect-[3/4] overflow-hidden rounded-[var(--radius-xs)] bg-surface"
                >
                  <Image
                    src={product.images[0]}
                    alt=""
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </Link>

                <div className="flex min-w-0 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-[15px] font-semibold leading-snug sm:text-base">
                        <Link
                          href={`/catalog/${product.slug}`}
                          className="transition-colors hover:text-primary"
                        >
                          {product.name}
                        </Link>
                      </h2>
                      <p className="mt-1 text-sm text-ink-muted">
                        {categoryBySlug.get(product.category)?.name} · {product.color}
                        {product.sku && ` · арт. ${product.sku}`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        remove(product.id);
                        toast.show('Товар удалён из корзины');
                      }}
                      aria-label={`Удалить «${product.name}» из корзины`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-ink-muted transition-colors hover:bg-danger-soft hover:text-danger"
                    >
                      <SketchIcon name="trash" size={17} />
                    </button>
                  </div>

                  <div className="mt-auto flex flex-wrap items-end justify-between gap-x-3 gap-y-3 pt-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <QuantitySelector
                        value={quantity}
                        size="sm"
                        onChange={(next) => setQuantity(product.id, next)}
                        onMinReached={() => {
                          remove(product.id);
                          toast.show('Товар удалён из корзины');
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => toggleFavorite(product.id)}
                        aria-pressed={isFavorite}
                        className={cn(
                          'hidden h-10 items-center gap-1.5 rounded-[var(--radius-sm)] px-3 text-sm transition-colors sm:inline-flex',
                          isFavorite ? 'text-primary' : 'text-ink-muted hover:text-ink',
                        )}
                      >
                        <SketchIcon
                          name={isFavorite ? 'heart-filled' : 'heart'}
                          size={16}
                          aria-hidden
                        />
                        {isFavorite ? 'В избранном' : 'В избранное'}
                      </button>
                    </div>

                    <div className="text-right">
                      {quantity > 1 && (
                        <p className="text-sm text-ink-muted">
                          {formatPrice(product.price)} × {quantity}
                        </p>
                      )}
                      <p className="text-lg font-bold whitespace-nowrap">
                        {formatPrice(product.price * quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="lg:sticky lg:top-28">
          <div className="rounded-[var(--radius-md)] border border-line bg-surface p-5">
            <h2 className="text-lg font-bold">Итого</h2>

            <div className="mt-4">
              <PromoField discount={discount} />
            </div>

            <dl className="mt-5 flex flex-col gap-2.5 text-[15px]">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">
                  Товары, {count} {pluralize(count, ['шт', 'шт', 'шт'])}
                </dt>
                <dd className="font-medium whitespace-nowrap">{formatPrice(itemsTotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between gap-4 text-success">
                  <dt>Скидка по промокоду</dt>
                  <dd className="font-medium whitespace-nowrap">−{formatPrice(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">Доставка</dt>
                <dd className="text-right text-sm text-ink-muted">
                  {typo('рассчитается при оформлении')}
                </dd>
              </div>
            </dl>

            <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-line pt-4">
              <span className="font-bold">К оплате</span>
              <span className="text-2xl font-bold whitespace-nowrap">{formatPrice(total)}</span>
            </div>

            <ButtonLink href="/checkout" size="lg" fullWidth className="mt-5">
              Оформить заказ
            </ButtonLink>
            <ButtonLink href="/catalog" variant="ghost" fullWidth className="mt-2">
              Продолжить покупки
            </ButtonLink>
          </div>
        </aside>
      </div>
    </>
  );
}
