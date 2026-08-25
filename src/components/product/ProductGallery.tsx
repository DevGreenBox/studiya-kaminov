'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { SketchIcon } from '@/components/icons/SketchIcon';
import { Lightbox } from './Lightbox';
import { cn } from '@/lib/cn';

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const touchStart = useRef<number | null>(null);

  const go = (index: number) => setActive(Math.min(images.length - 1, Math.max(0, index)));

  return (
    <div className="flex min-w-0 max-w-full flex-col gap-3 lg:flex-row-reverse lg:items-start lg:gap-4">
      {/*
        На мобильном фотография занимает всю ширину, на десктопе ширина
        считается из высоты окна: при пропорции 3:4 высота получается не
        больше 70vh, и вертикальный кадр целиком помещается на экран.
        Ограничение задано через ширину, а не высоту, — иначе колонка сетки
        сжимала бы блок и object-cover резал бы кадр по бокам.
      */}
      <div
        className="group relative mx-auto aspect-[3/4] w-full overflow-hidden rounded-[var(--radius-md)] border border-line bg-surface lg:w-[min(100%,calc(min(70vh,720px)*0.75))]"
        onTouchStart={(event) => {
          touchStart.current = event.touches[0].clientX;
        }}
        onTouchEnd={(event) => {
          if (touchStart.current === null) return;
          const delta = event.changedTouches[0].clientX - touchStart.current;
          if (Math.abs(delta) > 45) go(active + (delta < 0 ? 1 : -1));
          touchStart.current = null;
        }}
      >
        <Image
          key={images[active]}
          src={images[active]}
          alt={`${name} — фото ${active + 1} из ${images.length}`}
          fill
          priority={active === 0}
          sizes="(max-width: 1024px) 100vw, 40vw"
          className="object-cover ef-animate-fade-in"
        />

        {/*
          Фотография открывается на весь экран. Кнопка лежит поверх снимка и
          растянута на него целиком: клик по самой фотографии — то, чего ждут
          от галереи, а видимая подсказка нужна, чтобы это не приходилось
          угадывать.
        */}
        <button
          type="button"
          onClick={() => setZoomed(true)}
          aria-label={`Открыть фото ${active + 1} на весь экран`}
          className="absolute inset-0 cursor-zoom-in"
        >
          <span
            aria-hidden
            className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white/90 text-ink-soft shadow-card backdrop-blur transition-colors group-hover:border-primary group-hover:text-primary"
          >
            <SketchIcon name="search" size={18} />
          </span>
        </button>
      </div>

      {images.length > 1 && (
        <ul
          className="flex w-full min-w-0 gap-2 overflow-x-auto pb-1 [scrollbar-width:none] lg:max-h-[min(70vh,720px)] lg:w-[84px] lg:shrink-0 lg:flex-col lg:overflow-y-auto lg:pb-0 [&::-webkit-scrollbar]:hidden"
          aria-label="Другие фотографии товара"
        >
          {images.map((image, index) => (
            <li key={image} className="shrink-0">
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Показать фото ${index + 1}`}
                aria-current={index === active}
                className={cn(
                  'relative block h-[92px] w-[70px] overflow-hidden rounded-[var(--radius-xs)] border-2 bg-surface transition-colors lg:h-[110px] lg:w-full',
                  index === active
                    ? 'border-primary'
                    : 'border-transparent hover:border-line-strong',
                )}
              >
                <Image src={image} alt="" fill sizes="84px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {zoomed && (
        <Lightbox
          images={images}
          index={active}
          name={name}
          onClose={() => setZoomed(false)}
          onIndexChange={setActive}
        />
      )}
    </div>
  );
}
