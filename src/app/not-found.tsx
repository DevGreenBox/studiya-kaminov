import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ui/Button';
import { typo } from '@/lib/typography';

export const metadata: Metadata = {
  title: 'Страница не найдена',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="container-site flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="text-6xl font-bold text-primary">404</p>
      <h1 className="mt-4 text-[clamp(1.5rem,1.2rem+1.3vw,2.125rem)] leading-tight">
        Страница не найдена
      </h1>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft">
        {typo(
          'Возможно, ссылка устарела или в адресе опечатка. Загляните в каталог — все модели на месте.',
        )}
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/">На главную</ButtonLink>
        <ButtonLink href="/catalog" variant="secondary">
          В каталог
        </ButtonLink>
      </div>
    </div>
  );
}
