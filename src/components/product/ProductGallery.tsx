'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/cn';

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const touchStart = useRef<number | null>(null);

  const go = (index: number) => setActive(Math.min(images.length - 1, Math.max(0, index)));

  return (
    <div className="flex min-w-0 max-w-full flex-col gap-3 lg:flex-row-reverse lg:gap-4">
      <div
        className="relative aspect-[3/4] w-full overflow-hidden rounded-[var(--radius-md)] border border-line bg-surface lg:flex-1"
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
          sizes="(max-width: 1024px) 100vw, 520px"
          className="object-cover ef-animate-fade-in"
        />
      </div>

      {images.length > 1 && (
        <ul
          className="flex w-full min-w-0 gap-2 overflow-x-auto pb-1 [scrollbar-width:none] lg:w-[84px] lg:shrink-0 lg:flex-col lg:overflow-y-auto lg:pb-0 [&::-webkit-scrollbar]:hidden"
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
                  index === active ? 'border-primary' : 'border-transparent hover:border-line-strong',
                )}
              >
                <Image src={image} alt="" fill sizes="84px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
