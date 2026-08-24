'use client';

import { useState } from 'react';
import { SketchIcon } from '@/components/icons/SketchIcon';
import { Button } from '@/components/ui/Button';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { FavoriteButton } from './FavoriteButton';
import { ContactSellerModal } from '@/components/forms/ContactSellerModal';
import { useCart } from '@/lib/store/cart';
import { useToast } from '@/components/ui/Toast';
import type { Product } from '@/types';

export function ProductPurchase({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [contactOpen, setContactOpen] = useState(false);
  const items = useCart((s) => s.items);
  const hydrated = useCart((s) => s.hydrated);
  const add = useCart((s) => s.add);
  const toast = useToast();

  const inCart = hydrated && items.some((i) => i.productId === product.id);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <QuantitySelector value={quantity} onChange={setQuantity} />
          <Button
            size="md"
            className="min-w-44 flex-1"
            variant={inCart ? 'secondary' : 'primary'}
            disabled={!product.inStock}
            onClick={() => {
              add(product.id, quantity);
              toast.show(
                quantity > 1 ? `Добавлено в корзину: ${quantity} шт.` : 'Товар добавлен в корзину',
                { action: { label: 'В корзину', href: '/cart' } },
              );
            }}
          >
            {inCart ? (
              <SketchIcon name="check" size={18} aria-hidden />
            ) : (
              <SketchIcon name="cart" size={18} aria-hidden />
            )}
            {!product.inStock ? 'Нет в наличии' : inCart ? 'Добавить ещё' : 'В корзину'}
          </Button>
        </div>

        <div className="flex flex-wrap gap-3">
          <FavoriteButton
            productId={product.id}
            productName={product.name}
            variant="inline"
            className="flex-1"
          />
          <Button variant="secondary" className="flex-1" onClick={() => setContactOpen(true)}>
            <SketchIcon name="message-circle" size={18} aria-hidden />
            Связаться с продавцом
          </Button>
        </div>
      </div>

      {contactOpen && (
        <ContactSellerModal onClose={() => setContactOpen(false)} productName={product.name} />
      )}
    </>
  );
}
