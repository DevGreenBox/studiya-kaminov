'use client';

import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { SketchIcon } from '@/components/icons/SketchIcon';
import { useScrollLock } from '@/components/ui/Modal';
import { cn } from '@/lib/cn';

/**
 * Полноэкранный просмотр фотографий товара.
 *
 * Отдельно от `Modal`: тот рисует белую панель с заголовком и рамкой, а здесь
 * нужен тёмный фон во весь экран и максимум места под снимок.
 *
 * Управление: стрелки, Esc, свайп и клик по фону. Фокус удерживается внутри
 * слоя и возвращается на исходную кнопку при закрытии.
 */
export function Lightbox({
  images,
  index,
  name,
  onClose,
  onIndexChange,
}: {
  images: string[];
  index: number;
  name: string;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<number | null>(null);
  useScrollLock(true);

  const step = useCallback(
    (direction: -1 | 1) => onIndexChange((index + direction + images.length) % images.length),
    [index, images.length, onIndexChange],
  );

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      } else if (event.key === 'ArrowLeft') {
        step(-1);
      } else if (event.key === 'ArrowRight') {
        step(1);
      } else if (event.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>('button');
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previous?.focus?.();
    };
  }, [onClose, step]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${name} — просмотр фотографий`}
      ref={panelRef}
      tabIndex={-1}
      className="fixed inset-0 z-50 bg-ink/97 outline-none ef-animate-fade-in"
    >
      {/*
        Управление лежит поверх снимка, а не полосами сверху и снизу: у
        вертикальной фотографии на широком экране высота и так в дефиците, и
        полосы съедали около двухсот пикселей — «во весь экран» переставало
        отличаться от галереи на странице.
      */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <p className="rounded-full bg-ink/60 px-3 py-1 text-sm font-medium text-white/80 backdrop-blur">
          Фото {index + 1} из {images.length}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть просмотр"
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-ink/60 text-white backdrop-blur transition-colors hover:border-white/60 hover:bg-white/10"
        >
          <SketchIcon name="x" size={20} />
        </button>
      </div>

      <div
        className="relative h-full w-full p-2 sm:p-4"
        onTouchStart={(event) => {
          touchStart.current = event.touches[0].clientX;
        }}
        onTouchEnd={(event) => {
          if (touchStart.current === null) return;
          const delta = event.changedTouches[0].clientX - touchStart.current;
          if (Math.abs(delta) > 45) step(delta < 0 ? 1 : -1);
          touchStart.current = null;
        }}
      >
        {/* Клик мимо снимка закрывает просмотр — привычное поведение галерей */}
        <button
          type="button"
          aria-label="Закрыть просмотр"
          tabIndex={-1}
          onClick={onClose}
          className="absolute inset-0 cursor-default"
        />
        <Image
          key={images[index]}
          src={images[index]}
          alt={`${name} — фото ${index + 1} из ${images.length}`}
          fill
          sizes="100vw"
          priority
          className="pointer-events-none object-contain ef-animate-fade-in"
        />
      </div>

      {images.length > 1 && (
        <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-center gap-4 px-4 py-5 sm:px-6">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Предыдущее фото"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-ink/60 text-white backdrop-blur transition-colors hover:border-white/60 hover:bg-white/10"
          >
            <SketchIcon name="arrow-left" size={20} />
          </button>

          <div className="flex gap-1.5 rounded-full bg-ink/60 px-3 py-2.5 backdrop-blur">
            {images.map((image, dot) => (
              <button
                key={image}
                type="button"
                aria-label={`Показать фото ${dot + 1}`}
                aria-current={dot === index}
                onClick={() => onIndexChange(dot)}
                className={cn(
                  'h-2 rounded-full transition-[width,background-color] duration-200',
                  dot === index ? 'w-7 bg-primary' : 'w-2 bg-white/35 hover:bg-white/60',
                )}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Следующее фото"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-ink/60 text-white backdrop-blur transition-colors hover:border-white/60 hover:bg-white/10"
          >
            <SketchIcon name="arrow-right" size={20} />
          </button>
        </div>
      )}
    </div>,
    document.body,
  );
}
