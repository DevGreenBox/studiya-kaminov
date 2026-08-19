'use client';

import { Check, ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/store/cart';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import type { Product } from '@/types';

interface Props {
  product: Product;
  quantity?: number;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  /**
   * Добавляет название товара в доступное имя кнопки.
   * Нужно в списках, где рядом стоят несколько одинаковых кнопок.
   */
  nameProduct?: boolean;
}

export function AddToCartButton({
  product,
  quantity = 1,
  size = 'md',
  fullWidth,
  nameProduct,
}: Props) {
  const hydrated = useCart((s) => s.hydrated);
  const items = useCart((s) => s.items);
  const add = useCart((s) => s.add);
  const toast = useToast();

  const inCart = hydrated && items.some((i) => i.productId === product.id);

  if (!product.inStock) {
    return (
      <Button
        variant="secondary"
        size={size}
        fullWidth={fullWidth}
        disabled
        aria-label={nameProduct ? `Нет в наличии: ${product.name}` : undefined}
      >
        Нет в наличии
      </Button>
    );
  }

  return (
    <Button
      variant={inCart ? 'secondary' : 'primary'}
      size={size}
      fullWidth={fullWidth}
      aria-label={
        nameProduct ? `${inCart ? 'Уже в корзине' : 'Добавить в корзину'}: ${product.name}` : undefined
      }
      onClick={() => {
        add(product.id, quantity);
        toast.show('Товар добавлен в корзину', { action: { label: 'В корзину', href: '/cart' } });
      }}
    >
      {inCart ? <Check size={18} aria-hidden /> : <ShoppingCart size={18} aria-hidden />}
      {inCart ? 'В корзине' : 'В корзину'}
    </Button>
  );
}
