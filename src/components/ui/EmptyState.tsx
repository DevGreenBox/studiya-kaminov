import type { ReactNode } from 'react';
import { ButtonLink } from './Button';

interface Props {
  icon?: ReactNode;
  title: string;
  text?: string;
  action?: { label: string; href: string };
  secondaryAction?: ReactNode;
}

export function EmptyState({ icon, title, text, action, secondaryAction }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-line bg-surface px-6 py-14 text-center">
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-ink-muted" aria-hidden>
          {icon}
        </div>
      )}
      <h2 className="text-xl font-bold">{title}</h2>
      {text && <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink-soft">{text}</p>}
      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {action && <ButtonLink href={action.href}>{action.label}</ButtonLink>}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
