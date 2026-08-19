'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { IconButton } from './IconButton';

let lockCount = 0;

/** Единая блокировка прокрутки: несколько наложенных слоёв не мешают друг другу. */
function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    lockCount += 1;
    document.body.dataset.scrollLocked = 'true';
    return () => {
      lockCount -= 1;
      if (lockCount <= 0) {
        lockCount = 0;
        delete document.body.dataset.scrollLocked;
      }
    };
  }, [active]);
}

interface OverlayProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Заголовок скрыт визуально, но доступен скринридеру. */
  hideTitle?: boolean;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

function useOverlayBehaviour(open: boolean, onClose: () => void, panelRef: React.RefObject<HTMLDivElement | null>) {
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;

    const previous = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    panel?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !panel) return;

      // Удерживаем фокус внутри слоя.
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
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
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previous?.focus?.();
    };
  }, [open, onClose, panelRef]);
}

export function Modal({ open, onClose, title, hideTitle, children, footer, className }: OverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useOverlayBehaviour(open, onClose, panelRef);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-ink/45 ef-animate-fade-in"
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          'relative flex max-h-[92dvh] w-full flex-col overflow-hidden bg-white shadow-raised outline-none',
          'rounded-t-[var(--radius-lg)] sm:max-w-lg sm:rounded-[var(--radius-lg)]',
          'ef-animate-slide-in-bottom sm:ef-animate-slide-up',
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <h2 className={cn('text-lg font-bold', hideTitle && 'sr-only')}>{title}</h2>
          <IconButton label="Закрыть" onClick={onClose} className="-mr-2 shrink-0">
            <X size={20} />
          </IconButton>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">{children}</div>
        {footer && <div className="border-t border-line bg-surface px-5 py-4 sm:px-6">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}

interface DrawerProps extends OverlayProps {
  side?: 'right' | 'left';
}

export function Drawer({ open, onClose, title, children, footer, side = 'right', className }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useOverlayBehaviour(open, onClose, panelRef);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-ink/45 ef-animate-fade-in" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          'relative ml-auto flex h-full w-full max-w-[420px] flex-col bg-white shadow-raised outline-none ef-animate-slide-in-right',
          side === 'left' && 'ml-0 mr-auto',
          className,
        )}
      >
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <IconButton label="Закрыть" onClick={onClose} className="-mr-2 shrink-0">
            <X size={20} />
          </IconButton>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">{children}</div>
        {footer && <div className="border-t border-line bg-surface px-5 py-4">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}

export { useScrollLock };
