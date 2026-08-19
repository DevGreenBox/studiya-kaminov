import { productById } from '@/data/catalog';
import type { CartItem, Product } from '@/types';

export interface CartLine {
  product: Product;
  quantity: number;
}

/** Раскрывает позиции корзины в товары. Позиции с неизвестным id отбрасываются. */
export function resolveCartLines(items: CartItem[]): CartLine[] {
  return items.flatMap((item) => {
    const product = productById.get(item.productId);
    return product ? [{ product, quantity: item.quantity }] : [];
  });
}

export const cartItemsTotal = (lines: CartLine[]) =>
  lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);

export const cartCount = (lines: CartLine[]) => lines.reduce((sum, line) => sum + line.quantity, 0);
