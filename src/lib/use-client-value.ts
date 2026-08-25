'use client';

import { useSyncExternalStore } from 'react';

const noopSubscribe = () => () => {};

/**
 * true после гидратации, false на сервере и в первом клиентском рендере.
 * Позволяет читать localStorage/sessionStorage прямо в рендере без
 * setState внутри эффекта и без рассинхрона разметки.
 */
export function useIsClient() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/**
 * Подписка на прокрутку окна: возвращает true, когда страница сдвинута
 * больше чем на `threshold` пикселей.
 */
export function useScrolled(threshold = 8) {
  return useSyncExternalStore(
    (onChange) => {
      window.addEventListener('scroll', onChange, { passive: true });
      return () => window.removeEventListener('scroll', onChange);
    },
    () => window.scrollY > threshold,
    () => false,
  );
}

/**
 * Просит ли система уменьшить движение. Через внешний источник, а не через
 * состояние в эффекте: иначе первый кадр успевает проиграть анимацию, которую
 * пользователь просил не показывать.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia('(prefers-reduced-motion: reduce)');
      query.addEventListener('change', onChange);
      return () => query.removeEventListener('change', onChange);
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  );
}
