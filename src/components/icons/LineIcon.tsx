import type { SVGProps } from 'react';
import sketch from './sketch-paths.json';

/**
 * Ровные иконки — только для шапки сайта.
 *
 * Остальной интерфейс использует `SketchIcon`, нарисованный «от руки». Шапка
 * висит поверх любой страницы, и в мелком кегле рядом с логотипом дрожащий
 * контур читается как дефект печати, а не как приём. Геометрия у обоих
 * наборов одна и та же — отличается только обводка.
 */

export type LineIconName = keyof typeof sketch.plain;

interface Props extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: LineIconName;
  size?: number;
  strokeWidth?: number;
}

export function LineIcon({ name, size = 24, strokeWidth = 1.8, ...rest }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...rest}
    >
      {sketch.plain[name].strokes.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
