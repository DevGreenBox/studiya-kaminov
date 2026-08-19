import type { Metadata } from 'next';
import Link from 'next/link';
import { Quote, MessageSquarePlus } from 'lucide-react';
import { reviews } from '@/data/reviews';
import { productBySlug } from '@/data/catalog';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/format';
import { site } from '@/config/site';

export const metadata: Metadata = {
  title: 'Отзывы',
  description: 'Отзывы покупателей об электрокаминах собственного производства.',
  alternates: { canonical: '/reviews' },
  openGraph: { title: `Отзывы — ${site.name}`, url: '/reviews' },
};

export default function ReviewsPage() {
  const allDemo = reviews.length > 0 && reviews.every((r) => r.demo);

  return (
    <div className="container-site py-6 lg:py-8">
      <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Отзывы' }]} />

      <h1 className="mt-4 text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-tight">Отзывы</h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
        Здесь публикуются отзывы покупателей о моделях, доставке и сборке.
      </p>

      {allDemo && (
        <p className="mt-6 rounded-[var(--radius-sm)] border border-line bg-surface px-4 py-3 text-sm leading-relaxed text-ink-soft">
          Реальных отзывов в исходных материалах нет. Ниже — демонстрационные карточки: они
          показывают вёрстку раздела и заменяются настоящими отзывами в{' '}
          <code className="rounded bg-white px-1.5 py-0.5 text-[13px]">src/data/reviews.ts</code>.
        </p>
      )}

      {reviews.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={<MessageSquarePlus size={26} />}
            title="Отзывов пока нет"
            text="Как только появятся отзывы покупателей, они будут здесь."
            action={{ label: 'Перейти в каталог', href: '/catalog' }}
          />
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => {
            const product = review.productSlug ? productBySlug.get(review.productSlug) : undefined;
            return (
              <li key={review.id} className="flex">
                <article className="flex h-full flex-col rounded-[var(--radius-md)] border border-line bg-white p-5">
                  <Quote size={22} className="text-primary" aria-hidden />
                  <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-soft">{review.text}</p>
                  <footer className="mt-5 border-t border-line pt-4">
                    <p className="font-semibold">{review.name}</p>
                    {review.date && (
                      <p className="mt-0.5 text-sm text-ink-muted">{formatDate(review.date)}</p>
                    )}
                    {product && (
                      <Link
                        href={`/catalog/${product.slug}`}
                        className="mt-1 inline-block text-sm text-ink-muted transition-colors hover:text-primary"
                      >
                        {product.name}
                      </Link>
                    )}
                  </footer>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
