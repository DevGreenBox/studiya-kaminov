'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { SketchIcon } from '@/components/icons/SketchIcon';
import { ContactSellerModal } from '@/components/forms/ContactSellerModal';
import { typo } from '@/lib/typography';

/**
 * Последний экран — приглашение написать.
 *
 * Не центрированная плашка с двумя кнопками: вопрос набран крупно антиквой
 * слева, действие одно, второй выход — текстовой ссылкой.
 */
export function HelpCta() {
  const [open, setOpen] = useState(false);

  return (
    <section className="bg-surface-warm py-16 sm:py-24">
      <div className="container-site grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-20">
        <h2 className="display-lg max-w-[16ch]">{typo('Не знаете, какой камин подойдёт?')}</h2>

        <div>
          <p className="max-w-[44ch] text-[17px] leading-relaxed text-ink-soft">
            {typo(
              'Напишите размеры места и что хотите получить — подскажем модель, цвет портала и подходящий очаг.',
            )}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Button size="lg" onClick={() => setOpen(true)}>
              Связаться с продавцом
            </Button>
            <Link
              href="/catalog"
              className="group inline-flex items-center gap-2.5 border-b-2 border-line-strong pb-1.5 text-[16px] font-semibold text-ink transition-colors hover:border-primary hover:text-primary"
            >
              Открыть каталог
              <SketchIcon
                name="arrow-right"
                size={18}
                aria-hidden
                className="text-primary transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>

      {open && <ContactSellerModal onClose={() => setOpen(false)} />}
    </section>
  );
}
