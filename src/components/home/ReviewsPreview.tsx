import Link from 'next/link';
import { SketchIcon } from '@/components/icons/SketchIcon';
import { reviews } from '@/data/reviews';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { productBySlug } from '@/data/catalog';
import { typo } from '@/lib/typography';

export function ReviewsPreview() {
  const items = reviews.slice(0, 3);
  const allDemo = items.every((r) => r.demo);

  return (
    <section className="container-site py-10 sm:py-12">
      <SectionHeader title="Отзывы" link={{ href: '/reviews', label: 'Все отзывы' }} />

      {allDemo && (
        <p className="mb-5 rounded-[var(--radius-sm)] border border-line bg-surface px-4 py-3 text-sm text-ink-soft">
          {typo('Ниже — демонстрационные карточки: реальных отзывов в материалах пока нет.')}
        </p>
      )}

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {items.map((review) => {
          const product = review.productSlug ? productBySlug.get(review.productSlug) : undefined;
          return (
            <li key={review.id} className="flex">
              <article className="flex h-full flex-col rounded-[var(--radius-md)] border border-line bg-white p-5">
                <SketchIcon name="quote" size={22} className="text-primary" aria-hidden />
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-soft">
                  {review.text}
                </p>
                <footer className="mt-5 border-t border-line pt-4">
                  <p className="font-semibold">{review.name}</p>
                  {product && (
                    <Link
                      href={`/catalog/${product.slug}`}
                      className="mt-0.5 inline-block text-sm text-ink-muted transition-colors hover:text-primary"
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
    </section>
  );
}
