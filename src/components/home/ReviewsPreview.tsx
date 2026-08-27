import Link from 'next/link';
import { SketchIcon } from '@/components/icons/SketchIcon';
import { reviews } from '@/data/reviews';
import { productBySlug } from '@/data/catalog';
import { Reveal } from '@/components/ui/Reveal';
import { typo } from '@/lib/typography';

/**
 * Отзывы.
 *
 * Реальных отзывов в материалах заказчика нет, и выдумывать их нельзя. Пока их
 * нет, на главной стоит честное состояние ожидания, а не три карточки с
 * подписью «демо-отзыв»: заполненная витрина из заглушек выглядит хуже, чем
 * прямо сказанное «отзывов пока нет».
 *
 * Как только настоящие отзывы появятся в `src/data/reviews.ts`, секция сама
 * покажет их — вёрстку менять не придётся.
 */
export function ReviewsPreview() {
  const real = reviews.filter((r) => !r.demo).slice(0, 2);

  return (
    <section className="container-site py-16 sm:py-24">
      <div className="border-t border-line pt-12 sm:pt-16">
        {real.length === 0 ? (
          /*
            Узкая колонка по центру — намеренно другая композиция, чем у
            соседних секций: три двухколоночных блока подряд читались бы как
            один повторяющийся шаблон.
          */
          <Reveal className="mx-auto max-w-[52ch] text-center">
            <SketchIcon name="quote" size={34} className="mx-auto text-primary" aria-hidden />
            <h2 className="display-md mt-6">{typo('Здесь появятся отзывы покупателей')}</h2>
            <p className="mt-5 text-[16px] leading-relaxed text-ink-soft">
              {typo(
                'Мы не публикуем придуманные отзывы. Как только покупатели расскажут о своих каминах, их слова встанут сюда.',
              )}
            </p>
            <Link
              href="/reviews"
              className="group mt-7 inline-flex items-center gap-3 border-b-2 border-line-strong pb-1.5 text-[16px] font-semibold text-ink transition-colors hover:border-primary hover:text-primary"
            >
              Оставить отзыв
              <SketchIcon
                name="arrow-right"
                size={18}
                aria-hidden
                className="text-primary transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        ) : (
          <>
            <p className="eyebrow">{typo('Отзывы')}</p>
            <ul className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
              {real.map((review) => {
                const product = review.productSlug
                  ? productBySlug.get(review.productSlug)
                  : undefined;
                return (
                  <Reveal as="li" key={review.id}>
                    <blockquote className="font-display text-[22px] leading-snug">
                      {review.text}
                    </blockquote>
                    <footer className="mt-6 flex items-center gap-3 border-t border-line pt-4 text-sm">
                      <span className="font-semibold">{review.name}</span>
                      {product && (
                        <Link
                          href={`/catalog/${product.slug}`}
                          className="text-ink-muted transition-colors hover:text-primary"
                        >
                          {product.name}
                        </Link>
                      )}
                    </footer>
                  </Reveal>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
