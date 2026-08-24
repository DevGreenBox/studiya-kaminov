import type { SVGProps } from 'react';
import sketch from './sketch-paths.json';

/**
 * Интерфейсные иконки, нарисованные «от руки».
 *
 * Геометрия взята у lucide-react (лицензия ISC) и прогнана через rough.js —
 * подробности в `scripts/make-sketch-icons.mjs`. Здесь только отрисовка
 * готовых путей: сам rough.js в браузер не попадает.
 *
 * Замена lucide один в один по смыслу: `<Heart size={18} />` становится
 * `<SketchIcon name="heart" size={18} />`.
 */

export type SketchIconName = keyof typeof sketch.ui;

interface Props extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: SketchIconName;
  size?: number;
  /** Толщина при viewBox 24. Меняется редко — например, у крупных иконок. */
  strokeWidth?: number;
}

export function SketchIcon({ name, size = 24, strokeWidth = 1.9, ...rest }: Props) {
  const icon: { strokes: string[]; hatches?: string[] } = sketch.ui[name];

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
      {icon.strokes.map((d) => (
        <path key={d} d={d} />
      ))}
      {/* Штриховка заливки — тоньше контура, как второй проход карандашом */}
      {icon.hatches?.map((d) => (
        <path key={d} d={d} strokeWidth={strokeWidth * 0.62} />
      ))}
    </svg>
  );
}
