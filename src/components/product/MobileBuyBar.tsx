'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ShoppingCart } from 'lucide-react';
import { Price } from '@/components/ui/Price';
import { useCart } from '@/lib/store/cart';
import { useToast } from '@/components/ui/Toast';
import type { Product } from '@/types';

/**
 * Нижняя панель покупки на мобильном.
 * Появляется, только когда основная кнопка «В корзину» ушла за экран,
 * и прячется у футера, чтобы не перекрывать контент.
 */
export function MobileBuyBar({ product, anchorId }: { product: Product; anchorId: string }) {
  const [visible, setVisible] = useState(false);
  const observed = useRef(false);
  const items = useCart((s) => s.items);
  const hydrated = useCart((s) => s.hydrated);
  const add = useCart((s) => s.add);
  const toast = useToast();

  const inCart = hydrated && items.some((i) => i.productId === product.id);

  useEffect(() => {
    const anchor = document.getElementById(anchorId);
    const footer = document.querySelector('footer');
    if (!anchor) return;

    let anchorVisible = true;
    let footerVisible = false;
    const update = () => setVisible(!anchorVisible && !footerVisible);

    const anchorObserver = new IntersectionObserver(
      ([entry]) => {
        anchorVisible = entry.isIntersecting;
        update();
      },
      { rootMargin: '0px 0px -40% 0px' },
    );
    anchorObserver.observe(anchor);

    let footerObserver: IntersectionObserver | undefined;
    if (footer) {
      footerObserver = new IntersectionObserver(([entry]) => {
        footerVisible = entry.isIntersecting;
        update();
      });
      footerObserver.observe(footer);
    }

    observed.current = true;
    return () => {
      anchorObserver.disconnect();
      footerObserver?.disconnect();
    };
  }, [anchorId]);

  if (!product.inStock) return null;

  return (
    <div
      style={{ bottom: 'var(--ef-cookie-h, 0px)' }}
      className={`fixed inset-x-0 z-30 border-t border-line bg-white/97 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur transition-transform duration-200 lg:hidden print-hidden ${
        visible ? 'translate-y-0' : 'pointer-events-none translate-y-full'
      }`}
      aria-hidden={!visible}
    >
      <div className="flex items-center gap-3">
        <Price value={product.price} oldValue={product.oldPrice} />
        <button
          type="button"
          tabIndex={visible ? 0 : -1}
          onClick={() => {
            add(product.id, 1);
            toast.show('Товар добавлен в корзину', { action: { label: 'В корзину', href: '/cart' } });
          }}
          className="ml-auto inline-flex h-12 flex-1 max-w-[210px] items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-primary px-5 font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          {inCart ? <Check size={18} aria-hidden /> : <ShoppingCart size={18} aria-hidden />}
          {inCart ? 'Ещё раз' : 'В корзину'}
        </button>
      </div>
    </div>
  );
}
