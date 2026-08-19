'use client';

import { useState } from 'react';
import { Button, ButtonLink } from '@/components/ui/Button';
import { ContactSellerModal } from '@/components/forms/ContactSellerModal';

export function HelpCta() {
  const [open, setOpen] = useState(false);

  return (
    <section className="container-site pb-4 sm:pb-8">
      <div className="flex flex-col items-center rounded-[var(--radius-lg)] border border-line bg-white px-6 py-10 text-center sm:px-10 sm:py-12">
        <h2 className="max-w-2xl text-[clamp(1.375rem,1.15rem+1.1vw,1.875rem)] leading-tight">
          Не знаете, какой камин подойдёт?
        </h2>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-soft sm:text-base">
          Напишите нам размеры места и что хотите получить — подскажем модель, цвет портала и
          подходящий очаг.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" onClick={() => setOpen(true)}>
            Связаться с продавцом
          </Button>
          <ButtonLink href="/catalog" size="lg" variant="secondary">
            Открыть каталог
          </ButtonLink>
        </div>
      </div>

      {open && <ContactSellerModal onClose={() => setOpen(false)} />}
    </section>
  );
}
