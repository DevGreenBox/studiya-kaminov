import { products } from '@/data/catalog';
import { ProductCard } from '@/components/product/ProductCard';
import { SectionHeader } from '@/components/ui/SectionHeader';

export function FeaturedProducts() {
  const featured = products.filter((p) => p.featured).slice(0, 4);

  return (
    <section className="container-site py-10 sm:py-12">
      <SectionHeader
        title="Популярные модели"
        description="Модели, которые чаще всего выбирают для гостиной и загородного дома."
        link={{ href: '/catalog', label: 'Смотреть все' }}
      />
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {featured.map((product) => (
          <li key={product.id} className="flex">
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
