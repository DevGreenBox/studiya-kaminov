import Image from 'next/image';
import Link from 'next/link';
import { SketchIcon } from '@/components/icons/SketchIcon';
import { categories } from '@/data/categories';
import { products } from '@/data/catalog';
import { pluralize } from '@/lib/format';
import { SectionHeader } from '@/components/ui/SectionHeader';

export function CategoryGrid() {
  return (
    <section className="container-site py-12 sm:py-16">
      <SectionHeader
        title="Выберите камин"
        description="Модели распределены по типам — откройте нужный раздел и сравните исполнения."
        link={{ href: '/catalog', label: 'Весь каталог' }}
      />

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const count = products.filter((p) => p.category === category.slug).length;
          return (
            <li key={category.slug}>
              <Link
                href={`/catalog?category=${category.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-md)] border border-line bg-white transition-[border-color,box-shadow] duration-200 hover:border-line-strong hover:shadow-card"
              >
                <span className="relative block aspect-[4/3] overflow-hidden bg-surface">
                  <Image
                    src={category.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
                  />
                  <span
                    className="absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden
                  />
                </span>

                <span className="flex flex-1 items-center justify-between gap-4 p-4 sm:p-5">
                  <span className="min-w-0">
                    <span className="block text-lg font-bold leading-snug">{category.name}</span>
                    <span className="mt-1 block text-sm text-ink-muted">
                      {category.summary} · {count}{' '}
                      {pluralize(count, ['модель', 'модели', 'моделей'])}
                    </span>
                  </span>
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line-strong text-ink transition-[transform,border-color,color] duration-200 group-hover:translate-x-0.5 group-hover:border-primary group-hover:text-primary"
                    aria-hidden
                  >
                    <SketchIcon name="arrow-right" size={18} />
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
