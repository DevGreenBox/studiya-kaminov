'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { legal } from '@/config/site';
import { useIsClient } from '@/lib/use-client-value';

const KEY = 'ef-cookie-accepted';

/**
 * Уведомление о cookie.
 *
 * Баннер зафиксирован внизу экрана, поэтому он сообщает свою высоту в
 * CSS-переменную --ef-cookie-h. Страница добавляет такой же нижний отступ,
 * а мобильная панель покупки поднимается на эту высоту — иначе баннер
 * перекрывал бы кнопки «Оформить заказ» и «В корзину».
 */
export function CookieBanner() {
  const isClient = useIsClient();
  const [dismissed, setDismissed] = useState(false);

  const measure = useCallback((node: HTMLDivElement | null) => {
    const root = document.documentElement;
    if (!node) {
      root.style.removeProperty('--ef-cookie-h');
      return;
    }
    const apply = () => root.style.setProperty('--ef-cookie-h', `${node.offsetHeight}px`);
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(node);
    return () => {
      observer.disconnect();
      root.style.removeProperty('--ef-cookie-h');
    };
  }, []);

  // Хранилище читаем только после гидратации, чтобы разметка совпала с серверной.
  const accepted = isClient && localStorage.getItem(KEY) === '1';
  if (!isClient || accepted || dismissed) return null;

  return (
    <div
      ref={measure}
      role="region"
      aria-label="Уведомление о файлах cookie"
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-2 print-hidden"
    >
      <div className="container-site">
        <div className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-line bg-white px-5 py-4 shadow-raised sm:flex-row sm:items-center sm:gap-6">
          <p className="flex-1 text-sm leading-relaxed text-ink-soft">
            Сайт использует файлы cookie, чтобы запоминать корзину и избранное.{' '}
            <Link
              href={legal.privacyUrl}
              className="font-medium text-primary underline underline-offset-2"
            >
              Подробнее
            </Link>
          </p>
          <Button
            size="sm"
            className="shrink-0"
            onClick={() => {
              localStorage.setItem(KEY, '1');
              setDismissed(true);
            }}
          >
            Принять
          </Button>
        </div>
      </div>
    </div>
  );
}
