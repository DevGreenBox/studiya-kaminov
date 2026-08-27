import { products } from '@/data/catalog';
import { ProductCard } from '@/components/product/ProductCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Reveal } from '@/components/ui/Reveal';

export function FeaturedProducts() {
  const featured = products.filter((p) => p.featured).slice(0, 4);

  return (
    <section className="container-site py-16 sm:py-24">
      <SectionHeader
        eyebrow="Популярное"
        title="Чаще всего выбирают"
        description="Модели, которые берут в гостиную и загородный дом."
        link={{ href: '/catalog', label: 'Смотреть все' }}
      />
      {/* Просветы шире, чем были: карточки без рамок держатся воздухом */}
      <ul className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4 lg:gap-x-10">
        {featured.map((product, index) => (
          <Reveal as="li" key={product.id} delay={(index % 4) * 80} className="flex">
            <ProductCard product={product} />
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
