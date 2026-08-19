'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { useId } from 'react';
import { cn } from '@/lib/cn';

const control =
  'w-full rounded-[var(--radius-sm)] border bg-white text-ink placeholder:text-ink-muted ' +
  'transition-colors duration-150 disabled:bg-surface disabled:text-ink-muted';

function Shell({
  label,
  error,
  hint,
  required,
  htmlFor,
  children,
}: {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={htmlFor} className="text-sm font-medium text-ink-soft">
          {label}
          {required && (
            <span aria-hidden className="text-primary">
              {' '}*
            </span>
          )}
        </label>
      )}
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="text-sm text-danger">
          {error}
        </p>
      ) : hint ? (
        <p className="text-sm text-ink-muted">{hint}</p>
      ) : null}
    </div>
  );
}

interface InputProps extends ComponentPropsWithoutRef<'input'> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, className, id, required, ...rest }: InputProps) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <Shell label={label} error={error} hint={hint} required={required} htmlFor={fieldId}>
      <input
        id={fieldId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        {...rest}
        className={cn(
          control,
          'h-12 px-3.5 text-[15px]',
          error ? 'border-danger' : 'border-line-strong hover:border-ink-muted',
          className,
        )}
      />
    </Shell>
  );
}

interface TextareaProps extends ComponentPropsWithoutRef<'textarea'> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Textarea({ label, error, hint, className, id, required, ...rest }: TextareaProps) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <Shell label={label} error={error} hint={hint} required={required} htmlFor={fieldId}>
      <textarea
        id={fieldId}
        required={required}
        rows={4}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        {...rest}
        className={cn(
          control,
          'px-3.5 py-3 text-[15px] resize-y min-h-28',
          error ? 'border-danger' : 'border-line-strong hover:border-ink-muted',
          className,
        )}
      />
    </Shell>
  );
}

interface SelectProps extends ComponentPropsWithoutRef<'select'> {
  label?: string;
  error?: string;
}

export function Select({ label, error, className, id, children, ...rest }: SelectProps) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <Shell label={label} error={error} htmlFor={fieldId}>
      <select
        id={fieldId}
        aria-invalid={error ? true : undefined}
        {...rest}
        className={cn(
          control,
          'h-12 px-3 text-[15px] cursor-pointer appearance-none',
          "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2357534e%22 stroke-width=%222%22 stroke-linecap=%22round%22><path d=%22M6 9l6 6 6-6%22/></svg>')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat pr-10",
          error ? 'border-danger' : 'border-line-strong hover:border-ink-muted',
          className,
        )}
      >
        {children}
      </select>
    </Shell>
  );
}

interface CheckboxProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type'> {
  label: ReactNode;
  error?: string;
}

export function Checkbox({ label, error, className, id, ...rest }: CheckboxProps) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={fieldId} className="flex items-start gap-2.5 cursor-pointer group">
        <input
          id={fieldId}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          {...rest}
          className={cn(
            'mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded-[5px] border-2 accent-[var(--color-primary)]',
            error ? 'border-danger' : 'border-line-strong',
            className,
          )}
        />
        <span className="text-sm leading-6 text-ink-soft group-hover:text-ink">{label}</span>
      </label>
      {error && (
        <p id={`${fieldId}-error`} className="text-sm text-danger pl-7.5">
          {error}
        </p>
      )}
    </div>
  );
}
