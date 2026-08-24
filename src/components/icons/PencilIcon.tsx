import type { SVGProps } from 'react';
import sketch from './sketch-paths.json';

/**
 * Крупные декоративные иконки в информационных блоках — преимущества,
 * производство, шаги заказа.
 *
 * Отличаются от `SketchIcon` только масштабом (viewBox 48) и чуть более
 * свободной рукой: крупный размер это позволяет. Контуры собственные,
 * генерируются тем же скриптом `scripts/make-sketch-icons.mjs`.
 */

export type PencilIconName = keyof typeof sketch.decorative;

interface Props extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: PencilIconName;
  size?: number;
}

export function PencilIcon({ name, size = 48, ...rest }: Props) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...rest}
    >
      {sketch.decorative[name].strokes.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
