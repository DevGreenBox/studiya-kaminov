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

/** Две-три ключевые характеристики для карточки — берутся из каталога. */
function keyFacts(product: Product) {
  const facts: string[] = [product.color];
  if (product.dimensions) facts.push(`${product.dimensions.width} мм`);
  if (product.heatingArea) facts.push(`до ${product.heatingArea} м²`);
  else if (product.hearth) facts.push(`очаг ${product.hearth}`);
  return facts.slice(0, 3);
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
    <article className="group relative isolate flex h-full flex-col overflow-hidden rounded-[var(--radius-md)] border border-line bg-white transition-[border-color,box-shadow] duration-200 hover:border-line-strong hover:shadow-card focus-within:border-primary">
      <div className="relative aspect-[3/4] overflow-hidden bg-surface">
        <Image
          src={product.images[0]}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
        />

        <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
          {product.badges.map((badge) => (
            <Badge key={badge} kind={badge} />
          ))}
          {discount > 0 && <DiscountBadge percent={discount} />}
        </div>

        <FavoriteButton
          productId={product.id}
          productName={product.name}
          className="absolute right-2.5 top-2.5 z-20"
        />
      </div>

      {/* Контент сверху, цена и кнопки прижаты вниз — карточки в ряду одной высоты */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <h3 className="text-[15px] font-semibold leading-snug">
          <Link
            href={`/catalog/${product.slug}`}
            className="line-clamp-2-fixed transition-colors before:absolute before:inset-0 before:z-10 before:content-[''] group-hover:text-primary"
          >
            {product.name}
          </Link>
        </h3>

        <ul className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-[13px] text-ink-muted">
          {keyFacts(product).map((fact) => (
            <li
              key={fact}
              className="after:ml-2 after:text-line-strong after:content-['·'] last:after:content-none"
            >
              {fact}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-4">
          <Price value={product.price} oldValue={product.oldPrice} />
          {!product.inStock && <p className="mt-1 text-sm text-ink-muted">Нет в наличии</p>}
          <div className="relative z-20 mt-3">
            <AddToCartButton product={product} fullWidth nameProduct />
          </div>
        </div>
      </div>
    </article>
  );
}
