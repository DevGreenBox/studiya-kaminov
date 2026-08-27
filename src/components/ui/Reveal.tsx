'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Спокойное появление блока при первом попадании в экран.
 *
 * Двигается только прозрачность и на 14 px — сам элемент остаётся в потоке,
 * поэтому макет не смещается и ничего не «прыгает». Наблюдатель отключается
 * после первого срабатывания: повторные появления при прокрутке вверх-вниз
 * выглядят навязчиво.
 */
export function Reveal({
  as: Tag = 'div',
  delay = 0,
  className,
  children,
}: {
  as?: ElementType;
  /** Небольшая задержка для соседних блоков, чтобы они проявлялись каскадом. */
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        observer.disconnect();
      },
      { rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn('ef-reveal', shown && 'ef-reveal-in', className)}
    >
      {children}
    </Tag>
  );
}
