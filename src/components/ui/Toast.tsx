'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { SketchIcon } from '@/components/icons/SketchIcon';
import { cn } from '@/lib/cn';
import { useIsClient } from '@/lib/use-client-value';

interface ToastItem {
  id: number;
  message: string;
  tone: 'success' | 'error';
  action?: { label: string; href: string };
}

interface ToastApi {
  show: (
    message: string,
    options?: { tone?: 'success' | 'error'; action?: ToastItem['action'] },
  ) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const mounted = useIsClient();

  const show = useCallback<ToastApi['show']>((message, options) => {
    const id = Date.now() + Math.random();
    setItems((prev) => [
      ...prev.slice(-2),
      { id, message, tone: options?.tone ?? 'success', action: options?.action },
    ]);
    window.setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const api = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      {mounted &&
        createPortal(
          <div
            className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 px-4 pb-[max(16px,env(safe-area-inset-bottom))] sm:items-end sm:px-6"
            role="status"
            aria-live="polite"
          >
            {items.map((item) => (
              <div
                key={item.id}
                className={cn(
                  'pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-[var(--radius-sm)] border px-4 py-3 shadow-raised ef-animate-slide-up',
                  item.tone === 'success'
                    ? 'border-line bg-white'
                    : 'border-danger/30 bg-danger-soft',
                )}
              >
                <span
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                    item.tone === 'success'
                      ? 'bg-success-soft text-success'
                      : 'bg-white text-danger',
                  )}
                  aria-hidden
                >
                  {item.tone === 'success' ? (
                    <SketchIcon name="check" size={16} />
                  ) : (
                    <SketchIcon name="alert-circle" size={16} />
                  )}
                </span>
                <p className="min-w-0 flex-1 text-sm font-medium text-ink">{item.message}</p>
                {item.action && (
                  <a
                    href={item.action.href}
                    className="shrink-0 text-sm font-semibold text-primary hover:text-primary-hover"
                  >
                    {item.action.label}
                  </a>
                )}
                <button
                  type="button"
                  aria-label="Скрыть уведомление"
                  onClick={() => setItems((prev) => prev.filter((t) => t.id !== item.id))}
                  className="shrink-0 rounded p-1 text-ink-muted hover:text-ink"
                >
                  <SketchIcon name="x" size={16} />
                </button>
              </div>
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast должен использоваться внутри ToastProvider');
  return context;
}
