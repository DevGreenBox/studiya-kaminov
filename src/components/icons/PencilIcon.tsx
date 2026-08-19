import type { SVGProps } from 'react';

/**
 * Набор декоративных иконок в стиле карандашного рисунка.
 *
 * Используются только в информационных блоках (преимущества, производство,
 * процесс). Для функциональных элементов интерфейса — поиск, корзина, сердце,
 * меню — берутся чистые интерфейсные иконки lucide-react, чтобы стили не
 * смешивались (требование ТЗ, п. 67).
 */

export type PencilIconName =
  | 'factory'
  | 'design'
  | 'assembly'
  | 'quality'
  | 'package'
  | 'truck'
  | 'flame'
  | 'remote'
  | 'support'
  | 'shield'
  | 'palette'
  | 'plug';

const paths: Record<PencilIconName, React.ReactNode> = {
  factory: (
    <>
      <path d="M5 41h38" />
      <path d="M8 41V22l10 6V22l10 6V13l12 5v23" />
      <path d="M14 41v-6h5v6" />
      <path d="M26 41v-6h5v6" />
      <path d="M36 33h3" />
      <path d="M8.5 22.4l9.3 5.6" opacity=".45" />
    </>
  ),
  design: (
    <>
      <path d="M10 39V11a2 2 0 0 1 2-2h16l8 8v22a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2z" />
      <path d="M28 9v8h8" />
      <path d="M16 24h12M16 30h9" />
      <path d="M15.6 24.4h11.7" opacity=".4" />
    </>
  ),
  assembly: (
    <>
      <path d="M31 9l-6 6 8 8 6-6a9 9 0 0 1-8-8z" />
      <path d="M25 15L9 31a3 3 0 0 0 4 4l16-16" />
      <path d="M12 32.5l2.5 2.5" opacity=".45" />
      <path d="M35 34h6M38 31v6" />
    </>
  ),
  quality: (
    <>
      <path d="M24 6l14 6v11c0 9-6 16-14 19-8-3-14-10-14-19V12z" />
      <path d="M17 24l5 5 10-10" />
      <path d="M17.6 24.5l4.6 4.6" opacity=".4" />
    </>
  ),
  package: (
    <>
      <path d="M24 7l16 8v18l-16 8-16-8V15z" />
      <path d="M8 15l16 8 16-8" />
      <path d="M24 23v18" />
      <path d="M16 11l16 8" opacity=".45" />
    </>
  ),
  truck: (
    <>
      <path d="M4 33V14h20v19" />
      <path d="M24 20h8l6 7v6" />
      <path d="M4 33h5M17 33h8M33 33h6" />
      <circle cx="13" cy="35" r="3.5" />
      <circle cx="35" cy="35" r="3.5" />
    </>
  ),
  flame: (
    <>
      <path d="M24 5c1 7-6 9-6 16a6 6 0 0 0 12 0c0-3-1-5-2-7 4 2 8 6 8 12a12 12 0 0 1-24 0C12 17 21 15 24 5z" />
      <path d="M20 25c-1 2-1.5 3.5-1.5 5" opacity=".4" />
    </>
  ),
  remote: (
    <>
      <rect x="17" y="5" width="14" height="38" rx="4" />
      <circle cx="24" cy="14" r="3" />
      <path d="M20 24h8M20 30h8M20 36h8" />
      <path d="M20.5 24.4h7.2" opacity=".4" />
    </>
  ),
  support: (
    <>
      <path d="M10 28v-5a14 14 0 0 1 28 0v5" />
      <path d="M10 26h4v11h-4a3 3 0 0 1-3-3v-5a3 3 0 0 1 3-3z" />
      <path d="M38 26h-4v11h4a3 3 0 0 0 3-3v-5a3 3 0 0 0-3-3z" />
      <path d="M34 37v2a4 4 0 0 1-4 4h-5" />
    </>
  ),
  shield: (
    <>
      <path d="M24 6l14 6v11c0 9-6 16-14 19-8-3-14-10-14-19V12z" />
      <path d="M24 17v12M24 33.5v.5" />
    </>
  ),
  palette: (
    <>
      <path d="M24 7c10 0 18 7 18 15 0 5-4 8-8 8h-3a4 4 0 0 0-3 6.5c1 1.5 0 4.5-4 4.5C13 41 6 33 6 23 6 14 14 7 24 7z" />
      <circle cx="16" cy="18" r="2.4" />
      <circle cx="25" cy="14" r="2.4" />
      <circle cx="33" cy="19" r="2.4" />
    </>
  ),
  plug: (
    <>
      <path d="M18 6v10M30 6v10" />
      <path d="M12 16h24v6a12 12 0 0 1-24 0z" />
      <path d="M24 34v8" />
      <path d="M13 17h22" opacity=".4" />
    </>
  ),
};

interface Props extends SVGProps<SVGSVGElement> {
  name: PencilIconName;
  size?: number;
}

export function PencilIcon({ name, size = 48, className, ...rest }: Props) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      className={className}
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
