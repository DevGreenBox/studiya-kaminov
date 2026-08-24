'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SketchIcon } from '@/components/icons/SketchIcon';
import { searchProducts } from '@/lib/search';
import { categoryBySlug } from '@/data/categories';
import { formatPrice, pluralize } from '@/lib/format';
import { useScrollLock } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { typo } from '@/lib/typography';

interface Props {
  onClose: () => void;
}

/**
 * Оверлей поиска. Родитель монтирует его только в открытом состоянии,
 * поэтому поле очищается само собой — без сброса состояния в эффекте.
 */

const DEBOUNCE_MS = 250;

export function SearchOverlay({ onClose }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');
  const [query, setQuery] = useState('');

  useScrollLock(true);

  useEffect(() => {
    const id = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => setQuery(value), DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [value]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const results = useMemo(() => searchProducts(query, 6), [query]);
  const total = useMemo(() => (query.length >= 2 ? searchProducts(query).length : 0), [query]);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white sm:bg-ink/45">
      <button
        type="button"
        aria-label="Закрыть поиск"
        onClick={onClose}
        className="absolute inset-0 hidden cursor-default sm:block"
        tabIndex={-1}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Поиск по сайту"
        className="relative flex h-full flex-col bg-white sm:mx-auto sm:mt-20 sm:h-auto sm:w-full sm:max-w-2xl sm:rounded-[var(--radius-lg)] sm:shadow-raised"
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
          className="flex items-center gap-2 border-b border-line px-4 py-3 sm:px-5"
          role="search"
        >
          <SketchIcon name="search" size={20} className="shrink-0 text-ink-muted" aria-hidden />
          <input
            ref={inputRef}
            type="search"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Поиск по каталогу: модель, цвет, артикул"
            aria-label="Поисковый запрос"
            className="h-11 min-w-0 flex-1 bg-transparent text-[16px] text-ink outline-none placeholder:text-ink-muted"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть поиск"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-ink-muted transition-colors hover:bg-surface-strong hover:text-ink"
          >
            <SketchIcon name="x" size={20} />
          </button>
        </form>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {query.length < 2 ? (
            <p className="px-5 py-8 text-center text-sm text-ink-muted">
              {typo('Введите минимум два символа — например, «Дублин», «венге» или «угловой».')}
            </p>
          ) : results.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="font-semibold">Ничего не найдено</p>
              <p className="mt-1 text-sm text-ink-soft">
                {typo('Попробуйте другой запрос или откройте каталог целиком.')}
              </p>
              <Button
                variant="secondary"
                className="mt-4"
                onClick={() => {
                  onClose();
                  router.push('/catalog');
                }}
              >
                Перейти в каталог
              </Button>
            </div>
          ) : (
            <>
              <ul className="divide-y divide-line">
                {results.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/catalog/${product.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface sm:px-5"
                    >
                      <span className="relative block h-16 w-12 shrink-0 overflow-hidden rounded-[var(--radius-xs)] bg-surface">
                        <Image
                          src={product.images[0]}
                          alt=""
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold">{product.name}</span>
                        <span className="block text-sm text-ink-muted">
                          {categoryBySlug.get(product.category)?.name}
                        </span>
                      </span>
                      <span className="shrink-0 font-bold whitespace-nowrap">
                        {formatPrice(product.price)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="border-t border-line p-4 sm:p-5">
                <Button fullWidth onClick={submit}>
                  Показать все результаты ({total}{' '}
                  {pluralize(total, ['товар', 'товара', 'товаров'])})
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
