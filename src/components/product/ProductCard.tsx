'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge, DiscountBadge } from '@/components/ui/Badge';
import { Price } from '@/components/ui/Price';
import { FavoriteButton } from './FavoriteButton';
import { AddToCartButton } from './AddToCartButton';
import { discountPercent } from '@/data/catalog';
import type { Product } from '@/types';

interface Props {
  product: Product;
  /** Приоритетная загрузка для карточек первого экрана. */
  priority?: boolean;
  sizes?: string;
}

/**
 * Две характеристики, не три: в списке из двадцати карточек третья строка
 * читается как шум и отбирает место у фотографии.
 */
function keyFacts(product: Product) {
  const facts: string[] = [product.color];
  if (product.dimensions) facts.push(`${product.dimensions.width} мм`);
  else if (product.heatingArea) facts.push(`до ${product.heatingArea} м²`);
  return facts.slice(0, 2);
}

export function ProductCard({
  product,
  priority,
  sizes = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
}: Props) {
  const discount = discountPercent(product);

  return (
    /*
     * Кликабельна вся карточка: ссылка в заголовке растянута псевдоэлементом
     * на весь <article>. Так остаётся одна ссылка в разметке — заголовок
     * служит её доступным именем, а вложенных ссылок и дублей для скринридера
     * не появляется. Кнопки избранного и корзины подняты слоем выше, поэтому
     * работают как обычно.
     */
    <article className="group relative isolate flex h-full flex-col">
      <div className="relative aspect-[3/4] overflow-hidden bg-surface">
        <Image
          src={product.images[0]}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.025]"
        />

        <div className="pointer-events-none absolute left-0 top-0 flex flex-wrap gap-px">
          {product.badges.map((badge) => (
            <Badge key={badge} kind={badge} />
          ))}
          {discount > 0 && <DiscountBadge percent={discount} />}
        </div>

        <FavoriteButton
          productId={product.id}
          productName={product.name}
          className="absolute right-2 top-2 z-20"
        />
      </div>

      {/* Подпись под фотографией, без подложки: карточка — это сам снимок */}
      <div className="flex flex-1 flex-col pt-4">
        <h3 className="text-[16px] font-medium leading-snug">
          <Link
            href={`/catalog/${product.slug}`}
            className="line-clamp-2-fixed transition-colors before:absolute before:inset-0 before:z-10 before:content-[''] group-hover:text-primary"
          >
            {product.name}
          </Link>
        </h3>

        <ul className="mt-1.5 flex flex-wrap gap-x-2 gap-y-1 text-[13px] text-ink-muted">
          {keyFacts(product).map((fact) => (
            <li
              key={fact}
              className="after:ml-2 after:text-line-strong after:content-['·'] last:after:content-none"
            >
              {fact}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
          <div>
            <Price value={product.price} oldValue={product.oldPrice} />
            {!product.inStock && <p className="mt-1 text-sm text-ink-muted">Нет в наличии</p>}
          </div>
          {/* Кнопка компактная, а не во всю ширину: двадцать оранжевых полос
              в сетке перебивали фотографии */}
          <div className="relative z-20">
            <AddToCartButton product={product} size="sm" nameProduct />
          </div>
        </div>
      </div>
    </article>
  );
}
