import { PencilIcon, type PencilIconName } from '@/components/icons/PencilIcon';
import { typo } from '@/lib/typography';
import { cn } from '@/lib/cn';

/**
 * Пронумерованные шаги на тёмной плашке.
 *
 * Одни и те же этапы были свёрстаны трижды и по-разному: на главной — тёмной
 * лентой, на «О нас» — светлыми карточками, на «Доставке» — просто в строку.
 * Заказчику понравился вариант с главной, поэтому оформление вынесено сюда, а
 * страницы передают только содержание.
 *
 * Плашка скруглённая и лежит внутри контейнера, а не растянута во всю ширину:
 * на «О нас» тёмная секция идёт сразу за тёмным первым экраном, и full-bleed
 * слил бы их в одно пятно.
 */

export interface Step {
  icon: PencilIconName;
  title: string;
  text: string;
}

interface Props {
  steps: Step[];
  /** Заголовок внутри плашки. Без него плашка начинается сразу с шагов. */
  title?: string;
  lead?: string;
  /** «01» или «Шаг 1» — зависит от того, этапы это или инструкция. */
  numbering?: 'pad' | 'step';
  columns?: 3 | 4 | 6;
  /**
   * Плашку не рисовать: блок уже внутри тёмной секции. Так на главной —
   * там шаги идут продолжением рассказа о производстве.
   */
  inset?: boolean;
  id?: string;
  className?: string;
}

/** Классы задаются целиком: Tailwind не видит имена, собранные из кусков. */
const columnClass = {
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
  6: 'sm:grid-cols-2 lg:grid-cols-6',
} as const;

export function StepsPlate({
  steps,
  title,
  lead,
  numbering = 'pad',
  columns = 6,
  inset = false,
  id,
  className,
}: Props) {
  const list = (
    <ol
      className={cn(
        'grid grid-cols-1 gap-x-6 gap-y-8',
        columnClass[columns],
        inset && 'border-t border-white/10 pt-10',
      )}
    >
      {steps.map((step, index) => (
        <li key={step.title}>
          <div className="flex items-center gap-3">
            <PencilIcon name={step.icon} size={34} className="shrink-0 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wide tabular-nums text-white/40">
              {numbering === 'pad' ? `0${index + 1}` : `Шаг ${index + 1}`}
            </span>
          </div>
          <h3 className="mt-3 text-[16px] font-bold leading-snug">{step.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-white/60">{step.text}</p>
        </li>
      ))}
    </ol>
  );

  if (inset) return <div className={cn('mt-14', className)}>{list}</div>;

  return (
    <section
      id={id}
      className={cn(
        'rounded-[var(--radius-lg)] bg-ink px-6 py-10 text-white sm:px-10 sm:py-12',
        className,
      )}
    >
      {title && (
        <h2 className="max-w-2xl text-[clamp(1.5rem,1.2rem+1.3vw,2.125rem)] leading-tight">
          {typo(title)}
        </h2>
      )}
      {lead && (
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/70">{typo(lead)}</p>
      )}
      <div className={cn(title || lead ? 'mt-10' : undefined)}>{list}</div>
    </section>
  );
}
